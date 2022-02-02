import api from '#root/api.js'
import { sticker } from '#root/config.js'
import { random_id, log, peerFromMsg } from '#root/utils.js'

export const stickerListener = () => {
  api.on('updates', (updateInfo) => {
    updateInfo.updates.forEach(async (update) => {
      const message = update.message

      const isSticker =
        update._ === 'updateNewMessage' &&
        message &&
        message.media._ &&
        message.media._ === 'messageMediaDocument'

      if (!isSticker) return

      log(update._)

      const stickerId = message.media.document.id

      if (
        stickerId !== '2074256487122731017' &&
        stickerId !== '2074256487122731018'
      )
        return

      await api.call('messages.sendMedia', {
        peer: peerFromMsg({
          msg_id: message.id,
          user_id: message.peer_id.user_id,
        }),
        media: {
          _: 'inputMediaDocument',
          id: {
            _: 'inputDocument',
            ...sticker,
          },
        },
        random_id: random_id(),
      })
    })
  })
}
