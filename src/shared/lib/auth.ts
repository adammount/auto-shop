import { headers as nextHeaders } from 'next/headers'

import { getPayloadClient, safeQuery } from './payload'
import type { User } from '@/payload-types'

export async function getCurrentUser(): Promise<User | null> {
	return safeQuery(async () => {
		const payload = await getPayloadClient()
		const headers = await nextHeaders()

		const { user } = await payload.auth({ headers })
		return (user as User) ?? null
	}, null)
}

export function isApprovedWholesale(user: User | null): boolean {
	return user?.role === 'wholesale' && user.wholesaleStatus === 'approved'
}
