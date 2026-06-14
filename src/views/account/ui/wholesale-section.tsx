import { ROUTES } from '@/shared/config'
import { LinkButton } from '@/shared/ui/button'

import styles from './account-stack.module.scss'

const POINTS = [
	'Отдельные оптовые цены для СТО и магазинов.',
	'Заявка обрабатывается за один рабочий день.',
	'После одобрения цены меняются автоматически.'
]

interface Props {
	isWholesale: boolean
	isAdmin?: boolean
}

export function WholesaleSection({ isWholesale, isAdmin = false }: Props) {
	if (isAdmin) {
		return (
			<section className={styles.card}>
				<h2 className={styles.cardTitle}>Статус оптовика</h2>
				<p className={styles.statusNote}>
					Вы вошли как администратор. Оптовый статус для этого аккаунта не требуется — оптовые цены
					настраиваются в админке.
				</p>
			</section>
		)
	}

	return (
		<section className={styles.card}>
			<h2 className={styles.cardTitle}>Статус оптовика</h2>

			{isWholesale ? (
				<p className={styles.statusNote}>
					Статус оптовика подтверждён — в каталоге и корзине доступны оптовые цены.
				</p>
			) : (
				<>
					<p className={styles.statusNote}>
						Сейчас у вас розничный аккаунт. Подайте заявку, чтобы получить оптовые цены.
					</p>
					<ul className={styles.points}>
						{POINTS.map((point, index) => (
							<li
								key={point}
								className={styles.point}
							>
								<span className={styles.pointNum}>{String(index + 1).padStart(2, '0')}</span>
								<span className={styles.pointText}>{point}</span>
							</li>
						))}
					</ul>
					<LinkButton
						href={ROUTES.wholesaleRequest}
						size='md'
						className={styles.wholesaleButton}
					>
						Подать заявку на опт
					</LinkButton>
				</>
			)}
		</section>
	)
}
