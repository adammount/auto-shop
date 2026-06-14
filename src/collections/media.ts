import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from './access'

export const Media: CollectionConfig = {
	slug: 'media',
	access: {
		read: anyone,
		create: isAdmin,
		update: isAdmin,
		delete: isAdmin
	},
	upload: {
		staticDir: 'public/media',
		mimeTypes: ['image/*'],
		imageSizes: [
			{ name: 'thumbnail', width: 320, height: 320, position: 'centre' },
			{ name: 'card', width: 640, height: 640, position: 'centre' }
		]
	},
	fields: [
		{
			name: 'alt',
			type: 'text'
		}
	]
}
