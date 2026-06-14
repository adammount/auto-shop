import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Деталь — интернет-магазин автозапчастей',
		short_name: 'Деталь',
		description:
			'Интернет-магазин автозапчастей. Оригинал и проверенные аналоги. Доставка по РФ, опт для сервисов.',
		start_url: '/',
		display: 'standalone',
		background_color: '#fffbfa',
		theme_color: '#16130f',
		lang: 'ru',
		icons: [
			{
				src: '/icon.svg',
				sizes: 'any',
				type: 'image/svg+xml'
			}
		]
	}
}
