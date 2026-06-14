import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { OrderResult } from '@/shared/api/orders-client'

export type LastOrder = OrderResult

interface LastOrderState {
	order: LastOrder | null
	setOrder: (order: LastOrder) => void
	clear: () => void
}

export const useLastOrderStore = create<LastOrderState>()(
	persist(
		set => ({
			order: null,
			setOrder: order => set({ order }),
			clear: () => set({ order: null })
		}),
		{
			name: 'auto-shop-last-order',
			storage: createJSONStorage(() => sessionStorage)
		}
	)
)
