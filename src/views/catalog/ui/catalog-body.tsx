'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import type { CatalogQuery, CatalogSort } from '@/shared/api/products-repository'
import { useUiStore } from '@/shared/store/ui'
import type { Product } from '@/shared/types/product'
import { Icon } from '@/shared/ui/icon'
import { ProductCard } from '@/shared/ui/product-card'

import { SORT_LABELS, buildCatalogHref } from '../lib/filtering'

import { Pagination } from './pagination'

import styles from './catalog-body.module.scss'

interface Props {
	query: CatalogQuery
	products: Product[]
	total: number
	page: number
	totalPages: number
}

export function CatalogBody({ query, products, total, page, totalPages }: Props) {
	const router = useRouter()
	const [, startTransition] = useTransition()
	const openDrawer = useUiStore(state => state.openDrawer)

	const handleSortChange = (sort: CatalogSort) => {
		startTransition(() => {
			router.push(buildCatalogHref({ ...query, sort, page: 1 }), { scroll: false })
		})
	}

	return (
		<div className={styles.body}>
			<div className={styles.tools}>
				<button
					type='button'
					className={styles.filterButton}
					onClick={() => openDrawer('filters')}
				>
					<span className={styles.filterIcon}>
						<Icon name='filter' />
					</span>
					Фильтр
				</button>
				<span className={styles.found}>Найдено {total} товаров</span>
				<label className={styles.sortWrap}>
					<span className={styles.sortLabel}>Сортировка</span>
					<select
						className={styles.sortSelect}
						value={query.sort}
						onChange={event => handleSortChange(event.target.value as CatalogSort)}
					>
						{SORT_LABELS.map(option => (
							<option
								key={option.value}
								value={option.value}
							>
								{option.label}
							</option>
						))}
					</select>
				</label>
			</div>

			{products.length > 0 ? (
				<>
					<div className={styles.grid}>
						{products.map(product => (
							<ProductCard
								key={product.id}
								product={product}
							/>
						))}
					</div>
					<Pagination
						page={page}
						totalPages={totalPages}
						buildHref={nextPage => buildCatalogHref({ ...query, page: nextPage })}
					/>
				</>
			) : (
				<p className={styles.empty}>По выбранным фильтрам ничего не нашлось. Сбросьте фильтры.</p>
			)}
		</div>
	)
}
