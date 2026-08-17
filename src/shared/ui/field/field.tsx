import cn from 'clsx'
import { type InputHTMLAttributes, forwardRef } from 'react'

import styles from './field.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	error?: string
}

export const Field = forwardRef<HTMLInputElement, Props>(function Field(
	{ label, error, className, ...props },
	ref
) {
	return (
		<label className={cn(styles.field, className)}>
			<span className={styles.label}>{label}</span>
			<input
				ref={ref}
				className={cn(styles.input, { [styles.inputError]: error })}
				aria-invalid={error ? true : undefined}
				{...props}
			/>
			{error && <span className={styles.error}>{error}</span>}
		</label>
	)
})
