import { create } from 'zustand'

export type DrawerType = 'cart' | 'favorites' | 'menu' | 'filters'

interface UiStore {
	drawer: DrawerType | null
	openDrawer: (drawer: DrawerType) => void
	closeDrawer: () => void
}

export const useUiStore = create<UiStore>(set => ({
	drawer: null,
	openDrawer: drawer => set({ drawer }),
	closeDrawer: () => set({ drawer: null })
}))
