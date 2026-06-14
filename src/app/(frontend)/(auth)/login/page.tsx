import type { Metadata } from 'next'

import { AuthScreen } from '@/views/auth'

import { getSiteSettings } from '@/shared/api/content-repository'

export const metadata: Metadata = {
	title: 'Вход'
}

export default async function LoginPage() {
	const settings = await getSiteSettings()
	return (
		<AuthScreen
			tab='login'
			whatsappDigits={settings.whatsappDigits}
		/>
	)
}
