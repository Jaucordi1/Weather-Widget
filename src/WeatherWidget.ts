import 'geolocation-storage'
import { LOG } from './main'
import createLoader from "./components/loader"
import createLocateMeBtn from "./components/locate-me-btn"
import {ICON_URL, retrieveWeather, WeatherResponse, WeatherResponseRain, WeatherResponseSnow} from "./weather"
import createWidget, {WeatherWidgetStructure} from "./views/card"
import {FGColor} from "./utils"

function sameCoords(pos1: Position, pos2: Position){
	return pos1.coords.latitude === pos2.coords.latitude && pos1.coords.longitude === pos2.coords.longitude
}
function clearClassList(elem: HTMLElement, ...exclude: string[]){
	elem.classList.forEach(c => {
		if (exclude && exclude.indexOf(c) === -1)
			elem.classList.remove(c)
	})
}
function ucfirst(str: string): string {
	switch (str.length){
		case 0:
			return str
		case 1:
			return str.toUpperCase()
		default:
			return str.substring(0, 1).toUpperCase() + str.substring(1)
	}
}

type TemperatureData = {
	actual: number
	min: number
	max: number
	feeling: number
}
type WindData = {
	speed: number
	orientation: number
}

type WeatherNumbers = {
	temperature: TemperatureData
	wind: WindData
	cloudiness?: number
	rain?: WeatherResponseRain
	snow?: WeatherResponseSnow
	humidity: number
	pressure: number
	visibility: number
}
type WeatherData = {
	icon: string
	name: string
	description: string
	city: string
}

function inRange(test: number, min: number, max: number, roll?: number): boolean {
	if (roll !== undefined){
		if (test < roll) return test <= max && test >= min
		else if (test > roll) return (test - roll) <= max
		else return true
	}
	
	let mi, ma
	if (min > max) {
		mi = max
		ma = min
	} else {
		mi = min
		ma = max
	}
	
	return test >= mi && test <= ma
}
function getCardinalFromDegrees(deg: number) {
	if (inRange(deg, 348.75, 11.25, 360))
		return "N"
	else if (inRange(deg, 11.25, 33.75, 360))
		return "NNE"
	else if (inRange(deg, 33.75, 56.25, 360))
		return "NE"
	else if (inRange(deg, 56.25, 78.75, 360))
		return "ENE"
	else if (inRange(deg, 78.75, 101.25, 360))
		return "E"
	else if (inRange(deg, 101.25, 123.75, 360))
		return "ESE"
	else if (inRange(deg, 123.75, 146.25, 360))
		return "SE"
	else if (inRange(deg, 146.25, 168.75, 360))
		return "SSE"
	else if (inRange(deg, 168.75, 191.25, 360))
		return "S"
	else if (inRange(deg, 191.25, 213.75, 360))
		return "SSW"
	else if (inRange(deg, 213.75, 236.25, 360))
		return "SW"
	else if (inRange(deg, 236.25, 258.75, 360))
		return "WSW"
	else if (inRange(deg, 258.75, 281.25, 360))
		return "W"
	else if (inRange(deg, 281.25, 303.75, 360))
		return "WNW"
	else if (inRange(deg, 303.75, 326.25, 360))
		return "NW"
	else if (inRange(deg, 326.25, 348.75, 360))
		return "NNW"
	else
		return 'UNKNOWN'
}

class Weather{
	private _originalData: WeatherResponse
	private _numbers: WeatherNumbers
	private _weathers: WeatherData
	private _dataCalculation: number
	
	constructor(data: WeatherResponse) {
		this._originalData = data
		this._numbers = {
			temperature: {
				min: data.main.temp_min,
				max: data.main.temp_max,
				actual: data.main.temp,
				feeling: data.main.feels_like
			},
			wind: {
				speed: data.wind.speed,
				orientation: data.wind.deg
			},
			cloudiness: data.clouds?.all,
			rain: data.rain,
			snow: data.snow,
			humidity: data.main.humidity,
			pressure: data.main.pressure,
			visibility: data.visibility
		}
		this._weathers = {
			icon: data.weather[0].icon,
			name: data.weather[0].main,
			description: data.weather[0].description,
			city: data.name
		}
		this._dataCalculation = data.dt
	}
	
