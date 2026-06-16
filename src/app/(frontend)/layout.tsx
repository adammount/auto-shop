import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getSiteSettings } from '@/shared/api/content-repository'
import { CookieConsent } from '@/shared/ui/cookie-consent'
import { DrawersHost } from '@/shared/ui/drawer'
import { JsonLd } from '@/shared/ui/json-ld'
import { Footer, Header, PageTransition } from '@/shared/ui/layout'
import { SessionInit } from '@/shared/ui/session-init'
import { ToastViewport } from '@/shared/ui/toast'

import '../globals.scss'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
const siteName = 'Деталь'
const siteDescription =
	'Интернет-магазин автозапчастей. Оригинал и проверенные аналоги. Доставка по РФ, опт для сервисов.'

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: 'Деталь — интернет-магазин автозапчастей',
		template: '%s — Деталь'
	},
	description: siteDescription,
	applicationName: siteName,
	referrer: 'origin-when-cross-origin',
	formatDetection: { telephone: true, address: true, email: true },
	alternates: { canonical: '/' },
	openGraph: {
		type: 'website',
		locale: 'ru_RU',
		url: siteUrl,
		siteName,
		title: 'Деталь — интернет-магазин автозапчастей',
		description: siteDescription,
		images: [
			{
				url: '/og.png',
				width: 1200,
				height: 630,
				alt: 'Деталь — интернет-магазин автозапчастей'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Деталь — интернет-магазин автозапчастей',
		description: siteDescription,
		images: ['/og.png']
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true, 'max-image-preview': 'large' }
	}
}

interface Props {
	children: ReactNode
}

export default async function FrontendLayout({ children }: Props) {
	const settings = await getSiteSettings()

	const organizationLd = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteName,
		legalName: 'ООО «Деталь»',
		url: siteUrl,
		description: siteDescription,
		...(settings.email && { email: settings.email }),
		...(settings.phone && { telephone: settings.phone }),
		...(settings.address && {
			address: {
				'@type': 'PostalAddress',
				streetAddress: settings.address,
				addressCountry: 'RU'
			}
		})
	}

	return (
		<html lang='ru'>
			<head>
				<link
					rel='preload'
					href='/fonts/golos-text-regular.woff2'
					as='font'
					type='font/woff2'
					crossOrigin='anonymous'
				/>
				<link
					rel='preload'
					href='/fonts/golos-text-medium.woff2'
					as='font'
					type='font/woff2'
					crossOrigin='anonymous'
				/>
				<link
					rel='preload'
					href='/fonts/oswald-bold.woff2'
					as='font'
					type='font/woff2'
					crossOrigin='anonymous'
				/>
			</head>
			<body>
				<JsonLd data={organizationLd} />
				<SessionInit />
				<a
					href='#main-content'
					className='skip-link'
				>
					Перейти к содержимому
				</a>
				<Header />
				<main id='main-content'>
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
