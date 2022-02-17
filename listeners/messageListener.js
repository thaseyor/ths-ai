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

export const messageListener = () => {
  const net = new brain.recurrent.LSTM()
  loadNet(net)

  log('Net loaded')

  api.on('updateShortMessage', (message) => {
    if (message.out) return // ignore outgoing messages

    const peer = peerFromMsg({
      msg_id: message.id,
      user_id: message.user_id,
    })

    // read chat history after 2 seconds
    setTimeout(
      async () => await api.call('messages.readHistory', { peer }),
      1000
    )

    const input = cleanText(message.message)
    if (!input) return

    debouncedSetTyping({ peer })
    debouncedReply({ message: input, peer })
  })

  const debouncedSetTyping = debounce(async ({ peer }) => {
    await api.call('messages.setTyping', {
      peer,
      action: { _: 'sendMessageTypingAction' },
    })
  }, 2000)

  const debouncedReply = debounce(async ({ message, peer }) => {
    log(`Message: ${message}`)

    const output = net.run(message)
    log(`Output: ${output}`)

    if (!output) return

    await Promise.all([
      api.call('messages.sendMessage', {
        peer,
        message: `[AI] ${output}`,
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
  }, 3500)
}
