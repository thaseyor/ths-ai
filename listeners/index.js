import { messageListener } from './messageListener.js'
import { stickerListener } from './stickerListener.js'
import { log } from '#root/utils.js'

export const startListeners = () => {
  log('Starting listeners')
  stickerListener()
  messageListener()
}
