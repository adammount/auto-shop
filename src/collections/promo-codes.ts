import type { CollectionConfig } from 'payload'

import { isAdmin } from './access'

export const PromoCodes: CollectionConfig = {
	slug: 'promo-codes',
	admin: {
		useAsTitle: 'code',
		defaultColumns: ['code', 'type', 'value', 'isActive', 'expiresAt']
	},
	access: {
		read: isAdmin,
		create: isAdmin,
		update: isAdmin,
		delete: isAdmin
	},
	fields: [
		{
			name: 'code',
			type: 'text',
			required: true,
			unique: true,
			index: true
		},
		{
			name: 'type',
			type: 'select',
			required: true,
			defaultValue: 'percent',
			options: [
				{ label: 'Процент', value: 'percent' },
				{ label: 'Фиксированная сумма', value: 'fixed' }
			]
		},
		{
			name: 'value',
			type: 'number',
			required: true,
			min: 0
		},
		{
			name: 'minOrder',
			type: 'number',
			min: 0
		},
		{
			name: 'isActive',
			type: 'checkbox',
			defaultValue: true
		},
		{
			name: 'expiresAt',
			type: 'date'
		}
	]
}
