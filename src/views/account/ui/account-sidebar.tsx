import cn from 'clsx'

import styles from './account-sidebar.module.scss'

export type AccountTab = 'profile' | 'orders' | 'favorites' | 'wholesale'

interface Props {
	active: AccountTab
	onChange: (tab: AccountTab) => void
	onLogout?: () => void
	ordersCount: number
	favoritesCount: number
}

export function AccountSidebar({ active, onChange, onLogout, ordersCount, favoritesCount }: Props) {
	const tabs: { id: AccountTab; label: string; count?: number }[] = [
		{ id: 'profile', label: 'Профиль' },
		{ id: 'orders', label: 'История заказов', count: ordersCount },
		{ id: 'favorites', label: 'Избранное', count: favoritesCount },
		{ id: 'wholesale', label: 'Статус оптовика' }
	]

	return (
		<nav className={styles.sidebar}>
			{tabs.map(tab => (
				<button
					key={tab.id}
					type='button'
					className={cn(styles.tab, { [styles.tabActive]: tab.id === active })}
					onClick={() => onChange(tab.id)}
				>
					<span>{tab.label}</span>
					{tab.count !== undefined && <span className={styles.count}>{tab.count}</span>}
				</button>
			))}
			<button
				type='button'
				className={styles.logout}
				onClick={onLogout}
			>
				Выйти
			</button>
		</nav>
	)
}
