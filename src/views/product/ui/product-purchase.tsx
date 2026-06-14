'use client'

import cn from 'clsx'
import { useState } from 'react'

import { formatPrice } from '@/shared/lib/format-price'
import { useDisplayPrice } from '@/shared/lib/use-display-price'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { useCartStore } from '@/shared/store/cart'
import { useFavoritesStore } from '@/shared/store/favorites'
import { useToastStore } from '@/shared/store/toast'
import { useUiStore } from '@/shared/store/ui'
import type { Product } from '@/shared/types/product'
import { Icon } from '@/shared/ui/icon'
import { QuantityStepper } from '@/shared/ui/quantity-stepper'

import styles from './product-purchase.module.scss'

interface Props {
	product: Product
}

export function ProductPurchase({ product }: Props) {
	const [quantity, setQuantity] = useState(1)

	const hydrated = useHydrated()
	const addItem = useCartStore(state => state.addItem)
	const openDrawer = useUiStore(state => state.openDrawer)
	const showToast = useToastStore(state => state.showToast)
	const toggleFavorite = useFavoritesStore(state => state.toggle)
	const isFavorite = useFavoritesStore(state => state.items.some(item => item.id === product.id))
	const { displayPrice, isWholesale, priceReady } = useDisplayPrice(product.id, product.priceRetail)

	const handleAddToCart = () => {
		if (isWholesale && !priceReady) return
		addItem({ ...product, priceRetail: displayPrice }, quantity)
		showToast(`«${product.title}» — в корзине`)
		openDrawer('cart')
	}

	const handleToggleFavorite = () => {
		toggleFavorite(product)
		showToast(
			isFavorite ? `«${product.title}» — убрано из избранного` : `«${product.title}» — в избранном`
		)
	}

	return (
		<div className={styles.actions}>
			<QuantityStepper
				value={quantity}
				className={styles.stepper}
				onChange={setQuantity}
			/>
			<button
				type='button'
				className={styles.cart}
				onClick={handleAddToCart}
				disabled={isWholesale && !priceReady}
			>
				<span>В корзину ·</span>
				<span>{formatPrice(displayPrice * quantity)}</span>
			</button>
			<button
				type='button'
				className={cn(styles.favorite, { [styles.favoriteActive]: hydrated && isFavorite })}
				aria-label='В избранное'
				aria-pressed={hydrated && isFavorite}
				onClick={handleToggleFavorite}
			>
				<span className={styles.favoriteIcon}>
					<Icon name='heart' />
				</span>
			</button>
		</div>
	)
}
