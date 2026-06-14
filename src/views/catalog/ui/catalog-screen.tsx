import { getCatalogFacets, getCatalogProducts } from '@/shared/api/products-repository'
import { ROUTES } from '@/shared/config'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'

import { type CatalogSearchParams, parseCatalogSearchParams } from '../lib/filtering'

import { CatalogBody } from './catalog-body'
import { FiltersDrawer } from './filters-drawer'
import { FiltersSidebar } from './filters-sidebar'

import styles from './catalog-screen.module.scss'

interface Props {
	searchParams: CatalogSearchParams
}

export async function CatalogScreen({ searchParams }: Props) {
	const query = parseCatalogSearchParams(searchParams)
	const [result, facets] = await Promise.all([getCatalogProducts(query), getCatalogFacets()])

	return (
		<div className={styles.screen}>
			<div className={styles.top}>
				<Breadcrumbs items={[{ label: 'Главная', href: ROUTES.home }, { label: 'Каталог' }]} />
				<div className={styles.titleRow}>
					<h1 className={styles.title}>Каталог запчастей</h1>
					<span className={styles.count}>{result.total} товаров</span>
				</div>
			</div>

			<div className={styles.grid}>
				<div className={styles.sidebar}>
					<FiltersSidebar
						query={query}
						categories={facets.categories}
						brands={facets.brands}
					/>
				</div>
				<CatalogBody
					query={query}
					products={result.products}
					total={result.total}
					page={result.page}
					totalPages={result.totalPages}
				/>
			</div>

			<FiltersDrawer
				query={query}
				categories={facets.categories}
				brands={facets.brands}
			/>
		</div>
	)
}
