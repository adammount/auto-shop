import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Product } from '@/shared/types/product'

interface FavoritesStore {
	items: Product[]
	toggle: (product: Product) => void
	remove: (productId: string) => void
	has: (productId: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
	persist(
		(set, get) => ({
			items: [],
			toggle: product =>
				set(state => {
					const exists = state.items.some(item => item.id === product.id)
					return {
						items: exists
							? state.items.filter(item => item.id !== product.id)
							: [...state.items, product]
					}
				}),
			remove: productId =>
				set(state => ({ items: state.items.filter(item => item.id !== productId) })),
			has: productId => get().items.some(item => item.id === productId)
		}),
		{ name: 'auto-shop-favorites' }
	)
)
