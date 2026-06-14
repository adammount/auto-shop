import Link from 'next/link'

import { getNavCategories, getSiteSettings } from '@/shared/api/content-repository'
import { ROUTES } from '@/shared/config'
import cn from 'clsx'

import { telHref, waLink } from '@/shared/lib/contacts'
import { Icon } from '@/shared/ui/icon'

import styles from './footer.module.scss'

const CUSTOMER_LINKS = [
	{ label: 'Доставка и оплата', href: ROUTES.delivery },
	{ label: 'О компании', href: ROUTES.about },
	{ label: 'Контакты', href: ROUTES.contacts },
	{ label: 'Стать оптовиком', href: ROUTES.wholesaleRequest }
]

const MAX_FOOTER_CATEGORIES = 5

export async function Footer() {
	const [settings, categories] = await Promise.all([getSiteSettings(), getNavCategories()])
	const catalogLinks = categories.slice(0, MAX_FOOTER_CATEGORIES)

	return (
		<footer className={styles.footer}>
			<div className={styles.grid}>
				<div className={styles.brand}>
					<span className={styles.brandName}>Деталь</span>
					<p className={styles.brandText}>
						Интернет-магазин автозапчастей. Оригинал и проверенные аналоги. Доставка по РФ, опт для
						сервисов.
					</p>
					<div className={styles.contacts}>
						{settings.phone && (
							<a
								href={telHref(settings.phone)}
								className={styles.contactRow}
							>
								<span className={styles.contactIcon}>
									<Icon name='phone' />
								</span>
								{settings.phone}
							</a>
						)}
						{settings.email && (
							<a
								href={`mailto:${settings.email}`}
								className={styles.contactRow}
							>
								<span className={styles.contactAt}>@</span>
								{settings.email}
							</a>
						)}
						<a
							href={waLink(settings.whatsappDigits)}
							className={styles.contactRow}
						>
							<span className={styles.contactIcon}>
								<Icon name='whatsapp' />
							</span>
							Написать в WhatsApp
						</a>
					</div>
				</div>

				<div className={styles.cols}>
					<div className={cn(styles.col, styles.colCatalog)}>
						<span className={styles.colLabel}>Каталог</span>
						{catalogLinks.map(category => (
							<Link
								key={category.slug}
								href={ROUTES.catalogCategory(category.slug)}
								className={styles.colLink}
							>
								{category.title}
							</Link>
						))}
					</div>

					<div className={styles.col}>
						<span className={styles.colLabel}>Покупателям</span>
						{CUSTOMER_LINKS.map(link => (
							<Link
								key={link.href}
								href={link.href}
								className={styles.colLink}
							>
								{link.label}
							</Link>
						))}
					</div>

					<div className={styles.col}>
						<span className={styles.colLabel}>Адрес склада</span>
						<address className={styles.address}>
							{settings.address}
							{settings.hours && (
								<>
									<br />
									{settings.hours}
								</>
							)}
						</address>
						{settings.address && (
							<iframe
								src={`https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(
									settings.address
								)}&z=16`}
								title={`Карта: ${settings.address}`}
								loading='lazy'
								className={styles.map}
							/>
						)}
					</div>
				</div>
			</div>

			<div className={styles.bottom}>
				<span className={styles.copyright}>
						© 2026 ДЕТАЛЬ. <span className={styles.copyrightRest}>Все права защищены.</span>
					</span>
				<Link
					href={ROUTES.privacy}
					className={styles.legal}
				>
					Политика конфиденциальности
				</Link>
			</div>
		</footer>
	)
}
