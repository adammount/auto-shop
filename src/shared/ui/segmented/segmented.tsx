'use client'

import cn from 'clsx'

import styles from './segmented.module.scss'

interface Option<T extends string> {
	value: T
	label: string
}

interface Props<T extends string> {
	options: Option<T>[]
	value: T
	onChange: (value: T) => void
	className?: string
}

export function Segmented<T extends string>({ options, value, onChange, className }: Props<T>) {
	return (
		<div className={cn(styles.segmented, className)}>
			{options.map(option => (
				<button
					key={option.value}
					type='button'
					className={cn(styles.segment, { [styles.segmentActive]: option.value === value })}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</button>
			))}
		</div>
	)
}
