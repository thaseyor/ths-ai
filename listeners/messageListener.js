import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const brain = require('brain.js')

import {
  random_id,
  log,
  peerFromMsg,
  cleanText,
  debounce,
} from '#root/utils.js'

import loadNet from '#root/brain/load.js'
import api from '#root/api.js'

const net = new brain.recurrent.LSTM()
loadNet(net)

const reply = debounce(async ({ message, peer }) => {
  const input = cleanText(message)
  log(`Message: ${input}`)

  const output = net.run(input)
  log(`Output: ${output}`)

  if (!output) return

  await api.call('messages.setTyping', {
    peer,
    action: { _: 'sendMessageTypingAction' },
  })

  setTimeout(async () => {
    await Promise.all([
      api.call('messages.sendMessage', {
        peer,
        message: output,
        random_id: random_id(),
      }),
      api.call('messages.setTyping', {
        peer,
        action: { _: 'sendMessageCancelAction' },
      }),
      api.call('account.updateStatus', {
        offline: { _: 'BoolTrue' },
      }),
    ])
  }, 2500)
}, 5500)

export const messageListener = () => {
  api.on('updateShortMessage', (message) => {
    if (message.out) return // ignore outgoing messages

    const peer = peerFromMsg({
      msg_id: message.id,
      user_id: message.user_id,
    })

    // read chat history after 2 seconds
    setTimeout(
      async () => await api.call('messages.readHistory', { peer }),
      3000
    )

    reply({ message: message.message, peer })
  })
}
