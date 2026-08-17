import type { MetadataRoute } from 'next'

import { getNavCategories } from '@/shared/api/content-repository'
import { getAllProductSlugs } from '@/shared/api/products-repository'
import { ROUTES } from '@/shared/config'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date()

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
		{
			url: `${siteUrl}${ROUTES.catalog}`,
			lastModified: now,
			changeFrequency: 'daily',
			priority: 0.9
		},
		{
			url: `${siteUrl}${ROUTES.about}`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.5
		},
		{
			url: `${siteUrl}${ROUTES.delivery}`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.5
		},
		{
			url: `${siteUrl}${ROUTES.contacts}`,
			lastModified: now,
			changeFrequency: 'monthly',
			priority: 0.5
		},
		{
			url: `${siteUrl}${ROUTES.privacy}`,
			lastModified: now,
			changeFrequency: 'yearly',
			priority: 0.3
		}
	]

	const [slugs, categories] = await Promise.all([getAllProductSlugs(), getNavCategories()])

	const categoryRoutes: MetadataRoute.Sitemap = categories.map(category => ({
		url: `${siteUrl}${ROUTES.catalogCategory(category.slug)}`,
		lastModified: now,
		changeFrequency: 'weekly',
		priority: 0.7
	}))

	const productRoutes: MetadataRoute.Sitemap = slugs.map(slug => ({
		url: `${siteUrl}${ROUTES.product(slug)}`,
		lastModified: now,
		changeFrequency: 'weekly',
		priority: 0.8
	}))

	return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
