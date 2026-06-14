export interface PromoResult {
	code: string
	type: 'percent' | 'fixed'
	value: number
	discount: number
}
