'use client'

import cn from 'clsx'
import { useEffect, useState } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './toast.module.scss'

const LEAVE_BEFORE = 280

interface Props {
	message: string
	duration: number
}

export function Toast({ message, duration }: Props) {
	const [isLeaving, setIsLeaving] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setIsLeaving(true), duration - LEAVE_BEFORE)
		return () => clearTimeout(timer)
	}, [duration])

	return (
		<div
			className={cn(styles.toast, { [styles.leaving]: isLeaving })}
			role='status'
		>
			<span className={styles.icon}>
				<Icon name='check' />
			</span>
			<span className={styles.message}>{message}</span>
		</div>
	)
}
