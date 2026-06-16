'use client'

import { useEffect, useRef, useState } from 'react'

import styles from './footer.module.scss'

interface Props {
	address: string
}

export function FooterMap({ address }: Props) {
	const ref = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const node = ref.current
		if (!node) return

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0]?.isIntersecting) {
					setIsVisible(true)
					observer.disconnect()
				}
			},
			{ rootMargin: '200px' }
		)

		observer.observe(node)
		return () => observer.disconnect()
	}, [])

	const src = `https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(
		address
	)}&z=16`

	return (
		<div
			ref={ref}
			className={styles.map}
		>
			{isVisible && (
				<iframe
					src={src}
					title={`Карта: ${address}`}
					loading='lazy'
					className={styles.mapFrame}
				/>
			)}
		</div>
	)
}
