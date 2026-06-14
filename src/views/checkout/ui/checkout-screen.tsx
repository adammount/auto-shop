'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { type CheckoutFormValues, checkoutFormSchema } from '@/shared/api/order-schema'
import { createOrder } from '@/shared/api/orders-client'
import { ROUTES } from '@/shared/config'
import { useCartStore } from '@/shared/store/cart'
import { useLastOrderStore } from '@/shared/store/last-order'
import { useToastStore } from '@/shared/store/toast'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'

import { CheckoutForm } from './checkout-form'
import { CheckoutSummary } from './checkout-summary'

import styles from './checkout-screen.module.scss'

export function CheckoutScreen() {
	const router = useRouter()
	const items = useCartStore(state => state.items)
	const clearCart = useCartStore(state => state.clear)
	const showToast = useToastStore(state => state.showToast)
	const setLastOrder = useLastOrderStore(state => state.setOrder)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const methods = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			name: '',
			phone: '',
			email: '',
			comment: '',
			delivery: 'pickup',
			contactMethod: 'call',
			consent: false,
			captchaToken: ''
		}
	})

	const onSubmit = async (values: CheckoutFormValues) => {
		if (items.length === 0) return
		setIsSubmitting(true)

		try {
			const data = await createOrder({
				customer: {
					name: values.name,
					phone: values.phone,
					email: values.email,
					comment: values.comment
				},
				items: items.map(item => ({
					productId: item.product.id,
					quantity: item.quantity
				})),
				delivery: values.delivery,
				contactMethod: values.contactMethod,
				promoCode: values.promoCode,
				consent: values.consent,
				captchaToken: values.captchaToken
			})

			setLastOrder(data)
			clearCart()
			showToast('Заказ отправлен менеджеру')

			if (values.contactMethod === 'whatsapp') {
				window.open(data.whatsappLink, '_blank', 'noopener')
			}

			router.push(ROUTES.orderSuccess)
		} catch {
			showToast('Не удалось отправить заказ, попробуйте ещё раз')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className={styles.screen}>
			<div className={styles.hero}>
				<Breadcrumbs
					items={[
						{ label: 'Главная', href: ROUTES.home },
						{ label: 'Каталог', href: ROUTES.catalog },
						{ label: 'Оформление заказа' }
					]}
				/>
				<h1 className={styles.title}>Оформление</h1>
			</div>

			<FormProvider {...methods}>
				<form
					className={styles.layout}
					onSubmit={methods.handleSubmit(onSubmit)}
				>
					<CheckoutForm />
					<CheckoutSummary isSubmitting={isSubmitting} />
				</form>
			</FormProvider>
		</div>
	)
}
