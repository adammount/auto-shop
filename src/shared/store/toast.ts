import { create } from 'zustand'

interface ToastItem {
	id: string
	message: string
}

interface ToastStore {
	toasts: ToastItem[]
	showToast: (message: string) => void
	removeToast: (id: string) => void
}

export const TOAST_DURATION = 3000

export const useToastStore = create<ToastStore>(set => ({
	toasts: [],
	showToast: message => {
		const id = crypto.randomUUID()
		set(state => ({ toasts: [...state.toasts, { id, message }] }))
		setTimeout(() => {
			set(state => ({ toasts: state.toasts.filter(toast => toast.id !== id) }))
		}, TOAST_DURATION)
	},
	removeToast: id => set(state => ({ toasts: state.toasts.filter(toast => toast.id !== id) }))
}))
