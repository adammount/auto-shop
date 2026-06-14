import { create } from 'zustand'

import { postJson } from '@/shared/api/client'

interface PricingState {
	prices: Record<string, number>
	isWholesale: boolean
	requested: Set<string>
	resolved: Set<string>
	requestPrices: (ids: string[]) => void
	reset: () => void
}

let flushTimer: ReturnType<typeof setTimeout> | null = null
let pendingIds: string[] = []

async function flush() {
	flushTimer = null
	const ids = pendingIds
	pendingIds = []
	if (ids.length === 0) return

	try {
		const data = await postJson<{ wholesale: boolean; prices: Record<string, number> }>(
			'/api/pricing',
			{ productIds: ids }
		)

		usePricingStore.setState(state => ({
			isWholesale: data.wholesale,
			prices: { ...state.prices, ...data.prices },
			resolved: new Set([...state.resolved, ...ids])
		}))
	} catch {
		void 0
	}
}

export const usePricingStore = create<PricingState>((set, get) => ({
	prices: {},
	isWholesale: false,
	requested: new Set(),
	resolved: new Set(),
	requestPrices: ids => {
		const { requested } = get()
		const fresh = ids.filter(id => !requested.has(id))
		if (fresh.length === 0) return

		set({ requested: new Set([...requested, ...fresh]) })
		pendingIds.push(...fresh)

		if (flushTimer === null) {
			flushTimer = setTimeout(flush, 80)
		}
	},
	reset: () => {
		if (flushTimer !== null) {
			clearTimeout(flushTimer)
			flushTimer = null
		}
		pendingIds = []
		set({ prices: {}, isWholesale: false, requested: new Set(), resolved: new Set() })
	}
}))
