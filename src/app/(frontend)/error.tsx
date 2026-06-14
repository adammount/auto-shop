'use client'

import { Button } from '@/shared/ui/button'
import { StatusScreen } from '@/shared/ui/status-screen'

interface Props {
	error: Error & { digest?: string }
	reset: () => void
}

export default function Error({ reset }: Props) {
	return (
		<StatusScreen
			code='500'
			title='Что-то пошло не так'
			text='Произошла ошибка при загрузке страницы. Попробуйте обновить — если повторится, напишите нам.'
			action={
				<Button
					size='lg'
					onClick={reset}
				>
					Попробовать снова
				</Button>
			}
		/>
	)
}
