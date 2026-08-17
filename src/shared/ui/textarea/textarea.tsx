import cn from 'clsx'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

import styles from './textarea.module.scss'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string
	error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
	{ label, error, className, ...props },
	ref
) {
	return (
		<label className={cn(styles.field, className)}>
			<span className={styles.label}>{label}</span>
			<textarea
				ref={ref}
				className={cn(styles.textarea, { [styles.textareaError]: error })}
				aria-invalid={error ? true : undefined}
				{...props}
			/>
			{error && <span className={styles.error}>{error}</span>}
		</label>
	)
})
