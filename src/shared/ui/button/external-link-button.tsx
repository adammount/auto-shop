import cn from 'clsx'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

import styles from './button.module.scss'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
	children: ReactNode
	variant?: 'primary' | 'outline'
	size?: 'md' | 'lg'
}

export function ExternalLinkButton({
	children,
	variant = 'primary',
	size = 'lg',
	className,
	...props
}: Props) {
	return (
		<a
			className={cn(styles.button, styles[variant], styles[size], className)}
			target='_blank'
			rel='noopener noreferrer'
			{...props}
		>
			{children}
		</a>
	)
}
