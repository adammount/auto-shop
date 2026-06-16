'use client'

import cn from 'clsx'
import Image from 'next/image'

import { Badge } from '@/shared/ui/badge'

import { useGalleryCarousel } from '../lib/use-gallery-carousel'

import styles from './product-gallery.module.scss'

interface Props {
	images: string[]
	labels: string[]
	title: string
	isNew?: boolean
}

export function ProductGallery({ images, labels, title, isNew }: Props) {
	const { emblaRef, selectedIndex, scrollTo } = useGalleryCarousel()

	const hasImages = images.length > 0
	const slides = (hasImages ? images : labels).slice(0, 5)

	return (
		<div className={styles.gallery}>
			<div className={styles.thumbs}>
				{slides.map((slide, index) => (
					<button
						key={`${slide}-${index}`}
						type='button'
						className={cn(styles.thumb, { [styles.thumbActive]: index === selectedIndex })}
						aria-label={`Фото ${index + 1}`}
						onClick={() => scrollTo(index)}
					>
						{hasImages && (
							<Image
								src={slide}
								alt={`${title} — фото ${index + 1}`}
								fill
								sizes='80px'
								className={styles.thumbMedia}
							/>
						)}
					</button>
				))}
			</div>

			<div className={styles.mainWrap}>
				{isNew && (
					<Badge
						variant='dark'
						className={styles.badge}
					>
						новинка
					</Badge>
				)}
				<div
					className={styles.viewport}
					ref={emblaRef}
				>
					<div className={styles.track}>
						{slides.map((slide, index) => (
							<div
								key={`${slide}-${index}`}
								className={styles.slide}
							>
								{hasImages ? (
									<Image
										src={slide}
										alt={`${title} — фото ${index + 1}`}
										fill
										sizes='(max-width: 767px) 100vw, 560px'
										priority={index === 0}
										className={styles.slideMedia}
									/>
								) : (
									<span className={styles.slideLabel}>{slide}</span>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
