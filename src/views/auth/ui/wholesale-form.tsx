'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { requestWholesale } from '@/shared/api/auth-client'
import { type WholesaleValues, wholesaleSchema } from '@/shared/api/auth-schema'
import { ApiError } from '@/shared/api/client'
import { useSessionStore } from '@/shared/store/session'
import { useToastStore } from '@/shared/store/toast'
import { Button } from '@/shared/ui/button'
import { Field } from '@/shared/ui/field'

import styles from './auth-form.module.scss'

export function WholesaleForm() {
	const refresh = useSessionStore(state => state.refresh)
	const showToast = useToastStore(state => state.showToast)
	const [formError, setFormError] = useState('')
	const [isSent, setIsSent] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<WholesaleValues>({
		resolver: zodResolver(wholesaleSchema),
		defaultValues: { name: '', phone: '' }
	})

	const onSubmit = async (values: WholesaleValues) => {
		setFormError('')

		try {
			await requestWholesale(values)
		} catch (error) {
			setFormError(error instanceof ApiError ? error.message : 'Не удалось отправить заявку')
			return
		}

		await refresh()
		setIsSent(true)
		showToast('Заявка отправлена')
	}

	if (isSent) {
		return (
			<div className={styles.form}>
				<p className={styles.intro}>
					Заявка принята. Менеджер свяжется с вами и подтвердит статус оптовика — после одобрения в
					каталоге появятся оптовые цены.
				</p>
			</div>
		)
	}

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit(onSubmit)}
		>
			<p className={styles.intro}>
				Оставьте контакты — менеджер свяжется и подтвердит статус оптовика. После одобрения вы
				увидите оптовые цены. Заявку можно оставить из аккаунта.
			</p>

			<Field
				label='Имя *'
				placeholder='Имя или название организации'
				error={errors.name?.message}
				{...register('name')}
			/>
			<Field
				label='Телефон *'
				placeholder='+7 (___) ___-__-__'
				type='tel'
				error={errors.phone?.message}
				{...register('phone')}
			/>

			{formError && <p className={styles.formError}>{formError}</p>}

			<Button
				type='submit'
				size='lg'
				className={styles.submit}
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Отправляем…' : 'Отправить заявку'}
			</Button>
		</form>
	)
}