	get humidity(): string {
		return `${this._numbers.humidity} %`
	}
	get pressure(): string {
		return `${this._numbers.pressure} hPa`
	}
	get rain(): string {
		if (this._numbers.rain === undefined) return ''
		
		let one, three
		if (this._numbers.rain["3h"] !== undefined)
			one = `${this._numbers.rain["3h"]} mm de pluie durant les 3 dernières heures`
		if (this._numbers.rain["1h"] !== undefined)
			three = `${this._numbers.rain["1h"]}`
		
		if (three && one)
			return `${three}\n${one}`
		else if (three)
			return three
		else if (one)
			return one
		else
			return ''
	}
	get windSpeed(): string{
		return `${this._numbers.wind.speed} m/s`
	}
	get windOrientation(): string {
		return getCardinalFromDegrees(this._numbers.wind.orientation)
	}
	get wind(): string{
		return `Vent ${this.windOrientation} de ${this.windSpeed}`
	}
	get clouds(): string{
		return `${this._numbers.cloudiness} %`
	}
	get category(): string {
		return this._weathers.name
	}
	get description(): string {
		return this._weathers.description
	}
	get icon(): string{
		return ICON_URL(this._weathers.icon)
	}
	get city(): string {
		return this._weathers.city
	}
	
	get temperature(): string {
		return `${this._numbers.temperature.actual} °C`
	}
	get temperatureMin(): string {
		return `${this._numbers.temperature.min} °C`
	}
	get temperatureMax(): string {
		return `${this._numbers.temperature.max} °C`
	}
	get temperatureFeelsLike(): string {
		return `${this._numbers.temperature.feeling} °C`
	}
	
	get originalJSON(): WeatherResponse {
		return this._originalData
	}
	set originalJSON(json: WeatherResponse) {
		this._originalData = json
		this._numbers = {
			temperature: {
				min: json.main.temp_min,
				max: json.main.temp_max,
				actual: json.main.temp,
				feeling: json.main.feels_like
			},
			wind: {
				speed: json.wind.speed,
				orientation: json.wind.deg
			},
			cloudiness: json.clouds?.all,
			rain: json.rain,
			snow: json.snow,
			humidity: json.main.humidity,
			pressure: json.main.pressure,
			visibility: json.visibility
		}
		this._weathers = {
			icon: json.weather[0].icon,
			name: json.weather[0].main,
			description: json.weather[0].description,
			city: json.name
		}
		this._dataCalculation = json.dt
	}
	
	toString() {
		return JSON.stringify(this._originalData)
	}
}
class WeatherWidget {
	private _geolocator?: PositionSubscriber
	
	private _weather?: WeatherResponse
	private _timer?: number
	private _fetchDelay: number
	
	private _lastWeather?: Weather
	private _lastFetch?: number
	
	private _card: HTMLDivElement
	private _elements: {
		loader: {
			container: HTMLDivElement
			loader: HTMLDivElement
			message: HTMLSpanElement
		}
		card: WeatherWidgetStructure
		locateMeBtn: HTMLButtonElement
	}

	constructor(element: HTMLDivElement, fetchDelay: number = 1000 * 60 * 5) {
		this._card = element
		this._elements = {
			loader: createLoader(),
			card: createWidget(this._card, 'dark', 'light'),
			locateMeBtn: createLocateMeBtn(this.handlePermBtnClick)
		}
		this._fetchDelay = fetchDelay
		this.init()
	}
	
