import type { Metadata } from 'next'

import { DeliveryScreen } from '@/views/delivery'

export const metadata: Metadata = {
	title: 'Доставка и оплата'
}

export default function DeliveryPage() {
	return <DeliveryScreen />
}
