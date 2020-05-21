const createLoader = () => {
	const loaderSrOnly = document.createElement('span')
	loaderSrOnly.classList.add('sr-only')
	loaderSrOnly.innerText = "Loading…"
	
	const loader = document.createElement('div')
	loader.classList.add('spinner-border', 'text-primary')
	loader.appendChild(loaderSrOnly)
	
	const message = document.createElement('span')
	
	const flexBox = document.createElement('div')
	flexBox.classList.add('d-flex', 'justify-content-center')
	flexBox.appendChild(loader)
	flexBox.appendChild(message)
	
	return {
		container: flexBox,
		loader,
		message
	}
}

export default createLoader
