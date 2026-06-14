import type { GlobalConfig } from 'payload'

import { CACHE_TAGS } from '@/shared/config/cache'

import { anyone, isAdmin } from '@/collections/access'
import { makeGlobalRevalidate } from '@/collections/hooks/revalidate'

export const Reviews: GlobalConfig = {
	slug: 'reviews',
	access: {
		read: anyone,
		update: isAdmin
	},
	hooks: {
		afterChange: [makeGlobalRevalidate(CACHE_TAGS.content)]
	},
	fields: [
		{
			name: 'items',
			type: 'array',
			fields: [
				{ name: 'rating', type: 'number', required: true, min: 1, max: 5, defaultValue: 5 },
				{ name: 'text', type: 'textarea', required: true },
				{ name: 'author', type: 'text', required: true },
				{ name: 'role', type: 'text' }
			]
		}
	]
}
