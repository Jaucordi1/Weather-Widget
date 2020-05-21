import {applyColors, BGColor, FGColor} from "../utils"

type WeatherClassicData = {
	header: HTMLSpanElement
	data: HTMLSpanElement
}
type WeatherCardHeader = HTMLHeadingElement
type WeatherFigure = {
	figure: HTMLElement
	icon: HTMLImageElement
	caption: HTMLElement
}
type WeatherTemperature = { temperature: HTMLDivElement } & WeatherClassicData
type WeatherFeeling = { feeling: HTMLDivElement } & WeatherClassicData
type WeatherTemperatures = {
	temperatures: HTMLDivElement
	temperature: WeatherTemperature
	feeling: WeatherFeeling
}
type WeatherPressure = { pressure: HTMLDivElement } & WeatherClassicData
type WeatherHumidity = { humidity: HTMLDivElement } & WeatherClassicData
type WeatherAtmospheres = {
	atmospheres: HTMLDivElement
	pressure: WeatherPressure
	humidity: WeatherHumidity
}
type WeatherWind = {
	wind: HTMLDivElement
	header: HTMLSpanElement
	orientation: HTMLSpanElement
	speed: HTMLSpanElement
}
type WeatherDatas = {
	datas: HTMLDivElement
	temperatures: WeatherTemperatures
	atmospheres: WeatherAtmospheres
	wind: WeatherWind
}
type WeatherCardBody = {
	body: HTMLDivElement
	figure: WeatherFigure
	datas: WeatherDatas
}
export type WeatherWidgetStructure = {
	card: HTMLDivElement
	header: WeatherCardHeader
	body: WeatherCardBody
}

