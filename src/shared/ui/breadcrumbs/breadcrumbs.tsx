import Link from 'next/link'
import { Fragment } from 'react'

import styles from './breadcrumbs.module.scss'

export interface Crumb {
	label: string
	href?: string
}

interface Props {
	items: Crumb[]
}

export function Breadcrumbs({ items }: Props) {
	return (
		<nav
			className={styles.crumbs}
			aria-label='Хлебные крошки'
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1

				return (
					<Fragment key={item.label}>
						{item.href && !isLast ? (
							<Link
								href={item.href}
								className={styles.link}
							>
								{item.label}
							</Link>
						) : (
							<span className={styles.current}>{item.label}</span>
						)}
						{!isLast && <span className={styles.sep}>/</span>}
					</Fragment>
				)
			})}
		</nav>
	)
}
