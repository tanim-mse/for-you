import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { setTrack, setMuted, isMuted } from '../utils/audio'

// Track → route mapping
const ROUTE_TRACKS = {
  '/journal':  'journal',
  '/letters':  'letters',
  '/reels':    'reels',
  '/birthday': 'birthday',
  '/secret':   null,       // silence
  '/ending':   'ending',
}

export default function AudioManager() {
  const location = useLocation()

  // Change track on route change
  useEffect(() => {
    // Extract path from hash: '#/journal' → '/journal'
    const path = location.hash.replace('#', '') || '/'

    // Auth gate — use journal track (waits for first interaction)
    if (path === '/') {
      setTrack('journal')
      return
    }

    const track = ROUTE_TRACKS[path]

    // track === undefined means route not in map — do nothing
    if (track !== undefined) {
      setTrack(track)
    }
  }, [location.hash])

  // Sync mute state from localStorage on mount
  // (in case user reloaded with music_muted set)
  useEffect(() => {
    const stored = localStorage.getItem('music_muted') === 'true'
    if (stored !== isMuted()) {
      setMuted(stored)
    }

    // Poll for navbar toggle changes every 500ms
    // (navbar writes to localStorage, AudioManager reads it)
    const id = setInterval(() => {
      const current = localStorage.getItem('music_muted') === 'true'
      if (current !== isMuted()) {
        setMuted(current)
      }
    }, 500)

    return () => clearInterval(id)
  }, [])

  return null // renders nothing
}
