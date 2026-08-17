import { NextResponse } from 'next/server'

import { wholesaleSchema } from '@/shared/api/auth-schema'
import { getCurrentUser } from '@/shared/lib/auth'
import { getPayloadClient } from '@/shared/lib/payload'
import { clientKey, rateLimit } from '@/shared/lib/rate-limit'

export async function POST(request: Request) {
	const allowed = rateLimit(clientKey(request, 'wholesale'), {
		limit: 5,
		windowMs: 15 * 60 * 1000
	})

	if (!allowed) {
		return NextResponse.json({ error: 'Слишком много попыток, попробуйте позже' }, { status: 429 })
	}

	const body = await request.json().catch(() => null)
	const parsed = wholesaleSchema.safeParse(body)

	if (!parsed.success) {
		return NextResponse.json(
			{ error: 'Проверьте поля формы', issues: parsed.error.issues },
			{ status: 400 }
		)
	}

	const user = await getCurrentUser()

	if (!user) {
		return NextResponse.json(
			{ error: 'Войдите или зарегистрируйтесь, чтобы оставить заявку' },
			{ status: 401 }
		)
	}

	if (user.role === 'admin') {
		return NextResponse.json(
			{ error: 'Администратору не нужна заявка на оптовый статус' },
			{ status: 403 }
		)
	}

	const payload = await getPayloadClient()

	await payload.update({
		collection: 'users',
		id: user.id,
		data: {
			name: parsed.data.name,
			phone: parsed.data.phone,
			wholesaleStatus: 'pending'
		},
		overrideAccess: true
	})

	return NextResponse.json({ ok: true })
}
