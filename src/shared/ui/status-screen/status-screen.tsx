import type { ReactNode } from 'react'

import styles from './status-screen.module.scss'

interface Props {
	code: string
	title: string
	text: string
	action: ReactNode
}

export function StatusScreen({ code, title, text, action }: Props) {
	return (
		<div className={styles.screen}>
			<span className={styles.code}>{code}</span>
			<h1 className={styles.title}>{title}</h1>
			<p className={styles.text}>{text}</p>
			<div className={styles.action}>{action}</div>
		</div>
	)
}
