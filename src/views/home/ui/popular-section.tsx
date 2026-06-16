import { getPopularProducts } from '@/shared/api/products-repository'
import { ROUTES } from '@/shared/config'
import { ProductRail } from '@/shared/ui/product-rail'

export async function PopularSection() {
	const products = await getPopularProducts()

	if (products.length === 0) return null

	return (
		<ProductRail
			title='Популярные товары'
			products={products}
			actionLabel='Весь каталог'
			actionHref={ROUTES.catalog}
		/>
	)
}
