const APP_ID = 'YOUR_APP_ID'
const API = 'https://api.openweathermap.org'
export const ICON_URL = (code: string) => `http://openweathermap.org/img/wn/${code}@2x.png`

type ENDPOINTS = { [key: string]: string }
const ENDPOINTS: ENDPOINTS = {
	current: '/data/2.5/weather'
}

type LANG = 'fr' | 'en' | 'es'

function constructApiCallUrl(endpoint: keyof ENDPOINTS, lang: LANG, ...params: { name: string, value: string | number }[]) {
	let url = API
	url += ENDPOINTS[endpoint]
	url += `?appid=${APP_ID}&lang=${lang}&units=metric`
	params.forEach(param => url += `&${param.name}=${encodeURI(param.value.toString(10))}`)
	return url
}

interface HumanWeatherOptions {
	city: string
	state?: string
	country_code?: string
}
export async function retrieveWeatherHumanly(lang: LANG, options: HumanWeatherOptions) {
	const loc = (Object.getOwnPropertyNames(options) as [keyof HumanWeatherOptions])
		.filter(param => options[param] !== undefined && options[param] !== "")
		.map(param => options[param])
		.join(',')
	return retrieveWeather(lang, {name: 'q', value: loc})
}
export async function retrieveWeather(lang: LANG, ...params: { name: string; value: string | number }[]): Promise<WeatherResponse> {
	LOG('Retriving weather')
	const url = constructApiCallUrl('current', lang, ...params)
	return fetch(url).then(r => r.json())
}

type WeatherResponseCoord = {
	lon: number
	lat: number
}
type WeatherResponseWeather = {
	id: number
	main: string
	description: string
	icon: string
}
type WeatherResponseMain = {
	temp: number
	feels_like: number
	temp_min: number
	temp_max: number
	pressure: number
	humidity: number
}

type WeatherResponseWind = {
	speed: number
	deg: number
}

type WeatherResponseClouds = {
	all: number
}

export type WeatherResponseRain = {
	"1h"?: number
	"3h"?: number
}
export type WeatherResponseSnow = WeatherResponseRain

type WeatherResponseSys = {
	type: number
	id: number
	message: number
	country: string
	sunrise: number
	sunset: number
}
export interface WeatherResponse{
	coord: WeatherResponseCoord
	weather: WeatherResponseWeather[]
	base: string
	main: WeatherResponseMain
	visibility: number
	wind: WeatherResponseWind
	clouds?: WeatherResponseClouds
	rain?: WeatherResponseRain
	snow?: WeatherResponseSnow
	dt: number
	sys: WeatherResponseSys
	timezone: number
	id: number
	name: string
	cod: number
}
