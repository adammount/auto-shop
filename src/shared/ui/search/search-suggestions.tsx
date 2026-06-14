import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { formatPrice } from '@/shared/lib/format-price'
import type { Product } from '@/shared/types/product'

import styles from './search-suggestions.module.scss'

interface Props {
	query: string
	products: Product[]
	onSelect: () => void
	onShowAll: () => void
}

export function SearchSuggestions({ query, products, onSelect, onShowAll }: Props) {
	return (
		<div className={styles.dropdown}>
			{products.length === 0 ? (
				<p className={styles.empty}>Ничего не найдено по запросу «{query}»</p>
			) : (
				<ul className={styles.list}>
					{products.map(product => (
						<li key={product.id}>
							<Link
								href={ROUTES.product(product.slug)}
								className={styles.item}
								onClick={onSelect}
							>
								<span className={styles.itemInfo}>
									<span className={styles.itemTitle}>{product.title}</span>
									<span className={styles.itemMeta}>
										{product.brand} · {product.sku}
									</span>
								</span>
								<span className={styles.itemPrice}>{formatPrice(product.priceRetail)}</span>
							</Link>
						</li>
					))}
				</ul>
			)}

			<button
				type='button'
				className={styles.showAll}
				onClick={onShowAll}
			>
				Показать все результаты
			</button>
		</div>
	)
}
