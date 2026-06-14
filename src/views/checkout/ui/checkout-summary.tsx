'use client'

import cn from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

import type { CheckoutFormValues } from '@/shared/api/order-schema'
import { checkPromoCode } from '@/shared/api/orders-client'
import type { PromoResult } from '@/shared/lib/check-promo'
import { formatPrice } from '@/shared/lib/format-price'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { selectCartTotal, useCartStore } from '@/shared/store/cart'

import styles from './checkout-summary.module.scss'

interface Props {
	isSubmitting: boolean
}

export function CheckoutSummary({ isSubmitting }: Props) {
	const hydrated = useHydrated()
	const items = useCartStore(state => state.items)
	const total = useCartStore(selectCartTotal)
	const { setValue } = useFormContext<CheckoutFormValues>()

	const [promoCode, setPromoCode] = useState('')
	const [promo, setPromo] = useState<PromoResult | null>(null)
	const [promoError, setPromoError] = useState('')
	const [isChecking, setIsChecking] = useState(false)

	const applyPromo = async () => {
		const trimmed = promoCode.trim()
		if (!trimmed) return
		setIsChecking(true)

		try {
			const result = await checkPromoCode(trimmed, total)
			setPromo(result)
			setPromoError('')
			setValue('promoCode', result.code)
		} catch {
			setPromo(null)
			setPromoError('Промокод недействителен')
			setValue('promoCode', '')
		} finally {
			setIsChecking(false)
		}
	}

	const discount = promo?.discount ?? 0
	const grandTotal = Math.max(0, total - discount)

	return (
		<aside className={styles.summary}>
			<div className={styles.head}>
				<h2 className={styles.title}>Ваш заказ</h2>
				<span className={styles.count}>{hydrated ? `${items.length} поз.` : '—'}</span>
			</div>

			<div className={styles.items}>
				{hydrated && items.length === 0 && <p className={styles.empty}>Корзина пуста</p>}
				{hydrated &&
					items.map(({ product, quantity }) => (
						<div
							key={product.id}
							className={styles.line}
						>
							<span className={styles.thumb}>
								{product.image && (
									<Image
										src={product.image}
										alt={product.title}
										fill
										sizes='48px'
										className={styles.thumbMedia}
									/>
								)}
							</span>
							<div className={styles.lineInfo}>
								<span className={styles.lineTitle}>{product.title}</span>
								<span className={styles.lineMeta}>
									{product.brand} · {quantity} шт
								</span>
							</div>
							<span className={styles.linePrice}>
								{formatPrice(product.priceRetail * quantity)}
							</span>
						</div>
					))}
			</div>

			<div className={styles.promo}>
				<input
					className={styles.promoInput}
					placeholder='Промокод'
					aria-label='Промокод'
					value={promoCode}
					onChange={event => setPromoCode(event.target.value)}
				/>
				<button
					type='button'
					className={styles.promoButton}
					onClick={applyPromo}
					disabled={isChecking}
				>
					{isChecking ? 'Проверяем…' : 'Применить'}
				</button>
			</div>
			{promoError && <p className={styles.promoError}>{promoError}</p>}
			{promo && (
				<p className={styles.promoOk}>
					Промокод «{promo.code}» применён: −{formatPrice(promo.discount)}
				</p>
			)}

			<div className={styles.totals}>
				<div className={styles.totalRow}>
					<span className={styles.totalKey}>Товары</span>
					<span className={styles.totalValue}>{formatPrice(total)}</span>
				</div>
				{discount > 0 && (
					<div className={styles.totalRow}>
						<span className={styles.totalKey}>Скидка</span>
						<span className={cn(styles.totalValue, styles.discount)}>−{formatPrice(discount)}</span>
					</div>
				)}
				<div className={styles.totalRow}>
					<span className={styles.totalKey}>Доставка</span>
					<span className={styles.totalValue}>по согласованию</span>
				</div>
				<div className={styles.grandRow}>
					<span className={styles.grandKey}>Итого</span>
					<span className={styles.grandValue}>{formatPrice(grandTotal)}</span>
				</div>
			</div>

			<div className={styles.foot}>
				<button
					type='submit'
					className={styles.submit}
					disabled={isSubmitting || (hydrated && items.length === 0)}
				>
					{isSubmitting ? 'Отправляем…' : 'Отправить заказ'}
				</button>
				<p className={styles.note}>
					Оплата на сайте не требуется. Заказ уйдёт менеджеру на почту и в WhatsApp.
				</p>
			</div>
		</aside>
	)
}
