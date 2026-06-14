const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

interface SiteverifyResponse {
	success: boolean
	'error-codes'?: string[]
}

export async function verifyTurnstile(token: string, remoteip?: string): Promise<boolean> {
	const secret = process.env.TURNSTILE_SECRET_KEY
	if (!secret) return false
	if (!token) return false

	try {
		const response = await fetch(SITEVERIFY_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ secret, response: token, remoteip })
		})
		const result = (await response.json()) as SiteverifyResponse
		return result.success === true
	} catch {
		return false
	}
}
