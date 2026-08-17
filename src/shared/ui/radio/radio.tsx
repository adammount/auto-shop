import cn from 'clsx'
import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'

import styles from './radio.module.scss'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	children: ReactNode
}

export const Radio = forwardRef<HTMLInputElement, Props>(function Radio(
	{ children, className, ...props },
	ref
) {
	return (
		<label className={cn(styles.radio, className)}>
			<input
				ref={ref}
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
})
