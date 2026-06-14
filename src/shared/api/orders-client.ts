import type { PromoResult } from '@/shared/lib/check-promo'
import type { Product } from '@/shared/types/product'

import { getJson, postJson } from './client'

export interface OrderResult {
	orderNumber: string
	total: number
	contactMethod: 'call' | 'whatsapp' | 'email'
	phone: string
	email: string
	whatsappLink: string
}

export interface AccountOrderDto {
	id: string
	number: string
	createdAt: string
	positions: number
	total: number
	status: 'new' | 'processing' | 'in-transit' | 'delivered' | 'cancelled'
	items: { productId: string; quantity: number }[]
}

export function createOrder(input: unknown): Promise<OrderResult> {
	return postJson('/api/orders', input, { errorMessage: 'Не удалось отправить заказ' })
}

export function checkPromoCode(code: string, total: number): Promise<PromoResult> {
	return postJson('/api/promo', { code, total }, { errorMessage: 'Промокод недействителен' })
}

export async function fetchAccountOrders(signal?: AbortSignal): Promise<AccountOrderDto[]> {
	const data = await getJson<{ orders: AccountOrderDto[] }>('/api/account/orders', { signal })
	return data.orders
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
	const data = await postJson<{ products: Product[] }>('/api/products/by-ids', { ids })
	return data.products
}
