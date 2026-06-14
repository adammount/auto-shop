export const DELIVERY_OPTIONS = [
	{ value: 'pickup', label: 'Самовывоз', note: 'со склада · бесплатно' },
	{ value: 'courier', label: 'Курьер по Москве', note: 'от 350 ₽, на следующий день' },
	{ value: 'transport', label: 'Транспортная компания', note: 'по РФ, по тарифу перевозчика' }
] as const

export const CONTACT_OPTIONS = [
	{ value: 'call', label: 'Звонок' },
	{ value: 'whatsapp', label: 'WhatsApp' },
	{ value: 'email', label: 'E-mail' }
] as const
