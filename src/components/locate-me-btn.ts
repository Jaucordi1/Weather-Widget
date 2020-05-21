const createLocateMeBtn = (onClick: (ev: MouseEvent) => void) => {
	const permBtn = document.createElement('button')
	permBtn.innerText = 'Me localiser pour afficher la météo locale'
	permBtn.classList.add('btn', 'btn-block', 'btn-success', 'mx-auto')
	permBtn.addEventListener('click', onClick)
	
	return permBtn
}

export default createLocateMeBtn
