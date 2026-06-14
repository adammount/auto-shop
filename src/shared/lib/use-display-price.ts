import { useEffect } from 'react'

import { usePricingStore } from '@/shared/store/pricing'

interface DisplayPrice {
	displayPrice: number
	wholesalePrice?: number
	isWholesale: boolean
	priceReady: boolean
}

export function useDisplayPrice(productId: string, priceRetail: number): DisplayPrice {
	const requestPrices = usePricingStore(state => state.requestPrices)
	const wholesalePrice = usePricingStore(state => state.prices[productId])
	const isWholesale = usePricingStore(state => state.isWholesale)
	const resolved = usePricingStore(state => state.resolved.has(productId))

	useEffect(() => {
		requestPrices([productId])
	}, [productId, requestPrices])

	return {
		displayPrice: wholesalePrice ?? priceRetail,
		wholesalePrice,
		isWholesale: isWholesale && wholesalePrice !== undefined && wholesalePrice < priceRetail,
		priceReady: resolved
	}
}
