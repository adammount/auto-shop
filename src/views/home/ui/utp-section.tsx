import { FeatureGrid } from '@/shared/ui/feature-grid'

import { UTP_ITEMS } from '../model/utp.data'

import styles from './utp-section.module.scss'

export function UtpSection() {
	return (
		<section className={styles.section}>
			<FeatureGrid items={UTP_ITEMS.map(item => ({ ...item, tag: item.num }))} />
		</section>
	)
}
