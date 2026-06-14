import cn from 'clsx'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import styles from './button.module.scss'

interface Props extends ComponentProps<typeof Link> {
	children: ReactNode
	variant?: 'primary' | 'outline'
	size?: 'md' | 'lg'
}

export function LinkButton({
	children,
	variant = 'primary',
	size = 'lg',
	className,
	...props
}: Props) {
	return (
		<Link
			className={cn(styles.button, styles[variant], styles[size], className)}
			{...props}
		>
			{children}
		</Link>
	)
}
