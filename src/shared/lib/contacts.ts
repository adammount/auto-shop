export function telHref(phone: string): string {
	return `tel:${phone.replace(/\s/g, '')}`
}

export function waLink(digits: string): string {
	return `https://wa.me/${digits}`
}
