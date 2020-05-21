export type BGColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'white' | 'transparent'
export type FGColor = BGColor | 'body' | 'muted' | 'black-50' | 'white-50'

type COL_SIZE = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type BREAKPOINT = 'sm' | 'md' | 'lg' | 'xl'

export const createRow = (): HTMLDivElement => {
	const row = document.createElement('div')
	row.classList.add('row')
	
	return row
}
export const createCol = (size?: COL_SIZE, breakpoint?: BREAKPOINT): HTMLDivElement => {
	const col = document.createElement('div')
	if (size !== undefined) {
		if (breakpoint !== undefined)
			col.classList.add(`col-${breakpoint}-${size}`)
		else
			col.classList.add(`col-${size}`)
	} else
		col.classList.add('col')
	
	return col
}

export function applyColors(elem: HTMLElement, bgColor?: BGColor, fgColor?: FGColor) {
	if (bgColor !== undefined && !elem.classList.contains(`bg-${bgColor}`))
		elem.classList.add(`bg-${bgColor}`)
	if (fgColor !== undefined && !elem.classList.contains(`text-${fgColor}`))
		elem.classList.add(`text-${fgColor}`)
}
