import { z } from 'zod'

const nameField = z.string().min(2, 'Укажите имя').max(100)
const phoneField = z.string().min(6, 'Укажите телефон').max(30)
const emailField = z.string().email('Введите корректный e-mail').max(200)

export const loginSchema = z.object({
	email: emailField,
	password: z.string().min(1, 'Введите пароль').max(200)
})

export const registerSchema = z.object({
	name: nameField,
	phone: phoneField,
	email: emailField,
	password: z.string().min(8, 'Не менее 8 символов').max(200),
	consent: z.boolean().refine(value => value, { message: 'Необходимо согласие' })
})

export const wholesaleSchema = z.object({
	name: nameField,
	phone: phoneField
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type WholesaleValues = z.infer<typeof wholesaleSchema>