	private init() {
		LOG("Initialisation du module météo…")
		
		// Sending info to client
		this.displayLoader("Initialisation du widget météo…", 'info')
		
		// Getting previously fetched weather into runtime
		const weather = localStorage.getItem('weather')
		if (weather !== null)
			this._lastWeather = new Weather(JSON.parse(atob(weather)))
		
		// Getting previously saved weather fetch time into runtime
		const weatherFetch = localStorage.getItem('wtps')
		if (weatherFetch !== null)
			this._lastFetch = parseInt(weatherFetch, 10)
	}
	private handlePermBtnClick = async (ev: MouseEvent) => {
		LOG("'GeolocateMe' button has been clicked!")
		ev.preventDefault()
		this.start()
	}
	
	get geolocator(): PositionSubscriber {
		if (this._geolocator === undefined)
			this._geolocator = window.WatchPosition({
				timeout: 5000,
				enableHighAccuracy: true,
				maximumAge: 1000 * 60
			})
		
		return this._geolocator
	}
	get lastWeather(): Weather | null {
		if (this._lastWeather !== undefined)
			return this._lastWeather
		
		const savedJSON = localStorage.getItem('weather')
		if (savedJSON === null) return null
		
		let weather: WeatherResponse
		try {
			weather = JSON.parse(atob(savedJSON))
		} catch (e) {
			return null
		}
		
		this._lastWeather = new Weather(weather)
		return this._lastWeather
	}
	get lastFetch(): number | null {
		if (this._lastFetch !== undefined)
			return this._lastFetch
		
		const wtps = localStorage.getItem('wtps')
		if (wtps === null) return null
		
		this._lastFetch = parseInt(wtps, 10)
		
		return this._lastFetch
	}
	get canFetch(): boolean {
		const lastWeatherFetch = this.lastFetch
		
		// Never fetched weather
		if (lastWeatherFetch === null) return true
		
		// Already fetched weather
		const now = new Date().getTime()
		const diff = now - lastWeatherFetch
		LOG(
			parseInt((diff / 1000 / 60).toString(10), 10),
			'minutes',
			parseInt((diff / 1000).toString(10), 10) % 60,
			'seconds',
			"since last weather's fetch"
		)
		
		return diff > 1000 * 60 * 5
	}
	get needFetch(): boolean {
		// If no previous position
		// OR
		// If previous position and new position are the same
		// AND
		// last weather fetch is long enough
		if (this.geolocator.previousLocation === undefined) return this.canFetch
		
		// If position changed since the last weather fetch
		const pos = this.geolocator.savedLocation
		if (pos === undefined) return false
		
		if (sameCoords(this.geolocator.previousLocation, pos)) return this.canFetch
		else return true
	}
	
	onPositionChange = (pos: Position, prevPos?: Position) => {
		LOG("Receiving position update")
		if (this.needFetch)
			this.fetchWeather(pos.coords.latitude, pos.coords.longitude)
		else
			this.startTimer()
		
		if (this.lastWeather !== null)
			this.displayWeather(this.lastWeather)
	}
	shouldWeatherFetch = () => {
		LOG("Time out!")
		if (!this.needFetch) return this.restartTimer()
		
		if (this.geolocator.savedLocation !== undefined)
			this.fetchWeather(this.geolocator.savedLocation.coords.latitude, this.geolocator.savedLocation.coords.longitude)
	}
	
	fetchWeather = (lat: number, lng: number) => {
		LOG("Fetching weather…")
		this.displayLoader("Récupération des informations météorologiques…", 'info')
		const now = new Date().getTime()
		this._lastFetch = now
		localStorage.setItem('wtps', now.toString(10))
		retrieveWeather('fr', {
			name: 'lat',
			value: lat
		}, {
			name: 'lon',
			value: lng
		})
			.then(weather => {
				LOG("Weather fetched!", weather)
				this.saveWeather(weather)
				this.restartTimer()
			})
			.catch(e => {
				this.displayLoader("Impossible de contacter le service météo.")
				this._elements.loader.loader.style.display = 'none'
			})
	}
	saveWeather = (weather: WeatherResponse) => {
		LOG("Saving weather…")
		localStorage.setItem('weather', btoa(JSON.stringify(weather)))
		if (weather.weather !== undefined && weather.weather.length > 0) {
			// console.info('Weather:', res)
			if (this._lastWeather !== undefined)
				this._lastWeather.originalJSON = weather
			else
				this._lastWeather = new Weather(weather)
			this.displayWeather(this._lastWeather)
		} else
			console.error('No weather found!')
		LOG("Weather saved!")
	}
	
