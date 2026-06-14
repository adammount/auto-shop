import type { Product } from '@/shared/types/product'

import { getJson } from './client'

export async function searchProducts(query: string, signal?: AbortSignal): Promise<Product[]> {
	const data = await getJson<{ products: Product[] }>(
		`/api/search?q=${encodeURIComponent(query)}`,
		{ signal }
	)
	return data.products
}
