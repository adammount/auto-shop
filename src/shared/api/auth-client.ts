import type { LoginValues, RegisterValues, WholesaleValues } from '@/shared/api/auth-schema'
import type { SessionUser } from '@/shared/types/session'

import { getJson, patchJson, postJson } from './client'

function mapUser(raw: Record<string, unknown> | null): SessionUser | null {
	if (!raw) return null
	return {
		id: String(raw.id),
		name: String(raw.name ?? ''),
		email: String(raw.email ?? ''),
		phone: raw.phone ? String(raw.phone) : undefined,
		role: (raw.role as SessionUser['role']) ?? 'customer',
		wholesaleStatus: (raw.wholesaleStatus as SessionUser['wholesaleStatus']) ?? 'none'
	}
}

export async function fetchCurrentUser(): Promise<SessionUser | null> {
	const data = await getJson<{ user?: Record<string, unknown> | null }>('/api/users/me')
	return mapUser(data.user ?? null)
}

export function logoutUser(): Promise<unknown> {
	return postJson('/api/users/logout', {})
}

export function loginUser(values: LoginValues): Promise<unknown> {
	return postJson('/api/users/login', values, { errorMessage: 'Неверный e-mail или пароль' })
}

export function registerUser(values: RegisterValues): Promise<unknown> {
	return postJson('/api/auth/register', values, { errorMessage: 'Не удалось зарегистрироваться' })
}

export function requestWholesale(values: WholesaleValues): Promise<unknown> {
	return postJson('/api/auth/wholesale-request', values, {
		errorMessage: 'Не удалось отправить заявку'
	})
}

export function updateProfile(
	userId: string,
	data: { name: string; phone: string }
): Promise<unknown> {
	return patchJson(`/api/users/${userId}`, data, { errorMessage: 'Не удалось сохранить профиль' })
}
