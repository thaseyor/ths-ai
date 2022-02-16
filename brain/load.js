import fs from 'fs'

export default (net) => {
  try {
    const rawNet = fs.readFileSync('data/trainedNet.json', 'utf-8')
    const networkState = JSON.parse(rawNet)

    net.fromJSON(networkState)
  } catch (e) {
    throw new Error('No trained net found')
  }
}
