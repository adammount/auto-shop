'use client'

import { selectCartCount, useCartStore } from '@/shared/store/cart'
import { useFavoritesStore } from '@/shared/store/favorites'
import { useUiStore } from '@/shared/store/ui'

import { CartDrawerContent } from './cart-drawer-content'
import { Drawer } from './drawer'
import { FavoritesDrawerContent } from './favorites-drawer-content'

export function DrawersHost() {
	const drawer = useUiStore(state => state.drawer)
	const closeDrawer = useUiStore(state => state.closeDrawer)
	const cartCount = useCartStore(selectCartCount)
	const favoritesCount = useFavoritesStore(state => state.items.length)

	return (
		<>
			<Drawer
				isOpen={drawer === 'cart'}
				title='Корзина'
				count={cartCount}
				onClose={closeDrawer}
			>
				<CartDrawerContent />
			</Drawer>

			<Drawer
				isOpen={drawer === 'favorites'}
				title='Избранное'
				count={favoritesCount}
				onClose={closeDrawer}
			>
				<FavoritesDrawerContent />
			</Drawer>
		</>
	)
}
