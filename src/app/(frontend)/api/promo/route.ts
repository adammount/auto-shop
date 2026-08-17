import { NextResponse } from 'next/server'
import { z } from 'zod'

import { resolvePromo } from '@/shared/api/promo-repository'
import { clientKey, rateLimit } from '@/shared/lib/rate-limit'

const promoSchema = z.object({
	code: z.string().min(1).max(64),
	total: z.number().int().min(0)
})

export async function POST(request: Request) {
	const allowed = rateLimit(clientKey(request, 'promo'), {
		limit: 20,
		windowMs: 15 * 60 * 1000
	})

	if (!allowed) {
		return NextResponse.json({ error: 'Слишком много попыток, попробуйте позже' }, { status: 429 })
	}

	const body = await request.json().catch(() => null)
	const parsed = promoSchema.safeParse(body)

	if (!parsed.success) {
		return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
	}

	const promo = await resolvePromo(parsed.data.code, parsed.data.total)

	if (!promo) {
		return NextResponse.json({ error: 'Промокод недействителен' }, { status: 404 })
	}

	return NextResponse.json(promo)
}
