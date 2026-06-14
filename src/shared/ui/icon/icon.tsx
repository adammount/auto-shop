import cn from 'clsx'
import type { SVGProps } from 'react'

import styles from './icon.module.scss'

export type IconName =
	| 'burger'
	| 'search'
	| 'user'
	| 'heart'
	| 'cart'
	| 'arrow'
	| 'star'
	| 'star-outline'
	| 'phone'
	| 'whatsapp'
	| 'close'
	| 'chevron'
	| 'check'
	| 'copyright'
	| 'minus'
	| 'plus'
	| 'share'
	| 'info'
	| 'box'
	| 'filter'

interface Props extends SVGProps<SVGSVGElement> {
	name: IconName
}

export function Icon({ name, className, ...props }: Props) {
	return (
		<svg
			className={cn(styles.icon, className)}
			aria-hidden='true'
			focusable='false'
			{...props}
		>
			<use href={`/sprite.svg#${name}`} />
		</svg>
	)
}
