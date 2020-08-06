update = function(data) {
	window.PotData = {
		...PotData,
		...data,
	}

	// background color
	const backgroundColor = PotData.backgroundColor
	document.getElementById('generated').style.background = backgroundColor
	document.getElementById('preview').style.background = backgroundColor
	document.getElementById('background-color-picker').value = backgroundColor
	document.getElementById('background-hex-input').value = backgroundColor.replace('#', '')

	// background gradient
	const gradientLeft = PotData.gradientLeft
	const gradientRight = PotData.gradientRight
	if (gradientLeft && gradientRight) {
		document.getElementById('generated').style.background = 'none'
		document.getElementById('preview').style.background = 'none'
		const gradientStyle = 'linear-gradient(to top right, ' + gradientLeft + ', ' + gradientRight + ')'
		document.getElementById('preview').style.background = gradientStyle
		document.getElementById('generated').style.background = gradientStyle

		document.getElementById('gradient-left-color-picker').value = gradientLeft
		document.getElementById('gradient-right-color-picker').value = gradientRight
		document.getElementById('gradient-left-hex-input').value = gradientLeft.replace('#', '')
		document.getElementById('gradient-right-hex-input').value = gradientRight.replace('#', '')
	}

	// icon color
	const iconColor = PotData.color
	document.getElementById('generated-icon').style.color = iconColor
	document.getElementById('preview-icon').style.color = iconColor
	document.getElementById('icon-color-picker').value = iconColor
	document.getElementById('icon-hex-input').value = iconColor.replace('#', '')

	// icon size
	const iconSize = PotData.size
	document.getElementById('preview-icon-wrap').style.width = iconSize + 'px'
	document.getElementById('preview-icon-wrap').style.height = iconSize + 'px'
	document.getElementById('generated-icon-wrap').style.width = (parseInt(iconSize, 10) * 4) + 'px';
	document.getElementById('generated-icon-wrap').style.height = (parseInt(iconSize, 10) * 4) + 'px';
	document.getElementById('icon-size').value = iconSize

	// icon
	const icon = PotData.icon
	const prefix = PotData.prefix
	const showIcon = PotData.showIcon
	let iconClassName = prefix + ' fa-' + icon
	const rotation = PotData.rotation

	if (rotation >= 0) {
		if (rotation > 0) iconClassName += ' fa-rotate-' + rotation
		document.getElementById('rotation').innerHTML = rotation + '&deg;'
	}

	Array.from(document.getElementsByClassName('preview__controls-icon-changer-button')).forEach(function(element) {
		element.disabled = prefix === 'fab'
	})

	document.getElementById('preview-icon-wrap').style.display = showIcon ? 'block' : 'none'
	document.getElementById('generated-icon-wrap').style.display = showIcon ? 'block' : 'none'
	document.getElementById('toggle-icon-icon').className = 'fas fa-toggle-' + (showIcon ? 'on' : 'off')

	document.getElementById('generated-icon').className = iconClassName
	document.getElementById('preview-icon').className = iconClassName

	// background image
	const backgroundImage = PotData.image

	if (backgroundImage && backgroundImage !== 'null') {
		document.getElementById('preview-overlay-image').style.display = 'block'
		document.getElementById('preview-overlay-image').src = backgroundImage
		document.getElementById('generated-overlay-image').style.display = 'block'
		document.getElementById('generated-overlay-image').src = backgroundImage
	} else {
		document.getElementById('preview-overlay-image').style.display = 'none'
		document.getElementById('generated-overlay-image').style.display = 'none'
	}

	// text
	const text = PotData.text
	const textColor = PotData.textColor ? PotData.textColor : MPIGConfig.light
	document.getElementById('text-color-picker').value = textColor
	document.getElementById('text-hex-input').value = textColor.replace('#', '')
	if (text != null) {
		document.getElementById('preview-image-text').innerHTML = text
		document.getElementById('preview-image-text').style.color = textColor
		document.getElementById('generated-image-text').innerHTML = text
		document.getElementById('generated-image-text').style.color = textColor
		document.getElementById('text-input').value = text
	}
}

changeSizeFromInput = function() {
	changeSize(parseInt(document.getElementById('icon-size').value, 10))
}

changeSize = function(result) {
	if (result > 200) { 
		result = 200
	} else if (result < 0) {
		result = 0
	}

	update({ size: result })
}

increaseSize = function() { changeSize(parseInt(PotData.size, 10) + 25) }
decreaseSize = function() { changeSize(parseInt(PotData.size, 10) - 25) }

rotate = function(change) {
	let result = parseInt(PotData.rotation ? PotData.rotation : 0, 10) + change
	if (result > 270) {
		result = 0
	} else if (result === -90) {
		result = 270
	} else if (result === -180) {
		result = 180
	}
	update({ rotation: result })
}

