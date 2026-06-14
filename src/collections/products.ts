import type { CollectionConfig } from 'payload'

import { CACHE_TAGS } from '@/shared/config/cache'

import { anyone, isAdmin, isWholesaleOrAdminFieldLevel } from './access'
import { makeCollectionRevalidate } from './hooks/revalidate'

const revalidate = makeCollectionRevalidate(CACHE_TAGS.products)

export const Products: CollectionConfig = {
	slug: 'products',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'sku', 'priceRetail', 'stock', 'isActive']
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
			name: 'sku',
			type: 'text',
			required: true,
			index: true
		},
		{
			name: 'images',
			type: 'upload',
			relationTo: 'media',
			hasMany: true
		},
		{
			name: 'imageUrls',
			type: 'array',
			fields: [{ name: 'url', type: 'text', required: true }]
		},
		{
			name: 'description',
			type: 'richText'
		},
		{
			name: 'category',
			type: 'relationship',
			relationTo: 'categories',
			index: true
		},
		{
			name: 'brand',
			type: 'relationship',
			relationTo: 'brands',
			index: true
		},
		{
			name: 'priceRetail',
			type: 'number',
			required: true,
			min: 0
		},
		{
			name: 'priceWholesale',
			type: 'number',
			min: 0,
			access: {
				read: isWholesaleOrAdminFieldLevel
			}
		},
		{
			name: 'stock',
			type: 'number',
			defaultValue: 0,
			min: 0
		},
		{
			name: 'isActive',
			type: 'checkbox',
			defaultValue: true
		},
		{
			name: 'isNew',
			type: 'checkbox',
			defaultValue: false
		}
	]
}
