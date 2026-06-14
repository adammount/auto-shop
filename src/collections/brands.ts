import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from './access'

export const Brands: CollectionConfig = {
	slug: 'brands',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug']
	},
	access: {
		read: anyone,
		create: isAdmin,
		update: isAdmin,
		delete: isAdmin
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			index: true
		},
		{
			name: 'logo',
			type: 'upload',
			relationTo: 'media'
		}
	]
}
