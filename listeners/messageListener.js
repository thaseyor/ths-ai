import api from '#root/api.js'
import { random_id, log, peerFromMsg } from '#root/utils.js'

export const messageListener = () => {
  api.on('updateShortMessage', async (message) => {
    if (message.out) return

    log(`${message._}: ${message.message}`)

    return

    await api.call('messages.sendMessage', {
      peer: peerFromMsg({
        msg_id: message.id,
        user_id: message.user_id,
      }),
      message: 'хмм',
      random_id: random_id(),
    })
  })
}
