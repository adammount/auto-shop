import { getSiteSettings } from '@/shared/api/content-repository'
import { waLink } from '@/shared/lib/contacts'
import type { ProductDetail } from '@/shared/types/product'
import { Badge } from '@/shared/ui/badge'
import { Icon } from '@/shared/ui/icon'

import { CopyButton } from './copy-button'
import { ProductPrice } from './product-price'
import { ProductPurchase } from './product-purchase'
import { WholesaleNotice } from './wholesale-notice'

import styles from './product-info.module.scss'

interface Props {
	product: ProductDetail
}

export async function ProductInfo({ product }: Props) {
	const { id, title, sku, brand, priceRetail, stockCount, category, warranty, condition } = product
	const settings = await getSiteSettings()

	return (
		<div className={styles.info}>
			<div className={styles.head}>
				<div className={styles.brandRow}>
					<span className={styles.brandBadge}>{brand}</span>
					<Badge
						variant='success'
						withDot
					>
						В наличии · {stockCount} шт на складе
					</Badge>
				</div>
				<h1 className={styles.title}>{title}</h1>
				<div className={styles.art}>
					<span className={styles.artLabel}>Артикул:</span>
					<span className={styles.artValue}>{sku}</span>
					<CopyButton
						value={sku}
						className={styles.copy}
						successMessage='Артикул скопирован'
						aria-label='Скопировать артикул'
					>
						<span className={styles.copyIcon}>
							<Icon name='copyright' />
						</span>
					</CopyButton>
				</div>
			</div>

			<div className={styles.pricebox}>
				<ProductPrice
					productId={id}
					priceRetail={priceRetail}
				/>

				<WholesaleNotice />

				<ProductPurchase product={product} />
			</div>

			<dl className={styles.metaList}>
				<div className={styles.metaRow}>
					<dt className={styles.metaKey}>Бренд</dt>
					<dd className={styles.metaValue}>{brand}</dd>
				</div>
				<div className={styles.metaRow}>
					<dt className={styles.metaKey}>Категория</dt>
					<dd className={styles.metaValue}>{category}</dd>
				</div>
				<div className={styles.metaRow}>
					<dt className={styles.metaKey}>Гарантия</dt>
					<dd className={styles.metaValue}>{warranty}</dd>
				</div>
				<div className={styles.metaRow}>
					<dt className={styles.metaKey}>Состояние</dt>
					<dd className={styles.metaValue}>{condition}</dd>
				</div>
			</dl>

			<div className={styles.share}>
				<span className={styles.shareLabel}>Поделиться</span>
				<div className={styles.shareButtons}>
					<CopyButton
						value='current-url'
						className={styles.shareIconWrap}
						successMessage='Ссылка скопирована'
						aria-label='Скопировать ссылку'
					>
						<span className={styles.shareIcon}>
							<Icon name='share' />
						</span>
					</CopyButton>
					<a
						href={waLink(settings.whatsappDigits)}
						className={styles.shareIconWrap}
						aria-label='Поделиться в WhatsApp'
					>
						<span className={styles.shareIcon}>
							<Icon name='whatsapp' />
						</span>
					</a>
				</div>
			</div>
		</div>
	)
}
