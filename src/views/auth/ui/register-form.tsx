'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { registerUser } from '@/shared/api/auth-client'
import { type RegisterValues, registerSchema } from '@/shared/api/auth-schema'
import { ApiError } from '@/shared/api/client'
import { ROUTES } from '@/shared/config'
import { useSessionStore } from '@/shared/store/session'
import { useToastStore } from '@/shared/store/toast'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Field } from '@/shared/ui/field'

import styles from './auth-form.module.scss'

interface Props {
	onLogin: () => void
}

export function RegisterForm({ onLogin }: Props) {
	const router = useRouter()
	const refresh = useSessionStore(state => state.refresh)
	const showToast = useToastStore(state => state.showToast)
	const [formError, setFormError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: { name: '', phone: '', email: '', password: '', consent: false }
	})

	const onSubmit = async (values: RegisterValues) => {
		setFormError('')

		try {
			await registerUser(values)
		} catch (error) {
			setFormError(error instanceof ApiError ? error.message : 'Не удалось зарегистрироваться')
			return
		}

		await refresh()
		showToast('Аккаунт создан')
		router.push(ROUTES.account)
	}

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Field
				label='Имя *'
				placeholder='Как к вам обращаться'
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
			<Field
				label='E-mail *'
				placeholder='Для входа и копии заказов'
				type='email'
				error={errors.email?.message}
				{...register('email')}
			/>
			<Field
				label='Пароль *'
				placeholder='Не менее 8 символов'
				type='password'
				error={errors.password?.message}
				{...register('password')}
			/>

			<Checkbox {...register('consent')}>Согласен на обработку персональных данных.</Checkbox>
			{errors.consent && <p className={styles.formError}>{errors.consent.message}</p>}

			{formError && <p className={styles.formError}>{formError}</p>}

			<Button
				type='submit'
				size='lg'
				className={styles.submit}
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Создаём…' : 'Зарегистрироваться'}
			</Button>

			<p className={styles.switch}>
				Уже есть аккаунт?{' '}
				<button
					type='button'
					className={styles.switchLink}
					onClick={onLogin}
				>
					Войдите
				</button>
			</p>
		</form>
	)
}
