import Image from 'next/image'

import { getSiteSettings } from '@/shared/api/content-repository'
import { ROUTES } from '@/shared/config'
import { waLink } from '@/shared/lib/contacts'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'
import { ExternalLinkButton, LinkButton } from '@/shared/ui/button'
import { FeatureGrid } from '@/shared/ui/feature-grid'

import { ABOUT_STATS } from '../model/about.data'

import styles from './about-screen.module.scss'

export async function AboutScreen() {
	const settings = await getSiteSettings()

	return (
		<div className={styles.screen}>
			<div className={styles.hero}>
				<Breadcrumbs items={[{ label: 'Главная', href: ROUTES.home }, { label: 'О компании' }]} />
				<h1 className={styles.title}>Запчасти — это про доверие, а не про лотерею</h1>
				<p className={styles.lead}>
					ДЕТАЛЬ — интернет-магазин автозапчастей для частных владельцев и сервисов. Мы держим в
					наличии оригинал и проверенные аналоги, сверяем артикулы перед отгрузкой и отвечаем за то,
					что отправляем.
				</p>
			</div>

			<FeatureGrid items={ABOUT_STATS} />

			<div className={styles.layout}>
				<div className={styles.imageWrap}>
					{settings.warehousePhoto ? (
						<Image
							src={settings.warehousePhoto}
							alt='Склад компании'
							fill
							sizes='(max-width: 767px) 100vw, 608px'
							className={styles.image}
						/>
					) : (
						<span className={styles.imageLabel}>фото: склад / приёмка</span>
					)}
				</div>

				<div className={styles.stack}>
					<span className={styles.kicker}>Как мы работаем</span>
					<h2 className={styles.heading}>Без подбора по VIN — но с точностью по артикулу</h2>
					<div className={styles.text}>
						<p>
							Каталог построен по категориям и брендам. Вы находите деталь по названию или артикулу,
							видите реальное наличие на складе и оформляете заказ. Менеджер подтверждает
							совместимость и помогает, если нужно уточнить — по телефону или в WhatsApp.
						</p>
						<p>
							Оплаты на сайте нет: заказ уходит менеджеру на почту и в WhatsApp, а оплату и доставку
							мы согласуем удобным способом, в том числе по счёту для оптовых клиентов.
						</p>
					</div>
					<div className={styles.actions}>
						<LinkButton
							href={ROUTES.catalog}
							size='md'
						>
							В каталог
						</LinkButton>
						<ExternalLinkButton
							href={waLink(settings.whatsappDigits)}
							variant='outline'
							size='md'
						>
							Связаться
						</ExternalLinkButton>
					</div>
				</div>
			</div>
		</div>
	)
}
