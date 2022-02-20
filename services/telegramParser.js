import fs from 'fs'
import input from 'input'
import { cleanText, log, getPercentage } from '#root/utils.js'

const rawdata = fs.readFileSync('data/result.json')
const data = JSON.parse(rawdata)

const trainData = []

const MY_USER_ID = 'user' + data.personal_information.user_id

const validateMessage = (message) => {
	if (message.forwarded_from) return null

	if (!message.text || typeof message.text !== 'string') return null

	if (message.text.includes('[AI]')) return null

	return cleanText(message.text)
}

let replies = 0
const chatlist = []

data.chats.list.forEach((chat) => {
	if (chat.type !== 'personal_chat') return
	if (chat.name === 'Telegram') return
	chatlist.push(chat.name)
})

const whitelist = await input.checkboxes(`Which chats to parse?`, chatlist)

data.chats.list.forEach((chat) => {
	if (!whitelist.includes(chat.name)) return

	log('Parsing: ' + chat.name)

	let input = '' // messages from others
	let output = '' // your messages

	chat.messages.forEach((message, key) => {
		const text = validateMessage(message)
		if (!text) return

		const messageFromMe = message.from_id === MY_USER_ID

		if (messageFromMe && message.reply_to_message_id) {
			const diff = message.id - message.reply_to_message_id

			const forwardedMessage = chat.messages[key - diff]
			if (!forwardedMessage) return

			const forwarded = validateMessage(forwardedMessage)
			if (!forwarded) return
			replies++
			trainData.push({ input: forwarded, output: text })
			return
		}

		if (!input && messageFromMe) return
		if (!output && !messageFromMe) input = text
		if (input && messageFromMe) output = text
		if (output && !messageFromMe) {
			trainData.push({ input, output })
			input = ''
			output = ''
		}
	})
})

log(`Data accuracy: ${getPercentage(replies, trainData.length)}%`)
log(`Overall data volume: ${trainData.length}`)

const json = JSON.stringify(trainData)
fs.writeFileSync('data/trainData.json', json)
