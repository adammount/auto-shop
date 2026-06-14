import { ROUTES } from '@/shared/config'
import { LinkButton } from '@/shared/ui/button'
import { StatusScreen } from '@/shared/ui/status-screen'

export default function NotFound() {
	return (
		<StatusScreen
			code='404'
			title='Страница не найдена'
			text='Возможно, ссылка устарела или товар снят с продажи. Вернитесь в каталог — нужная деталь наверняка там.'
			action={
				<LinkButton
					href={ROUTES.catalog}
					size='lg'
				>
					В каталог
				</LinkButton>
			}
		/>
	)
}
