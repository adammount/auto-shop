import cn from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './button.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode
	variant?: 'primary' | 'outline'
	size?: 'md' | 'lg'
}

export function Button({
	children,
	variant = 'primary',
	size = 'md',
	className,
	type = 'button',
	...props
}: Props) {
	return (
		<button
			type={type}
			className={cn(styles.button, styles[variant], styles[size], className)}
			{...props}
		>
			{children}
		</button>
	)
}
