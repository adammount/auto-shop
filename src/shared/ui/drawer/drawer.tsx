'use client'

import cn from 'clsx'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './drawer.module.scss'

interface Props {
	isOpen: boolean
	title: string
	count?: number
	side?: 'right' | 'left'
	onClose: () => void
	children: ReactNode
}

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Drawer({ isOpen, title, count, side = 'right', onClose, children }: Props) {
	const panelRef = useRef<HTMLElement>(null)

	useEffect(() => {
		if (!isOpen) return

		const trigger = document.activeElement as HTMLElement | null
		const panel = panelRef.current

		const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE)
		focusables?.[0]?.focus()

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
				return
			}

			if (event.key !== 'Tab' || !panel) return

			const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
			if (items.length === 0) return

			const first = items[0]
			const last = items[items.length - 1]
			const active = document.activeElement

			if (event.shiftKey && active === first) {
				event.preventDefault()
				last.focus()
			} else if (!event.shiftKey && active === last) {
				event.preventDefault()
				first.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = ''
			trigger?.focus()
		}
	}, [isOpen, onClose])

	return (
		<div
			className={cn(styles.root, { [styles.open]: isOpen })}
			aria-hidden={!isOpen}
		>
			<div
				className={styles.overlay}
				onClick={onClose}
			/>
			<aside
				ref={panelRef}
				className={cn(styles.panel, { [styles.panelLeft]: side === 'left' })}
				role='dialog'
				aria-modal='true'
				aria-label={title}
			>
				<div className={styles.head}>
					<span className={styles.title}>
						{title}
						{count !== undefined && <span className={styles.count}>{count}</span>}
					</span>
					<button
						type='button'
						className={styles.close}
						aria-label='Закрыть'
						onClick={onClose}
					>
						<span className={styles.closeIcon}>
							<Icon name='close' />
						</span>
					</button>
				</div>
				<div className={styles.body}>{children}</div>
			</aside>
		</div>
	)
}
