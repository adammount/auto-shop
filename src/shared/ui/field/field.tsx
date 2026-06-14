import cn from 'clsx'
import type { InputHTMLAttributes } from 'react'

import styles from './field.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	error?: string
}

export function Field({ label, error, className, ...props }: Props) {
	return (
		<label className={cn(styles.field, className)}>
			<span className={styles.label}>{label}</span>
			<input
				className={cn(styles.input, { [styles.inputError]: error })}
				{...props}
			/>
			{error && <span className={styles.error}>{error}</span>}
		</label>
	)
}
