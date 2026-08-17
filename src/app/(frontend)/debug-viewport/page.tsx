'use client'

import { useEffect, useRef, useState } from 'react'

interface Snapshot {
	label: string
	htmlFontSize: string
	inputFontSize: string
	innerWidth: number
	innerHeight: number
	visualWidth: number
	visualHeight: number
	scrollY: number
}

function read(label: string, input: HTMLInputElement | null): Snapshot {
	const visual = window.visualViewport

	return {
		label,
		htmlFontSize: getComputedStyle(document.documentElement).fontSize,
		inputFontSize: input ? getComputedStyle(input).fontSize : '—',
		innerWidth: window.innerWidth,
		innerHeight: window.innerHeight,
		visualWidth: visual ? Math.round(visual.width) : 0,
		visualHeight: visual ? Math.round(visual.height) : 0,
		scrollY: Math.round(window.scrollY)
	}
}

export default function DebugViewportPage() {
	const inputRef = useRef<HTMLInputElement>(null)
	const [rows, setRows] = useState<Snapshot[]>([])
	const [value, setValue] = useState('')

	useEffect(() => {
		setRows([read('1. загрузка', inputRef.current)])
	}, [])

	const snap = (label: string) => {
		setRows(current => [...current, read(label, inputRef.current)])
	}

	return (
		<div style={{ padding: 16, fontFamily: 'monospace', fontSize: 14 }}>
			<h1 style={{ fontSize: 18, marginBottom: 12 }}>Диагностика вьюпорта</h1>

			<ol style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16, paddingLeft: 20 }}>
				<li>Прокрутите страницу вниз до поля</li>
				<li>Тапните по полю — откроется клавиатура</li>
				<li>Введите один символ</li>
				<li>Пришлите скриншот таблицы ниже</li>
			</ol>

			<div style={{ height: 600, background: '#f3f3f3', marginBottom: 16, padding: 8 }}>
				заполнитель, чтобы страница прокручивалась
			</div>

			<input
				ref={inputRef}
				value={value}
				placeholder='введите сюда любой символ'
				onFocus={() => snap('2. фокус')}
				onChange={event => {
					setValue(event.target.value)
					snap(`3. ввод «${event.target.value}»`)
				}}
				style={{ width: '100%', padding: 12, marginBottom: 16 }}
			/>

			<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
				<thead>
					<tr>
						{['событие', 'html', 'input', 'inner', 'visual', 'scrollY'].map(head => (
							<th
								key={head}
								style={{ border: '1px solid #999', padding: 4, textAlign: 'left' }}
							>
								{head}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, index) => (
						<tr key={index}>
							<td style={{ border: '1px solid #999', padding: 4 }}>{row.label}</td>
							<td style={{ border: '1px solid #999', padding: 4 }}>{row.htmlFontSize}</td>
							<td style={{ border: '1px solid #999', padding: 4 }}>{row.inputFontSize}</td>
							<td style={{ border: '1px solid #999', padding: 4 }}>
								{row.innerWidth}×{row.innerHeight}
							</td>
							<td style={{ border: '1px solid #999', padding: 4 }}>
								{row.visualWidth}×{row.visualHeight}
							</td>
							<td style={{ border: '1px solid #999', padding: 4 }}>{row.scrollY}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
