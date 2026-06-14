import type { Metadata } from 'next'

import { CheckoutScreen } from '@/views/checkout'

export const metadata: Metadata = {
	title: 'Оформление заказа'
}

export default function CheckoutPage() {
	return <CheckoutScreen />
}
