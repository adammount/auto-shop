import type { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

export function useGalleryCarousel() {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
	const [selectedIndex, setSelectedIndex] = useState(0)

	const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

	useEffect(() => {
		if (!emblaApi) return

		const onSelect = (api: EmblaCarouselType) => setSelectedIndex(api.selectedScrollSnap())

		emblaApi.on('select', onSelect).on('reInit', onSelect)

		const raf = requestAnimationFrame(() => onSelect(emblaApi))

		return () => {
			cancelAnimationFrame(raf)
			emblaApi.off('select', onSelect).off('reInit', onSelect)
		}
	}, [emblaApi])

	return { emblaRef, selectedIndex, scrollTo }
}
