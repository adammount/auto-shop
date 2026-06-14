import { getSiteSettings } from '@/shared/api/content-repository'
import { ROUTES } from '@/shared/config'
import { telHref, waLink } from '@/shared/lib/contacts'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'
import { LinkButton } from '@/shared/ui/button'

import styles from './contacts-screen.module.scss'

export async function ContactsScreen() {
	const settings = await getSiteSettings()

	return (
		<div className={styles.screen}>
			<div className={styles.hero}>
				<Breadcrumbs items={[{ label: 'Главная', href: ROUTES.home }, { label: 'Контакты' }]} />
				<h1 className={styles.title}>Контакты</h1>
			</div>

			<div className={styles.layout}>
				<div className={styles.stack}>
					<div className={styles.item}>
						<span className={styles.label}>Телефон и почта</span>
						{settings.phone && (
							<a
								href={telHref(settings.phone)}
								className={styles.phone}
							>
								{settings.phone}
							</a>
						)}
						{settings.email && (
							<a
								href={`mailto:${settings.email}`}
								className={styles.text}
							>
								{settings.email}
							</a>
						)}
					</div>

					<div className={styles.item}>
						<span className={styles.label}>Склад и пункт выдачи</span>
						<p className={styles.text}>{settings.address}</p>
						<p className={styles.note}>{settings.hours}</p>
					</div>

					<div className={styles.item}>
						<span className={styles.label}>Реквизиты</span>
						<p className={styles.requisites}>{settings.requisites}</p>
					</div>

					<div className={styles.actions}>
						<LinkButton
							href={waLink(settings.whatsappDigits)}
							size='md'
						>
							Написать в WhatsApp
						</LinkButton>
						<LinkButton
							href={ROUTES.wholesaleRequest}
							variant='outline'
							size='md'
						>
							Стать оптовиком
						</LinkButton>
					</div>
				</div>

				<div className={styles.map}>
					<span className={styles.mapLabel}>карта · схема проезда</span>
				</div>
			</div>
		</div>
	)
}
