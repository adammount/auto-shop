import type { Metadata } from 'next'

import { CatalogScreen } from '@/views/catalog'

export const metadata: Metadata = {
	title: 'Каталог запчастей'
}

interface Props {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CatalogPage({ searchParams }: Props) {
	const params = await searchParams
	return <CatalogScreen searchParams={params} />
}
