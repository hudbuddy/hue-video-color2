/**
 * https://www.developers.meethue.com/documentation/lights-api
 */

import captureVideoFrame from 'capture-frame'
import ColorThief from 'color-thief-browser'
import Hue from 'jshue'

let user
const hue = Hue()
const getBridge = () =>
  hue.discover().then(bridges => {
    if (bridges.length === 0) {
      console.warn('No bridges found')
      return null
    }

    const bridge = hue.bridge(bridges[0].internalipaddress)
    return bridge
  })

const colorThief = new ColorThief()
const video = document.querySelector('video')

const getVideo = async () => {
  return navigator.mediaDevices.getUserMedia({video: true, audio: true})
}

const getColors = async () =>
  new Promise(resolve => {
    const frame = captureVideoFrame(video, 'jpeg')
    const img = document.createElement('img')
    img.src = window.URL.createObjectURL(new window.Blob([frame]))
    img.onload = () => {
      const palette = colorThief.getPalette(img, 4)
      resolve(palette)
    }
  })

const onInterval = async () => {
  const palette = getColors()
  palette.forEach((color, i) => {
    const xy = rgb_to_cie(...palette)
    user
      .setLightState(i + 1, {
        colormode: 'xy',
        on: true,              // On/Off: Bool
        xy,                    // X/Y color val: [x=0...1, y=0...1]
        bri: 128,              // Brightness: 1...254
        effect: 'none',        // 'none', 'colorloop'
        transitiontime: 4      // x100 milliseconds, Int
      })
      .then(data => {
        // process response data, do other things
      })
  })
}

const run = async () => {
  const src = await getVideo()
  video.srcObject = src
  const bridge = await getBridge()
  if (!bridge) return
  user = bridge.user('HdfBjyRxpynajpn-93mKiLw6XXIwlBMLu3yjNsX9')
  const interval = window.setTimeout(onInterval, 1000)
}

run()
