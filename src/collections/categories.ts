import type { CollectionConfig } from 'payload'

import { CACHE_TAGS } from '@/shared/config/cache'

import { anyone, isAdmin } from './access'
import { makeCollectionRevalidate } from './hooks/revalidate'

const revalidate = makeCollectionRevalidate(CACHE_TAGS.content)

export const Categories: CollectionConfig = {
	slug: 'categories',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'parent']
	},
	access: {
		read: anyone,
		create: isAdmin,
		update: isAdmin,
		delete: isAdmin
	},
	hooks: {
		afterChange: [revalidate.afterChange],
		afterDelete: [revalidate.afterDelete]
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
			name: 'image',
			type: 'upload',
			relationTo: 'media'
		},
		{
			name: 'imageUrl',
			type: 'text'
		},
		{
			name: 'parent',
			type: 'relationship',
			relationTo: 'categories'
		}
	]
}
