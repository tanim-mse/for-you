import { useEffect, useRef } from 'react'

const COLORS = ['#FFD97D', '#E8A020', '#C4681A', '#FFF4CC']

export default function CandleParticles({ count = 15 }) {
  const canvasRef = useRef(null)
  const countRef  = useRef(count)

  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    let particles = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const rand    = (min, max) => Math.random() * (max - min) + min
    const randInt = (min, max) => Math.floor(rand(min, max))

    // Spec: lifespan 4s–9s at 60fps = 240–540 frames
    const spawn = (staggerLife = false) => {
      const maxLife = randInt(240, 540)
      return {
        x:         rand(window.innerWidth * 0.1, window.innerWidth * 0.9),
        y:         window.innerHeight,
        size:      rand(1.5, 3.5),
        color:     COLORS[randInt(0, COLORS.length)],
        speed:     rand(0.4, 1.2),
        driftAmp:  rand(8, 16),
        driftFreq: rand(0.02, 0.04),
        life:      staggerLife ? randInt(0, maxLife) : 0,
        maxLife,
      }
    }

    for (let i = 0; i < countRef.current; i++) {
      particles.push(spawn(true))
    }

    const draw = () => {
      while (particles.length < countRef.current) particles.push(spawn(true))
      while (particles.length > countRef.current) particles.pop()

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        const progress = p.life / p.maxLife

        // Spec opacity curve:
        // 0 → 0.55 over first 15% of life
        // steady 0.55 until 80%
        // 0.55 → 0 over last 20%
        let alpha
        if (progress < 0.15) {
          alpha = (progress / 0.15) * 0.55
        } else if (progress < 0.80) {
          alpha = 0.55
        } else {
          alpha = ((1 - progress) / 0.20) * 0.55
        }

        const xOffset = Math.sin(p.life * p.driftFreq) * p.driftAmp

        const hex = p.color.replace('#', '')
        const r   = parseInt(hex.substring(0, 2), 16)
        const g   = parseInt(hex.substring(2, 4), 16)
        const b   = parseInt(hex.substring(4, 6), 16)

        ctx.beginPath()
        ctx.arc(p.x + xOffset, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.fill()

        p.y    -= p.speed
        p.life += 1

        if (p.life >= p.maxLife) {
          particles[i] = spawn()
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  )
}
