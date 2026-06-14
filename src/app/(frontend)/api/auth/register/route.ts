import { APIError, generatePayloadCookie } from 'payload'

import { registerSchema } from '@/shared/api/auth-schema'
import { getPayloadClient } from '@/shared/lib/payload'
import { clientKey, rateLimit } from '@/shared/lib/rate-limit'

export async function POST(request: Request) {
	const allowed = rateLimit(clientKey(request, 'register'), {
		limit: 10,
		windowMs: 15 * 60 * 1000
	})

	if (!allowed) {
		return Response.json({ error: 'Слишком много попыток, попробуйте позже' }, { status: 429 })
	}

	const body = await request.json().catch(() => null)
	const parsed = registerSchema.safeParse(body)

	if (!parsed.success) {
		return Response.json(
			{ error: 'Проверьте поля формы', issues: parsed.error.issues },
			{ status: 400 }
		)
	}

	const { name, phone, email, password } = parsed.data
	const payload = await getPayloadClient()

	const existing = await payload.find({
		collection: 'users',
		where: { email: { equals: email } },
		depth: 0,
		limit: 1,
		overrideAccess: true
	})

	if (existing.docs.length > 0) {
		return Response.json({ error: 'Пользователь с таким e-mail уже есть' }, { status: 409 })
	}

	try {
		await payload.create({
			collection: 'users',
			data: { name, phone, email, password, role: 'customer' },
			overrideAccess: true
		})

		const result = await payload.login({
			collection: 'users',
			data: { email, password }
		})

		const cookie = generatePayloadCookie({
			collectionAuthConfig: payload.config.collections.find(item => item.slug === 'users')!.auth,
			cookiePrefix: payload.config.cookiePrefix,
			token: result.token!
		})

		return Response.json({ user: result.user }, { status: 201, headers: { 'Set-Cookie': cookie } })
	} catch (err) {
		const message = err instanceof APIError ? err.message : 'Не удалось зарегистрироваться'
		return Response.json({ error: message }, { status: 400 })
	}
}
