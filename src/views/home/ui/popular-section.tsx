import { getProducts } from '@/shared/api/products-repository'
import { ROUTES } from '@/shared/config'
import { ProductRail } from '@/shared/ui/product-rail'

export async function PopularSection() {
	const products = await getProducts()

	return (
		<ProductRail
			title='Популярные товары'
			products={products.slice(0, 4)}
			actionLabel='Весь каталог'
			actionHref={ROUTES.catalog}
		/>
	)
}
