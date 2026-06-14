export type StockStatus = 'in-stock' | 'low' | 'out'

export interface Product {
	id: string
	slug: string
	title: string
	sku: string
	brand: string
	category: string
	priceRetail: number
	stock: StockStatus
	stockLabel?: string
	isNew?: boolean
	image?: string
}

export interface ProductDetail extends Product {
	category: string
	categorySlug: string
	warranty: string
	condition: string
	stockCount: number
	gallery: string[]
	galleryImages: string[]
	description: string[]
	features: string[]
}
