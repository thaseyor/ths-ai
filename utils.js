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