rotateLeft = function() { rotate(-90) }
rotateRight = function() { rotate(90) }

contrastChangeEnabled = function() {
	return document.getElementById('calc-contrast').checked
}

setBackgroundColor = function(color, skipContrast) {
	update({
		backgroundColor: color,
		image: null,
		gradientLeft: null,
		gradientRight: null,
		color: contrastChangeEnabled ? getIconColorFromBackground(color) : PotData.color,
	})
}

setGradientColor = function(left, right) {
	update({
		gradientLeft: left,
		gradientRight: right,
		image: null,
	})
}

setBackgroundColorFromPicker = function() {
	setBackgroundColor(document.getElementById('background-color-picker').value)
}

setBackgroundColorFromInput = function() {
	setBackgroundColor('#' + document.getElementById('background-hex-input').value)
}

setBackgroundImage = function(backgroundImage, setToDarkIcon) {
	update({
		image: backgroundImage,
		gradientLeft: null,
		gradientRight: null,
		color: contrastChangeEnabled() && setToDarkIcon ? MPIGConfig.dark : MPIGConfig.light,
	})
}

setText = function() {
	update({
		text: document.getElementById('text-input').value,
	})
}

setIcon = function(icon, prefix) {
	update({
		icon: icon,
		prefix: prefix,
		showIcon: true,
	})
}

setIconColor = function(iconColor) {
	update({ color: iconColor })
}

setIconPrefix = function(prefix) {
	update({
		prefix: prefix,
	})
}

setTextColor = function(color) {
	update({ textColor: color })
}

getIconColorFromBackground = function(bgColor) {
   var nThreshold = 105;
   var components = getRGBComponents(bgColor);
   var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

   return (255 - bgDelta) < nThreshold ? MPIGConfig.dark : MPIGConfig.light;
}

getRGBComponents = function(color) {
    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);

    return {
       R: parseInt(r, 16),
       G: parseInt(g, 16),
       B: parseInt(b, 16)
    };
}

setIconColorFromPicker = function() {
	setIconColor(document.getElementById('icon-color-picker').value)
}

setTextColorFromPicker = function() {
	setTextColor(document.getElementById('text-color-picker').value)
}

setIconColorFromInput = function() {
	setIconColor('#' + document.getElementById('icon-hex-input').value)
}

setTextColorFromInput = function() {
	setTextColor('#' + document.getElementById('text-hex-input').value)
}

setGradientFromPickers = function() {
	setGradientColor(
		document.getElementById('gradient-left-color-picker').value,
		document.getElementById('gradient-right-color-picker').value
	)
}

setGradientFromInputs = function() {
	setGradientColor(
		document.getElementById('gradient-left-hex-input').value ? '#' + document.getElementById('gradient-left-hex-input').value : null,
		document.getElementById('gradient-right-hex-input').value ? '#' + document.getElementById('gradient-right-hex-input').value : null,
	)
}

search = function() {
	const search = document.getElementById('icon-search').value.toLowerCase()
	const filters = [document.querySelector('input[name="icon-filter"]:checked').value]

	Array.from(document.getElementsByClassName('icons__single')).forEach(function(element) {
		const keywordMatch = element.dataset.keywords.includes(search)
		const filterMatch = filters.includes(element.dataset.prefix)
		element.style.display = keywordMatch && filterMatch ? 'block' : 'none'
	})
}

clearHistory = function() {
	window.localStorage.clear()
	document.getElementById('history').innerHTML = ''
}

getHistory = function() {
	return JSON.parse(window.localStorage.getItem('MPIG-history')) || []
}

loadHistoryCard = function(e) {
	if (window.fathom) window.fathom.trackGoal('8BQURW72', 0);
	loadCard(e)
}

loadExampleCard = function(e) {
	if (window.fathom) window.fathom.trackGoal('OI8A0MWO', 0);
	loadCard(e)
}

loadCard = function(e) {
	let data = e.target.dataset
	if (e.target.className !== 'example-card') { // clicked the icon not the card itself
		data = e.target.closest('.example-card').dataset
	}
	update({
		icon: data.icon,
		prefix: data.prefix,
		size: data.size,
		color: data.color,
		backgroundColor: data.background,
		image: data.image != null ? data.image : '',
		gradientLeft: data.gradientLeft,
		gradientRight: data.gradientRight,
		rotation: data.rotation ? data.rotation : 0,
		text: data.text != null ? data.text : '',
		textColor: data.textColor != null ? data.textColor : MPIGConfig.light,
		showIcon: data.showIcon === 'false' ? false : true,
	})
}

