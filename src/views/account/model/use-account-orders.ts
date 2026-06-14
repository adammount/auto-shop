'use client'

import { useEffect, useState } from 'react'

import { type AccountOrderDto, fetchAccountOrders } from '@/shared/api/orders-client'

export type AccountOrder = AccountOrderDto
export type OrderStatus = AccountOrderDto['status']

interface AccountOrders {
	orders: AccountOrder[]
	isLoading: boolean
}

export function useAccountOrders(): AccountOrders {
	const [orders, setOrders] = useState<AccountOrder[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const controller = new AbortController()

		fetchAccountOrders(controller.signal)
			.then(result => {
				setOrders(result)
				setIsLoading(false)
			})
			.catch(error => {
				if (error?.name !== 'AbortError') setIsLoading(false)
			})

		return () => controller.abort()
	}, [])

	return { orders, isLoading }
}
