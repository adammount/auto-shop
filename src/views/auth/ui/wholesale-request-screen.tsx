import { AuthAside } from './auth-aside'
import { WholesaleForm } from './wholesale-form'

import styles from './auth-screen.module.scss'

const STATUS_TEXT: Record<string, string> = {
	pending: 'Заявка на рассмотрении. Менеджер свяжется с вами в ближайшее время.',
	approved: 'Статус оптовика подтверждён — в каталоге доступны оптовые цены.',
	rejected: 'Заявка отклонена. Свяжитесь с менеджером, чтобы уточнить детали.'
}

interface Props {
	status: 'none' | 'pending' | 'approved' | 'rejected'
	whatsappDigits: string
}

export function WholesaleRequestScreen({ status, whatsappDigits }: Props) {
	const statusText = STATUS_TEXT[status]

	return (
		<div className={styles.screen}>
			<div className={styles.card}>
				<AuthAside whatsappDigits={whatsappDigits} />

				<div className={styles.main}>
					<div className={styles.heading}>
						<h2 className={styles.headingTitle}>Заявка на опт</h2>
					</div>

					{statusText ? <p className={styles.statusText}>{statusText}</p> : <WholesaleForm />}
				</div>
			</div>
		</div>
	)
}
