import type { Metadata } from 'next'

import { SearchScreen } from '@/views/search'

export const metadata: Metadata = {
	title: 'Поиск'
}

interface Props {
	searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
	const { q = '' } = await searchParams

	return <SearchScreen query={q} />
}
