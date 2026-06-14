'use client'

import cn from 'clsx'
import { useEffect } from 'react'
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

export function Drawer({ isOpen, title, count, side = 'right', onClose, children }: Props) {
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		document.addEventListener('keydown', handleKeyDown)
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = ''
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
