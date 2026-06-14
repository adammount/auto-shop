import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { WholesaleRequestScreen } from '@/views/auth'

import { getSiteSettings } from '@/shared/api/content-repository'
import { ROUTES } from '@/shared/config'
import { getCurrentUser } from '@/shared/lib/auth'

export const metadata: Metadata = {
	title: 'Заявка на опт'
}

export const dynamic = 'force-dynamic'

export default async function WholesaleRequestPage() {
	const user = await getCurrentUser()
	if (!user) redirect(ROUTES.login)

	const settings = await getSiteSettings()

	return (
		<WholesaleRequestScreen
			status={user.wholesaleStatus ?? 'none'}
			whatsappDigits={settings.whatsappDigits}
		/>
	)
}
