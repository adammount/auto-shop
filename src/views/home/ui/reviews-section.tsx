import { getReviews } from '@/shared/api/content-repository'
import { Icon } from '@/shared/ui/icon'
import { SectionHead } from '@/shared/ui/section-head'

import styles from './reviews-section.module.scss'

function pluralizeReviews(count: number): string {
	const mod10 = count % 10
	const mod100 = count % 100
	if (mod10 === 1 && mod100 !== 11) return 'отзыв'
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'отзыва'
	return 'отзывов'
}

export async function ReviewsSection() {
	const reviews = await getReviews()

	if (reviews.length === 0) return null

	const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
	const averageLabel = average.toFixed(1).replace('.', ',')
	const ratingText = `${averageLabel} из 5 · ${reviews.length} ${pluralizeReviews(reviews.length)}`

	return (
		<section className={styles.section}>
			<SectionHead
				title='Нам доверяют'
				aside={<span className={styles.rating}>{ratingText}</span>}
			/>

			<div className={styles.grid}>
				{reviews.map(review => (
					<article
						key={review.id}
						className={styles.item}
					>
						<div className={styles.top}>
							<div
								className={styles.stars}
								role='img'
								aria-label={`Оценка ${review.rating} из 5`}
							>
								{Array.from({ length: Math.min(5, Math.round(review.rating)) }).map((_, index) => (
									<span
										key={index}
										className={styles.star}
									>
										<Icon name='star' />
									</span>
								))}
							</div>
							<p className={styles.text}>{review.text}</p>
						</div>
						<div className={styles.who}>
							<span className={styles.author}>{review.author}</span>
							<span className={styles.role}>{review.role}</span>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}
