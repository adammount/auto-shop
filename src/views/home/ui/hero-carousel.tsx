'use client'

import cn from 'clsx'
import Image from 'next/image'

import type { HeroSlide } from '@/shared/api/content-repository'
import { LinkButton } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'

import { useHeroCarousel } from '../lib/use-hero-carousel'

import styles from './hero-section.module.scss'

interface Props {
	slides: HeroSlide[]
}

export function HeroCarousel({ slides }: Props) {
	const { emblaRef, selectedIndex, scrollSnaps, scrollPrev, scrollNext, scrollTo } =
		useHeroCarousel()

	return (
		<section
			className={styles.hero}
			aria-roledescription='carousel'
		>
			<div
				className={styles.viewport}
				ref={emblaRef}
			>
				<div className={styles.track}>
					{slides.map(slide => (
						<div
							key={slide.id}
							className={styles.slide}
						>
							<div className={styles.text}>
								<span className={styles.badge}>{slide.badge}</span>
								<h1 className={styles.title}>{slide.title}</h1>
								<p className={styles.sub}>{slide.sub}</p>
								<div className={styles.cta}>
									<LinkButton
										href={slide.primaryHref}
										variant='primary'
									>
										{slide.primaryLabel}
										<span className={styles.ctaIcon}>
											<Icon name='arrow' />
										</span>
									</LinkButton>
									<LinkButton
										href={slide.secondaryHref}
										variant='outline'
									>
										{slide.secondaryLabel}
									</LinkButton>
								</div>
							</div>

							<div className={styles.media}>
								{slide.image ? (
									<Image
										src={slide.image}
										alt={slide.title}
										fill
										sizes='(max-width: 767px) 100vw, 50vw'
										className={styles.mediaImage}
										priority
									/>
								) : (
									<span className={styles.mediaLabel}>{slide.mediaLabel}</span>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className={styles.dots}>
				{scrollSnaps.map((_, index) => (
					<button
						key={index}
						type='button'
						className={cn(styles.dot, { [styles.dotActive]: index === selectedIndex })}
						aria-label={`Слайд ${index + 1}`}
						aria-current={index === selectedIndex}
						onClick={() => scrollTo(index)}
					/>
				))}
			</div>

			<div className={styles.nav}>
				<button
					type='button'
					className={styles.arrow}
					aria-label='Предыдущий слайд'
					onClick={scrollPrev}
				>
					<span className={styles.arrowIconPrev}>
						<Icon name='arrow' />
					</span>
				</button>
				<button
					type='button'
					className={styles.arrow}
					aria-label='Следующий слайд'
					onClick={scrollNext}
				>
					<span className={styles.arrowIcon}>
						<Icon name='arrow' />
					</span>
				</button>
			</div>
		</section>
	)
}
