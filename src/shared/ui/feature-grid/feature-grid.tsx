import styles from './feature-grid.module.scss'

export interface FeatureItem {
	tag: string
	title: string
	text: string
}

interface Props {
	items: FeatureItem[]
}

export function FeatureGrid({ items }: Props) {
	return (
		<div className={styles.grid}>
			{items.map(item => (
				<div
					key={item.title}
					className={styles.item}
				>
					<span className={styles.tag}>{item.tag}</span>
					<h3 className={styles.title}>{item.title}</h3>
					<p className={styles.text}>{item.text}</p>
				</div>
			))}
		</div>
	)
}
