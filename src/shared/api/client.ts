export class ApiError extends Error {
	status: number

	constructor(message: string, status: number) {
		super(message)
		this.status = status
		this.name = 'ApiError'
	}
}

async function parseError(response: Response, fallback: string): Promise<never> {
	const data = await response.json().catch(() => null)
	throw new ApiError(data?.error ?? fallback, response.status)
}

interface RequestOptions {
	signal?: AbortSignal
	errorMessage?: string
}

async function sendJson<T>(
	method: 'POST' | 'PATCH',
	url: string,
	body: unknown,
	options: RequestOptions
): Promise<T> {
	const response = await fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
		signal: options.signal
	})

	if (!response.ok) await parseError(response, options.errorMessage ?? 'Запрос не выполнен')

	return response.json() as Promise<T>
}

export function postJson<T>(url: string, body: unknown, options: RequestOptions = {}): Promise<T> {
	return sendJson('POST', url, body, options)
}

export function patchJson<T>(url: string, body: unknown, options: RequestOptions = {}): Promise<T> {
	return sendJson('PATCH', url, body, options)
}

export async function getJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
	const response = await fetch(url, { signal: options.signal })

	if (!response.ok) await parseError(response, options.errorMessage ?? 'Запрос не выполнен')

	return response.json() as Promise<T>
}
