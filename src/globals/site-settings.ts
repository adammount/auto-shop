import type { GlobalConfig } from 'payload'

import { CACHE_TAGS } from '@/shared/config/cache'

import { anyone, isAdmin } from '@/collections/access'
import { makeGlobalRevalidate } from '@/collections/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
	slug: 'site-settings',
	access: {
		read: anyone,
		update: isAdmin
	},
	hooks: {
		afterChange: [makeGlobalRevalidate(CACHE_TAGS.content)]
	},
	fields: [
		{ name: 'phone', type: 'text' },
		{ name: 'email', type: 'email' },
		{ name: 'whatsapp', type: 'text' },
		{ name: 'address', type: 'text' },
		{ name: 'hours', type: 'text' },
		{ name: 'requisites', type: 'text' },
		{ name: 'warehousePhoto', type: 'upload', relationTo: 'media' },
		{ name: 'warehousePhotoUrl', type: 'text' }
	]
}
