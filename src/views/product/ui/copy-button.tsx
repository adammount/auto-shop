'use client'

import type { ReactNode } from 'react'

import { useToastStore } from '@/shared/store/toast'

type CopyValue = 'current-url'

interface Props {
	value: string | CopyValue
	className?: string
	successMessage: string
	'aria-label': string
	children: ReactNode
}

function resolveValue(value: string): string {
	return value === 'current-url' ? window.location.href : value
}

export function CopyButton({ value, className, successMessage, children, ...rest }: Props) {
	const showToast = useToastStore(state => state.showToast)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(resolveValue(value))
			showToast(successMessage)
		} catch {
			showToast('Не удалось скопировать')
		}
	}

	return (
		<button
			type='button'
			className={className}
			aria-label={rest['aria-label']}
			onClick={handleCopy}
		>
			{children}
		</button>
	)
}
