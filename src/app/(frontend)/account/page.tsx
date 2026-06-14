import type { Metadata } from 'next'

import { AccountScreen } from '@/views/account'

export const metadata: Metadata = {
	title: 'Личный кабинет'
}

export default function AccountPage() {
	return <AccountScreen />
}
