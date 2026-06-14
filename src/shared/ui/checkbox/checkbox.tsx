import cn from 'clsx'
import type { InputHTMLAttributes, ReactNode } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './checkbox.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	children: ReactNode
	count?: number
}

export function Checkbox({ children, count, className, ...props }: Props) {
	return (
		<label className={cn(styles.checkbox, className)}>
			<input
				type='checkbox'
				className={styles.input}
				{...props}
			/>
			<span className={styles.box}>
				<span className={styles.check}>
					<Icon name='check' />
				</span>
			</span>
			<span className={styles.text}>
				<span className={styles.label}>{children}</span>
				{count !== undefined && <span className={styles.count}>{count}</span>}
			</span>
		</label>
	)
}
