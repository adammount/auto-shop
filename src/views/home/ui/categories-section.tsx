import Image from 'next/image'
import Link from 'next/link'

import { getHomeCategories } from '@/shared/api/content-repository'
import { ROUTES } from '@/shared/config'
import { Icon } from '@/shared/ui/icon'
import { SectionHead } from '@/shared/ui/section-head'

import styles from './categories-section.module.scss'

export async function CategoriesSection() {
	const categories = await getHomeCategories()

	if (categories.length === 0) return null

	return (
		<section className={styles.section}>
			<SectionHead
				title='Каталог по категориям'
				actionLabel='Все категории'
				actionHref={ROUTES.catalog}
			/>

			<div className={styles.grid}>
				{categories.map(category => (
					<Link
						key={category.slug}
						href={ROUTES.catalogCategory(category.slug)}
						className={styles.item}
					>
						<div className={styles.top}>
							<span className={styles.ico}>
								{category.image && (
									<Image
										src={category.image}
										alt={category.title}
										fill
										sizes='120px'
										className={styles.icoImage}
									/>
								)}
							</span>
							<span className={styles.count}>{category.count} арт.</span>
						</div>
						<div className={styles.bottom}>
							<span className={styles.title}>{category.title}</span>
							<span className={styles.go}>
								Перейти
								<span className={styles.goIcon}>
									<Icon name='arrow' />
								</span>
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	)
}
