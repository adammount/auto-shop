import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from './access'

export const Users: CollectionConfig = {
	slug: 'users',
	auth: {
		maxLoginAttempts: 5,
		lockTime: 15 * 60 * 1000,
		tokenExpiration: 7 * 24 * 60 * 60,
		cookies: {
			sameSite: 'Lax',
			secure: process.env.NODE_ENV === 'production'
		}
	},
	admin: {
		useAsTitle: 'email',
		defaultColumns: ['name', 'email', 'role', 'wholesaleStatus']
	},
	hooks: {
		beforeChange: [
			({ data, originalDoc }) => {
				if (data.role === 'admin' || originalDoc?.role === 'admin') return data

				if (data.wholesaleStatus === 'approved') {
					data.role = 'wholesale'
				} else if (
					(data.wholesaleStatus === 'rejected' || data.wholesaleStatus === 'none') &&
					originalDoc?.role === 'wholesale'
				) {
					data.role = 'customer'
				}

				return data
			}
		]
	},
	access: {
		read: ({ req }) => {
			if (req.user?.role === 'admin') return true
			if (req.user) return { id: { equals: req.user.id } }
			return false
		},
		create: () => true,
		update: ({ req }) => {
			if (req.user?.role === 'admin') return true
			if (req.user) return { id: { equals: req.user.id } }
			return false
		},
		delete: isAdmin,
		admin: ({ req }) => req.user?.role === 'admin'
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true
		},
		{
			name: 'phone',
			type: 'text'
		},
		{
			name: 'role',
			type: 'select',
			required: true,
			defaultValue: 'customer',
			options: [
				{ label: 'Покупатель', value: 'customer' },
				{ label: 'Оптовик', value: 'wholesale' },
				{ label: 'Администратор', value: 'admin' }
			],
			access: {
				create: isAdminFieldLevel,
				update: isAdminFieldLevel
			}
		},
		{
			name: 'wholesaleStatus',
			type: 'select',
			defaultValue: 'none',
			options: [
				{ label: 'Нет заявки', value: 'none' },
				{ label: 'На рассмотрении', value: 'pending' },
				{ label: 'Одобрен', value: 'approved' },
				{ label: 'Отклонён', value: 'rejected' }
			],
			access: {
				update: isAdminFieldLevel
			}
		}
	]
}
