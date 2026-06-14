'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { loginUser } from '@/shared/api/auth-client'
import { type LoginValues, loginSchema } from '@/shared/api/auth-schema'
import { ROUTES } from '@/shared/config'
import { useSessionStore } from '@/shared/store/session'
import { useToastStore } from '@/shared/store/toast'
import { Button } from '@/shared/ui/button'
import { Field } from '@/shared/ui/field'

import styles from './auth-form.module.scss'

interface Props {
	onRegister: () => void
}

export function LoginForm({ onRegister }: Props) {
	const router = useRouter()
	const refresh = useSessionStore(state => state.refresh)
	const showToast = useToastStore(state => state.showToast)
	const [formError, setFormError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' }
	})

	const onSubmit = async (values: LoginValues) => {
		setFormError('')

		try {
			await loginUser(values)
		} catch {
			setFormError('Неверный e-mail или пароль')
			return
		}

		await refresh()
		showToast('Вы вошли в аккаунт')
		router.push(ROUTES.account)
	}

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Field
				label='E-mail'
				placeholder='you@example.com'
				type='email'
				error={errors.email?.message}
				{...register('email')}
			/>
			<Field
				label='Пароль'
				placeholder='••••••••'
				type='password'
				error={errors.password?.message}
				{...register('password')}
			/>

			{formError && <p className={styles.formError}>{formError}</p>}

			<Button
				type='submit'
				size='lg'
				className={styles.submit}
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Входим…' : 'Войти'}
			</Button>

			<p className={styles.switch}>
				Нет аккаунта?{' '}
				<button
					type='button'
					className={styles.switchLink}
					onClick={onRegister}
				>
					Зарегистрируйтесь
				</button>
			</p>
		</form>
	)
}
