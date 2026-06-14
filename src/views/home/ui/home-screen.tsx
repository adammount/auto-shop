import { CategoriesSection } from './categories-section'
import { HeroSection } from './hero-section'
import { PopularSection } from './popular-section'
import { ReviewsSection } from './reviews-section'
import { UtpSection } from './utp-section'

import styles from './home-screen.module.scss'

export function HomeScreen() {
	return (
		<div className={styles.screen}>
			<HeroSection />
			<CategoriesSection />
			<UtpSection />
			<PopularSection />
			<ReviewsSection />
		</div>
	)
}
