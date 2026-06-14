import Link from 'next/link'
import type { ReactNode } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './section-head.module.scss'

interface Props {
	title: string
	actionLabel?: string
	actionHref?: string
	aside?: ReactNode
}

export function SectionHead({ title, actionLabel, actionHref, aside }: Props) {
	return (
		<div className={styles.head}>
			<h2 className={styles.title}>{title}</h2>
			{actionLabel && actionHref && (
				<Link
					href={actionHref}
					className={styles.action}
				>
					{actionLabel}
					<span className={styles.actionIcon}>
						<Icon name='arrow' />
					</span>
				</Link>
			)}
			{aside}
		</div>
	)
}
