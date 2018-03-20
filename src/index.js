import captureVideoFrame from 'capture-frame'
import ColorThief from 'color-thief-browser'
import Hue from 'jshue'

let user
const hue = Hue()
const getBridge = () =>
  hue.discover().then(bridges => {
    if (bridges.length === 0) {
      console.log('No bridges found. :(')
    }

    const bridge = hue.bridge(bridges[0].internalipaddress)
    return bridge
  })

const colorThief = new ColorThief()
const video = document.querySelector('video')

const getVideo = async () => {
  return navigator.mediaDevices.getUserMedia({video: true})
}

const onInterval = () => {
  const frame = captureVideoFrame(video, 'jpeg')
  const img = document.createElement('img')
  img.src = window.URL.createObjectURL(new window.Blob([frame]))
  img.onload = () => {
    const color = colorThief.getPalette(img, 4)
    console.log(color)
  }
  user
    .setLightState(1, {bri: 128, hue: Math.round(Math.random() * 65000)})
    .then(data => {
      // process response data, do other things
    })
}

const run = async () => {
  const src = await getVideo()
  const bridge = await getBridge()
  user = bridge.user('HdfBjyRxpynajpn-93mKiLw6XXIwlBMLu3yjNsX9')
  const interval = window.setTimeout(onInterval, 1000)
  video.srcObject = src
}

run()
