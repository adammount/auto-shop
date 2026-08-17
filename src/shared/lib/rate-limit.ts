interface Bucket {
	count: number
	resetAt: number
}

const buckets = new Map<string, Bucket>()

interface Options {
	limit: number
	windowMs: number
}

function sweep(now: number) {
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt < now) buckets.delete(key)
	}
}

export function rateLimit(key: string, { limit, windowMs }: Options): boolean {
	const now = Date.now()
	const bucket = buckets.get(key)

	if (!bucket || bucket.resetAt < now) {
		sweep(now)
		buckets.set(key, { count: 1, resetAt: now + windowMs })
		return true
	}

	if (bucket.count >= limit) return false

	bucket.count += 1
	return true
}

export function clientKey(request: Request, scope: string): string {
	const ip =
		request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-real-ip') ?? 'unknown'

	return `${scope}:${ip}`
}
