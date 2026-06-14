import type { PromoResult } from '@/shared/lib/check-promo'
import { getPayloadClient } from '@/shared/lib/payload'

export async function resolvePromo(code: string, orderTotal: number): Promise<PromoResult | null> {
	const normalized = code.trim()
	if (!normalized) return null

	const payload = await getPayloadClient()

	const result = await payload.find({
		collection: 'promo-codes',
		where: {
			and: [{ code: { like: normalized } }, { isActive: { equals: true } }]
		},
		depth: 0,
		limit: 10,
		overrideAccess: true
	})

	const target = normalized.toLowerCase()
	const rule = result.docs.find(doc => doc.code.trim().toLowerCase() === target)
	if (!rule) return null

	if (rule.expiresAt && new Date(rule.expiresAt).getTime() < Date.now()) return null
	if (typeof rule.minOrder === 'number' && orderTotal < rule.minOrder) return null

	const type = rule.type as PromoResult['type']
	const discount = type === 'percent' ? Math.round((orderTotal * rule.value) / 100) : rule.value

	return {
		code: rule.code,
		type,
		value: rule.value,
		discount: Math.min(discount, orderTotal)
	}
}
