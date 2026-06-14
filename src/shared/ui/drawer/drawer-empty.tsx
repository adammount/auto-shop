import { Icon } from '@/shared/ui/icon'
import type { IconName } from '@/shared/ui/icon'

import styles from './drawer-empty.module.scss'

interface Props {
	icon: IconName
	title: string
	text: string
}

export function DrawerEmpty({ icon, title, text }: Props) {
	return (
		<div className={styles.empty}>
			<span className={styles.icon}>
				<Icon name={icon} />
			</span>
			<p className={styles.title}>{title}</p>
			<p className={styles.text}>{text}</p>
		</div>
	)
}
