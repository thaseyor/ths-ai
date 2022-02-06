import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const brain = require('brain.js')

import api from '#root/api.js'
import { random_id, log, peerFromMsg } from '#root/utils.js'

const net = new brain.recurrent.LSTM()

const networkState = JSON.parse(
  fs.readFileSync('data/trainedNet.json', 'utf-8')
)

net.fromJSON(networkState)

export const messageListener = () => {
  api.on('updateShortMessage', async (message) => {
    if (message.out) return

    log(`Message: ${message.message}`)

    // message: message.message,
    // user: message.user_id,
    const output = net.run(message.message) // 'happy'

    await api.call('messages.sendMessage', {
      peer: peerFromMsg({
        msg_id: message.id,
        user_id: message.user_id,
      }),
      message: output,
      random_id: random_id(),
    })
  })
}
