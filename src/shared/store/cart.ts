import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Product } from '@/shared/types/product'

export interface CartItem {
	product: Product
	quantity: number
}

interface CartStore {
	items: CartItem[]
	addItem: (product: Product, quantity?: number) => void
	removeItem: (productId: string) => void
	setQuantity: (productId: string, quantity: number) => void
	clear: () => void
}

export const useCartStore = create<CartStore>()(
	persist(
		set => ({
			items: [],
			addItem: (product, quantity = 1) =>
				set(state => {
					const existing = state.items.find(item => item.product.id === product.id)
					if (existing) {
						return {
							items: state.items.map(item =>
								item.product.id === product.id
									? { ...item, quantity: item.quantity + quantity }
									: item
							)
						}
					}
					return { items: [...state.items, { product, quantity }] }
				}),
			removeItem: productId =>
				set(state => ({ items: state.items.filter(item => item.product.id !== productId) })),
			setQuantity: (productId, quantity) =>
				set(state => ({
					items: state.items
						.map(item => (item.product.id === productId ? { ...item, quantity } : item))
						.filter(item => item.quantity > 0)
				})),
			clear: () => set({ items: [] })
		}),
		{ name: 'auto-shop-cart' }
	)
)

export const selectCartCount = (state: CartStore) =>
	state.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartTotal = (state: CartStore) =>
	state.items.reduce((sum, item) => sum + item.product.priceRetail * item.quantity, 0)
