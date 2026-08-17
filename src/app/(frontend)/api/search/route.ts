import { NextResponse } from 'next/server'

import { searchProductsDb } from '@/shared/api/products-repository'
import { clientKey, rateLimit } from '@/shared/lib/rate-limit'

const MAX_QUERY_LENGTH = 100

export async function GET(request: Request) {
	const allowed = rateLimit(clientKey(request, 'search'), {
		limit: 60,
		windowMs: 60 * 1000
	})

	if (!allowed) {
		return NextResponse.json({ error: 'Слишком много запросов, попробуйте позже' }, { status: 429 })
	}

	const query = (new URL(request.url).searchParams.get('q') ?? '').slice(0, MAX_QUERY_LENGTH)
	const products = await searchProductsDb(query)

	return NextResponse.json({ products })
}
