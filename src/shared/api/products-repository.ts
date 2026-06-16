import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'

import { CACHE_REVALIDATE, CACHE_TAGS } from '@/shared/config/cache'
import { getPayloadClient, safeQuery } from '@/shared/lib/payload'
import type { Product, ProductDetail } from '@/shared/types/product'

import { categoryTitle, toProduct, toProductDetail } from './product-mapper'

export const CATALOG_PAGE_SIZE = 12

export type CatalogSort = 'default' | 'price-asc' | 'price-desc' | 'new'

export interface CatalogQuery {
	page: number
	sort: CatalogSort
	categorySlugs: string[]
	brandSlugs: string[]
	priceMin?: number
	priceMax?: number
	inStockOnly: boolean
}

export interface CatalogResult {
	products: Product[]
	total: number
	page: number
	totalPages: number
}

export interface CatalogFacet {
	slug: string
	title: string
	count: number
}

export interface CatalogFacets {
	categories: CatalogFacet[]
	brands: CatalogFacet[]
}

const SORT_MAP: Record<CatalogSort, string> = {
	default: '-createdAt',
	'price-asc': 'priceRetail',
	'price-desc': '-priceRetail',
	new: '-isNew'
}

function buildCatalogWhere(query: CatalogQuery): Where {
	const and: Where[] = [{ isActive: { equals: true } }]

	if (query.categorySlugs.length > 0) and.push({ 'category.slug': { in: query.categorySlugs } })
	if (query.brandSlugs.length > 0) and.push({ 'brand.slug': { in: query.brandSlugs } })
	if (query.priceMin !== undefined) and.push({ priceRetail: { greater_than_equal: query.priceMin } })
	if (query.priceMax !== undefined) and.push({ priceRetail: { less_than_equal: query.priceMax } })
	if (query.inStockOnly) and.push({ stock: { greater_than: 0 } })

	return { and }
}

export const getPopularProducts = unstable_cache(
	async (): Promise<Product[]> =>
		safeQuery(async () => {
			const payload = await getPayloadClient()

			const result = await payload.find({
				collection: 'products',
				where: {
					and: [{ isActive: { equals: true } }, { isPopular: { equals: true } }]
				},
				depth: 1,
				limit: 4,
				sort: '-createdAt'
			})

			return result.docs.map(toProduct)
		}, []),
	['popular-products'],
	{ tags: [CACHE_TAGS.products], revalidate: CACHE_REVALIDATE }
)

const getCatalogProductsCached = unstable_cache(
	async (key: string): Promise<CatalogResult> => {
		const query = JSON.parse(key) as CatalogQuery
		return safeQuery(
			async () => {
				const payload = await getPayloadClient()

				const result = await payload.find({
					collection: 'products',
					where: buildCatalogWhere(query),
					sort: SORT_MAP[query.sort],
					depth: 1,
					page: query.page,
					limit: CATALOG_PAGE_SIZE
				})

				return {
					products: result.docs.map(toProduct),
					total: result.totalDocs,
					page: result.page ?? query.page,
					totalPages: result.totalPages
				}
			},
			{ products: [], total: 0, page: query.page, totalPages: 0 }
		)
	},
	['catalog-products'],
	{ tags: [CACHE_TAGS.products], revalidate: CACHE_REVALIDATE }
)

export async function getCatalogProducts(query: CatalogQuery): Promise<CatalogResult> {
	return getCatalogProductsCached(JSON.stringify(query))
}

