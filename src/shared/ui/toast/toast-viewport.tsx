'use client'

import { TOAST_DURATION, useToastStore } from '@/shared/store/toast'

import { Toast } from './toast'

import styles from './toast-viewport.module.scss'

const PEEK = 12
const SCALE_STEP = 0.05
const MAX_VISIBLE = 3

export function ToastViewport() {
	const toasts = useToastStore(state => state.toasts)

	return (
		<div className={styles.viewport}>
			{toasts.map((toast, index) => {
				const depth = toasts.length - 1 - index
				const isHidden = depth >= MAX_VISIBLE

				return (
					<div
						key={toast.id}
						className={styles.slot}
						style={{
							zIndex: index,
							transform: `translateX(-50%) translateY(${depth * PEEK}rem) scale(${1 - depth * SCALE_STEP})`,
							opacity: isHidden ? 0 : 1
						}}
					>
						<Toast
							message={toast.message}
							duration={TOAST_DURATION}
						/>
					</div>
				)
			})}
		</div>
	)
}
