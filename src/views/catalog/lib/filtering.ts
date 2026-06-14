import type { CatalogQuery, CatalogSort } from '@/shared/api/products-repository'

export type { CatalogSort } from '@/shared/api/products-repository'

export interface SortLabel {
	value: CatalogSort
	label: string
}

export const SORT_LABELS: SortLabel[] = [
	{ value: 'default', label: 'По популярности' },
	{ value: 'price-asc', label: 'Сначала дешёвые' },
	{ value: 'price-desc', label: 'Сначала дорогие' },
	{ value: 'new', label: 'Сначала новинки' }
]

const SORT_VALUES = new Set<CatalogSort>(SORT_LABELS.map(option => option.value))

export type CatalogSearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined): string | undefined {
	return Array.isArray(value) ? value[0] : value
}

function arrayValue(value: string | string[] | undefined): string[] {
	if (Array.isArray(value)) return value.filter(Boolean)
	return value ? [value] : []
}

function parsePositiveInt(value: string | undefined): number | undefined {
	if (!value) return undefined
	const parsed = Number(value)
	if (!Number.isFinite(parsed) || parsed < 0) return undefined
	return Math.floor(parsed)
}

export function parseCatalogSearchParams(params: CatalogSearchParams): CatalogQuery {
	const sortRaw = firstValue(params.sort) as CatalogSort | undefined
	const sort = sortRaw && SORT_VALUES.has(sortRaw) ? sortRaw : 'default'
	const page = Math.max(1, parsePositiveInt(firstValue(params.page)) ?? 1)

	return {
		page,
		sort,
		categorySlugs: arrayValue(params.category),
		brandSlugs: arrayValue(params.brand),
		priceMin: parsePositiveInt(firstValue(params.min)),
		priceMax: parsePositiveInt(firstValue(params.max)),
		inStockOnly: firstValue(params.stock) === '1'
	}
}

export function buildCatalogHref(query: CatalogQuery): string {
	const search = new URLSearchParams()

	for (const slug of query.categorySlugs) search.append('category', slug)
	for (const slug of query.brandSlugs) search.append('brand', slug)
	if (query.priceMin !== undefined) search.set('min', String(query.priceMin))
	if (query.priceMax !== undefined) search.set('max', String(query.priceMax))
	if (query.inStockOnly) search.set('stock', '1')
	if (query.sort !== 'default') search.set('sort', query.sort)
	if (query.page > 1) search.set('page', String(query.page))

	const queryString = search.toString()
	return queryString ? `/catalog?${queryString}` : '/catalog'
}

export function toggleSlug(list: string[], slug: string): string[] {
	return list.includes(slug) ? list.filter(item => item !== slug) : [...list, slug]
}
