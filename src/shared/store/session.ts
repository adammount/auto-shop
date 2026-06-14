import { create } from 'zustand'

import { fetchCurrentUser, logoutUser } from '@/shared/api/auth-client'
import type { SessionUser } from '@/shared/types/session'

export type { SessionUser }

interface SessionState {
	user: SessionUser | null
	isLoaded: boolean
	setUser: (user: SessionUser | null) => void
	refresh: () => Promise<void>
	logout: () => Promise<void>
}

export const useSessionStore = create<SessionState>(set => ({
	user: null,
	isLoaded: false,
	setUser: user => set({ user, isLoaded: true }),
	refresh: async () => {
		try {
			const user = await fetchCurrentUser()
			set({ user, isLoaded: true })
		} catch {
			set({ user: null, isLoaded: true })
		}
	},
	logout: async () => {
		try {
			await logoutUser()
		} catch {
			void 0
		}
		set({ user: null, isLoaded: true })
	}
}))
