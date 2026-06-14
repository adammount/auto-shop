import type { Product } from '@/shared/types/product'
import { ProductCard } from '@/shared/ui/product-card'
import { SectionHead } from '@/shared/ui/section-head'

import styles from './product-rail.module.scss'

interface Props {
	title: string
	products: Product[]
	actionLabel?: string
	actionHref?: string
}

export function ProductRail({ title, products, actionLabel, actionHref }: Props) {
	return (
		<section className={styles.section}>
			<SectionHead
				title={title}
				actionLabel={actionLabel}
				actionHref={actionHref}
			/>

			<div className={styles.rail}>
				{products.map(product => (
					<ProductCard
						key={product.id}
						product={product}
					/>
				))}
			</div>
		</section>
	)
}
