import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const brain = require('brain.js')
import input from 'input'

import trainNet from '#root/brain/train.js'

const net = new brain.recurrent.LSTM({
  hiddenLayers: [80, 80], // 2-4 layers recommended
})

// import loadNet from '#root/brain/load.js'
// loadNet(net)

// training error record: 0.04094568624572072

trainNet(net, {
  INPUT_LENGTH: 6000, // need to increase
  iterations: 300,
  learningRate: 0.0008, // 0.003
  momentum: 0.02, // 0.03
})

let netOverwritten = false

const overwriteNet = async () => {
  const override = await input.confirm('Overwrite? ', { default: false })

  if (override) {
    const json = JSON.stringify(net.toJSON())
    fs.writeFileSync('data/trainedNet.json', json, 'utf-8')
    netOverwritten = true
  }
}

const chat = async () => {
  const text = await input.text('me: ')

  const output = net.run(text)
  console.log('ths-ai: ', output)

  if (!netOverwritten) await overwriteNet()
  chat()
}

chat()
