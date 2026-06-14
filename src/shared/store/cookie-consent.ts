import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface CookieConsentState {
	accepted: boolean
	accept: () => void
}

export const useCookieConsentStore = create<CookieConsentState>()(
	persist(
		set => ({
			accepted: false,
			accept: () => set({ accepted: true })
		}),
		{
			name: 'auto-shop-cookie-consent',
			storage: createJSONStorage(() => localStorage)
		}
	)
)
