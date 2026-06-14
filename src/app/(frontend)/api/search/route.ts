import { NextResponse } from 'next/server'

import { searchProductsDb } from '@/shared/api/products-repository'

export async function GET(request: Request) {
	const query = new URL(request.url).searchParams.get('q') ?? ''
	const products = await searchProductsDb(query)
	return NextResponse.json({ products })
}
