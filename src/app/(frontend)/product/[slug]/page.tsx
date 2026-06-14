import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProductScreen } from '@/views/product'

import {
	getAllProductSlugs,
	getProductDetailBySlug,
	getRelatedProducts
} from '@/shared/api/products-repository'

interface Props {
	params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
	const slugs = await getAllProductSlugs()
	return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const product = await getProductDetailBySlug(slug)

	if (!product) return { title: 'Товар не найден' }

	return {
		title: product.title,
		description: product.description[0] ?? product.title
	}
}

export default async function ProductPage({ params }: Props) {
	const { slug } = await params
	const product = await getProductDetailBySlug(slug)

	if (!product) notFound()

	const related = await getRelatedProducts(slug)

	return (
		<ProductScreen
			product={product}
			related={related}
		/>
	)
}
