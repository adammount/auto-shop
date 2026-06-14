'use client'

import { useUiStore } from '@/shared/store/ui'
import { Icon } from '@/shared/ui/icon'

import styles from './header.module.scss'

export function BurgerButton() {
	const openDrawer = useUiStore(state => state.openDrawer)

	return (
		<button
			type='button'
			className={styles.burger}
			aria-label='Меню'
			onClick={() => openDrawer('menu')}
		>
			<span className={styles.burgerIcon}>
				<Icon name='burger' />
			</span>
		</button>
	)
}
