import type { Metadata } from 'next'

import { AboutScreen } from '@/views/about'

export const metadata: Metadata = {
	title: 'О компании'
}

export default function AboutPage() {
	return <AboutScreen />
}
