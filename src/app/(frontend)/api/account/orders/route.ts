import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/shared/lib/auth'
import { getPayloadClient } from '@/shared/lib/payload'

export async function GET() {
	const user = await getCurrentUser()

	if (!user) {
		return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
	}

	const payload = await getPayloadClient()

	const result = await payload.find({
		collection: 'orders',
		where: { createdBy: { equals: user.id } },
		depth: 1,
		limit: 50,
		sort: '-createdAt',
		overrideAccess: false,
		user
	})

	const orders = result.docs.map(order => ({
		id: String(order.id),
		number: order.orderNumber ?? '—',
		createdAt: order.createdAt,
		positions: order.items.length,
		total: order.total,
		status: order.status ?? 'new',
		items: order.items.map(item => ({
			productId: typeof item.product === 'object' ? String(item.product.id) : String(item.product),
			quantity: item.quantity
		}))
	}))

	return NextResponse.json({ orders })
}
