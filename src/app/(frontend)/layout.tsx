import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { CookieConsent } from '@/shared/ui/cookie-consent'
import { DrawersHost } from '@/shared/ui/drawer'
import { Footer, Header, PageTransition } from '@/shared/ui/layout'
import { SessionInit } from '@/shared/ui/session-init'
import { ToastViewport } from '@/shared/ui/toast'

import '../globals.scss'

export const metadata: Metadata = {
	title: {
		default: 'Деталь — интернет-магазин автозапчастей',
		template: '%s — Деталь'
	},
	description:
		'Интернет-магазин автозапчастей. Оригинал и проверенные аналоги. Доставка по РФ, опт для сервисов.'
}

interface Props {
	children: ReactNode
}

export default function FrontendLayout({ children }: Props) {
	return (
		<html lang='ru'>
			<body>
				<SessionInit />
				<Header />
				<main>
					<PageTransition>{children}</PageTransition>
				</main>
				<Footer />
				<ToastViewport />
				<DrawersHost />
				<CookieConsent />
			</body>
		</html>
	)
}
