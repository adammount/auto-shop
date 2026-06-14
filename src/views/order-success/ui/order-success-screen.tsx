'use client'

import type { OrderResult } from '@/shared/api/orders-client'
import { ROUTES } from '@/shared/config'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { useLastOrderStore } from '@/shared/store/last-order'
import { LinkButton } from '@/shared/ui/button'
import { StatusScreen } from '@/shared/ui/status-screen'

import styles from './order-success-screen.module.scss'

const DEFAULT_TEXT =
	'Менеджер свяжется с вами для подтверждения. Оплата и доставка согласуются удобным способом.'

function successText(order: OrderResult): string {
	switch (order.contactMethod) {
		case 'call':
			return `Менеджер перезвонит вам по номеру ${order.phone} для подтверждения заказа.`
		case 'whatsapp':
			return 'Напишите нам в WhatsApp или дождитесь сообщения менеджера — он подтвердит заказ и согласует доставку.'
		case 'email':
			return order.email
				? `Подтверждение заказа отправили на ${order.email}. Менеджер также свяжется с вами при необходимости.`
				: DEFAULT_TEXT
		default:
			return DEFAULT_TEXT
	}
}

export function OrderSuccessScreen() {
	const hydrated = useHydrated()
	const order = useLastOrderStore(state => state.order)

	const title = hydrated && order ? `Заказ ${order.orderNumber} принят` : 'Заказ принят'
	const text = hydrated && order ? successText(order) : DEFAULT_TEXT
	const showWhatsapp = hydrated && order?.contactMethod === 'whatsapp'

	return (
		<StatusScreen
			code='Спасибо!'
			title={title}
			text={text}
			action={
				<div className={styles.actions}>
					{showWhatsapp && (
						<a
							href={order.whatsappLink}
							target='_blank'
							rel='noopener noreferrer'
							className={styles.whatsapp}
						>
							Связаться в WhatsApp
						</a>
					)}
					<LinkButton
						href={ROUTES.catalog}
						size='lg'
						variant={showWhatsapp ? 'outline' : 'primary'}
					>
						Вернуться в каталог
					</LinkButton>
				</div>
			}
		/>
	)
}
