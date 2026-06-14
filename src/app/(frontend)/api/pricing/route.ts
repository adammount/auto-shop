import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getCurrentUser, isApprovedWholesale } from '@/shared/lib/auth'
import { getPayloadClient } from '@/shared/lib/payload'

const pricingSchema = z.object({
	productIds: z.array(z.string().min(1)).min(1)
})

export async function POST(request: Request) {
	const body = await request.json().catch(() => null)
	const parsed = pricingSchema.safeParse(body)

	if (!parsed.success) {
		return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
	}

	const user = await getCurrentUser()

	if (!isApprovedWholesale(user)) {
		return NextResponse.json({ wholesale: false, prices: {} })
	}

	const payload = await getPayloadClient()
	const ids = parsed.data.productIds.map(Number)

	const result = await payload.find({
		collection: 'products',
		where: { id: { in: ids } },
		depth: 0,
		limit: ids.length,
		overrideAccess: false,
		user
	})

	const prices: Record<string, number> = {}
	for (const doc of result.docs) {
		if (typeof doc.priceWholesale === 'number') {
			prices[String(doc.id)] = doc.priceWholesale
		}
	}

	return NextResponse.json({ wholesale: true, prices })
}
