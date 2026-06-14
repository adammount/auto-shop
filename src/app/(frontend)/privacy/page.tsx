import type { Metadata } from 'next'

import { PrivacyScreen } from '@/views/privacy'

export const metadata: Metadata = {
	title: 'Политика конфиденциальности'
}

export default function PrivacyPage() {
	return <PrivacyScreen />
}
