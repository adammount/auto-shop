'use client'

import { useState } from 'react'

import { fetchProductsByIds } from '@/shared/api/orders-client'
import { formatDate } from '@/shared/lib/format-date'
import { formatPrice } from '@/shared/lib/format-price'
import { useCartStore } from '@/shared/store/cart'
import { useToastStore } from '@/shared/store/toast'
import { useUiStore } from '@/shared/store/ui'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

import { type AccountOrder, type OrderStatus } from '../model/use-account-orders'

import styles from './account-stack.module.scss'

const STATUS_META: Record<
	OrderStatus,
	{ label: string; variant: 'success' | 'info' | 'warning' | 'danger' }
> = {
	new: { label: 'Новый', variant: 'info' },
	processing: { label: 'В обработке', variant: 'warning' },
	'in-transit': { label: 'В пути', variant: 'info' },
	delivered: { label: 'Доставлен', variant: 'success' },
	cancelled: { label: 'Отменён', variant: 'danger' }
}

interface Props {
	orders: AccountOrder[]
	isLoading: boolean
}

export function OrdersSection({ orders, isLoading }: Props) {
	const [repeatingId, setRepeatingId] = useState<string | null>(null)

	const addItem = useCartStore(state => state.addItem)
	const openDrawer = useUiStore(state => state.openDrawer)
	const showToast = useToastStore(state => state.showToast)

	const handleRepeat = async (order: AccountOrder) => {
		setRepeatingId(order.id)

		try {
			const products = await fetchProductsByIds(order.items.map(item => item.productId))
			const quantityById = new Map(order.items.map(item => [item.productId, item.quantity]))

			let added = 0
			for (const product of products) {
				addItem(product, quantityById.get(product.id) ?? 1)
				added += 1
			}

			if (added === 0) {
				showToast('Товары из заказа больше недоступны')
				return
			}

			showToast(
				added < order.items.length ? 'Часть товаров уже недоступна' : 'Товары добавлены в корзину'
			)
			openDrawer('cart')
		} catch {
			showToast('Не удалось повторить заказ')
		} finally {
			setRepeatingId(null)
		}
	}

	return (
		<section className={styles.card}>
			<h2 className={styles.cardTitle}>История заказов</h2>

			{isLoading && <p className={styles.statusNote}>Загружаем заказы…</p>}

			{!isLoading && orders.length === 0 && (
				<p className={styles.statusNote}>Заказов пока нет. Оформите первый — он появится здесь.</p>
			)}

			{!isLoading && orders.length > 0 && (
				<div className={styles.orders}>
					{orders.map(order => {
						const meta = STATUS_META[order.status]
						return (
							<div
								key={order.id}
								className={styles.order}
							>
								<div className={styles.orderInfo}>
									<span className={styles.orderNumber}>{order.number}</span>
									<span className={styles.orderMeta}>
										{formatDate(order.createdAt)} · {order.positions} поз.
									</span>
								</div>
								<Badge
									variant={meta.variant}
									withDot
								>
									{meta.label}
								</Badge>
								<span className={styles.orderTotal}>{formatPrice(order.total)}</span>
								<Button
									variant='outline'
									size='md'
									className={styles.orderRepeat}
									onClick={() => handleRepeat(order)}
									disabled={repeatingId === order.id}
								>
									{repeatingId === order.id ? 'Добавляем…' : 'Повторить'}
								</Button>
							</div>
						)
					})}
				</div>
			)}
		</section>
	)
}
