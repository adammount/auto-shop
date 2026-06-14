import styles from './spinner.module.scss'

export function Spinner() {
	return (
		<div className={styles.wrap}>
			<span
				className={styles.spinner}
				aria-label='Загрузка'
			/>
		</div>
	)
}
