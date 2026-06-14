import cn from 'clsx'
import type { TextareaHTMLAttributes } from 'react'

import styles from './textarea.module.scss'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string
	error?: string
}

export function Textarea({ label, error, className, ...props }: Props) {
	return (
		<label className={cn(styles.field, className)}>
			<span className={styles.label}>{label}</span>
			<textarea
				className={cn(styles.textarea, { [styles.textareaError]: error })}
				{...props}
			/>
			{error && <span className={styles.error}>{error}</span>}
		</label>
	)
}
