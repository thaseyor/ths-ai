import fs from 'fs'

export default (net) => {
  const rawNet = fs.readFileSync('data/trainedNet.json', 'utf-8')
  const networkState = JSON.parse(rawNet)

  net.fromJSON(networkState)
}
