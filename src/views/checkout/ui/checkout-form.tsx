'use client'

import { Controller, useFormContext } from 'react-hook-form'

import type { CheckoutFormValues } from '@/shared/api/order-schema'
import { Checkbox } from '@/shared/ui/checkbox'
import { Field } from '@/shared/ui/field'
import { Radio } from '@/shared/ui/radio'
import { Segmented } from '@/shared/ui/segmented'
import { Textarea } from '@/shared/ui/textarea'
import { Turnstile } from '@/shared/ui/turnstile'

import { CONTACT_OPTIONS, DELIVERY_OPTIONS } from '../model/order.data'

import styles from './checkout-form.module.scss'

interface SectionProps {
	num: string
	title: string
	children: React.ReactNode
}

function FormSection({ num, title, children }: SectionProps) {
	return (
		<section className={styles.section}>
			<div className={styles.sectionTitle}>
				<span className={styles.sectionNum}>{num}</span>
				<h2 className={styles.sectionHeading}>{title}</h2>
			</div>
			{children}
		</section>
	)
}

export function CheckoutForm() {
	const {
		register,
		control,
		formState: { errors }
	} = useFormContext<CheckoutFormValues>()

	return (
		<div className={styles.form}>
			<FormSection
				num='01'
				title='Контактные данные'
			>
				<div className={styles.row}>
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
				</div>
				<Field
					label='E-mail'
					placeholder='Для копии заказа (необязательно)'
					type='email'
					error={errors.email?.message}
					{...register('email')}
				/>
			</FormSection>

			<FormSection
				num='02'
				title='Способ получения'
			>
				<Controller
					control={control}
					name='delivery'
					render={({ field }) => (
						<div className={styles.radios}>
							{DELIVERY_OPTIONS.map(option => (
								<Radio
									key={option.value}
									name={field.name}
									checked={field.value === option.value}
									onChange={() => field.onChange(option.value)}
								>
									<strong>{option.label}</strong> — {option.note}
								</Radio>
							))}
						</div>
					)}
				/>
			</FormSection>

			<FormSection
				num='03'
				title='Предпочтительная связь'
			>
				<Controller
					control={control}
					name='contactMethod'
					render={({ field }) => (
						<Segmented
							options={CONTACT_OPTIONS.map(option => ({ ...option }))}
							value={field.value}
							onChange={field.onChange}
						/>
					)}
				/>
				<Textarea
					label='Комментарий к заказу'
					placeholder='Марка и модель авто, VIN, пожелания по доставке'
					{...register('comment')}
				/>
			</FormSection>

			<FormSection
				num='04'
				title='Подтверждение'
			>
				<Checkbox {...register('consent')}>
					Я согласен на обработку персональных данных и принимаю политику конфиденциальности. *
				</Checkbox>
				{errors.consent && <span className={styles.error}>{errors.consent.message}</span>}
				<Controller
					control={control}
					name='captchaToken'
					render={({ field }) => (
						<Turnstile
							onVerify={field.onChange}
							onExpire={() => field.onChange('')}
						/>
					)}
				/>
				{errors.captchaToken && <span className={styles.error}>{errors.captchaToken.message}</span>}
			</FormSection>
		</div>
	)
}
