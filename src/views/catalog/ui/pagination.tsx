'use client'

import cn from 'clsx'
import Link from 'next/link'

import { Icon } from '@/shared/ui/icon'

import styles from './pagination.module.scss'

interface Props {
	page: number
	totalPages: number
	buildHref: (page: number) => string
}

type PageItem = number | 'gap'

function buildPageItems(page: number, totalPages: number): PageItem[] {
	const items: PageItem[] = []
	const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])

	let previous = 0
	for (const value of [...pages].filter(n => n >= 1 && n <= totalPages).sort((a, b) => a - b)) {
		if (value - previous > 1) items.push('gap')
		items.push(value)
		previous = value
	}

	return items
}

export function Pagination({ page, totalPages, buildHref }: Props) {
	if (totalPages <= 1) return null

	const items = buildPageItems(page, totalPages)
	const hasPrev = page > 1
	const hasNext = page < totalPages

	return (
		<nav
			className={styles.pagination}
			aria-label='Страницы каталога'
		>
			{hasPrev ? (
				<Link
					href={buildHref(page - 1)}
					className={cn(styles.arrow, styles.arrowPrev)}
					aria-label='Предыдущая страница'
				>
					<Icon name='arrow' />
				</Link>
			) : (
				<span
					className={cn(styles.arrow, styles.arrowPrev, styles.arrowDisabled)}
					aria-hidden='true'
				>
					<Icon name='arrow' />
				</span>
			)}

			{items.map((item, index) =>
				item === 'gap' ? (
					<span
						key={`gap-${index}`}
						className={styles.gap}
					>
						…
					</span>
				) : item === page ? (
					<span
						key={item}
						className={cn(styles.page, styles.pageActive)}
						aria-current='page'
					>
						{item}
					</span>
				) : (
					<Link
						key={item}
						href={buildHref(item)}
						className={styles.page}
					>
						{item}
					</Link>
				)
			)}

			{hasNext ? (
				<Link
					href={buildHref(page + 1)}
					className={styles.arrow}
					aria-label='Следующая страница'
				>
					<Icon name='arrow' />
				</Link>
			) : (
				<span
					className={cn(styles.arrow, styles.arrowDisabled)}
					aria-hidden='true'
				>
					<Icon name='arrow' />
				</span>
			)}
		</nav>
	)
}
