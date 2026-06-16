import { getPayload } from 'payload'

import config from '@/payload.config'

const CATEGORIES = [
	{ title: 'Тормозная система', slug: 'tormoznaya-sistema' },
	{ title: 'Двигатель', slug: 'dvigatel' },
	{ title: 'Подвеска и рулевое', slug: 'podveska-i-rulevoe' },
	{ title: 'Фильтры', slug: 'filtry' },
	{ title: 'Электрика', slug: 'elektrika' },
	{ title: 'Масла и жидкости', slug: 'masla-i-zhidkosti' },
	{ title: 'Трансмиссия', slug: 'transmissiya' },
	{ title: 'Кузов и оптика', slug: 'kuzov-i-optika' }
]

const BRANDS = [
	'Bosch',
	'TRW',
	'Brembo',
	'Mann-Filter',
	'Sachs',
	'Febi',
	'NGK',
	'Mahle',
	'SKF',
	'Valeo',
	'Hella'
]

const PRODUCTS = [
	{
		title: 'Тормозной диск передний',
		slug: 'tormoznoy-disk-peredniy',
		sku: '0 986 479 R23',
		brand: 'Bosch',
		category: 'tormoznaya-sistema',
		priceRetail: 4280,
		priceWholesale: 3620,
		stock: 24,
		isNew: true,
		isPopular: true
	},
	{
		title: 'Колодки тормозные, комплект',
		slug: 'kolodki-tormoznye-komplekt',
		sku: 'GDB 1330',
		brand: 'TRW',
		category: 'tormoznaya-sistema',
		priceRetail: 2940,
		priceWholesale: 2480,
		stock: 40
	},
	{
		title: 'Суппорт тормозной правый',
		slug: 'support-tormoznoy-pravyy',
		sku: 'BR-5521',
		brand: 'Brembo',
		category: 'tormoznaya-sistema',
		priceRetail: 11900,
		priceWholesale: 10200,
		stock: 8
	},
	{
		title: 'Масляный фильтр',
		slug: 'maslyanyy-filtr',
		sku: 'W 712/75',
		brand: 'Mann-Filter',
		category: 'filtry',
		priceRetail: 540,
		priceWholesale: 430,
		stock: 120,
		isPopular: true
	},
	{
		title: 'Воздушный фильтр салона',
		slug: 'vozdushnyy-filtr-salona',
		sku: 'CUK 2939',
		brand: 'Mann-Filter',
		category: 'filtry',
		priceRetail: 1180,
		priceWholesale: 980,
		stock: 64
	},
	{
		title: 'Амортизатор передний газовый',
		slug: 'amortizator-peredniy-gazovyy',
		sku: '314 037',
		brand: 'Sachs',
		category: 'podveska-i-rulevoe',
		priceRetail: 6750,
		priceWholesale: 5800,
		stock: 16,
		isNew: true,
		isPopular: true
	},
	{
		title: 'Опора шаровая',
		slug: 'opora-sharovaya',
		sku: '27179',
		brand: 'Febi',
		category: 'podveska-i-rulevoe',
		priceRetail: 1640,
		priceWholesale: 1380,
		stock: 5
	},
	{
		title: 'Свеча зажигания иридиевая',
		slug: 'svecha-zazhiganiya-iridievaya',
		sku: 'IFR6T11',
		brand: 'NGK',
		category: 'dvigatel',
		priceRetail: 920,
		priceWholesale: 740,
		stock: 200,
		isPopular: true
	},
	{
		title: 'Масло моторное 5W-30, 4 л',
		slug: 'maslo-motornoe-5w-30-4l',
		sku: 'GE 5W30 4L',
		brand: 'Mahle',
		category: 'masla-i-zhidkosti',
		priceRetail: 3640,
		priceWholesale: 3100,
		stock: 80,
		isNew: true
	},
	{
		title: 'Антифриз G12, 5 л',
		slug: 'antifriz-g12-5l',
		sku: 'AF G12 5L',
		brand: 'Febi',
		category: 'masla-i-zhidkosti',
		priceRetail: 1290,
		priceWholesale: 1050,
		stock: 60
	},
	{
		title: 'Ремень ГРМ, комплект',
		slug: 'remen-grm-komplekt',
		sku: 'CT 1028 K1',
		brand: 'Bosch',
		category: 'dvigatel',
		priceRetail: 5870,
		priceWholesale: 4990,
		stock: 18
	},
	{
		title: 'Аккумулятор 60 Ач',
		slug: 'akkumulyator-60ah',
		sku: 'S4 005',
		brand: 'Bosch',
		category: 'elektrika',
		priceRetail: 7480,
		priceWholesale: 6450,
		stock: 22,
		isNew: true
	},
	{
		title: 'Генератор 14V 90A',
		slug: 'generator-14v-90a',
		sku: 'CG 137 HE',
		brand: 'Valeo',
		category: 'elektrika',
		priceRetail: 12400,
		priceWholesale: 10900,
		stock: 7
	},
	{
		title: 'Стартер редукторный',
		slug: 'starter-reduktornyy',
		sku: 'CS 1289',
		brand: 'Valeo',
		category: 'elektrika',
		priceRetail: 9650,
		priceWholesale: 8300,
		stock: 5
	},
	{
		title: 'Сцепление, комплект',
		slug: 'sceplenie-komplekt',
		sku: '3000 951 081',
		brand: 'Sachs',
		category: 'transmissiya',
		priceRetail: 14300,
		priceWholesale: 12600,
		stock: 9
	},
	{
		title: 'Масло трансмиссионное 75W-90, 1 л',
		slug: 'maslo-transmissionnoe-75w-90-1l',
		sku: 'GO 75W90 1L',
		brand: 'Mahle',
		category: 'transmissiya',
		priceRetail: 1140,
		priceWholesale: 920,
		stock: 70
	},
	{
		title: 'Фара передняя левая',
		slug: 'fara-perednyaya-levaya',
		sku: '1EL 354 833-011',
		brand: 'Hella',
		category: 'kuzov-i-optika',
		priceRetail: 8900,
		priceWholesale: 7700,
		stock: 6,
		isNew: true
	},
	{
		title: 'Зеркало боковое правое',
		slug: 'zerkalo-bokovoe-pravoe',
		sku: '6PX 012 528',
		brand: 'Hella',
		category: 'kuzov-i-optika',
		priceRetail: 4560,
		priceWholesale: 3850,
		stock: 14
	}
]

