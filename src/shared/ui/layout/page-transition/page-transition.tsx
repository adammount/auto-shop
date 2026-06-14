'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import styles from './page-transition.module.scss'

interface Props {
	children: ReactNode
}

export function PageTransition({ children }: Props) {
	const pathname = usePathname()

	return (
		<div
			key={pathname}
			className={styles.page}
		>
			{children}
		</div>
	)
}
