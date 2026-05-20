import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { isSecretUnlocked } from '../utils/unlock'

// ── Replace with your actual YouTube unlisted video ID ────────────────────────
const VIDEO_ID = 'YOUR_VIDEO_ID_HERE'

// ── Text below the video — keep under 20 words, write this last ───────────────
const BELOW_TEXT = "You didn't have to watch all of this. But I'm glad you did."

export default function Secret() {
  const navigate = useNavigate()

  // Guard — redirect if unlock conditions not met
  useEffect(() => {
    if (!isSecretUnlocked()) {
      navigate('/birthday', { replace: true })
    }
  }, [navigate])

  // Don't render if not unlocked (avoids flash before redirect)
  if (!isSecretUnlocked()) return null

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000', // pure black — not a CSS variable
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        position: 'relative',
      }}
    >
      {/* No particles. No ambient. No textures.
          The contrast with everything else IS the design. */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 640 }}
      >
        {/* Video player — no border, no glow, no shadow. Just the video. */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            background: '#000',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}`}
            allow="fullscreen"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="secret"
          />
        </div>

        {/* Text below video — intentionally low contrast */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          style={{
            marginTop: 24,
            maxWidth: 480,
            margin: '24px auto 0',
            textAlign: 'center',
            fontFamily: "'EB Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 17,
            lineHeight: 1.7,
            // Intentionally low contrast — she has to lean in slightly
            color: 'rgba(242,232,213,0.45)',
          }}
        >
          {BELOW_TEXT}
        </motion.p>
      </motion.div>
    </div>
  )
}
