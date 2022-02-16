import fs from 'fs'
import { cleanText } from '#root/utils.js'

const rawdata = fs.readFileSync('data/result.json')
const data = JSON.parse(rawdata)

const trainData = []

const MY_USER_ID = 'user' + data.personal_information.user_id

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
