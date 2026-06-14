import Image from 'next/image'

import styles from './drawer-content.module.scss'

interface Props {
	image?: string
	title: string
}

export function DrawerThumb({ image, title }: Props) {
	return (
		<span className={styles.thumb}>
			{image && (
				<Image
					src={image}
					alt={title}
					fill
					sizes='64px'
					className={styles.thumbMedia}
				/>
			)}
		</span>
	)
}
