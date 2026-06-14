'use client'

import Link from 'next/link'

import { ROUTES } from '@/shared/config'
import { useSessionStore } from '@/shared/store/session'
import { Icon } from '@/shared/ui/icon'

import styles from './product-info.module.scss'

export function WholesaleNotice() {
	const user = useSessionStore(state => state.user)
	const isWholesale = user?.role === 'wholesale' && user.wholesaleStatus === 'approved'

	if (isWholesale) {
		return (
			<div className={styles.notice}>
				<span className={styles.noticeIcon}>
					<Icon name='box' />
				</span>
				<p className={styles.noticeText}>
					Оптовый аккаунт — цена показана с учётом вашего статуса.
				</p>
			</div>
		)
	}

	return (
		<div className={styles.notice}>
			<span className={styles.noticeIcon}>
				<Icon name='box' />
			</span>
			<p className={styles.noticeText}>
				Вы СТО или магазин?{' '}
				<Link
					href={ROUTES.wholesaleRequest}
					className={styles.noticeLink}
				>
					Оформите опт
				</Link>{' '}
				— цены ниже.
			</p>
		</div>
	)
}
