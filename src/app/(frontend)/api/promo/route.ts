import { NextResponse } from 'next/server'
import { z } from 'zod'

import { resolvePromo } from '@/shared/api/promo-repository'

const promoSchema = z.object({
	code: z.string().min(1),
	total: z.number().int().min(0)
})

export async function POST(request: Request) {
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
