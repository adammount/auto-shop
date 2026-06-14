import cn from 'clsx'
import type { ReactNode } from 'react'

import styles from './badge.module.scss'

interface Props {
	children: ReactNode
	variant?: 'success' | 'warning' | 'info' | 'danger' | 'dark'
	withDot?: boolean
	className?: string
}

export function Badge({ children, variant = 'success', withDot = false, className }: Props) {
	return (
		<span className={cn(styles.badge, styles[variant], className)}>
			{withDot && <span className={styles.dot} />}
			{children}
		</span>
	)
}
