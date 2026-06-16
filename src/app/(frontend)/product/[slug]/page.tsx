import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ROUTES } from '@/shared/config'
import { ProductScreen } from '@/views/product'
import { JsonLd } from '@/shared/ui/json-ld'

import {
	getAllProductSlugs,
	getProductDetailBySlug,
	getRelatedProducts
} from '@/shared/api/products-repository'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

interface Props {
	params: Promise<{ slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
	const slugs = await getAllProductSlugs()
	return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const product = await getProductDetailBySlug(slug)

	if (!product) return { title: 'Товар не найден' }

	const description = product.description[0] ?? `${product.title} — ${product.brand}. ${product.sku}`
	const url = `${siteUrl}${ROUTES.product(slug)}`

	return {
		title: product.title,
		description,
		alternates: { canonical: ROUTES.product(slug) },
		openGraph: {
			type: 'website',
			url,
			title: product.title,
			description,
			...(product.image && { images: [{ url: product.image, alt: product.title }] })
		},
		twitter: {
			card: 'summary_large_image',
			title: product.title,
			description,
			...(product.image && { images: [product.image] })
		}
	}
}

export default async function ProductPage({ params }: Props) {
	const { slug } = await params
	const product = await getProductDetailBySlug(slug)

	if (!product) notFound()

	const related = await getRelatedProducts(slug, product.categorySlug)
	const url = `${siteUrl}${ROUTES.product(slug)}`

	const availability =
		product.stock === 'out'
			? 'https://schema.org/OutOfStock'
			: 'https://schema.org/InStock'

	const productLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.title,
		sku: product.sku,
		mpn: product.sku,
		brand: { '@type': 'Brand', name: product.brand },
		category: product.category,
		...(product.description.length > 0 && { description: product.description.join(' ') }),
		...(product.image && { image: product.image }),
		offers: {
			'@type': 'Offer',
			url,
			priceCurrency: 'RUB',
			price: product.priceRetail,
			availability,
			itemCondition: 'https://schema.org/NewCondition'
		}
	}

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Главная', item: siteUrl },
			{ '@type': 'ListItem', position: 2, name: 'Каталог', item: `${siteUrl}${ROUTES.catalog}` },
			{
				'@type': 'ListItem',
				position: 3,
				name: product.category,
				item: product.categorySlug
					? `${siteUrl}${ROUTES.catalogCategory(product.categorySlug)}`
					: `${siteUrl}${ROUTES.catalog}`
			},
			{ '@type': 'ListItem', position: 4, name: product.title, item: url }
		]
	}

	return (
		<>
			<JsonLd data={productLd} />
			<JsonLd data={breadcrumbLd} />
			<ProductScreen
				product={product}
				related={related}
			/>
		</>
	)
}
