'use client'

import cn from 'clsx'
import { useState } from 'react'

import { Icon } from '@/shared/ui/icon'

import styles from './accordion.module.scss'

export interface AccordionItem {
	id: string
	num: string
	title: string
	content: string
}

interface Props {
	items: AccordionItem[]
	defaultOpenId?: string
}

export function Accordion({ items, defaultOpenId }: Props) {
	const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null)

	return (
		<div className={styles.accordion}>
			{items.map(item => {
				const isOpen = item.id === openId

				return (
					<div
						key={item.id}
						className={styles.item}
					>
						<button
							type='button'
							className={styles.head}
							aria-expanded={isOpen}
							onClick={() => setOpenId(isOpen ? null : item.id)}
						>
							<span className={styles.num}>{item.num}</span>
							<span className={styles.title}>{item.title}</span>
							<span className={styles.icon}>
								<Icon name={isOpen ? 'minus' : 'plus'} />
							</span>
						</button>
						<div className={cn(styles.body, { [styles.bodyOpen]: isOpen })}>
							<div className={styles.bodyInner}>
								<p className={styles.content}>{item.content}</p>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
