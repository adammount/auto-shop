'use client'

import { useState } from 'react'

const LOG_ID = 'debug-log'

function log(message: string) {
	const node = document.getElementById(LOG_ID)
	if (!node) return
	node.textContent = `${new Date().toISOString().slice(17, 23)} ${message}\n${node.textContent}`
}

function handlers(name: string) {
	return {
		onFocus: () => log(`${name}: FOCUS   scrollY=${Math.round(window.scrollY)}`),
		onBlur: () => log(`${name}: BLUR    scrollY=${Math.round(window.scrollY)}`),
		onInput: () => log(`${name}: input   scrollY=${Math.round(window.scrollY)}`)
	}
}

export default function DebugViewportPage() {
	const [controlled, setControlled] = useState('')

	return (
		<div style={{ padding: 16, fontFamily: 'monospace', fontSize: 14 }}>
			<h1 style={{ fontSize: 17, marginBottom: 8 }}>Тест A / B</h1>
			<p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
				Наберите 3–4 символа в поле A, потом столько же в поле B. Пришлите лог.
				<br />
				Появление BLUR/FOCUS во время набора = поле перемонтируется.
			</p>

			<div style={{ height: 700, background: '#f3f3f3', padding: 8, marginBottom: 16 }}>
				заполнитель для прокрутки
			</div>

			<label style={{ display: 'block', marginBottom: 4 }}>A — без React-состояния</label>
			<input
				{...handlers('A')}
				defaultValue=''
				placeholder='поле A'
				style={{ width: '100%', padding: 12, marginBottom: 20, fontSize: 16 }}
			/>

			<label style={{ display: 'block', marginBottom: 4 }}>B — с React-состоянием</label>
			<input
				{...handlers('B')}
				value={controlled}
				onChange={event => setControlled(event.target.value)}
				placeholder='поле B'
				style={{ width: '100%', padding: 12, marginBottom: 20, fontSize: 16 }}
			/>

			<pre
				id={LOG_ID}
				style={{
					height: 260,
					overflow: 'auto',
					background: '#111',
					color: '#0f0',
					padding: 8,
					fontSize: 11,
					whiteSpace: 'pre-wrap'
				}}
			/>
		</div>
	)
}
