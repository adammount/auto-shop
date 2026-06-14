'use client'

import cn from 'clsx'
import { useState } from 'react'

import { AuthAside } from './auth-aside'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'

import styles from './auth-screen.module.scss'

export type AuthTab = 'login' | 'register'

const TABS: { id: AuthTab; label: string }[] = [
	{ id: 'login', label: 'Вход' },
	{ id: 'register', label: 'Регистрация' }
]

interface Props {
	tab?: AuthTab
	whatsappDigits: string
}

export function AuthScreen({ tab = 'login', whatsappDigits }: Props) {
	const [active, setActive] = useState<AuthTab>(tab)

	return (
		<div className={styles.screen}>
			<div className={styles.card}>
				<AuthAside whatsappDigits={whatsappDigits} />

				<div className={styles.main}>
					<div className={styles.tabs}>
						{TABS.map(item => (
							<button
								key={item.id}
								type='button'
								className={cn(styles.tab, { [styles.tabActive]: item.id === active })}
								onClick={() => setActive(item.id)}
							>
								{item.label}
							</button>
						))}
					</div>

					{active === 'login' && <LoginForm onRegister={() => setActive('register')} />}
					{active === 'register' && <RegisterForm onLogin={() => setActive('login')} />}
				</div>
			</div>
		</div>
	)
}
