import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { setTrack, setMuted, isMuted } from '../utils/audio'

// With HashRouter, location.pathname IS the route (e.g. '/journal')
// location.hash is the fragment after a second # (not used here)
const ROUTE_TRACKS = {
  '/':         'journal',   // auth gate — queued until first click
  '/journal':  'journal',
  '/reels':    'reels',
  '/birthday': 'birthday',
  '/secret':   null,        // silence
  '/ending':   'ending',
}

export default function AudioManager() {
  const location = useLocation()

  useEffect(() => {
    // HashRouter puts the route in location.pathname directly
    const path = location.pathname || '/'
    const track = ROUTE_TRACKS[path]

    // undefined = unknown route, skip. null = silence.
    if (track !== undefined) {
      setTrack(track)
    }
  }, [location.pathname])

  // Sync mute state from localStorage on mount + poll for navbar toggle
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem('music_muted') === 'true'
      if (stored !== isMuted()) setMuted(stored)
    }
    sync()
    const id = setInterval(sync, 500)
    return () => clearInterval(id)
  }, [])

  return null
}
