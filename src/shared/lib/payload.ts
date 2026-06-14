import config from '@payload-config'
import { getPayload } from 'payload'

export async function getPayloadClient() {
	return getPayload({ config })
}

export async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
	try {
		return await query()
	} catch (err) {
		console.warn('[payload] query failed, using fallback', err)
		return fallback
	}
}
