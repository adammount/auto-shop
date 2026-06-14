export const ROUTES = {
	home: '/',
	catalog: '/catalog',
	catalogCategory: (slug: string) => `/catalog?category=${encodeURIComponent(slug)}`,
	search: (query: string) => `/search?q=${encodeURIComponent(query)}`,
	product: (slug: string) => `/product/${slug}`,
	checkout: '/checkout',
	orderSuccess: '/order/success',
	about: '/about',
	delivery: '/delivery',
	contacts: '/contacts',
	privacy: '/privacy',
	login: '/login',
	register: '/register',
	wholesaleRequest: '/wholesale-request',
	account: '/account'
} as const
