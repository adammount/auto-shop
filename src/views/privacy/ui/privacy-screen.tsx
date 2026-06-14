import { ROUTES } from '@/shared/config'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'

import { PRIVACY_SECTIONS } from '../model/privacy.data'

import styles from './privacy-screen.module.scss'

export function PrivacyScreen() {
	return (
		<div className={styles.screen}>
			<div className={styles.hero}>
				<Breadcrumbs
					items={[
						{ label: 'Главная', href: ROUTES.home },
						{ label: 'Политика конфиденциальности' }
					]}
				/>
				<h1 className={styles.title}>Политика конфиденциальности</h1>
				<p className={styles.lead}>
					Как мы собираем, используем и защищаем персональные данные пользователей интернет-магазина
					«Деталь».
				</p>
			</div>

			<div className={styles.sections}>
				{PRIVACY_SECTIONS.map(section => (
					<section
						key={section.num}
						className={styles.section}
					>
						<span className={styles.num}>{section.num}</span>
						<div className={styles.content}>
							<h2 className={styles.sectionTitle}>{section.title}</h2>
							<p className={styles.text}>{section.text}</p>
						</div>
					</section>
				))}
			</div>
		</div>
	)
}
