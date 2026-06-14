export interface SessionUser {
	id: string
	name: string
	email: string
	phone?: string
	role: 'customer' | 'wholesale' | 'admin'
	wholesaleStatus: 'none' | 'pending' | 'approved' | 'rejected'
}
