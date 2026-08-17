import { NextResponse } from 'next/server'

import { getSiteSettings } from '@/shared/api/content-repository'
import { orderSchema } from '@/shared/api/order-schema'
import { resolvePromo } from '@/shared/api/promo-repository'
import { getCurrentUser, isApprovedWholesale } from '@/shared/lib/auth'
import { formatPrice } from '@/shared/lib/format-price'
import { getPayloadClient } from '@/shared/lib/payload'
import { clientKey, rateLimit } from '@/shared/lib/rate-limit'
import { verifyTurnstile } from '@/shared/lib/turnstile'

const DELIVERY_LABELS: Record<string, string> = {
	pickup: 'Самовывоз',
	courier: 'Курьер',
	transport: 'Транспортная компания'
}

const CONTACT_LABELS: Record<string, string> = {
	call: 'Звонок',
	whatsapp: 'WhatsApp',
	email: 'E-mail'
}

function deliveryLabel(value: string): string {
	return DELIVERY_LABELS[value] ?? value
}

function contactMethodLabel(value: string): string {
	return CONTACT_LABELS[value] ?? value
}

function buildWhatsappLink(
	phone: string,
	orderNumber: string,
	lines: string[],
	total: number
): string {
	const text = [`Заказ ${orderNumber}`, ...lines, `Итого: ${formatPrice(total)}`].join('\n')
	return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export async function POST(request: Request) {
	const allowed = rateLimit(clientKey(request, 'orders'), {
		limit: 10,
		windowMs: 15 * 60 * 1000
	})

	if (!allowed) {
		return NextResponse.json({ error: 'Слишком много попыток, попробуйте позже' }, { status: 429 })
	}

	const body = await request.json().catch(() => null)
	const parsed = orderSchema.safeParse(body)

	if (!parsed.success) {
		return NextResponse.json(
			{ error: 'Некорректные данные заказа', issues: parsed.error.issues },
			{ status: 400 }
		)
	}

	const { customer, items, promoCode, delivery, contactMethod, captchaToken } = parsed.data

	const ip = request.headers.get('CF-Connecting-IP') ?? undefined
	const captchaValid = await verifyTurnstile(captchaToken, ip)
	if (!captchaValid) {
		return NextResponse.json({ error: 'Проверка капчи не пройдена' }, { status: 400 })
	}

	const payload = await getPayloadClient()

	const user = await getCurrentUser()
	const wholesale = isApprovedWholesale(user)

	const numericIds = items.map(item => Number(item.productId)).filter(id => Number.isInteger(id))

	const products = await payload.find({
		collection: 'products',
		where: { id: { in: numericIds } },
		depth: 0,
		limit: items.length,
		overrideAccess: true
	})

	const productById = new Map(products.docs.map(doc => [String(doc.id), doc]))

	const resolvedItems = items
		.map(item => {
			const product = productById.get(item.productId)
			if (!product) return null
			const price =
				wholesale && typeof product.priceWholesale === 'number'
					? product.priceWholesale
					: product.priceRetail
			return {
				product: product.id,
				quantity: item.quantity,
				priceSnapshot: price,
				title: product.title
			}
		})
		.filter((item): item is NonNullable<typeof item> => item !== null)

	const orderItems = resolvedItems.map(item => ({
		product: item.product,
		quantity: item.quantity,
		priceSnapshot: item.priceSnapshot
	}))

	if (orderItems.length === 0) {
		return NextResponse.json({ error: 'Товары не найдены' }, { status: 400 })
	}

	const subtotal = orderItems.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0)
	const promo = promoCode ? await resolvePromo(promoCode, subtotal) : null
	const total = Math.max(0, subtotal - (promo?.discount ?? 0))

	const orderNumber = `DT-${Date.now().toString().slice(-6)}`

	await payload.create({
		collection: 'orders',
		data: {
			orderNumber,
			items: orderItems,
			total,
			promoCode: promo?.code,
			status: 'new',
			delivery,
			contactMethod,
			customer: {
				name: customer.name,
				phone: customer.phone,
				email: customer.email || undefined,
				comment: customer.comment
			},
			createdBy: user?.id
		},
		overrideAccess: true
	})

	const lines = resolvedItems.map(item => `${item.title} — ${item.quantity} шт`)
	const settings = await getSiteSettings()

	if (process.env.RESEND_API_KEY) {
		const managerBody = [
			`Заказ ${orderNumber}`,
			`Покупатель: ${customer.name}, ${customer.phone}`,
			customer.email ? `E-mail: ${customer.email}` : '',
			`Связь: ${contactMethodLabel(contactMethod)}, доставка: ${deliveryLabel(delivery)}`,
			'',
			...lines,
			`Итого: ${formatPrice(total)}`
		]
			.filter(Boolean)
			.join('\n')

		if (process.env.ORDER_EMAIL_TO) {
			try {
				await payload.sendEmail({
					to: process.env.ORDER_EMAIL_TO,
					subject: `Новый заказ ${orderNumber}`,
					text: managerBody
				})
			} catch (err) {
				payload.logger.error(err, `Не удалось отправить письмо менеджеру по заказу ${orderNumber}`)
			}
		}

		if (customer.email) {
			try {
				await payload.sendEmail({
					to: customer.email,
					subject: `Деталь — заказ ${orderNumber} принят`,
					text: [
						`${customer.name}, спасибо за заказ!`,
						`Номер заказа: ${orderNumber}.`,
						'Менеджер свяжется с вами для подтверждения.',
						'',
						...lines,
						`Итого: ${formatPrice(total)}`
					].join('\n')
				})
			} catch (err) {
				payload.logger.error(err, `Не удалось отправить письмо покупателю по заказу ${orderNumber}`)
			}
		}
	}

	return NextResponse.json({
		orderNumber,
		total,
		contactMethod,
		phone: customer.phone,
		email: customer.email || '',
		whatsappLink: buildWhatsappLink(settings.whatsappDigits, orderNumber, lines, total)
	})
}
