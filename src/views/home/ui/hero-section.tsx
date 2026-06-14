import { getHeroSlides } from '@/shared/api/content-repository'

import { HeroCarousel } from './hero-carousel'

export async function HeroSection() {
	const slides = await getHeroSlides()

	if (slides.length === 0) return null

	return <HeroCarousel slides={slides} />
}
