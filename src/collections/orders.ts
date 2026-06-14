import type { CollectionConfig } from 'payload'

import { isAdmin } from './access'

export const Orders: CollectionConfig = {
	slug: 'orders',
	admin: {
		useAsTitle: 'orderNumber',
		defaultColumns: ['orderNumber', 'status', 'total', 'createdAt']
	},
	access: {
		read: ({ req }) => {
			if (req.user?.role === 'admin') return true
			if (req.user) return { createdBy: { equals: req.user.id } }
			return false
		},
		create: () => true,
		update: isAdmin,
		delete: isAdmin
	},
	fields: [
		{
			name: 'orderNumber',
			type: 'text',
			index: true
		},
		{
			name: 'items',
			type: 'array',
			required: true,
			fields: [
				{
					name: 'product',
					type: 'relationship',
					relationTo: 'products',
					required: true
				},
				{
					name: 'quantity',
					type: 'number',
					required: true,
					min: 1
				},
				{
					name: 'priceSnapshot',
					type: 'number',
					required: true,
					min: 0
				}
			]
		},
		{
			name: 'total',
			type: 'number',
			required: true,
			min: 0
		},
		{
			name: 'promoCode',
			type: 'text'
		},
		{
			name: 'status',
			type: 'select',
			defaultValue: 'new',
			options: [
				{ label: 'Новый', value: 'new' },
				{ label: 'В обработке', value: 'processing' },
				{ label: 'В пути', value: 'in-transit' },
				{ label: 'Доставлен', value: 'delivered' },
				{ label: 'Отменён', value: 'cancelled' }
			]
		},
		{
			name: 'delivery',
			type: 'select',
			options: [
				{ label: 'Самовывоз', value: 'pickup' },
				{ label: 'Курьер', value: 'courier' },
				{ label: 'Транспортная компания', value: 'transport' }
			]
		},
		{
			name: 'contactMethod',
			type: 'select',
			options: [
				{ label: 'Звонок', value: 'call' },
				{ label: 'WhatsApp', value: 'whatsapp' },
				{ label: 'E-mail', value: 'email' }
			]
		},
		{
			name: 'customer',
			type: 'group',
			fields: [
				{ name: 'name', type: 'text', required: true },
				{ name: 'phone', type: 'text', required: true },
				{ name: 'email', type: 'email' },
				{ name: 'comment', type: 'textarea' }
			]
		},
		{
			name: 'createdBy',
			type: 'relationship',
			relationTo: 'users'
		}
	]
}
