'use client'

import { ROUTES } from '@/shared/config'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { useFavoritesStore } from '@/shared/store/favorites'
import { LinkButton } from '@/shared/ui/button'
import { ProductCard } from '@/shared/ui/product-card'

import styles from './account-stack.module.scss'

export function FavoritesSection() {
	const hydrated = useHydrated()
	const items = useFavoritesStore(state => state.items)

	const isEmpty = hydrated && items.length === 0

	return (
		<section className={styles.card}>
			<h2 className={styles.cardTitle}>Избранное</h2>

			{!hydrated && <p className={styles.emptyText}>Загружаем избранное…</p>}

			{isEmpty && (
				<div className={styles.empty}>
					<p className={styles.emptyText}>В избранном пока пусто</p>
					<p className={styles.emptyNote}>
						Добавляйте товары в избранное, чтобы быстро вернуться к ним позже.
					</p>
					<LinkButton
						href={ROUTES.catalog}
						variant='outline'
						size='md'
						className={styles.emptyButton}
					>
						Перейти в каталог
					</LinkButton>
				</div>
			)}

			{hydrated && items.length > 0 && (
				<div className={styles.favoritesGrid}>
					{items.map(product => (
						<ProductCard
							key={product.id}
							product={product}
						/>
					))}
				</div>
			)}
		</section>
	)
}
