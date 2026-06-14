interface Bucket {
	count: number
	resetAt: number
}

const buckets = new Map<string, Bucket>()

interface Options {
	limit: number
	windowMs: number
}

export function rateLimit(key: string, { limit, windowMs }: Options): boolean {
	const now = Date.now()
	const bucket = buckets.get(key)

	if (!bucket || bucket.resetAt < now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs })
		return true
	}

	if (bucket.count >= limit) return false

	bucket.count += 1
	return true
}

export function clientKey(request: Request, scope: string): string {
	const forwarded = request.headers.get('x-forwarded-for')
	const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
	return `${scope}:${ip}`
}
