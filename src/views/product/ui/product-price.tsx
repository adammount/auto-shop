'use client'

import { formatPrice } from '@/shared/lib/format-price'
import { useDisplayPrice } from '@/shared/lib/use-display-price'

import styles from './product-info.module.scss'

interface Props {
	productId: string
	priceRetail: number
}

export function ProductPrice({ productId, priceRetail }: Props) {
	const { displayPrice, isWholesale } = useDisplayPrice(productId, priceRetail)

	return (
		<div className={styles.price}>
			<span className={styles.priceValue}>{formatPrice(displayPrice)}</span>
			<span className={styles.priceUnit}>/шт</span>
			{isWholesale && <span className={styles.priceOld}>{formatPrice(priceRetail)}</span>}
		</div>
	)
}
