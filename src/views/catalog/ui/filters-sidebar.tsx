'use client'

import cn from 'clsx'
import { useRouter } from 'next/navigation'
import { type ReactNode, useState, useTransition } from 'react'

import type { CatalogFacet, CatalogQuery } from '@/shared/api/products-repository'
import { Checkbox } from '@/shared/ui/checkbox'
import { Icon } from '@/shared/ui/icon'

import { buildCatalogHref, toggleSlug } from '../lib/filtering'

import styles from './filters-sidebar.module.scss'

interface GroupProps {
	title: string
	children: ReactNode
}

function FilterGroup({ title, children }: GroupProps) {
	const [isOpen, setIsOpen] = useState(true)

	return (
		<div className={styles.group}>
			<button
				type='button'
				className={styles.groupHead}
				aria-expanded={isOpen}
				onClick={() => setIsOpen(open => !open)}
			>
				<span className={styles.groupTitle}>{title}</span>
				<span className={cn(styles.groupIcon, { [styles.groupIconOpen]: isOpen })}>
					<Icon name='chevron' />
				</span>
			</button>
			<div className={cn(styles.groupBody, { [styles.groupBodyOpen]: isOpen })}>
				<div className={styles.groupBodyInner}>
					<div className={styles.groupContent}>{children}</div>
				</div>
			</div>
		</div>
	)
}

interface Props {
	query: CatalogQuery
	categories: CatalogFacet[]
	brands: CatalogFacet[]
	embedded?: boolean
}

export function FiltersSidebar({ query, categories, brands, embedded = false }: Props) {
	const router = useRouter()
	const [, startTransition] = useTransition()
	const [priceMin, setPriceMin] = useState(query.priceMin?.toString() ?? '')
	const [priceMax, setPriceMax] = useState(query.priceMax?.toString() ?? '')

	const navigate = (next: CatalogQuery) => {
		startTransition(() => {
			router.push(buildCatalogHref({ ...next, page: 1 }), { scroll: false })
		})
	}

	const toggleCategory = (slug: string) => {
		navigate({ ...query, categorySlugs: toggleSlug(query.categorySlugs, slug) })
	}

	const toggleBrand = (slug: string) => {
		navigate({ ...query, brandSlugs: toggleSlug(query.brandSlugs, slug) })
	}

	const applyPrice = () => {
		const min = priceMin ? Number(priceMin) : undefined
		const max = priceMax ? Number(priceMax) : undefined
		navigate({ ...query, priceMin: min, priceMax: max })
	}

	const toggleInStock = (checked: boolean) => {
		navigate({ ...query, inStockOnly: checked })
	}

	const handleReset = () => {
		setPriceMin('')
		setPriceMax('')
		startTransition(() => {
			router.push('/catalog', { scroll: false })
		})
	}

	return (
		<aside className={cn(styles.filters, { [styles.filtersEmbedded]: embedded })}>
			<div className={styles.head}>
				{!embedded && <h2 className={styles.title}>Фильтры</h2>}
				<button
					type='button'
					className={styles.clear}
					onClick={handleReset}
				>
					<span className={styles.clearText}>Сбросить</span>
					<span className={styles.clearIcon}>
						<Icon name='close' />
					</span>
				</button>
			</div>

			<FilterGroup title='Категория'>
				{categories.map(option => (
					<Checkbox
						key={option.slug}
						count={option.count}
						checked={query.categorySlugs.includes(option.slug)}
						onChange={() => toggleCategory(option.slug)}
					>
						{option.title}
					</Checkbox>
				))}
			</FilterGroup>

			<FilterGroup title='Бренд'>
				{brands.map(option => (
					<Checkbox
						key={option.slug}
						count={option.count}
						checked={query.brandSlugs.includes(option.slug)}
						onChange={() => toggleBrand(option.slug)}
					>
						{option.title}
					</Checkbox>
				))}
			</FilterGroup>

			<FilterGroup title='Цена, ₽'>
				<div className={styles.priceRange}>
					<input
						className={styles.priceInput}
						type='number'
						placeholder='от 0'
						aria-label='Цена от'
						value={priceMin}
						onChange={event => setPriceMin(event.target.value)}
						onBlur={applyPrice}
					/>
					<span className={styles.priceSep}>—</span>
					<input
						className={styles.priceInput}
						type='number'
						placeholder='до 20 000'
						aria-label='Цена до'
						value={priceMax}
						onChange={event => setPriceMax(event.target.value)}
						onBlur={applyPrice}
					/>
				</div>
			</FilterGroup>

			<FilterGroup title='Наличие'>
				<Checkbox
					checked={query.inStockOnly}
					onChange={event => toggleInStock(event.target.checked)}
				>
					Только в наличии
				</Checkbox>
			</FilterGroup>
		</aside>
	)
}