function createHR(): HTMLHRElement{
	const hr = document.createElement('hr')
	hr.classList.add('d-none', 'd-xl-block', 'w-100')
	
	return hr
}
function createHeader(): WeatherCardHeader {
	const header = document.createElement('h5')
	header.classList.add('card-header')
	header.innerText = 'Météo'
	
	return header
}
function createFigure(): WeatherFigure {
	const figure = document.createElement('figure')
	figure.classList.add('mx-auto', 'align-self-center', 'text-center', 'px-2')
	
	const img = document.createElement('img')
	img.classList.add('mx-auto', 'align-self-center')
	
	const caption = document.createElement('figcaption')
	caption.classList.add('font-weight-bold')
	
	figure.appendChild(img)
	figure.appendChild(caption)
	
	return {
		figure,
		icon: img,
		caption
	}
}
function createTemperature(): WeatherTemperature {
	const icon = document.createElement('span')
	icon.classList.add('mx-2', 'pr-2', 'icon', 'w-25', 'text-center', 'text-md-right')
	icon.innerText = "🌡"
	
	const data = document.createElement('span')
	data.classList.add('mr-auto', 'align-self-center', 'w-75', 'text-center', 'text-lg-left')
	
	const display = document.createElement('div')
	display.classList.add('d-flex', 'w-100')
	display.appendChild(icon)
	display.appendChild(data)
	
	const header = document.createElement('small')
	header.classList.add('text-muted', 'mx-auto', 'text-center', 'd-none', 'd-xl-block')
	header.innerText = "Température"
	
	const temperature = document.createElement('div')
	temperature.classList.add('d-flex', 'flex-column', 'justify-content-start', 'w-100')
	temperature.appendChild(header)
	temperature.appendChild(display)
	
	return {
		temperature,
		header,
		data
	}
}
function createFeeling(): WeatherFeeling {
	const icon = document.createElement('span')
	icon.classList.add('mx-2', 'pr-2', 'icon', 'w-25', 'text-center', 'text-md-right')
	icon.innerText = '😰'
	
	const data = document.createElement('span')
	data.classList.add('mr-auto', 'align-self-center', 'w-75', 'text-center', 'text-lg-left')
	
	const display = document.createElement('div')
	display.classList.add('d-flex', 'w-100')
	display.appendChild(icon)
	display.appendChild(data)
	
	const header = document.createElement('small')
	header.classList.add('text-muted', 'mx-auto', 'text-center', 'd-none', 'd-xl-block')
	header.innerText = "Température ressentie"
	
	const feeling = document.createElement('div')
	feeling.classList.add('d-flex', 'flex-column', 'justify-content-start', 'w-100')
	feeling.appendChild(header)
	feeling.appendChild(display)
	
	return {
		feeling,
		header,
		data
	}
}
function createTemperatures(): WeatherTemperatures {
	const temperatures = document.createElement('div')
	temperatures.classList.add('d-flex', 'flex-column', 'flex-md-row', 'justify-content-around')
	
	const temperature = createTemperature()
	const feeling = createFeeling()
	
	temperatures.appendChild(temperature.temperature)
	temperatures.appendChild(feeling.feeling)
	
	return {
		temperatures,
		temperature,
		feeling
	}
}
function createPressure(): WeatherPressure {
	const icon = document.createElement('span')
	icon.classList.add('mx-2', 'pr-2', 'icon', 'w-25', 'text-center', 'text-md-right')
	icon.innerText = '⇊'
	
	const data = document.createElement('span')
	data.classList.add('mr-auto', 'align-self-center', 'w-75', 'text-center', 'text-lg-left')
	
	const display = document.createElement('div')
	display.classList.add('d-flex', 'w-100')
	display.appendChild(icon)
	display.appendChild(data)
	
	const header = document.createElement('small')
	header.classList.add('text-muted', 'mx-auto', 'text-center', 'd-none', 'd-xl-block')
	header.innerText = "Pression atmosphérique"
	
	const pressure = document.createElement('div')
	pressure.classList.add('d-flex', 'flex-column', 'justify-content-start', 'w-100')
	pressure.appendChild(header)
	pressure.appendChild(display)
	
	return {
		pressure,
		header,
		data
	}
}
function createHumidity(): WeatherHumidity {
	const icon = document.createElement('span')
	icon.classList.add('mx-2', 'pr-2', 'icon', 'w-25', 'text-center', 'text-md-right')
	icon.innerText = '💧'
	
	const data = document.createElement('span')
	data.classList.add('mr-auto', 'align-self-center', 'w-75', 'text-center', 'text-lg-left')
	
	const display = document.createElement('div')
	display.classList.add('d-flex', 'w-100')
	display.appendChild(icon)
	display.appendChild(data)
	
	const header = document.createElement('small')
	header.classList.add('text-muted', 'mx-auto', 'text-center', 'd-none', 'd-xl-block')
	header.innerText = "Humidité"
	
	const humidity = document.createElement('div')
	humidity.classList.add('d-flex', 'flex-column', 'justify-content-start', 'w-100')
	humidity.appendChild(header)
	humidity.appendChild(display)
	
	return {
		humidity,
		header,
		data
	}
}
function createAtmospheres(): WeatherAtmospheres {
	const atmospheres = document.createElement('div')
	atmospheres.classList.add('d-flex', 'flex-column', 'flex-md-row', 'justify-content-around')
	
	const pressure = createPressure()
	const humidity = createHumidity()
	
	atmospheres.appendChild(pressure.pressure)
	atmospheres.appendChild(humidity.humidity)
	
	return {
		atmospheres,
		pressure,
		humidity
	}
}
function createWind(): WeatherWind {
	const icon = document.createElement('span')
	icon.classList.add('mx-2', 'pr-2', 'icon', 'text-center', 'text-md-right')
	icon.innerText = '🍃'
	
	const orientation = document.createElement('span')
	orientation.classList.add('ml-2', 'align-self-center')
	
	const speed = document.createElement('span')
	speed.classList.add('ml-3', 'pl-3', 'align-self-center', 'border-left', 'border-secondary')
	
	const data = document.createElement('div')
	data.classList.add('d-flex')
	data.appendChild(orientation)
	data.appendChild(speed)
	
	const display = document.createElement('div')
	display.classList.add('d-flex')
	display.appendChild(icon)
	display.appendChild(data)
	
	const header = document.createElement('small')
	header.classList.add('text-muted', 'mx-auto', 'text-center', 'd-none', 'd-xl-block')
	header.innerText = "Vent"
	
	const wind = document.createElement('div')
	wind.classList.add('d-flex', 'flex-column', 'justify-content-start')
	wind.appendChild(header)
	wind.appendChild(display)
	
	return {
		wind,
		header,
		orientation,
		speed
	}
}
function createDatas(): WeatherDatas {
	const temperatures = createTemperatures()
	const atmospheres = createAtmospheres()
	const wind = createWind()
	
	const datas = document.createElement('div')
	datas.classList.add('d-flex', 'flex-column', 'flex-grow-1', 'justify-content-between')
	datas.appendChild(temperatures.temperatures)
	datas.appendChild(createHR())
	datas.appendChild(atmospheres.atmospheres)
	datas.appendChild(createHR())
	datas.appendChild(wind.wind)
	
	return {
		datas,
		temperatures,
		atmospheres,
		wind
	}
}
function createBody(): WeatherCardBody {
	const figure = createFigure()
	const datas = createDatas()
	
	const body = document.createElement('div')
	body.classList.add('card-body', 'p-2', 'd-flex', 'flex-column', 'flex-md-row', 'h-100')
	body.appendChild(figure.figure)
	body.appendChild(datas.datas)
	
	return {
		body,
		figure,
		datas
	}
}

export default function createWidget(elem: HTMLDivElement, bgColor?: BGColor, fgColor?: FGColor): WeatherWidgetStructure {
	const cardHeader = createHeader()
	const cardBody = createBody()
	
	if (!elem.classList.contains('card'))
		elem.classList.add('card')
	
	applyColors(elem, bgColor, fgColor)
	
	elem.appendChild(cardHeader)
	elem.appendChild(cardBody.body)
	
	return {
		card: elem,
		header: cardHeader,
		body: cardBody
	}
}
