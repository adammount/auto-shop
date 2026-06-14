import type { Product, ProductDetail, StockStatus } from '@/shared/types/product'

import type { Brand, Category, Product as PayloadProduct } from '@/payload-types'

const LOW_STOCK_THRESHOLD = 5

function stockStatus(stock: number): StockStatus {
	if (stock <= 0) return 'out'
	if (stock <= LOW_STOCK_THRESHOLD) return 'low'
	return 'in-stock'
}

function relationTitle(value: number | { title?: string | null } | null | undefined): string {
	if (value && typeof value === 'object' && value.title) return value.title
	return ''
}

function productImageUrls(doc: PayloadProduct): string[] {
	const uploaded = (doc.images ?? [])
		.map(item => (item && typeof item === 'object' ? item.url : null))
		.filter((url): url is string => Boolean(url))

	const urls =
		uploaded.length > 0
			? uploaded
			: (doc.imageUrls ?? []).map(item => item.url).filter((url): url is string => Boolean(url))

	return [...new Set(urls)]
}

export function toProduct(doc: PayloadProduct): Product {
	const stock = doc.stock ?? 0
	const status = stockStatus(stock)
	const images = productImageUrls(doc)

	return {
		id: String(doc.id),
		slug: doc.slug,
		title: doc.title,
		sku: doc.sku,
		brand: relationTitle(doc.brand as Brand | number | null | undefined),
		category: categoryTitle(doc),
		priceRetail: doc.priceRetail,
		stock: status,
		stockLabel: status === 'low' ? `Мало · ${stock} шт` : undefined,
		isNew: doc.isNew ?? false,
		image: images[0]
	}
}

export function categoryTitle(doc: PayloadProduct): string {
	return relationTitle(doc.category as Category | number | null | undefined)
}

function relationSlug(value: number | { slug?: string | null } | null | undefined): string {
	if (value && typeof value === 'object' && value.slug) return value.slug
	return ''
}

export function categorySlug(doc: PayloadProduct): string {
	return relationSlug(doc.category as Category | number | null | undefined)
}

interface LexicalNode {
	type?: string
	text?: string
	children?: LexicalNode[]
}

function extractParagraphs(richText: unknown): string[] {
	const root = (richText as { root?: LexicalNode } | null)?.root
	if (!root?.children) return []

	const collectText = (node: LexicalNode): string => {
		if (typeof node.text === 'string') return node.text
		if (node.children) return node.children.map(collectText).join('')
		return ''
	}

	return root.children
		.map(collectText)
		.map(text => text.trim())
		.filter(text => text.length > 0)
}

export function toProductDetail(doc: PayloadProduct): ProductDetail {
	const base = toProduct(doc)
	const stock = doc.stock ?? 0
	const gallery = `${doc.title} · фото`
	const galleryImages = productImageUrls(doc)

	return {
		...base,
		categorySlug: categorySlug(doc),
		warranty: '12 месяцев',
		condition: 'Новое',
		stockCount: stock,
		gallery: [gallery, `${gallery} 2`, `${gallery} 3`, `${gallery} 4`],
		galleryImages,
		description: extractParagraphs(doc.description),
		features: []
	}
}
