import { unstable_cache } from 'next/cache'

import { CACHE_REVALIDATE, CACHE_TAGS } from '@/shared/config/cache'
import { getPayloadClient, safeQuery } from '@/shared/lib/payload'

const cacheOptions = { tags: [CACHE_TAGS.content], revalidate: CACHE_REVALIDATE }

export interface SiteContacts {
	phone: string
	email: string
	whatsapp: string
	whatsappDigits: string
	address: string
	hours: string
	requisites: string
	warehousePhoto?: string
}

const FALLBACK_WHATSAPP = '79998887766'

function digitsOnly(value: string | null | undefined): string {
	return (value ?? '').replace(/\D/g, '')
}

export const getSiteSettings = unstable_cache(
	async (): Promise<SiteContacts> => {
		return safeQuery(
			async () => {
				const payload = await getPayloadClient()
				const global = await payload.findGlobal({ slug: 'site-settings', depth: 1 })

				const whatsapp = global.whatsapp ?? ''
				const whatsappDigits = digitsOnly(whatsapp) || FALLBACK_WHATSAPP

				return {
					phone: global.phone ?? '',
					email: global.email ?? '',
					whatsapp,
					whatsappDigits,
					address: global.address ?? '',
					hours: global.hours ?? '',
					requisites: global.requisites ?? '',
					warehousePhoto: uploadUrl(global.warehousePhoto) ?? global.warehousePhotoUrl ?? undefined
				}
			},
			{
				phone: '',
				email: '',
				whatsapp: '',
				whatsappDigits: FALLBACK_WHATSAPP,
				address: '',
				hours: '',
				requisites: '',
				warehousePhoto: undefined
			}
		)
	},
	['site-settings'],
	cacheOptions
)

export interface Review {
	id: string
	rating: number
	text: string
	author: string
	role: string
}

export interface HeroSlide {
	id: string
	badge: string
	title: string
	sub: string
	primaryLabel: string
	primaryHref: string
	secondaryLabel: string
	secondaryHref: string
	mediaLabel: string
	image?: string
}

export interface HomeCategory {
	title: string
	slug: string
	count: number
	image?: string
}

export interface NavCategory {
	title: string
	slug: string
}

function uploadUrl(value: unknown): string | undefined {
	if (value && typeof value === 'object' && 'url' in value) {
		const url = (value as { url?: string | null }).url
		return url ?? undefined
	}
	return undefined
}

export const getNavCategories = unstable_cache(
	async (): Promise<NavCategory[]> => {
		return safeQuery(async () => {
			const payload = await getPayloadClient()
			const result = await payload.find({
				collection: 'categories',
				depth: 0,
				limit: 100,
				pagination: false
			})
			return result.docs.map(category => ({ title: category.title, slug: category.slug }))
		}, [])
	},
	['nav-categories'],
	cacheOptions
)

export const getReviews = unstable_cache(
	async (): Promise<Review[]> => {
		return safeQuery(async () => {
			const payload = await getPayloadClient()
			const global = await payload.findGlobal({ slug: 'reviews', depth: 0 })

			return (global.items ?? []).map((item, index) => ({
				id: item.id ?? String(index),
				rating: item.rating,
				text: item.text,
				author: item.author,
				role: item.role ?? ''
			}))
		}, [])
	},
	['reviews'],
	cacheOptions
)

export const getHeroSlides = unstable_cache(
	async (): Promise<HeroSlide[]> => {
		return safeQuery(async () => {
			const payload = await getPayloadClient()
			const global = await payload.findGlobal({ slug: 'banners', depth: 1 })

			return (global.slides ?? []).map((slide, index) => ({
				id: slide.id ?? String(index),
				badge: slide.badge ?? '',
				title: slide.title,
				sub: slide.sub ?? '',
				primaryLabel: slide.primaryLabel ?? '',
				primaryHref: slide.primaryHref ?? '/',
				secondaryLabel: slide.secondaryLabel ?? '',
				secondaryHref: slide.secondaryHref ?? '/',
				mediaLabel: slide.mediaLabel ?? '',
				image: uploadUrl(slide.image) ?? slide.imageUrl ?? undefined
			}))
		}, [])
	},
	['hero-slides'],
	cacheOptions
)

export const getHomeCategories = unstable_cache(
	async (): Promise<HomeCategory[]> =>
		safeQuery(async () => {
			const payload = await getPayloadClient()

			const categories = await payload.find({
				collection: 'categories',
				depth: 1,
				limit: 100,
				pagination: false
			})

			const products = await payload.find({
				collection: 'products',
				where: { isActive: { equals: true } },
				depth: 0,
				limit: 10000,
				pagination: false
			})

			const counts = new Map<number, number>()
			for (const product of products.docs) {
				const categoryId =
					typeof product.category === 'object' && product.category
						? product.category.id
						: product.category
				if (typeof categoryId === 'number') {
					counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1)
				}
			}

			return categories.docs.map(category => ({
				title: category.title,
				slug: category.slug,
				count: counts.get(category.id) ?? 0,
				image: uploadUrl(category.image) ?? category.imageUrl ?? undefined
			}))
		}, []),
	['home-categories'],
	{ tags: [CACHE_TAGS.content, CACHE_TAGS.products], revalidate: CACHE_REVALIDATE }
)