const seed = async () => {
	const payload = await getPayload({ config })

	payload.logger.info('Seeding database…')

	const adminEmail = process.env.ADMIN_EMAIL || 'admin@detal.ru'
	const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345'
	const adminName = process.env.ADMIN_NAME || 'Администратор'

	const existingAdmin = await payload.find({
		collection: 'users',
		where: { email: { equals: adminEmail } },
		limit: 1
	})

	if (existingAdmin.docs.length === 0) {
		await payload.create({
			collection: 'users',
			data: {
				name: adminName,
				email: adminEmail,
				password: adminPassword,
				role: 'admin'
			}
		})
		payload.logger.info(`Admin created: ${adminEmail}`)
	}

	const categoryMap = new Map<string, number>()
	for (const category of CATEGORIES) {
		const existing = await payload.find({
			collection: 'categories',
			where: { slug: { equals: category.slug } },
			limit: 1
		})

		if (existing.docs[0]) {
			categoryMap.set(category.slug, existing.docs[0].id)
		} else {
			const doc = await payload.create({
				collection: 'categories',
				context: { disableRevalidate: true },
				data: category
			})
			categoryMap.set(category.slug, doc.id)
		}
	}

	const brandMap = new Map<string, number>()
	for (const title of BRANDS) {
		const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
		const existing = await payload.find({
			collection: 'brands',
			where: { slug: { equals: slug } },
			limit: 1
		})
		const doc =
			existing.docs[0] ?? (await payload.create({ collection: 'brands', data: { title, slug } }))
		brandMap.set(title, doc.id)
	}

	for (const product of PRODUCTS) {
		const existing = await payload.find({
			collection: 'products',
			where: { slug: { equals: product.slug } },
			limit: 1
		})

		if (existing.docs[0]) continue

		await payload.create({
			collection: 'products',
			context: { disableRevalidate: true },
			data: {
				title: product.title,
				slug: product.slug,
				sku: product.sku,
				priceRetail: product.priceRetail,
				priceWholesale: product.priceWholesale,
				stock: product.stock,
				isActive: true,
				isNew: 'isNew' in product ? product.isNew : false,
				isPopular: 'isPopular' in product ? product.isPopular : false,
				category: categoryMap.get(product.category),
				brand: brandMap.get(product.brand)
			}
		})
	}

	await payload.updateGlobal({
		slug: 'site-settings',
		context: { disableRevalidate: true },
		data: {
			phone: '+7 (999) 888-77-66',
			email: 'zakaz@detal.ru',
			whatsapp: 'https://wa.me/79998887766',
			address: 'г. Москва, ул. Промышленная, 14, стр. 2',
			hours: 'Пн–Сб 9:00–20:00 · Вс — выходной',
			requisites: 'ООО «Деталь» · ИНН 7700000000 · ОГРН 1147700000000'
		}
	})

	await payload.updateGlobal({
		slug: 'reviews',
		context: { disableRevalidate: true },
		data: {
			items: [
				{
					rating: 5,
					text: '«Заказываем запчасти регулярно. Артикулы всегда совпадают, доставка в срок, по опту цены адекватные.»',
					author: 'Алексей М.',
					role: 'Сервис «АвтоПрофи»'
				},
				{
					rating: 5,
					text: '«Подобрала колодки по артикулу за минуту. Менеджер уточнил наличие в WhatsApp — удобно, оплатила при получении.»',
					author: 'Ирина К.',
					role: 'Частный клиент'
				},
				{
					rating: 5,
					text: '«Хороший выбор по подвеске и тормозам. Не хватает только подбора по VIN, но артикулы выручают.»',
					author: 'Дмитрий В.',
					role: 'СТО «Гараж 22»'
				},
				{
					rating: 5,
					text: '«Перешли на опт после первой заявки. Прайс выгружается, заявки уходят менеджеру — всё прозрачно.»',
					author: 'Сергей П.',
					role: 'Оптовый покупатель'
				}
			]
		}
	})

	await payload.updateGlobal({
		slug: 'banners',
		context: { disableRevalidate: true },
		data: {
			slides: [
				{
					badge: 'Оригинал и проверенные аналоги',
					title: 'Запчасти, которым доверяют сервисы',
					sub: 'Точный подбор по артикулу, наличие на складе в реальном времени и отгрузка в день заказа. Bosch, SKF, TRW, Mann и ещё 40 брендов.',
					primaryLabel: 'Открыть каталог',
					primaryHref: '/catalog',
					secondaryLabel: 'О компании',
					secondaryHref: '/about',
					mediaLabel: 'фото: витрина / стеллажи со склада'
				},
				{
					badge: 'Отгрузка в день заказа',
					title: 'Со склада в Москве по всей России',
					sub: 'Транспортные компании и самовывоз. Собираем заказ за пару часов и передаём в доставку в тот же день.',
					primaryLabel: 'Условия доставки',
					primaryHref: '/delivery',
					secondaryLabel: 'Контакты',
					secondaryHref: '/contacts',
					mediaLabel: 'фото: упаковка и отгрузка заказа'
				},
				{
					badge: 'Опт для сервисов и магазинов',
					title: 'Отдельные цены для СТО',
					sub: 'Заявка на статус оптовика — за один день. Прайс выгружается, заявки уходят менеджеру напрямую.',
					primaryLabel: 'Стать оптовиком',
					primaryHref: '/wholesale-request',
					secondaryLabel: 'Войти',
					secondaryHref: '/login',
					mediaLabel: 'фото: оптовый склад'
				}
			]
		}
	})

	payload.logger.info('Seeding complete.')
	process.exit(0)
}

await seed()
