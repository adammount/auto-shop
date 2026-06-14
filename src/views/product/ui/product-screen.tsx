import { ROUTES } from '@/shared/config'
import type { Product, ProductDetail } from '@/shared/types/product'
import { Breadcrumbs } from '@/shared/ui/breadcrumbs'
import { ProductRail } from '@/shared/ui/product-rail'

import { ProductGallery } from './product-gallery'
import { ProductInfo } from './product-info'
import { ProductTabs } from './product-tabs'

import styles from './product-screen.module.scss'

interface Props {
	product: ProductDetail
	related: Product[]
}

export function ProductScreen({ product, related }: Props) {
	return (
		<div className={styles.screen}>
			<Breadcrumbs
				items={[
					{ label: 'Главная', href: ROUTES.home },
					{ label: 'Каталог', href: ROUTES.catalog },
					{
						label: product.category,
						href: product.categorySlug
							? ROUTES.catalogCategory(product.categorySlug)
							: ROUTES.catalog
					},
					{ label: product.title }
				]}
			/>

			<div className={styles.layout}>
				<ProductGallery
					images={product.galleryImages}
					labels={product.gallery}
					title={product.title}
					isNew={product.isNew}
				/>
				<ProductInfo product={product} />
			</div>

			<ProductTabs product={product} />

			{related.length > 0 && (
				<ProductRail
					title='Похожие товары'
					products={related}
					actionLabel='Весь каталог'
					actionHref={ROUTES.catalog}
				/>
			)}
		</div>
	)
}
