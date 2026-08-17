import { z } from 'zod'

export const orderItemSchema = z.object({
	productId: z.string().min(1),
	quantity: z.number().int().min(1).max(999)
})

const customerFields = {
	name: z.string().min(2, 'Укажите имя').max(100),
	phone: z.string().min(6, 'Укажите телефон').max(30),
	email: z.string().email('Некорректный e-mail').max(200).optional().or(z.literal('')),
	comment: z.string().max(1000).optional()
}

const orderFields = {
	delivery: z.enum(['pickup', 'courier', 'transport']),
	contactMethod: z.enum(['call', 'whatsapp', 'email']),
	promoCode: z.string().max(64).optional(),
	captchaToken: z.string().min(1, 'Подтвердите, что вы не робот')
}

export const orderSchema = z.object({
	customer: z.object(customerFields),
	items: z.array(orderItemSchema).min(1, 'Корзина пуста').max(100),
	consent: z.literal(true),
	...orderFields
})

export type OrderInput = z.infer<typeof orderSchema>

export const checkoutFormSchema = z.object({
	...customerFields,
	...orderFields,
	consent: z.boolean().refine(value => value, { message: 'Необходимо согласие' })
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>
