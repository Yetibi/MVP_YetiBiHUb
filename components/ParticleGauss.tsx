'use client'

import { useEffect, useRef } from 'react'

interface ParticleGaussProps {
  width?: number            // ancho lógico del canvas
  height?: number           // alto lógico del canvas
  density?: number          // partículas asentadas
  compact?: boolean         // true = solo labels −2σ, μ, +2σ (móvil)
  mouseParallax?: boolean   // true = parallax sutil con cursor (desktop)
  className?: string
}

export default function ParticleGauss({
  width = 640,
  height = 340,
  density = 850,
  compact = false,
  mouseParallax = false,
  className = '',
}: ParticleGaussProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = width
    const H = height
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    // Geometría paramétrica
    const cx = W / 2
    const baseY = H - 46
    const sigma = (W / 2 - 36) / 3.6
    const A = H * 0.58
    const maxX = 3.6 * sigma

    const f = (x: number) => A * Math.exp(-(x * x) / (2 * sigma * sigma))
    const randn = () => {
      const u1 = Math.random() || 1e-9
      const u2 = Math.random()
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    }

    // Masa asentada
    type Settled = { x: number; yF: number; ph: number; sz: number }
    const M = density
    const settled: Settled[] = Array.from({ length: M }, () => ({
      x: Math.max(-maxX, Math.min(maxX, randn() * sigma)),
      yF: Math.random(),
      ph: Math.random() * 6.28,
      sz: 0.8 + Math.random() * 1.0,
    }))
    let replaceIdx = 0

    // Muestras cayendo
    type Falling = { x: number; y: number; yT: number; v: number }
    const falling: Falling[] = []
    let nCount = 1247
    const spawn = () => {
      falling.push({
        x: Math.max(-maxX, Math.min(maxX, randn() * sigma)),
        y: -14,
        yT: Math.random(),
        v: 0,
      })
    }

    // Parallax
    let dx = 0, dy = 0, tdx = 0, tdy = 0
    const onMouse = (e: MouseEvent) => {
      tdx = (e.clientX / window.innerWidth - 0.5) * 24
      tdy = (e.clientY / window.innerHeight - 0.5) * 12
    }
    if (mouseParallax) window.addEventListener('mousemove', onMouse)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let t = 0
    let lastSpawn = 0
    let rafId = 0
    let running = true

    const marks: [number, string][] = compact
      ? [[-2, '−2σ'], [0, 'μ'], [2, '+2σ']]
      : [[-2, '−2σ'], [-1, '−1σ'], [0, 'μ'], [1, '+1σ'], [2, '+2σ']]

    const drawAxes = () => {
      ctx.strokeStyle = 'rgba(93,107,122,0.45)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx + dx - maxX - 16, baseY + dy + 0.5)
      ctx.lineTo(cx + dx + maxX + 16, baseY + dy + 0.5)
      ctx.stroke()

      ctx.font = '9px var(--font-mono, monospace)'
      ctx.textAlign = 'center'
      for (const [k, label] of marks) {
        const mx = cx + dx + k * sigma
        ctx.strokeStyle = 'rgba(93,107,122,0.45)'
        ctx.beginPath()
        ctx.moveTo(mx, baseY + dy)
        ctx.lineTo(mx, baseY + dy + 5)
        ctx.stroke()
        ctx.fillStyle = k === 0 ? 'rgba(79,209,224,0.9)' : 'rgba(139,123,168,0.9)'
        ctx.fillText(label, mx, baseY + dy + 17)
      }

      ctx.setLineDash([3, 4])
      ctx.strokeStyle = 'rgba(79,209,224,0.28)'
      ctx.beginPath()
      ctx.moveTo(cx + dx, baseY + dy)
      ctx.lineTo(cx + dx, baseY + dy - A - 8)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(79,209,224,0.4)'
      for (const s of [-1, 1]) {
        const lx = cx + dx + s * 2 * sigma
        ctx.beginPath()
        ctx.moveTo(lx, baseY + dy)
        ctx.lineTo(lx, baseY + dy - f(2 * sigma) - 34)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }

    const drawCurve = () => {
      ctx.strokeStyle = 'rgba(79,209,224,0.85)'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      for (let x = -maxX - 10; x <= maxX + 10; x += 3) {
        const y = baseY + dy - f(x)
        if (x === -maxX - 10) ctx.moveTo(cx + dx + x, y)
        else ctx.lineTo(cx + dx + x, y)
      }
      ctx.stroke()
    }

    const drawCounter = () => {
      ctx.font = '10px var(--font-mono, monospace)'
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(79,209,224,0.9)'
      ctx.fillText('n = ' + nCount.toLocaleString('es-CO'), W - 14, 20)
    }

    const frame = () => {
      if (!running) return
      t += 0.016
      dx += (tdx - dx) * 0.05
      dy += (tdy - dy) * 0.05
      ctx.clearRect(0, 0, W, H)
      drawAxes()

      for (let i = 0; i < M; i++) {
        const p = settled[i]
        const py = baseY + dy - p.yF * f(p.x) - 1.5
        const out = Math.abs(p.x) > 2 * sigma
        const tw = reduced ? 1 : 0.75 + 0.25 * Math.sin(t * 1.4 + p.ph)
        const a = (out ? 0.75 : 0.52) * tw
        ctx.beginPath()
        ctx.arc(cx + dx + p.x, py, p.sz, 0, 6.2832)
        ctx.fillStyle = out
          ? `rgba(79,209,224,${a.toFixed(2)})`
          : `rgba(79,209,224,${a.toFixed(2)})`
        ctx.fill()
      }

      if (!reduced) {
        if (t - lastSpawn > 0.13 && falling.length < 14) {
          spawn()
          lastSpawn = t
        }
        for (let j = falling.length - 1; j >= 0; j--) {
          const q = falling[j]
          const yTarget = baseY + dy - q.yT * f(q.x) - 1.5
          q.v += 0.5
          q.y += q.v
          if (q.y >= yTarget) {
            settled[replaceIdx] = {
              x: q.x, yF: q.yT, ph: Math.random() * 6.28,
              sz: 0.8 + Math.random() * 1.0,
            }
            replaceIdx = (replaceIdx + 1) % M
            falling.splice(j, 1)
            nCount++
          } else {
            const outF = Math.abs(q.x) > 2 * sigma
            ctx.beginPath()
            ctx.arc(cx + dx + q.x, q.y, 1.6, 0, 6.2832)
            ctx.fillStyle = outF ? 'rgba(79,209,224,0.95)' : 'rgba(79,209,224,0.95)'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(cx + dx + q.x, q.y - 5, 1.0, 0, 6.2832)
            ctx.fillStyle = outF ? 'rgba(79,209,224,0.3)' : 'rgba(79,209,224,0.3)'
            ctx.fill()
          }
        }
      }

      drawCurve()
      drawCounter()
      if (!reduced) rafId = requestAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
        if (running && !reduced) rafId = requestAnimationFrame(frame)
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    if (reduced) frame()
    else rafId = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      observer.disconnect()
      if (mouseParallax) window.removeEventListener('mousemove', onMouse)
    }
  }, [width, height, density, compact, mouseParallax])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width, height, pointerEvents: 'none' }}
    />
  )
}
