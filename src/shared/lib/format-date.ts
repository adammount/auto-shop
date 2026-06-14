const formatter = new Intl.DateTimeFormat('ru-RU', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric'
})

export function formatDate(value: string): string {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '—'
	return formatter.format(date)
}
