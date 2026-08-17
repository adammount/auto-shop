import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'node:path'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const parsedServerUrl = serverUrl ? new URL(serverUrl) : null
const serverHostname = parsedServerUrl?.hostname
const serverProtocol = parsedServerUrl?.protocol.replace(':', '') === 'http' ? 'http' : 'https'

const securityHeaders = [
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload'
	},
	{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{
		key: 'Cross-Origin-Opener-Policy',
		value: 'same-origin-allow-popups'
	}
]

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	async headers() {
		return [{ source: '/:path*', headers: securityHeaders }]
	},
	sassOptions: {
		loadPaths: [path.join(process.cwd(), 'src')]
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [
			{ protocol: 'https', hostname: 'picsum.photos' },
			...(serverHostname ? [{ protocol: serverProtocol, hostname: serverHostname } as const] : [])
		]
	}
}

export default withPayload(nextConfig)
