import { waLink } from '@/shared/lib/contacts'

import styles from './auth-aside.module.scss'

const POINTS = [
	{ num: '01', text: 'История заказов и быстрый повтор по артикулам.' },
	{ num: '02', text: 'Избранное и сохранённые подборки для авто.' },
	{ num: '03', text: 'Статус оптовика — отдельные цены для СТО и магазинов.' }
]

interface Props {
	whatsappDigits: string
}

export function AuthAside({ whatsappDigits }: Props) {
	return (
		<aside className={styles.aside}>
			<div className={styles.top}>
				<span className={styles.badge}>Личный кабинет</span>
				<h1 className={styles.title}>Запчасти под рукой</h1>
				<ul className={styles.points}>
					{POINTS.map(point => (
						<li
							key={point.num}
							className={styles.point}
						>
							<span className={styles.pointNum}>{point.num}</span>
							<span className={styles.pointText}>{point.text}</span>
						</li>
					))}
				</ul>
			</div>

			<p className={styles.help}>
				Нужна помощь со входом? Напишите в{' '}
				<a
					href={waLink(whatsappDigits)}
					target='_blank'
					rel='noopener noreferrer'
					className={styles.helpLink}
				>
					WhatsApp
				</a>
				.
			</p>
		</aside>
	)
}
