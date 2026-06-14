import Link from 'next/link'

import { getNavCategories } from '@/shared/api/content-repository'
import { ROUTES } from '@/shared/config'
import { Icon } from '@/shared/ui/icon'
import { SearchBar } from '@/shared/ui/search'

import { BurgerButton } from './burger-button'
import { HeaderActions } from './header-actions'
import { MenuDrawer } from './menu-drawer'

import styles from './header.module.scss'

const MAX_NAV_CATEGORIES = 8

export async function Header() {
	const categories = (await getNavCategories()).slice(0, MAX_NAV_CATEGORIES)

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.left}>
					<BurgerButton />

					<Link
						href={ROUTES.home}
						className={styles.logo}
					>
						<span className={styles.logoName}>Деталь</span>
						<span className={styles.logoSub}>авто·запчасти</span>
					</Link>
				</div>

				<div className={styles.search}>
					<SearchBar />
				</div>

				<HeaderActions />
			</div>

			<MenuDrawer categories={categories} />

			<nav className={styles.nav}>
				<div className={styles.navContainer}>
					<Link
						href={ROUTES.catalog}
						className={styles.navCatalog}
					>
						Каталог
					</Link>
					<ul className={styles.navLinks}>
						{categories.map(category => (
							<li key={category.slug}>
								<Link
									href={ROUTES.catalogCategory(category.slug)}
									className={styles.navLink}
								>
									{category.title}
								</Link>
							</li>
						))}
					</ul>
					<Link
						href={ROUTES.account}
						className={styles.navAccount}
					>
						Личный кабинет
						<span className={styles.navAccountIcon}>
							<Icon name='arrow' />
						</span>
					</Link>
				</div>
			</nav>
		</header>
	)
}
