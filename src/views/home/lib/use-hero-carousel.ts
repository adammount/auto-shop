import type { EmblaCarouselType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

const AUTOPLAY_DELAY = 6000

export function useHeroCarousel() {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
		Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })
	])
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
	const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

	useEffect(() => {
		if (!emblaApi) return

		const onInit = (api: EmblaCarouselType) => setScrollSnaps(api.scrollSnapList())
		const onSelect = (api: EmblaCarouselType) => setSelectedIndex(api.selectedScrollSnap())

		emblaApi.on('init', onInit).on('reInit', onInit).on('select', onSelect)

		const raf = requestAnimationFrame(() => {
			onInit(emblaApi)
			onSelect(emblaApi)
		})

		return () => {
			cancelAnimationFrame(raf)
			emblaApi.off('init', onInit).off('reInit', onInit).off('select', onSelect)
		}
	}, [emblaApi])

	return { emblaRef, selectedIndex, scrollSnaps, scrollPrev, scrollNext, scrollTo }
}
