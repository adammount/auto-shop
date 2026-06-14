'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { searchProducts } from '@/shared/api/catalog-client'
import { ROUTES } from '@/shared/config'
import { useDebounce } from '@/shared/lib/use-debounce'
import type { Product } from '@/shared/types/product'
import { Icon } from '@/shared/ui/icon'

import { SearchSuggestions } from './search-suggestions'

import styles from './search-bar.module.scss'

const MAX_SUGGESTIONS = 6

export function SearchBar() {
	const router = useRouter()
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [suggestions, setSuggestions] = useState<Product[]>([])
	const rootRef = useRef<HTMLFormElement>(null)

	const debouncedQuery = useDebounce(query, 200)
	const trimmedQuery = debouncedQuery.trim()
	const isActive = isOpen && trimmedQuery.length >= 2

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClick)
		return () => document.removeEventListener('mousedown', handleClick)
	}, [])

	useEffect(() => {
		if (trimmedQuery.length < 2) return

		const controller = new AbortController()

		searchProducts(trimmedQuery, controller.signal)
			.then(products => setSuggestions(products.slice(0, MAX_SUGGESTIONS)))
			.catch(() => void 0)

		return () => controller.abort()
	}, [trimmedQuery])

	const submit = () => {
		const trimmed = query.trim()
		if (trimmed.length < 2) return
		setIsOpen(false)
		router.push(ROUTES.search(trimmed))
	}

	return (
		<form
			ref={rootRef}
			className={styles.search}
			role='search'
			onSubmit={event => {
				event.preventDefault()
				submit()
			}}
		>
			<span className={styles.icon}>
				<Icon name='search' />
			</span>
			<input
				className={styles.input}
				type='search'
				placeholder='Поиск по названию или артикулу'
				value={query}
				onChange={event => {
					setQuery(event.target.value)
					setIsOpen(true)
				}}
				onFocus={() => setIsOpen(true)}
			/>

			{isActive && (
				<SearchSuggestions
					query={trimmedQuery}
					products={suggestions}
					onSelect={() => setIsOpen(false)}
					onShowAll={submit}
				/>
			)}
		</form>
	)
}