	empty = () => {
		this._elements.card.body.body.innerHTML = ""
	}
	displayLoader = (message?: string, color?: FGColor) => {
		this._elements.card.header.innerText = 'Météo'
		if (!this._elements.card.body.body.contains(this._elements.loader.container)){
			this.empty()
			this._elements.card.body.body.appendChild(this._elements.loader.container)
		}
		if (message)
			this._elements.loader.message.innerText = message
		if (color){
			clearClassList(this._elements.loader.message, 'mx-auto')
			this._elements.loader.message.classList.add(`text-${color}`)
		}
		this._elements.loader.loader.style.display = 'inline'
	}
	displayGeolocateMeBtn = () => {
		this._elements.card.header.innerText = 'Météo'
		this.empty()
		this._elements.card.body.body.appendChild(this._elements.locateMeBtn)
	}
	displayWeather = (weather: Weather) => {
		// console.info('Weather:', weather)
		
		this._elements.card.header.innerText = `Météo de ${weather.city}`
		
		if (!this._elements.card.body.body.contains(this._elements.card.body.figure.figure)){
			this.empty()
			this._elements.card.body.body.appendChild(this._elements.card.body.figure.figure)
			this._elements.card.body.body.appendChild(this._elements.card.body.datas.datas)
		}
		
		// Display icon
		const iconUrl = weather.icon
		if (this._elements.card.body.figure.icon.src !== iconUrl) {
			this._elements.card.body.figure.icon.src = iconUrl
			this._elements.card.body.figure.icon.title = weather.category
		}
		
		// Display weather
		const desc = ucfirst(weather.description)
		if (this._elements.card.body.figure.caption.innerText !== desc)
			this._elements.card.body.figure.caption.innerText = desc
		
		// Display temperatures
		if (this._elements.card.body.datas.temperatures.temperature.data.innerText !== weather.temperature)
			this._elements.card.body.datas.temperatures.temperature.data.innerText = weather.temperature
		if (this._elements.card.body.datas.temperatures.feeling.data.innerText !== weather.temperatureFeelsLike)
			this._elements.card.body.datas.temperatures.feeling.data.innerText = weather.temperatureFeelsLike
		
		// Display wind
		if (this._elements.card.body.datas.wind.orientation.innerText !== weather.windOrientation)
			this._elements.card.body.datas.wind.orientation.innerText = weather.windOrientation
		if (this._elements.card.body.datas.wind.speed.innerText !== weather.windSpeed)
			this._elements.card.body.datas.wind.speed.innerText = weather.windSpeed
		
		// Display pressure
		if (this._elements.card.body.datas.atmospheres.pressure.data.innerText !== weather.pressure)
			this._elements.card.body.datas.atmospheres.pressure.data.innerText = weather.pressure
		
		// Display humidity
		if (this._elements.card.body.datas.atmospheres.humidity.data.innerText !== weather.humidity)
			this._elements.card.body.datas.atmospheres.humidity.data.innerText = weather.humidity
	}
	
	public start() {
		this.displayLoader("Le widget météo attend de connaître votre localisation.", 'warning')
		this.geolocator.subscribe(this.onPositionChange)
	}
	public stop = () => {
		this.geolocator.unsubscribe(this.onPositionChange)
		this.stopTimer()
		this.displayGeolocateMeBtn()
	}
	
	private startTimer = () => {
		if (this._timer !== undefined) return
		LOG("Timer started!")
		this._timer = setTimeout(this.shouldWeatherFetch, 1000 * 60 * 5)
	}
	private stopTimer = () => {
		if (this._timer !== undefined) {
			LOG("Timer stopped!")
			clearInterval(this._timer)
			this._timer = undefined
		}
	}
	private restartTimer = () => {
		this.stopTimer()
		this.startTimer()
	}
}

export default WeatherWidget
