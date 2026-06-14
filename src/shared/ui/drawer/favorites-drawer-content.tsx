'use client'

import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { formatPrice } from '@/shared/lib/format-price'
import { useCartStore } from '@/shared/store/cart'
import { useFavoritesStore } from '@/shared/store/favorites'
import { useToastStore } from '@/shared/store/toast'
import { useUiStore } from '@/shared/store/ui'
import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'

import { DrawerEmpty } from './drawer-empty'
import { DrawerThumb } from './drawer-thumb'

import styles from './drawer-content.module.scss'

export function FavoritesDrawerContent() {
	const items = useFavoritesStore(state => state.items)
	const remove = useFavoritesStore(state => state.remove)
	const addItem = useCartStore(state => state.addItem)
	const showToast = useToastStore(state => state.showToast)
	const closeDrawer = useUiStore(state => state.closeDrawer)

	if (items.length === 0) {
		return (
			<DrawerEmpty
				icon='heart'
				title='В избранном пусто'
				text='Сохраняйте товары, чтобы быстро вернуться к ним позже.'
			/>
		)
	}

	return (
		<div className={styles.list}>
			{items.map(product => (
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
						<div className={styles.favRow}>
							<span className={styles.favPrice}>{formatPrice(product.priceRetail)}</span>
							<Button
								size='md'
								className={styles.favAdd}
								onClick={() => {
									addItem(product)
									showToast(`«${product.title}» — в корзине`)
								}}
							>
								В корзину
							</Button>
						</div>
					</div>
					<button
						type='button'
						className={styles.remove}
						aria-label='Удалить из избранного'
						onClick={() => remove(product.id)}
					>
						<span className={styles.removeIcon}>
							<Icon name='close' />
						</span>
					</button>
				</div>
			))}
		</div>
	)
}
