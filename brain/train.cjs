module.exports = (
  net,
  { iterations = 20000, learningRate = 0.3, momentum = 0.1, INPUT_LENGTH = 100 }
) => {
  const trainData = require('../data/trainData.json')

  console.log('Train data volume: ' + trainData.length)

  console.log('Current input: ' + INPUT_LENGTH)

  net.train(trainData.slice(0, INPUT_LENGTH), {
    iterations, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.01, // the acceptable error percentage from training data --> number between 0 and 1
    log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 1, // iterations between logging out --> number greater than 0
    learningRate, // scales with delta to effect training rate --> number between 0 and 1
    momentum, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
  })

  console.log('done training')
}
