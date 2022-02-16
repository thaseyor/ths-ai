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
    .replace(/[^а-яa-zё\s]/gi, '')
    .replace(/\s+/g, ' ')
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
