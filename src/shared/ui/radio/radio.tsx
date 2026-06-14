import cn from 'clsx'
import type { InputHTMLAttributes, ReactNode } from 'react'

import styles from './radio.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	children: ReactNode
}

export function Radio({ children, className, ...props }: Props) {
	return (
		<label className={cn(styles.radio, className)}>
			<input
				type='radio'
				className={styles.input}
				{...props}
			/>
			<span className={styles.box}>
				<span className={styles.dot} />
			</span>
			<span className={styles.text}>{children}</span>
		</label>
	)
}
