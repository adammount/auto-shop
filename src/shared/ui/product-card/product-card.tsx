'use client'

import cn from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { formatPrice } from '@/shared/lib/format-price'
import { useDisplayPrice } from '@/shared/lib/use-display-price'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { useCartStore } from '@/shared/store/cart'
import { useFavoritesStore } from '@/shared/store/favorites'
import { useToastStore } from '@/shared/store/toast'
import type { Product } from '@/shared/types/product'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'

import styles from './product-card.module.scss'

interface Props {
	product: Product
}

export function ProductCard({ product }: Props) {
	const { id, slug, title, sku, brand, priceRetail, stock, stockLabel, isNew, image } = product

	const hydrated = useHydrated()
	const addItem = useCartStore(state => state.addItem)
	const toggleFavorite = useFavoritesStore(state => state.toggle)
	const isFavorite = useFavoritesStore(state => state.items.some(item => item.id === product.id))
	const showToast = useToastStore(state => state.showToast)
	const { displayPrice, isWholesale, priceReady } = useDisplayPrice(id, priceRetail)

	const handleAddToCart = () => {
		if (isWholesale && !priceReady) return
		addItem({ ...product, priceRetail: displayPrice })
		showToast(`«${title}» — в корзине`)
	}

	const handleToggleFavorite = () => {
		toggleFavorite(product)
		showToast(isFavorite ? `«${title}» — убрано из избранного` : `«${title}» — в избранном`)
	}

	return (
		<article className={styles.card}>
			<div className={styles.thumb}>
				<Link
					href={ROUTES.product(slug)}
					className={styles.image}
				>
					{image ? (
						<Image
							src={image}
							alt={title}
							fill
							sizes='(max-width: 767px) 50vw, 280px'
							className={styles.imageMedia}
						/>
					) : (
						<span className={styles.imageLabel}>{title}</span>
					)}
				</Link>
				{isNew && (
					<Badge
						variant='dark'
						className={styles.badgeNew}
					>
						новинка
					</Badge>
				)}
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

			<Link
				href={ROUTES.product(slug)}
				className={styles.name}
			>
				<span className={styles.nameText}>{title}</span>
			</Link>

			<div className={styles.meta}>
				<div className={styles.specs}>
					<span className={styles.sku}>{sku}</span>
					<span className={styles.brand}>{brand}</span>
				</div>
				{stock === 'in-stock' && (
					<Badge
						variant='success'
						withDot
					>
						В наличии
					</Badge>
				)}
				{stock === 'low' && (
					<Badge
						variant='warning'
						withDot
					>
						{stockLabel ?? 'Мало'}
					</Badge>
				)}
			</div>

			<div className={styles.price}>
				<span className={styles.priceValue}>{formatPrice(displayPrice)}</span>
				<span className={styles.priceUnit}>/шт</span>
				{isWholesale && <span className={styles.priceOld}>{formatPrice(priceRetail)}</span>}
			</div>

			<Button
				size='md'
				className={styles.cta}
				onClick={handleAddToCart}
				disabled={isWholesale && !priceReady}
			>
				В корзину
			</Button>
		</article>
	)
}
