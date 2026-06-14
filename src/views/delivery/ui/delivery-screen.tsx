import { ROUTES } from '@/shared/config'
import { Accordion } from '@/shared/ui/accordion'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'

import { DELIVERY_ITEMS } from '../model/delivery.data'

import styles from './delivery-screen.module.scss'

export function DeliveryScreen() {
	return (
		<div className={styles.screen}>
			<div className={styles.hero}>
				<Breadcrumbs
					items={[{ label: 'Главная', href: ROUTES.home }, { label: 'Доставка и оплата' }]}
				/>
				<h1 className={styles.title}>Доставка и оплата</h1>
				<p className={styles.lead}>
					Отгружаем со склада в Москве в день оплаты. Оплата на сайте не требуется — заказ
					согласуется с менеджером.
				</p>
			</div>

			<Accordion items={DELIVERY_ITEMS} />
		</div>
	)
}
