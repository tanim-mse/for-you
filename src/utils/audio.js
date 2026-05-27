// src/utils/audio.js
// Fixed: audio paths use './' prefix to work with Vite base: '/for-you/'

import { Howl } from 'howler'

const TRACKS = {
  preloader: './audio/01-preloader.mp3',
  journal:   './audio/02-journal.mp3',
  piano:     './audio/03-piano.mp3',
  letters:   './audio/04-letters.mp3',
  reels:     './audio/05-reels.mp3',
  birthday:  './audio/06-birthday.mp3',
  ending:    './audio/07-ending.mp3',
}

const SFX = {
  paper:  './audio/sfx-paper.mp3',
  candle: './audio/sfx-candle.mp3',
}

const VOLUME     = 0.22
const FADE_MS    = 1800
const SFX_VOLUME = 0.22

let currentHowl  = null
let currentTrack = null
let muted        = localStorage.getItem('music_muted') === 'true'
let unlocked     = false
let queuedTrack  = null

function onFirstInteraction() {
  unlocked = true
  window.removeEventListener('click', onFirstInteraction)
  window.removeEventListener('touchstart', onFirstInteraction)
  if (queuedTrack) {
    _playTrack(queuedTrack)
    queuedTrack = null
  }
}

window.addEventListener('click', onFirstInteraction)
window.addEventListener('touchstart', onFirstInteraction)

function _playTrack(trackName) {
  if (!trackName || trackName === currentTrack) return
  const src = TRACKS[trackName]
  if (!src) return

  if (currentHowl) {
    const old = currentHowl
    old.fade(old.volume(), 0, FADE_MS)
    setTimeout(() => old.stop(), FADE_MS)
  }

  const howl = new Howl({
    src: [src],
    volume: 0,
    loop: trackName !== 'ending',
    html5: true,
  })

  if (!muted) {
    howl.play()
    howl.fade(0, VOLUME, FADE_MS)
  }

  currentHowl  = howl
  currentTrack = trackName
}

export function setTrack(trackName) {
  if (trackName === null) {
    if (currentHowl) {
      currentHowl.fade(currentHowl.volume(), 0, FADE_MS)
      setTimeout(() => {
        if (currentHowl) currentHowl.stop()
        currentHowl  = null
        currentTrack = null
      }, FADE_MS)
    }
    return
  }

  if (trackName === currentTrack && currentHowl?.playing()) return

  if (!unlocked) {
    queuedTrack = trackName
    return
  }

  _playTrack(trackName)
}

export function setMuted(isMuted) {
  muted = isMuted
  localStorage.setItem('music_muted', isMuted ? 'true' : 'false')

  if (currentHowl) {
    if (isMuted) {
      currentHowl.fade(currentHowl.volume(), 0, 600)
    } else {
      currentHowl.play()
      currentHowl.fade(currentHowl.volume(), VOLUME, 600)
    }
  }
}

export function isMuted() {
  return muted
}

export function playSfx(sfxName) {
  if (muted) return
  const src = SFX[sfxName]
  if (!src) return
  const sfx = new Howl({ src: [src], volume: SFX_VOLUME, loop: false })
  sfx.play()
}

export default { setTrack, setMuted, isMuted, playSfx }
