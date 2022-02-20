import fs from 'fs'
import { log, getDateDiff, getPercentage } from '#root/utils.js'

const trainData = JSON.parse(fs.readFileSync('data/trainData.json', 'utf-8'))

export default (
	net,
	{
		iterations = 20000,
		learningRate = 0.3,
		momentum = 0.1,
		INPUT_LENGTH = 1000,
	}
) => {
	log('Train data volume: ' + trainData.length)

	const data = trainData.slice(0, INPUT_LENGTH)
	log(
		`Current input: ${data.length}, learningRate: ${learningRate}, momentum: ${momentum}`
	)

	let start = new Date()
	const result = net.train(data, {
		iterations, // the maximum times to iterate the training data --> number greater than 0
		errorThresh: 0.01, // the acceptable error percentage from training data --> number between 0 and 1
		log: (stats) => {
			const end = new Date()
			const dateDifference = getDateDiff(start, end)
			start = end

			const currentIteration = Number(stats.split(',')[0].split(':')[1])
			const currentPercentage = getPercentage(currentIteration, iterations)

			if (currentIteration === 0) {
				const predTime = (dateDifference / 60) * iterations
				log(`Predicted time: ${predTime.toFixed(2)} minutes`)
			}

			log(
				`${currentPercentage}% - ${stats}, iteration time: ${dateDifference}s`
			)
		},
		logPeriod: 1, // iterations between logging out --> number greater than 0
		learningRate, // scales with delta to effect training rate --> number between 0 and 1
		momentum, // scales with next layer's change value --> number between 0 and 1
		callback: null, // a periodic call back that can be triggered while training --> null or function
		callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
		timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
	})

	log(
		`Done training - error: ${result.error}, iterations: ${result.iterations}`
	)
}
