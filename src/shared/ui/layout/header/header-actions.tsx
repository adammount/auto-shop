'use client'

import cn from 'clsx'
import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { formatPrice } from '@/shared/lib/format-price'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { selectCartCount, selectCartTotal, useCartStore } from '@/shared/store/cart'
import { useFavoritesStore } from '@/shared/store/favorites'
import { useSessionStore } from '@/shared/store/session'
import { useUiStore } from '@/shared/store/ui'
import { Icon } from '@/shared/ui/icon'

import styles from './header.module.scss'

export function HeaderActions() {
	const hydrated = useHydrated()
	const openDrawer = useUiStore(state => state.openDrawer)
	const cartTotal = useCartStore(selectCartTotal)
	const cartCount = useCartStore(selectCartCount)
	const favoritesCount = useFavoritesStore(state => state.items.length)
	const user = useSessionStore(state => state.user)

	const isWholesale = user?.role === 'wholesale' && user.wholesaleStatus === 'approved'

	return (
		<div className={styles.actions}>
			<div className={styles.toggle}>
				<span className={styles.toggleLabel}>Режим</span>
				<div className={styles.segmented}>
					<span className={cn(styles.segment, { [styles.segmentActive]: !isWholesale })}>
						Покупатель
					</span>
					<span className={cn(styles.segment, { [styles.segmentActive]: isWholesale })}>
						Оптовик
					</span>
				</div>
			</div>

			<Link
				href={user ? ROUTES.account : ROUTES.login}
				className={styles.iconWrap}
				aria-label='Личный кабинет'
			>
				<span className={styles.icon}>
					<Icon name='user' />
				</span>
			</Link>

			<button
				type='button'
				className={cn(styles.iconWrap, styles.iconButton)}
				aria-label='Избранное'
				onClick={() => openDrawer('favorites')}
			>
				<span className={styles.iconHeart}>
					<Icon name='heart' />
				</span>
				{hydrated && favoritesCount > 0 && <span className={styles.badge}>{favoritesCount}</span>}
			</button>

			<button
				type='button'
				className={cn(styles.cart, styles.iconButton)}
				aria-label='Корзина'
				onClick={() => openDrawer('cart')}
			>
				<span className={styles.cartIconWrap}>
					<span className={styles.iconCart}>
						<Icon name='cart' />
					</span>
				</span>
				<span className={styles.cartSum}>{formatPrice(hydrated ? cartTotal : 0)}</span>
				{hydrated && cartCount > 0 && (
					<span className={cn(styles.badge, styles.cartBadge)}>{cartCount}</span>
				)}
			</button>
		</div>
	)
}
