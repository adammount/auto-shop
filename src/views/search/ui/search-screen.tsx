import { searchProductsDb } from '@/shared/api/products-repository'
import { ROUTES } from '@/shared/config'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'
import { LinkButton } from '@/shared/ui/button'
import { ProductCard } from '@/shared/ui/product-card'

import styles from './search-screen.module.scss'

interface Props {
	query: string
}

export async function SearchScreen({ query }: Props) {
	const results = await searchProductsDb(query)
	const trimmed = query.trim()

	return (
		<div className={styles.screen}>
			<div className={styles.hero}>
				<Breadcrumbs items={[{ label: 'Главная', href: ROUTES.home }, { label: 'Поиск' }]} />
				<div className={styles.titleRow}>
					<h1 className={styles.title}>Результаты поиска</h1>
					<span className={styles.count}>
						{trimmed ? `${results.length} товаров` : 'Введите запрос'}
					</span>
				</div>
				{trimmed && <p className={styles.query}>По запросу «{trimmed}»</p>}
			</div>

			{results.length > 0 ? (
				<div className={styles.grid}>
					{results.map(product => (
						<ProductCard
							key={product.id}
							product={product}
						/>
					))}
				</div>
			) : (
				<div className={styles.empty}>
					<p className={styles.emptyTitle}>Ничего не найдено</p>
					<p className={styles.emptyText}>
						Попробуйте изменить запрос или поискать по артикулу. Можно открыть весь каталог.
					</p>
					<LinkButton
						href={ROUTES.catalog}
						size='md'
					>
						В каталог
					</LinkButton>
				</div>
			)}
		</div>
	)
}
