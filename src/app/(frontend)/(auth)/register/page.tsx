import type { Metadata } from 'next'

import { AuthScreen } from '@/views/auth'

import { getSiteSettings } from '@/shared/api/content-repository'

export const metadata: Metadata = {
	title: 'Регистрация'
}

export default async function RegisterPage() {
	const settings = await getSiteSettings()
	return (
		<AuthScreen
			tab='register'
			whatsappDigits={settings.whatsappDigits}
		/>
	)
}
