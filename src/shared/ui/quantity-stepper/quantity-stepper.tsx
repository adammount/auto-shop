'use client'

import cn from 'clsx'

import { Icon } from '@/shared/ui/icon'

import styles from './quantity-stepper.module.scss'

interface Props {
	value: number
	min?: number
	max?: number
	size?: 'md' | 'sm'
	className?: string
	onChange: (value: number) => void
}

export function QuantityStepper({
	value,
	min = 1,
	max = 99,
	size = 'md',
	className,
	onChange
}: Props) {
	const decrease = () => onChange(Math.max(min, value - 1))
	const increase = () => onChange(Math.min(max, value + 1))

	return (
		<div className={cn(styles.stepper, { [styles.stepperSm]: size === 'sm' }, className)}>
			<button
				type='button'
				className={styles.button}
				aria-label='Уменьшить количество'
				disabled={value <= min}
				onClick={decrease}
			>
				<span className={styles.icon}>
					<Icon name='minus' />
				</span>
			</button>
			<span className={styles.value}>
				<span className={styles.count}>{value}</span>
				<span className={styles.unit}>шт</span>
			</span>
			<button
				type='button'
				className={styles.button}
				aria-label='Увеличить количество'
				disabled={value >= max}
				onClick={increase}
			>
				<span className={styles.icon}>
					<Icon name='plus' />
				</span>
			</button>
		</div>
	)
}
