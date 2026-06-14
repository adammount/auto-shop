'use client'

import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { useCookieConsentStore } from '@/shared/store/cookie-consent'
import { Button } from '@/shared/ui/button'

import styles from './cookie-consent.module.scss'

export function CookieConsent() {
	const hydrated = useHydrated()
	const accepted = useCookieConsentStore(state => state.accepted)
	const accept = useCookieConsentStore(state => state.accept)

	if (!hydrated || accepted) return null

	return (
		<div
			className={styles.banner}
			role='dialog'
			aria-label='Согласие на использование cookie'
		>
			<p className={styles.text}>
				Мы используем файлы cookie, чтобы сайт работал корректно и удобно. Продолжая пользоваться
				сайтом, вы соглашаетесь с{' '}
				<Link
					href={ROUTES.privacy}
					className={styles.link}
				>
					политикой конфиденциальности
				</Link>
				.
			</p>
			<Button
				size='md'
				className={styles.action}
				onClick={accept}
			>
				Принять
			</Button>
		</div>
	)
}