export const getCatalogFacets = unstable_cache(
	async (): Promise<CatalogFacets> =>
		safeQuery(
			async () => {
				const payload = await getPayloadClient()

				const result = await payload.find({
					collection: 'products',
					where: { isActive: { equals: true } },
					depth: 1,
					limit: 10000,
					pagination: false
				})

				const categories = new Map<string, CatalogFacet>()
				const brands = new Map<string, CatalogFacet>()

				const bump = (map: Map<string, CatalogFacet>, slug: string, title: string) => {
					const facet = map.get(slug)
					if (facet) {
						facet.count += 1
					} else {
						map.set(slug, { slug, title, count: 1 })
					}
				}

				for (const doc of result.docs) {
					const category = doc.category
					if (category && typeof category === 'object' && category.slug) {
						bump(categories, category.slug, categoryTitle(doc))
					}
					const brand = doc.brand
					if (brand && typeof brand === 'object' && brand.slug && brand.title) {
						bump(brands, brand.slug, brand.title)
					}
				}

				const sortFacets = (map: Map<string, CatalogFacet>) =>
					[...map.values()].sort((a, b) => a.title.localeCompare(b.title, 'ru'))

				return { categories: sortFacets(categories), brands: sortFacets(brands) }
			},
			{ categories: [], brands: [] }
		),
	['catalog-facets'],
	{ tags: [CACHE_TAGS.products], revalidate: CACHE_REVALIDATE }
)

export async function getProductDetailBySlug(slug: string): Promise<ProductDetail | null> {
	return safeQuery(async () => {
		const payload = await getPayloadClient()

		const result = await payload.find({
			collection: 'products',
			where: { slug: { equals: slug } },
			depth: 1,
			limit: 1
		})

		const doc = result.docs[0]
		return doc ? toProductDetail(doc) : null
	}, null)
}

const RELATED_LIMIT = 4

export async function getRelatedProducts(
	excludeSlug: string,
	categorySlug?: string
): Promise<Product[]> {
	return safeQuery(async () => {
		const payload = await getPayloadClient()

		const findProducts = (where: Where, limit: number) =>
			payload.find({ collection: 'products', where, depth: 1, limit, sort: '-createdAt' })

		const sameCategory = categorySlug
			? await findProducts(
					{
						and: [
							{ isActive: { equals: true } },
							{ slug: { not_equals: excludeSlug } },
							{ 'category.slug': { equals: categorySlug } }
						]
					},
					RELATED_LIMIT
				)
			: { docs: [] }

		const products = sameCategory.docs.map(toProduct)

		if (products.length >= RELATED_LIMIT) return products

		const excludeSlugs = [excludeSlug, ...products.map(item => item.slug)]
		const fallback = await findProducts(
			{ and: [{ isActive: { equals: true } }, { slug: { not_in: excludeSlugs } }] },
			RELATED_LIMIT - products.length
		)

		return [...products, ...fallback.docs.map(toProduct)]
	}, [])
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
	if (ids.length === 0) return []

	const payload = await getPayloadClient()

	const result = await payload.find({
		collection: 'products',
		where: {
			and: [{ isActive: { equals: true } }, { id: { in: ids.map(Number) } }]
		},
		depth: 1,
		limit: ids.length
	})

	return result.docs.map(toProduct)
}

export async function getAllProductSlugs(): Promise<string[]> {
	return safeQuery(async () => {
		const payload = await getPayloadClient()

		const result = await payload.find({
			collection: 'products',
			where: { isActive: { equals: true } },
			depth: 0,
			limit: 1000,
			pagination: false
		})

		return result.docs.map(doc => doc.slug)
	}, [])
}

const searchProductsCached = unstable_cache(
	async (normalized: string): Promise<Product[]> =>
		safeQuery(async () => {
			const payload = await getPayloadClient()

			const result = await payload.find({
				collection: 'products',
				where: {
					and: [
						{ isActive: { equals: true } },
						{
							or: [{ title: { like: normalized } }, { sku: { like: normalized } }]
						}
					]
				},
				depth: 1,
				limit: 24
			})

			return result.docs.map(toProduct)
		}, []),
	['products-search'],
	{ tags: [CACHE_TAGS.products], revalidate: CACHE_REVALIDATE }
)

export async function searchProductsDb(query: string): Promise<Product[]> {
	const normalized = query.trim()
	if (normalized.length < 2) return []
	return searchProductsCached(normalized)
}
