import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getProductsByIds } from '@/shared/api/products-repository'
import { clientKey, rateLimit } from '@/shared/lib/rate-limit'

const schema = z.object({
	ids: z.array(z.string().min(1)).min(1).max(100)
})

export async function POST(request: Request) {
	const allowed = rateLimit(clientKey(request, 'by-ids'), {
		limit: 60,
		windowMs: 60 * 1000
	})

	if (!allowed) {
		return NextResponse.json({ error: 'Слишком много запросов, попробуйте позже' }, { status: 429 })
	}

	const body = await request.json().catch(() => null)
	const parsed = schema.safeParse(body)

	if (!parsed.success) {
		return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
	}

	const products = await getProductsByIds(parsed.data.ids)
	return NextResponse.json({ products })
}
