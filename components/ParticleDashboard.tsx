'use client'

import { useEffect, useRef, useState } from 'react'

interface ParticleDashboardProps {
  width?: number
  height?: number
  /** Variante móvil de 3 paneles (sin mini-Gauss) y tipografía un punto menor. */
  compact?: boolean
  mouseParallax?: boolean
  className?: string
}

export default function ParticleDashboard({
  width = 610,
  height = 385,
  compact = false,
  mouseParallax = false,
  className = '',
}: ParticleDashboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Ancho realmente ocupado tras el layout. Redibuja el tablero si el
  // contenedor lo comprime, en vez de dejar que el buffer se estire.
  const [laidOut, setLaidOut] = useState(0)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ro = new ResizeObserver(() => {
      setLaidOut(Math.round(c.getBoundingClientRect().width))
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    // Si el layout comprime el canvas (max-width del wrapper), se dibuja al
    // ancho real en vez de estirar el buffer: nunca hay distorsión horizontal.
    const laidOutW = Math.round(canvas.getBoundingClientRect().width)
    const W = laidOutW > 0 ? Math.min(width, laidOutW) : width
    const H = height
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const CIAN = '79,209,224'
    const AMBAR = '242,143,107'
    const NEBLINA = '93,107,122'         // #5D6B7A — neblina tenue
    const GRAY = '139,123,168'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ---------- Layout proporcional ----------
    // compact (móvil): 3 paneles — header, fila KPI y fila inferior de dos
    // paneles (barras + tendencia) que llegan hasta el fondo. Sin mini-Gauss.
    const headerH = Math.round(H * (compact ? 0.10 : 0.085))
    const kpiY0 = headerH
    const kpiY1 = Math.round(H * (compact ? 0.40 : 0.36))
    const row2Y0 = kpiY1
    const barsX1 = Math.round(W * (compact ? 0.56 : 0.55))
    const lineY1 = Math.round(H * 0.67)   // sólo se usa fuera de compact

    // ---------- Estado ----------
    let t = 0
    let nCount = 2054
    let lastN = 0

    // KPI A
    let kpiA = 128.4
    let kpiATarget = 128.4
    let lastTickA = 0
    const sparkA = Array.from({ length: 24 }, (_, i) =>
      0.35 + 0.3 * Math.sin(i * 0.45) + Math.random() * 0.18)

    // KPI B
    let kpiB = 94.1
    let lastTickB = 0
    const sparkB = Array.from({ length: 24 }, (_, i) =>
      0.65 - i * 0.008 + Math.random() * 0.15)

    // BARRAS (velas)
    const barArea = compact
      ? {
          x0: 12, x1: barsX1 - 10,
          base: H - Math.round(H * 0.10),
          top: row2Y0 + Math.round(H * 0.12),
        }
      : {
          x0: 16, x1: barsX1 - 14,
          base: H - Math.round(H * 0.08),
          top: row2Y0 + Math.round(H * 0.11),
        }
    const nBars = 6
    const targetH = [0.52, 0.66, 0.58, 0.78, 0.34, 0.62]
    const metaFrac = 0.5
    const highestIdx = targetH.indexOf(Math.max(...targetH))
    const barLabels = ['E', 'F', 'M', 'A', 'M', 'J']
    const maxBarH = barArea.base - barArea.top
    const barSlot = (barArea.x1 - barArea.x0) / nBars
    // arranque escalonado: currentH crece de 0 a target con easing
    const currentH = targetH.map(() => 0)
    const startDelay = targetH.map((_, i) => i * 0.12)
    let lastRetarget = 0
    const liveTarget = [...targetH]

    // TENDENCIA
    const lineArea = compact
      ? {
          x0: barsX1 + 10, x1: W - 10,
          y0: row2Y0 + Math.round(H * 0.11),
          y1: H - Math.round(H * 0.14),
        }
      : {
          x0: barsX1 + 12, x1: W - 12,
          y0: row2Y0 + Math.round(H * 0.075),
          y1: lineY1 - Math.round(H * 0.05),
        }
    let serie: number[] = []
    const genSerie = () => {
      serie = []
      let v = 0.5
      for (let i = 0; i < 34; i++) {
        v += (Math.random() - 0.48) * 0.16
        v = Math.max(0.08, Math.min(0.92, v))
        serie.push(v)
      }
    }
    genSerie()
    let lineProg = 0
    let linePause = 0
    const lineMeta = 0.42

    // MINI GAUSS
    const gA = {
      x0: barsX1 + 12, x1: W - 12,
      base: H - Math.round(H * 0.065),
      top: lineY1 + Math.round(H * 0.035),
    }
    const gCx = (gA.x0 + gA.x1) / 2
    const gSigma = (gA.x1 - gA.x0 - 30) / 2 / 3.4
    const gAmp = (gA.base - gA.top) * 0.8
    const gMaxX = 3.4 * gSigma
    const gF = (x: number) => gAmp * Math.exp(-(x * x) / (2 * gSigma * gSigma))
    const randn = () => {
      const u1 = Math.random() || 1e-9
      const u2 = Math.random()
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    }
    type GPt = { x: number; yF: number; ph: number }
    // en compact la mini-Gauss no existe: no se siembran partículas
    const gSettled: GPt[] = compact ? [] : Array.from({ length: 130 }, () => ({
      x: Math.max(-gMaxX, Math.min(gMaxX, randn() * gSigma)),
      yF: Math.random(),
      ph: Math.random() * 6.28,
    }))
    let gIdx = 0
    type GFall = { x: number; y: number; yT: number; v: number }
    const gFalling: GFall[] = []
    let gLastSpawn = 0

    // Parallax
    let dx = 0, dy = 0, tdx = 0, tdy = 0
    const onMouse = (e: MouseEvent) => {
      tdx = (e.clientX / window.innerWidth - 0.5) * 16
      tdy = (e.clientY / window.innerHeight - 0.5) * 8
    }
    if (mouseParallax) window.addEventListener('mousemove', onMouse)

    let rafId = 0
    let running = true

    const mono = (px: number, weight = '') => {
      ctx.font = `${weight ? weight + ' ' : ''}${px}px var(--font-jetbrains-mono, monospace)`
    }
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)

    // Escala tipográfica: en compact el canvas es más chico y todo baja un punto
    const kpiRowH = kpiY1 - headerH
    const FS = compact
      ? {
          header: 9, kpiLabel: 7,
          // 17px es el tamaño de referencia (H≈260); en tableros más bajos baja
          // hasta 13px para no comerse la fila
          kpiNum: Math.max(13, Math.min(17, Math.round(kpiRowH * 0.22))),
          delta: 8, panel: 8, bar: 7, meta: 6,
        }
      : { header: 10, kpiLabel: 9, kpiNum: 22, delta: 9, panel: 9, bar: 8, meta: 7 }
    // Offsets del bloque KPI. En compact se reparten sobre el alto real de la
    // fila (kpiY1 - headerH) para que el sparkline nunca invada la fila de
    // barras cuando el tablero se encoge en viewports bajos.
    const OY = compact
      ? {
          label: Math.round(kpiRowH * 0.21),
          num: Math.round(kpiRowH * 0.52),
          delta: Math.round(kpiRowH * 0.72),
          spark: Math.round(kpiRowH * 0.76),
          sparkH: Math.max(7, Math.round(kpiRowH * 0.17)),
        }
      : { label: 18, num: 45, delta: 61, spark: 64, sparkH: 15 }
    const PADX = compact ? 12 : 16

    const frame = () => {
      if (!running) return
      t += 0.016
      dx += (tdx - dx) * 0.05
      dy += (tdy - dy) * 0.05
      ctx.save()
      ctx.translate(dx, dy)
      ctx.clearRect(-40, -40, W + 80, H + 80)

      // Marco + divisores. El borde real de la pieza lo da el wrapper (tarjeta
      // con radius y sombra), así que aquí sólo queda una insinuación teal.
      ctx.strokeStyle = `rgba(${CIAN},0.12)`
      ctx.lineWidth = 1
      ctx.strokeRect(0.5, 0.5, W - 1, H - 1)
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.beginPath()
      ctx.moveTo(0, headerH + 0.5); ctx.lineTo(W, headerH + 0.5)
      ctx.moveTo(0, kpiY1 + 0.5); ctx.lineTo(W, kpiY1 + 0.5)
      ctx.moveTo(W / 2 + 0.5, headerH); ctx.lineTo(W / 2 + 0.5, kpiY1)
      ctx.moveTo(barsX1 + 0.5, kpiY1); ctx.lineTo(barsX1 + 0.5, H)
      // el divisor de la mini-Gauss sólo existe en el tablero de 4 paneles
      if (!compact) { ctx.moveTo(barsX1, lineY1 + 0.5); ctx.lineTo(W, lineY1 + 0.5) }
      ctx.stroke()

      // Header
      if (!reduced && t - lastN > 0.9) { nCount += 1 + Math.floor(Math.random() * 3); lastN = t }
      mono(FS.header); ctx.textAlign = 'left'
      ctx.fillStyle = `rgba(${GRAY},0.95)`
      const headBase = headerH - (compact ? 6 : 9)
      ctx.fillText('TABLERO.OPERACIONAL', compact ? 12 : 14, headBase)
      ctx.textAlign = 'right'
      ctx.fillStyle = `rgba(${CIAN},0.9)`
      ctx.fillText('n = ' + nCount.toLocaleString('es-CO'), W - (compact ? 12 : 14), headBase)

      // KPI A
      if (!reduced && t - lastTickA > 1.4) { kpiATarget += 0.1 + Math.random() * 0.25; lastTickA = t }
      kpiA += (kpiATarget - kpiA) * 0.08
      mono(FS.kpiLabel); ctx.textAlign = 'left'
      ctx.fillStyle = `rgba(${GRAY},1)`
      ctx.fillText('VENTAS.MES', PADX, kpiY0 + OY.label)
      mono(FS.kpiNum, '800')
      ctx.fillStyle = `rgba(${CIAN},0.95)`
      ctx.fillText('$' + kpiA.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'M', PADX, kpiY0 + OY.num)
      mono(FS.delta)
      ctx.fillText('▲ +6,2%', PADX, kpiY0 + OY.delta)
      // sparkline A
      const sx0 = W * (compact ? 0.30 : 0.245), sx1 = W / 2 - PADX
      const sy0 = kpiY0 + OY.spark, sh = OY.sparkH
      ctx.strokeStyle = `rgba(${CIAN},0.4)`
      ctx.lineWidth = 1
      ctx.beginPath()
      sparkA.forEach((v, i) => {
        const x = sx0 + (sx1 - sx0) * i / (sparkA.length - 1)
        const y = sy0 + sh - v * sh
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // KPI B
      if (!reduced && t - lastTickB > 2.1) { kpiB = 94.1 + (Math.random() - 0.5) * 0.3; lastTickB = t }
      const bx = W / 2 + PADX
      mono(FS.kpiLabel)
      ctx.fillStyle = `rgba(${GRAY},1)`
      ctx.fillText('OTIF.ENTREGAS', bx, kpiY0 + OY.label)
      mono(FS.kpiNum, '800')
      ctx.fillStyle = `rgba(${CIAN},0.95)`
      ctx.fillText(kpiB.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%', bx, kpiY0 + OY.num)
      mono(FS.delta)
      ctx.fillStyle = `rgba(${AMBAR},0.95)`
      ctx.fillText('▼ −1,8%', bx, kpiY0 + OY.delta)
      // sparkline B (últimos puntos naranjas)
      const tx0 = bx + W * (compact ? 0.20 : 0.155), tx1 = W - PADX
      sparkB.forEach((v, i) => {
        const x = tx0 + (tx1 - tx0) * i / (sparkB.length - 1)
        const y = kpiY0 + OY.spark + OY.sparkH - v * OY.sparkH
        const late = i >= sparkB.length - 7
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, 6.2832)
        ctx.fillStyle = late ? `rgba(${AMBAR},0.9)` : `rgba(${CIAN},0.75)`
        ctx.fill()
      })

      // ---------- BARRAS: VELAS QUE SUBEN ----------
      mono(FS.panel); ctx.textAlign = 'left'
      ctx.fillStyle = `rgba(${GRAY},1)`
      ctx.fillText('UNIDADES.MES', PADX, row2Y0 + (compact ? 15 : 18))

      const metaY = barArea.base - metaFrac * maxBarH
      ctx.setLineDash([3, 4])
      ctx.strokeStyle = `rgba(${AMBAR},0.4)`
      ctx.beginPath()
      ctx.moveTo(barArea.x0, metaY); ctx.lineTo(barArea.x1, metaY)
      ctx.stroke()
      ctx.setLineDash([])
      // el label va sobre la línea, a la izquierda: a la derecha chocaba con
      // la última vela
      mono(FS.meta); ctx.textAlign = 'left'
      ctx.fillStyle = `rgba(${AMBAR},0.7)`
      ctx.fillText('META', barArea.x0, metaY - 4)

      // retarget suave de una barra aleatoria cada ~3.5s (sin cambiar
      // cuál es la más alta ni cuál está bajo meta)
      if (!reduced && t - lastRetarget > 3.5) {
        const ri = Math.floor(Math.random() * nBars)
        const jitter = (Math.random() - 0.5) * 0.06
        let nt = targetH[ri] + jitter
        if (ri === highestIdx) nt = Math.max(nt, 0.82)
        else if (targetH[ri] < metaFrac) nt = Math.min(nt, metaFrac - 0.06)
        else nt = Math.max(metaFrac + 0.05, Math.min(nt, 0.8))
        liveTarget[ri] = nt
        lastRetarget = t
      }

      ctx.textAlign = 'center'
      for (let b = 0; b < nBars; b++) {
        // crecimiento con easing + stagger inicial
        const grow = reduced ? 1 : easeOut(Math.max(0, Math.min(1, (t - startDelay[b]) / 0.9)))
        currentH[b] += (liveTarget[b] * grow - currentH[b]) * 0.06
        const bh = currentH[b] * maxBarH
        const cxB = barArea.x0 + b * barSlot + barSlot / 2
        const topY = barArea.base - bh
        const below = targetH[b] < metaFrac
        const col = b === highestIdx ? NEBLINA : below ? AMBAR : CIAN

        // cuerpo: vela delgada 3px
        ctx.fillStyle = `rgba(${col},0.55)`
        ctx.fillRect(cxB - 1.5, topY, 3, bh)
        // cap superior 14px
        ctx.fillStyle = `rgba(${col},0.95)`
        ctx.fillRect(cxB - 7, topY - 1, 14, 2)
        // dot brillante en el tope
        ctx.beginPath()
        ctx.arc(cxB, topY, 2, 0, 6.2832)
        ctx.fillStyle = `rgba(${col},1)`
        ctx.fill()
        // label
        mono(FS.bar)
        ctx.fillStyle = `rgba(${GRAY},0.85)`
        ctx.fillText(barLabels[b], cxB, barArea.base + (compact ? 11 : 14))
      }

      // ---------- TENDENCIA ----------
      mono(FS.panel); ctx.textAlign = 'left'
      ctx.fillStyle = `rgba(${GRAY},1)`
      ctx.fillText('TENDENCIA.SEMANAL', lineArea.x0 + 2, row2Y0 + (compact ? 15 : 18))
      const lh = lineArea.y1 - lineArea.y0
      const lMetaY = lineArea.y1 - lineMeta * lh
      ctx.setLineDash([3, 4])
      ctx.strokeStyle = `rgba(${AMBAR},0.4)`
      ctx.beginPath()
      ctx.moveTo(lineArea.x0, lMetaY); ctx.lineTo(lineArea.x1, lMetaY)
      ctx.stroke()
      ctx.setLineDash([])

      if (!reduced) {
        if (linePause > 0) {
          linePause -= 0.016
          if (linePause <= 0) { genSerie(); lineProg = 0 }
        } else {
          lineProg += 0.006
          if (lineProg >= 1) { lineProg = 1; linePause = 1.2 }
        }
      } else lineProg = 1

      const nPts = serie.length
      const lastIdx = Math.max(1, Math.floor(lineProg * (nPts - 1)))
      ctx.lineWidth = 1.4
      for (let i = 1; i <= lastIdx; i++) {
        const xA = lineArea.x0 + (lineArea.x1 - lineArea.x0) * (i - 1) / (nPts - 1)
        const yA = lineArea.y1 - serie[i - 1] * lh
        const xB2 = lineArea.x0 + (lineArea.x1 - lineArea.x0) * i / (nPts - 1)
        const yB = lineArea.y1 - serie[i] * lh
        const below = serie[i - 1] < lineMeta || serie[i] < lineMeta
        ctx.strokeStyle = below ? `rgba(${AMBAR},0.85)` : `rgba(${CIAN},0.85)`
        ctx.beginPath()
        ctx.moveTo(xA, yA); ctx.lineTo(xB2, yB)
        ctx.stroke()
      }
      if (!reduced && linePause <= 0) {
        const hx = lineArea.x0 + (lineArea.x1 - lineArea.x0) * lastIdx / (nPts - 1)
        const hy = lineArea.y1 - serie[lastIdx] * lh
        ctx.beginPath()
        ctx.arc(hx, hy, 2.2, 0, 6.2832)
        ctx.fillStyle = serie[lastIdx] < lineMeta ? `rgba(${AMBAR},1)` : `rgba(${CIAN},1)`
        ctx.fill()
      }

      // ---------- MINI GAUSS (sólo tablero de 4 paneles) ----------
      if (!compact) {
      mono(FS.panel); ctx.textAlign = 'left'
      ctx.fillStyle = `rgba(${GRAY},1)`
      ctx.fillText('PROCESO.σ', gA.x0 + 2, lineY1 + 18)
      ctx.strokeStyle = 'rgba(93,107,122,0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(gA.x0 + 4, gA.base + 0.5); ctx.lineTo(gA.x1 - 4, gA.base + 0.5)
      ctx.stroke()
      mono(7); ctx.textAlign = 'center'
      const gm: [number, string][] = [[-2, '−2σ'], [0, 'μ'], [2, '+2σ']]
      for (const [k, label] of gm) {
        ctx.fillStyle = k === 0 ? `rgba(${CIAN},0.9)` : `rgba(${GRAY},0.85)`
        ctx.fillText(label, gCx + k * gSigma, gA.base + 11)
      }
      for (const gp of gSettled) {
        const gout = Math.abs(gp.x) > 2 * gSigma
        const gtw = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * 1.5 + gp.ph)
        ctx.beginPath()
        ctx.arc(gCx + gp.x, gA.base - gp.yF * gF(gp.x) - 1, 0.8, 0, 6.2832)
        ctx.fillStyle = gout
          ? `rgba(${AMBAR},${(0.75 * gtw).toFixed(2)})`
          : `rgba(${CIAN},${(0.5 * gtw).toFixed(2)})`
        ctx.fill()
      }
      if (!reduced) {
        if (t - gLastSpawn > 0.5 && gFalling.length < 3) {
          gFalling.push({
            x: Math.max(-gMaxX, Math.min(gMaxX, randn() * gSigma)),
            y: lineY1 + 22, yT: Math.random(), v: 0,
          })
          gLastSpawn = t
        }
        for (let j = gFalling.length - 1; j >= 0; j--) {
          const q = gFalling[j]
          const yT = gA.base - q.yT * gF(q.x) - 1
          q.v += 0.4
          q.y += q.v
          if (q.y >= yT) {
            gSettled[gIdx] = { x: q.x, yF: q.yT, ph: Math.random() * 6.28 }
            gIdx = (gIdx + 1) % gSettled.length
            gFalling.splice(j, 1)
          } else {
            const gof = Math.abs(q.x) > 2 * gSigma
            ctx.beginPath()
            ctx.arc(gCx + q.x, q.y, 1.2, 0, 6.2832)
            ctx.fillStyle = gof ? `rgba(${AMBAR},0.95)` : `rgba(${CIAN},0.95)`
            ctx.fill()
          }
        }
      }
      ctx.strokeStyle = `rgba(${CIAN},0.8)`
      ctx.lineWidth = 1.2
      ctx.beginPath()
      for (let x = -gMaxX; x <= gMaxX; x += 3) {
        const y = gA.base - gF(x)
        if (x === -gMaxX) ctx.moveTo(gCx + x, y)
        else ctx.lineTo(gCx + x, y)
      }
      ctx.stroke()
      }   // fin mini-Gauss

      ctx.restore()
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

    if (reduced) { running = true; frame() }
    else rafId = requestAnimationFrame(frame)

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      observer.disconnect()
      if (mouseParallax) window.removeEventListener('mousemove', onMouse)
    }
  }, [width, height, compact, mouseParallax, laidOut])

  // Tarjeta recortada: fondo propio, borde y sombra hacen que el tablero se
  // despegue de la sección en vez de fundirse con ella. Frontal — sin
  // perspectiva ni rotación.
  return (
    <div
      className={className}
      style={{
        background: '#141F2E',
        border: '1px solid rgba(79,209,224,0.10)',
        borderRadius: 12,
        padding: 10,
        boxShadow: '0 16px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)',
        display: 'inline-block',
        lineHeight: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          width,
          height,
          display: 'block',
          borderRadius: 6,
          maxWidth: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
