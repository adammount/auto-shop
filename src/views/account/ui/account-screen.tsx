'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ROUTES } from '@/shared/config'
import { useFavoritesStore } from '@/shared/store/favorites'
import { useSessionStore } from '@/shared/store/session'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'

import { useAccountOrders } from '../model/use-account-orders'

import { AccountSidebar, type AccountTab } from './account-sidebar'
import { FavoritesSection } from './favorites-section'
import { OrdersSection } from './orders-section'
import { ProfileSection } from './profile-section'
import { WholesaleSection } from './wholesale-section'

import styles from './account-screen.module.scss'

const ROLE_LABEL: Record<string, string> = {
	customer: 'Покупатель',
	wholesale: 'Оптовик',
	admin: 'Администратор'
}

export function AccountScreen() {
	const router = useRouter()
	const user = useSessionStore(state => state.user)
	const isLoaded = useSessionStore(state => state.isLoaded)
	const logout = useSessionStore(state => state.logout)
	const favoritesCount = useFavoritesStore(state => state.items.length)
	const { orders, isLoading: ordersLoading } = useAccountOrders()
	const [active, setActive] = useState<AccountTab>('profile')

	useEffect(() => {
		if (isLoaded && !user) router.replace(ROUTES.login)
	}, [isLoaded, user, router])

	const handleLogout = async () => {
		await logout()
		router.replace(ROUTES.login)
	}

	if (!user) return null

	const isWholesale = user.role === 'wholesale' && user.wholesaleStatus === 'approved'

	return (
		<div className={styles.screen}>
			<div className={styles.hero}>
				<Breadcrumbs
					items={[{ label: 'Главная', href: ROUTES.home }, { label: 'Личный кабинет' }]}
				/>
				<div className={styles.titleRow}>
					<h1 className={styles.title}>{user.name}</h1>
					<span className={styles.role}>{ROLE_LABEL[user.role]}</span>
				</div>
			</div>

			<div className={styles.layout}>
				<AccountSidebar
					active={active}
					onChange={setActive}
					onLogout={handleLogout}
					ordersCount={orders.length}
					favoritesCount={favoritesCount}
				/>

				<div className={styles.stack}>
					{active === 'profile' && <ProfileSection user={user} />}
					{active === 'orders' && (
						<OrdersSection
							orders={orders}
							isLoading={ordersLoading}
						/>
					)}
					{active === 'favorites' && <FavoritesSection />}
					{active === 'wholesale' && <WholesaleSection isWholesale={isWholesale} />}
				</div>
			</div>
		</div>
	)
}
