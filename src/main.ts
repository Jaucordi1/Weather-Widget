import WeatherWidget from "./WeatherWidget"

const DEBUG = false
export const LOG = (...params: any) => {
	if (DEBUG)
		console.log('[WeatherWidget]', ...params)
}

function main() {
	const container: HTMLElement | null = document.getElementById('weather-widget')
	if (container === null) return LOG("Add an HTML element with an 'id' attribute value at 'weather-widget'")
	if (container.tagName !== 'DIV') return LOG("Weather-Widget container must be a 'div' tag.")
	
	const widget = new WeatherWidget(container as HTMLDivElement)
	widget.start()
}

main()
