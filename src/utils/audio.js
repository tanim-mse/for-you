// src/utils/audio.js
// Central audio manager using Howler.js.
// All pages call audioManager.setTrack(trackName) on mount.
// The navbar music toggle calls audioManager.setMuted(bool).

import { Howl } from 'howler'

// ── Track definitions ─────────────────────────────────────────────────────────
const TRACKS = {
  preloader: '/audio/01-preloader.mp3',
  journal:   '/audio/02-journal.mp3',
  piano:     '/audio/03-piano.mp3',
  letters:   '/audio/04-letters.mp3',
  reels:     '/audio/05-reels.mp3',
  birthday:  '/audio/06-birthday.mp3',
  ending:    '/audio/07-ending.mp3',
}

const SFX = {
  paper:  '/audio/sfx-paper.mp3',
  candle: '/audio/sfx-candle.mp3',
}

const VOLUME      = 0.22   // ambient volume for all tracks
const FADE_MS     = 1800   // crossfade duration in ms
const SFX_VOLUME  = 0.22

// ── Manager state ─────────────────────────────────────────────────────────────
let currentHowl   = null
let currentTrack  = null
let muted         = localStorage.getItem('music_muted') === 'true'
let unlocked      = false   // mobile audio unlock flag

// ── Mobile audio unlock ───────────────────────────────────────────────────────
// Browsers block audio until the first user interaction.
// We listen for the first tap/click and then start the queued track.
let queuedTrack = null

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

// ── Internal play ─────────────────────────────────────────────────────────────
function _playTrack(trackName) {
  if (!trackName || trackName === currentTrack) return
  const src = TRACKS[trackName]
  if (!src) return

  // Fade out and stop old track
  if (currentHowl) {
    const old = currentHowl
    old.fade(old.volume(), 0, FADE_MS)
    setTimeout(() => old.stop(), FADE_MS)
  }

  const isEnding = trackName === 'ending'

  const howl = new Howl({
    src: [src],
    volume: 0,
    loop: !isEnding,
    html5: true,   // streaming — better for large files
  })

  if (!muted) {
    howl.play()
    howl.fade(0, VOLUME, FADE_MS)
  }

  currentHowl  = howl
  currentTrack = trackName
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Call on each page mount.
 * trackName: one of 'journal' | 'piano' | 'letters' | 'reels' | 'birthday' | 'ending' | null
 * null = silence (Secret page)
 */
export function setTrack(trackName) {
  // Secret page — full silence
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

  // Same track already playing — don't restart
  if (trackName === currentTrack && currentHowl?.playing()) return

  if (!unlocked) {
    // Queue it — will play on first interaction
    queuedTrack = trackName
    return
  }

  _playTrack(trackName)
}

/**
 * Mute or unmute all audio.
 * Called by navbar music toggle.
 */
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

/**
 * Play a sound effect once.
 * sfxName: 'paper' | 'candle'
 */
export function playSfx(sfxName) {
  if (muted) return
  const src = SFX[sfxName]
  if (!src) return
  const sfx = new Howl({ src: [src], volume: SFX_VOLUME, loop: false })
  sfx.play()
}

export default { setTrack, setMuted, isMuted, playSfx }
