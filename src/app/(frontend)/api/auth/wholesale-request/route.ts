import { wholesaleSchema } from '@/shared/api/auth-schema'
import { getCurrentUser } from '@/shared/lib/auth'
import { getPayloadClient } from '@/shared/lib/payload'

export async function POST(request: Request) {
	const body = await request.json().catch(() => null)
	const parsed = wholesaleSchema.safeParse(body)

	if (!parsed.success) {
		return Response.json(
			{ error: 'Проверьте поля формы', issues: parsed.error.issues },
			{ status: 400 }
		)
	}

	const user = await getCurrentUser()

	if (!user) {
		return Response.json(
			{ error: 'Войдите или зарегистрируйтесь, чтобы оставить заявку' },
			{ status: 401 }
		)
	}

	if (user.role === 'admin') {
		return Response.json(
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

	return Response.json({ ok: true })
}
