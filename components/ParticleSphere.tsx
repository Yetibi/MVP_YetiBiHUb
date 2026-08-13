'use client'

import { useEffect, useRef } from 'react'

interface ParticleSphereProps {
  size?: number          // diámetro lógico del canvas en px
  className?: string
}

export default function ParticleSphere({ size = 380, className = '' }: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = size
    const H = size
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    // Esfera de Fibonacci — 650 puntos
    const N = 650
    const R = size * 0.31
    const golden = Math.PI * (3 - Math.sqrt(5))
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2
      const rad = Math.sqrt(1 - y * y)
      const th = golden * i
      return {
        x: Math.cos(th) * rad,
        y,
        z: Math.sin(th) * rad,
        orange: i % 7 === 0,          // ~15% naranja = proporción de acento Yeti BI
        jitter: Math.random() * 0.06,
      }
    })

    let angY = 0
    const angX = 0.35
    const cx = W / 2
    const cy = H / 2
    const fov = size * 0.84

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rafId = 0
    let running = true

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const cosY = Math.cos(angY), sinY = Math.sin(angY)
      const cosX = Math.cos(angX), sinX = Math.sin(angX)
      for (let i = 0; i < N; i++) {
        const p = pts[i]
        const r = R * (1 + p.jitter)
        const x = p.x * r, y = p.y * r, z = p.z * r
        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        const y1 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX
        const s = fov / (fov + z2)
        const px = cx + x1 * s
        const py = cy + y1 * s
        const depth = (z2 + R) / (2 * R)
        const alpha = 0.12 + (1 - depth) * 0.55
        const dotSize = 0.7 + (1 - depth) * 1.3
        ctx.beginPath()
        ctx.arc(px, py, dotSize, 0, Math.PI * 2)
        ctx.fillStyle = p.orange
          ? `rgba(79,209,224,${alpha.toFixed(2)})`
          : `rgba(79,209,224,${alpha.toFixed(2)})`
        ctx.fill()
      }
    }

    const frame = () => {
      if (!running) return
      angY += 0.0038
      draw()
      if (!reduced) rafId = requestAnimationFrame(frame)
    }

    // Pausar fuera de viewport (performance móvil / Lighthouse)
    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
        if (running && !reduced) rafId = requestAnimationFrame(frame)
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    // reduced motion: un solo frame estático
    if (reduced) draw()
    else rafId = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: size, height: size, pointerEvents: 'none' }}
    />
  )
}
