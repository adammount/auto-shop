'use client'

import type { CatalogFacet, CatalogQuery } from '@/shared/api/products-repository'
import { useUiStore } from '@/shared/store/ui'
import { Drawer } from '@/shared/ui/drawer'

import { FiltersSidebar } from './filters-sidebar'

interface Props {
	query: CatalogQuery
	categories: CatalogFacet[]
	brands: CatalogFacet[]
}

export function FiltersDrawer({ query, categories, brands }: Props) {
	const isOpen = useUiStore(state => state.drawer === 'filters')
	const closeDrawer = useUiStore(state => state.closeDrawer)

	return (
		<Drawer
			isOpen={isOpen}
			title='Фильтры'
			side='left'
			onClose={closeDrawer}
		>
			<FiltersSidebar
				query={query}
				categories={categories}
				brands={brands}
				embedded
			/>
		</Drawer>
	)
}
