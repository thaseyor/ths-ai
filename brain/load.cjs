const fs = require('fs')

module.exports = (net) => {
  const networkState = JSON.parse(
    fs.readFileSync('data/trainedNet.json', 'utf-8')
  )
  // console.log(networkState)
  net.fromJSON(networkState)
}
