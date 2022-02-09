import fs from 'fs'
import { MY_USER_ID } from '#root/config.js'
import { cleanText } from '#root/utils.js'

const rawdata = fs.readFileSync('data/telegramData.json')
const data = JSON.parse(rawdata)

const trainData = []

data.chats.list.forEach((chat) => {
  console.log('Parsing: ' + chat.name)

  let input = '' // messages from others
  let output = '' // your messages

  chat.messages.forEach((message) => {
    const messageFromMe = message.from_id === MY_USER_ID

    if (!input && messageFromMe) return

    if (!message.text || typeof message.text !== 'string') return

    const text = cleanText(message.text)

    if (!output && !messageFromMe) input = text
    if (input && messageFromMe) output = text
    if (output && !messageFromMe) {
      trainData.push({ input, output })
      input = ''
      output = ''
    }
  })
})

const json = JSON.stringify(trainData)
fs.writeFileSync('data/trainData.json', json)
