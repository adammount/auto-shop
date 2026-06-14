'use client'

import { useEffect } from 'react'

import { useSessionStore } from '@/shared/store/session'

export function SessionInit() {
	const refresh = useSessionStore(state => state.refresh)

	useEffect(() => {
		void refresh()
	}, [refresh])

	return null
}
