'use client'

import Link from 'next/link'
import { useState } from 'react'

import { updateProfile } from '@/shared/api/auth-client'
import { ROUTES } from '@/shared/config'
import { type SessionUser, useSessionStore } from '@/shared/store/session'
import { useToastStore } from '@/shared/store/toast'
import { Button } from '@/shared/ui/button'
import { Field } from '@/shared/ui/field'
import { Icon } from '@/shared/ui/icon'

import styles from './account-stack.module.scss'

interface Props {
	user: SessionUser
}

export function ProfileSection({ user }: Props) {
	const refresh = useSessionStore(state => state.refresh)
	const showToast = useToastStore(state => state.showToast)
	const [name, setName] = useState(user.name)
	const [phone, setPhone] = useState(user.phone ?? '')
	const [isSaving, setIsSaving] = useState(false)

	const isWholesale = user.role === 'wholesale' && user.wholesaleStatus === 'approved'

	const handleSave = async () => {
		setIsSaving(true)

		try {
			await updateProfile(user.id, { name, phone })
			await refresh()
			showToast('Профиль обновлён')
		} catch {
			showToast('Не удалось сохранить профиль')
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<>
			{!isWholesale && (
				<div className={styles.status}>
					<span className={styles.statusIcon}>
						<Icon name='info' />
					</span>
					<div className={styles.statusText}>
						<span className={styles.statusTitle}>Розничный аккаунт</span>
						<p className={styles.statusNote}>
							Вы СТО или магазин?{' '}
							<Link
								href={ROUTES.wholesaleRequest}
								className={styles.statusLink}
							>
								Подайте заявку на опт
							</Link>{' '}
							— получите отдельные цены.
						</p>
					</div>
				</div>
			)}

			<section className={styles.card}>
				<h2 className={styles.cardTitle}>Данные профиля</h2>
				<div className={styles.profileGrid}>
					<Field
						label='Имя'
						value={name}
						onChange={event => setName(event.target.value)}
					/>
					<Field
						label='Телефон'
						value={phone}
						onChange={event => setPhone(event.target.value)}
					/>
					<Field
						label='E-mail'
						defaultValue={user.email}
						readOnly
					/>
				</div>
				<Button
					size='md'
					className={styles.saveButton}
					onClick={handleSave}
					disabled={isSaving}
				>
					{isSaving ? 'Сохраняем…' : 'Сохранить'}
				</Button>
			</section>
		</>
	)
}
