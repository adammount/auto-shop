'use client'

import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { formatPrice } from '@/shared/lib/format-price'
import { selectCartTotal, useCartStore } from '@/shared/store/cart'
import { useUiStore } from '@/shared/store/ui'
import { Icon } from '@/shared/ui/icon'
import { QuantityStepper } from '@/shared/ui/quantity-stepper'

import { DrawerEmpty } from './drawer-empty'
import { DrawerThumb } from './drawer-thumb'

import styles from './drawer-content.module.scss'

export function CartDrawerContent() {
	const items = useCartStore(state => state.items)
	const setQuantity = useCartStore(state => state.setQuantity)
	const removeItem = useCartStore(state => state.removeItem)
	const total = useCartStore(selectCartTotal)
	const closeDrawer = useUiStore(state => state.closeDrawer)

	if (items.length === 0) {
		return (
			<DrawerEmpty
				icon='cart'
				title='Корзина пуста'
				text='Добавьте товары из каталога, чтобы оформить заказ.'
			/>
		)
	}

	return (
		<div className={styles.wrap}>
			<div className={styles.list}>
				{items.map(({ product, quantity }) => (
					<div
						key={product.id}
						className={styles.line}
					>
						<DrawerThumb
							image={product.image}
							title={product.title}
						/>
						<div className={styles.info}>
							<Link
								href={ROUTES.product(product.slug)}
								className={styles.title}
								onClick={closeDrawer}
							>
								{product.title}
							</Link>
							<span className={styles.meta}>{product.brand}</span>
							<div className={styles.controls}>
								<QuantityStepper
									value={quantity}
									size='sm'
									onChange={value => setQuantity(product.id, value)}
								/>
								<span className={styles.price}>{formatPrice(product.priceRetail * quantity)}</span>
							</div>
						</div>
						<button
							type='button'
							className={styles.remove}
							aria-label='Удалить'
							onClick={() => removeItem(product.id)}
						>
							<span className={styles.removeIcon}>
								<Icon name='close' />
							</span>
						</button>
					</div>
				))}
			</div>

			<div className={styles.footer}>
				<div className={styles.totalRow}>
					<span className={styles.totalLabel}>Итого</span>
					<span className={styles.totalValue}>{formatPrice(total)}</span>
				</div>
				<Link
					href={ROUTES.checkout}
					className={styles.checkout}
					onClick={closeDrawer}
				>
					Оформить заказ
				</Link>
			</div>
		</div>
	)
}
