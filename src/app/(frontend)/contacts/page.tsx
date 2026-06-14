import type { Metadata } from 'next'

import { ContactsScreen } from '@/views/contacts'

export const metadata: Metadata = {
	title: 'Контакты'
}

export default function ContactsPage() {
	return <ContactsScreen />
}
