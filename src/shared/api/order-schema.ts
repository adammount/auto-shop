import { z } from 'zod'

export const orderItemSchema = z.object({
	productId: z.string().min(1),
	quantity: z.number().int().min(1)
})

export const orderSchema = z.object({
	customer: z.object({
		name: z.string().min(2, 'Укажите имя'),
		phone: z.string().min(6, 'Укажите телефон'),
		email: z.string().email('Некорректный e-mail').optional().or(z.literal('')),
		comment: z.string().optional()
	}),
	items: z.array(orderItemSchema).min(1, 'Корзина пуста'),
	delivery: z.enum(['pickup', 'courier', 'transport']),
	contactMethod: z.enum(['call', 'whatsapp', 'email']),
	promoCode: z.string().optional(),
	consent: z.literal(true),
	captchaToken: z.string().min(1, 'Подтвердите, что вы не робот')
})

export type OrderInput = z.infer<typeof orderSchema>

export const checkoutFormSchema = z.object({
	name: z.string().min(2, 'Укажите имя'),
	phone: z.string().min(6, 'Укажите телефон'),
	email: z.string().email('Некорректный e-mail').optional().or(z.literal('')),
	comment: z.string().optional(),
	delivery: z.enum(['pickup', 'courier', 'transport']),
	contactMethod: z.enum(['call', 'whatsapp', 'email']),
	promoCode: z.string().optional(),
	consent: z.boolean().refine(value => value, { message: 'Необходимо согласие' }),
	captchaToken: z.string().min(1, 'Подтвердите, что вы не робот')
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>
