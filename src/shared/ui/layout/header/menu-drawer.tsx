'use client'

import Link from 'next/link'

import type { NavCategory } from '@/shared/api/content-repository'
import { ROUTES } from '@/shared/config'
import { useUiStore } from '@/shared/store/ui'
import { Drawer } from '@/shared/ui/drawer'

import styles from './menu-drawer.module.scss'

interface Props {
	categories: NavCategory[]
}

export function MenuDrawer({ categories }: Props) {
	const isOpen = useUiStore(state => state.drawer === 'menu')
	const closeDrawer = useUiStore(state => state.closeDrawer)

	return (
		<Drawer
			isOpen={isOpen}
			title='Меню'
			side='left'
			onClose={closeDrawer}
		>
			<nav className={styles.menu}>
				<Link
					href={ROUTES.catalog}
					className={styles.link}
					onClick={closeDrawer}
				>
					Каталог
				</Link>
				{categories.map(category => (
					<Link
						key={category.slug}
						href={ROUTES.catalogCategory(category.slug)}
						className={styles.link}
						onClick={closeDrawer}
					>
						{category.title}
					</Link>
				))}
			</nav>
		</Drawer>
	)
}