addHistoryCard = function(data) {
	let card = document.createElement('div')
	card.className = 'example-card'
	card.style.background = data.backgroundColor
	if (data.gradientLeft && data.gradientRight && data.gradientLeft !== 'null' && data.gradientRight !== 'null') {
		card.style.background = 'linear-gradient(to top right, ' + data.gradientLeft + ', ' + data.gradientRight + ')'
		card.dataset.gradientLeft = data.gradientLeft
		card.dataset.gradientRight = data.gradientRight
	}
	if (data.rotation) {
		card.dataset.rotation = data.rotation
	}
	card.dataset.background = data.backgroundColor
	card.dataset.color = data.color
	card.dataset.icon = data.icon
	card.dataset.prefix = data.prefix
	card.dataset.size = data.size
	card.dataset.image = data.image != null ? data.image : '',
	card.dataset.text = data.text != null ? data.text : ''
	card.dataset.textColor = data.textColor
	card.dataset.showIcon = data.showIcon
	card.onclick = loadHistoryCard

	if (data.image) {
		let image = document.createElement('img')
		image.src = data.image
		card.appendChild(image)
	}

	if (data.text != null) {
		let text = document.createElement('p')
		text.className = 'example-card-text image-text'
		text.innerHTML = data.text
		text.style.color = data.textColor
		card.appendChild(text)
	}

	let icon = document.createElement('div')
	icon.className = 'example-card-icon'
	let i = document.createElement('i')
	i.className = data.prefix + ' fa-' + data.icon
	if (data.rotation) {
		i.className += ' fa-rotate-' + data.rotation
	}
	if (!data.showIcon) {
		icon.style.display = 'none'
	}
	i.style.color = data.color
	icon.appendChild(i)
	card.appendChild(icon)

	const historyBlock = document.getElementById('history')
	historyBlock.insertBefore(card, historyBlock.childNodes[0])
}

loadHistory = function() {
	getHistory().reverse().map(h => addHistoryCard(h))
}

showHistory = function() {
	const cards = Array.from(document.getElementsByClassName('example-card'))
	if (cards.length === 10) {
		const oldest = cards.pop()
		oldest.parentNode.removeChild(oldest)
	}
	addHistoryCard(PotData)
}

updateHistory = function() {
	try {
		let history = getHistory()
		if (history.length === 10) {
			history.pop()
		}
		history.unshift(PotData)
		window.localStorage.setItem('MPIG-history', JSON.stringify(history))
		showHistory(history)
	} catch (e) {}
}

document.getElementById('background-color-picker').addEventListener("input", setBackgroundColorFromPicker, false)
document.getElementById('icon-color-picker').addEventListener("input", setIconColorFromPicker, false)
document.getElementById('gradient-left-color-picker').addEventListener("input", setGradientFromPickers, false)
document.getElementById('gradient-right-color-picker').addEventListener("input", setGradientFromPickers, false)
document.getElementById('text-color-picker').addEventListener("input", setTextColorFromPicker, false)

document.getElementById('background-hex-input').addEventListener("keyup", setBackgroundColorFromInput, false)
document.getElementById('icon-hex-input').addEventListener("keyup", setIconColorFromInput, false)
document.getElementById('gradient-left-hex-input').addEventListener("keyup", setGradientFromInputs, false)
document.getElementById('gradient-right-hex-input').addEventListener("keyup", setGradientFromInputs, false)
document.getElementById('text-hex-input').addEventListener("keyup", setTextColorFromInput, false)

document.getElementById('icon-size').addEventListener("change", changeSizeFromInput, false)
document.getElementById('icon-size').addEventListener("keyup", changeSizeFromInput, false)

document.getElementById('download').onclick = function() {
  domtoimage.toBlob(document.getElementById('generated'))
      .then(function (blob) {
      	// doing this twice fixes a bug where an image background wouldn't show on first download
      	domtoimage.toBlob(document.getElementById('generated'))
      	    .then(function (blob) {
      	        window.saveAs(blob, 'monzo-pot-image-' + window.PotData.icon + '-' + PotData.backgroundColor.replace('#', '') + '.png');
      	        updateHistory()
      	    });
      });

  if (window.fathom) window.fathom.trackGoal('QAZHZCEC', 0);
}

document.getElementById('random').onclick = function() {
	const icons = Array.from(document.getElementsByClassName('icons__single'))
	const randomElement = icons[Math.floor(Math.random() * icons.length)]
	const randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)

	update({
		icon: randomElement.dataset.key,
		prefix: randomElement.dataset.prefix,
		size: PotData.size,
		color: getIconColorFromBackground(randomColor),
		backgroundColor: randomColor,
		image: null,
		gradientLeft: null,
		gradientRight: null,
		rotation: 0,
	})
}

document.getElementById('toggle-icon').onclick = function() {
	update({
		showIcon: !PotData.showIcon,
	})
}

document.getElementById('random-gradient').onclick = function() {
	const randomColor = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)
	const randomColor2 = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)

	update({
		image: null,
		gradientLeft: randomColor,
		gradientRight: randomColor2,
	})
}