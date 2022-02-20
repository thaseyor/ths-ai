'use strict'

export const random_id = () =>
	Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff)

export const log = (msg) => {
	const now = new Date()
	console.log(`[${now.toISOString()}]`, msg)
}

export const peerFromMsg = ({ msg_id, user_id }) => ({
	_: 'inputPeerUserFromMessage',
	peer: {
		_: 'inputPeerSelf',
	},
	msg_id,
	user_id,
})

export const cleanText = (text) => {
	return text
		.toLowerCase()
		.replaceAll('\n', ' ')
		.replaceAll('/n', ' ')
		.replaceAll('-', ' ')
		.replaceAll(':', ' ')
		.replaceAll('ё', 'е')
		.replace(/[^а-яa-zА-ЯA-Z0-9+\s]/gi, '')
		.replace(/\s+/g, ' ')
		.toLowerCase()
		.trim()
}

export const debounce = (func, wait) => {
	let timeout

	return function executedFunction(...args) {
		const later = () => {
			timeout = null
			func(...args)
		}

		clearTimeout(timeout)

		timeout = setTimeout(later, wait)
	}
}

export const getRandomItem = (arr) => {
	return arr[Math.floor(Math.random() * arr.length)]
}

const SECOND = 1000 // milliseconds
export const getDateDiff = (start, end) => {
	const dateDifference = (end.getTime() - start.getTime()).toFixed(1) / SECOND
	return dateDifference.toFixed(1)
}

export const getPercentage = (value, maximum) => {
	return Math.round((value / maximum) * 100)
}
