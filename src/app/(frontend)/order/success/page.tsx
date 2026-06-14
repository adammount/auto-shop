import type { Metadata } from 'next'

import { OrderSuccessScreen } from '@/views/order-success'

export const metadata: Metadata = {
	title: 'Заказ оформлен'
}

export default function OrderSuccessPage() {
	return <OrderSuccessScreen />
}
