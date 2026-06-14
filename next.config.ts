import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
	output: 'standalone',
	reactStrictMode: true,
	sassOptions: {
		loadPaths: [path.join(process.cwd(), 'src')]
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [{ protocol: 'https', hostname: 'picsum.photos' }]
	}
}

export default withPayload(nextConfig)
