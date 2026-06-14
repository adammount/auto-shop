import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getProductsByIds } from '@/shared/api/products-repository'

const schema = z.object({
	ids: z.array(z.string().min(1)).min(1)
})

export async function POST(request: Request) {
	const body = await request.json().catch(() => null)
	const parsed = schema.safeParse(body)

	if (!parsed.success) {
		return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
	}

	const products = await getProductsByIds(parsed.data.ids)
	return NextResponse.json({ products })
}
