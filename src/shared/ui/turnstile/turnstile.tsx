'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

import styles from './turnstile.module.scss'

interface TurnstileApi {
	render: (
		container: HTMLElement,
		options: {
			sitekey: string
			callback: (token: string) => void
			'expired-callback'?: () => void
			'error-callback'?: () => void
		}
	) => string
	remove: (widgetId: string) => void
}

declare global {
	interface Window {
		turnstile?: TurnstileApi
	}
}

interface Props {
	onVerify: (token: string) => void
	onExpire?: () => void
}

export function Turnstile({ onVerify, onExpire }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const widgetIdRef = useRef<string | null>(null)
	const [ready, setReady] = useState(false)
	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

	useEffect(() => {
		if (!ready || !siteKey || !containerRef.current || !window.turnstile) return
		if (widgetIdRef.current) return

		const container = containerRef.current
		widgetIdRef.current = window.turnstile.render(container, {
			sitekey: siteKey,
			callback: onVerify,
			'expired-callback': () => onExpire?.(),
			'error-callback': () => onExpire?.()
		})

		return () => {
			if (widgetIdRef.current && window.turnstile) {
				window.turnstile.remove(widgetIdRef.current)
				widgetIdRef.current = null
			}
		}
	}, [ready, siteKey, onVerify, onExpire])

	if (!siteKey) return null

	return (
		<>
			<Script
				src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
				strategy='afterInteractive'
				onLoad={() => setReady(true)}
			/>
			<div
				ref={containerRef}
				className={styles.widget}
			/>
		</>
	)
}
