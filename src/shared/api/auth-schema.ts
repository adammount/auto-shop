import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().email('Введите корректный e-mail'),
	password: z.string().min(1, 'Введите пароль')
})

export const registerSchema = z.object({
	name: z.string().min(2, 'Укажите имя'),
	phone: z.string().min(6, 'Укажите телефон'),
	email: z.string().email('Введите корректный e-mail'),
	password: z.string().min(6, 'Не менее 6 символов'),
	consent: z.boolean().refine(value => value, { message: 'Необходимо согласие' })
})

export const wholesaleSchema = z.object({
	name: z.string().min(2, 'Укажите имя'),
	phone: z.string().min(6, 'Укажите телефон')
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type WholesaleValues = z.infer<typeof wholesaleSchema>
