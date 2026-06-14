'use client'

import cn from 'clsx'
import { useState } from 'react'

import type { ProductDetail } from '@/shared/types/product'

import styles from './product-tabs.module.scss'

type TabId = 'description' | 'specs' | 'delivery'

const TABS: { id: TabId; label: string }[] = [
	{ id: 'description', label: 'Описание' },
	{ id: 'specs', label: 'Характеристики' },
	{ id: 'delivery', label: 'Доставка' }
]

interface Props {
	product: ProductDetail
}

export function ProductTabs({ product }: Props) {
	const [active, setActive] = useState<TabId>('description')

	return (
		<div className={styles.wrap}>
			<div className={styles.tabs}>
				{TABS.map(tab => (
					<button
						key={tab.id}
						type='button'
						className={cn(styles.tab, { [styles.tabActive]: tab.id === active })}
						onClick={() => setActive(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className={styles.panel}>
				{active === 'description' && (
					<>
						{product.description.length > 0 ? (
							product.description.map(paragraph => (
								<p
									key={paragraph}
									className={styles.text}
								>
									{paragraph}
								</p>
							))
						) : (
							<p className={styles.text}>
								Оригинальная деталь {product.brand} для замены. Уточнить совместимость по автомобилю
								можно по телефону или в WhatsApp.
							</p>
						)}
						{product.features.length > 0 && (
							<ul className={styles.list}>
								{product.features.map(feature => (
									<li
										key={feature}
										className={styles.listItem}
									>
										{feature}
									</li>
								))}
							</ul>
						)}
					</>
				)}

				{active === 'specs' && (
					<dl className={styles.specs}>
						<div className={styles.specRow}>
							<dt className={styles.specKey}>Бренд</dt>
							<dd className={styles.specValue}>{product.brand}</dd>
						</div>
						<div className={styles.specRow}>
							<dt className={styles.specKey}>Артикул</dt>
							<dd className={styles.specValue}>{product.sku}</dd>
						</div>
						<div className={styles.specRow}>
							<dt className={styles.specKey}>Категория</dt>
							<dd className={styles.specValue}>{product.category}</dd>
						</div>
						<div className={styles.specRow}>
							<dt className={styles.specKey}>Состояние</dt>
							<dd className={styles.specValue}>{product.condition}</dd>
						</div>
					</dl>
				)}

				{active === 'delivery' && (
					<p className={styles.text}>
						Отгрузка со склада в день оплаты. Доставка транспортными компаниями по всей России или
						самовывоз из Москвы. Сроки и стоимость уточняются при оформлении заказа.
					</p>
				)}
			</div>
		</div>
	)
}
