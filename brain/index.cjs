const fs = require('fs')

const brain = require('brain.js')
const input = require('input')

const trainNet = require('./train.cjs')
const loadNet = require('./load.cjs')

const net = new brain.recurrent.LSTM({
  hiddenLayers: [20, 20, 20, 20, 20, 20, 20],
})

// loadNet(net)

trainNet(net, {
  INPUT_LENGTH: 2000,
  iterations: 300,
  learningRate: 0.001,
  momentum: 0.05,
})

let netOverwritten = false

const overwriteNet = async () => {
  const override = await input.confirm('Overwrite? ', { default: false })

  if (override) {
    const json = JSON.stringify(net.toJSON())
    fs.writeFileSync('data/trainedNet2.json', json, 'utf-8')
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
