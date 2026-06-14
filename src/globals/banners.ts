import type { GlobalConfig } from 'payload'

import { CACHE_TAGS } from '@/shared/config/cache'

import { anyone, isAdmin } from '@/collections/access'
import { makeGlobalRevalidate } from '@/collections/hooks/revalidate'

export const Banners: GlobalConfig = {
	slug: 'banners',
	access: {
		read: anyone,
		update: isAdmin
	},
	hooks: {
		afterChange: [makeGlobalRevalidate(CACHE_TAGS.content)]
	},
	fields: [
		{
			name: 'slides',
			type: 'array',
			fields: [
				{ name: 'badge', type: 'text' },
				{ name: 'title', type: 'text', required: true },
				{ name: 'sub', type: 'textarea' },
				{ name: 'primaryLabel', type: 'text' },
				{ name: 'primaryHref', type: 'text' },
				{ name: 'secondaryLabel', type: 'text' },
				{ name: 'secondaryHref', type: 'text' },
				{ name: 'image', type: 'upload', relationTo: 'media' },
				{ name: 'imageUrl', type: 'text' },
				{ name: 'mediaLabel', type: 'text' }
			]
		}
	]
}
