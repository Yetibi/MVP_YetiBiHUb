'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from 'ogl'

const vertex = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uAlpha;
  uniform vec2 uResolution;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(tMap, vUv);
    gl_FragColor = vec4(color.rgb, color.a * uAlpha);
  }
`

interface Item {
  num: string
  title: string
  desc: string
  tag: string
  alert?: {
    title: string
    text: string
    formats: string
  }
}

interface Props {
  items: Item[]
  bend?: number
  textColor?: string
  borderRadius?: number
  font?: string
}

// Helper: dibuja texto con word-wrap, devuelve la Y final
function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ')
  let line = ''
  let y = startY
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, y)
      line = word + ' '
      y += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, y)
  return y + lineHeight
}

function createCanvas(item: Item, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width * 2
  canvas.height = height * 2
  const ctx = canvas.getContext('2d')!
  ctx.scale(2, 2)

  const PAD = 20        // padding horizontal
  const maxW = width - PAD * 2

  // Fondo oscuro
  ctx.fillStyle = '#0E0B14'
  ctx.fillRect(0, 0, width, height)

  // Línea superior sutil
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(0, 0, width, 1)

  // Número decorativo de fondo — anclado a la esquina superior derecha
  ctx.save()
  ctx.font = 'bold 100px sans-serif'
  ctx.fillStyle = 'rgba(224,123,48,0.07)'
  ctx.textAlign = 'right'
  ctx.fillText(item.num, width - PAD, 90)
  ctx.restore()

  // ── Ícono circular (y fijo: centrado en 52) ──
  const iconCY = 52
  ctx.beginPath()
  ctx.arc(PAD + 22, iconCY, 22, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(224,123,48,0.35)'
  ctx.lineWidth = 1
  ctx.stroke()
  // dot central
  ctx.beginPath()
  ctx.arc(PAD + 22, iconCY, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#E07B30'
  ctx.fill()

  // ── Título (debajo del ícono, con margen) ──
  let y = iconCY + 22 + 20   // base = bottom del ícono + margen

  ctx.font = 'bold 17px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  // Título en una línea (puede recortarse con ellipsis manual si es muy largo)
  ctx.fillText(item.title, PAD, y)
  y += 26

  // ── Descripción con wrap ──
  ctx.font = '12px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  y = drawWrapped(ctx, item.desc, PAD, y, maxW, 19)
  y += 8

  // ── Alerta (solo paso 1) ──
  if (item.alert) {
    const alertH = 78
    ctx.fillStyle = 'rgba(224,123,48,0.07)'
    ctx.fillRect(PAD, y, maxW, alertH)
    // borde izquierdo
    ctx.fillStyle = '#E07B30'
    ctx.fillRect(PAD, y, 2, alertH)

    const ax = PAD + 10
    // título alerta
    ctx.font = 'bold 8px sans-serif'
    ctx.fillStyle = '#E07B30'
    ctx.fillText(item.alert.title.toUpperCase(), ax, y + 14)
    // texto alerta
    ctx.font = '10px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillText(item.alert.text, ax, y + 30)
    // formatos
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.fillText(item.alert.formats, ax, y + 48)

    y += alertH + 12
  }

  // ── Tag ──
  ctx.font = '9px monospace'
  ctx.fillStyle = '#E07B30'
  ctx.textAlign = 'left'
  ctx.fillText(item.tag.toUpperCase(), PAD, y + 10)

  return canvas
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px sans-serif',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({ alpha: true })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(gl.canvas)

    const camera = new Camera(gl, { fov: 35 })
    camera.position.set(0, 0, 5)

    const scene = new Transform()

    const CARD_W = 1.8
    const CARD_H = 2.7   // ratio 1:1.5 para canvas 400×600
    const N = items.length
    const radius = (N * CARD_W) / (2 * Math.PI) + bend

    const meshes: Mesh[] = []
    const CANVAS_W = 400
    const CANVAS_H = 600  // más alto = más espacio para el contenido

    items.forEach((item, i) => {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2
      const cvs = createCanvas(item, CANVAS_W, CANVAS_H)
      const texture = new Texture(gl, { image: cvs })

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tMap: { value: texture },
          uAlpha: { value: 1 },
          uResolution: { value: [CANVAS_W, CANVAS_H] },
          uTime: { value: 0 },
        },
        transparent: true,
      })

      const geometry = new Plane(gl, {
        width: CARD_W,
        height: CARD_H,
        widthSegments: 1,
        heightSegments: 1,
      })

      const mesh = new Mesh(gl, { geometry, program })
      mesh.position.x = Math.cos(angle) * radius
      mesh.position.z = Math.sin(angle) * radius
      mesh.rotation.y = -angle + Math.PI / 2
      mesh.setParent(scene)
      meshes.push(mesh)
    })

    let currentAngle = 0
    let targetAngle = 0

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      targetAngle += e.deltaY * 0.002
    }

    container.addEventListener('wheel', handleScroll, { passive: false })

    function resize() {
      renderer.setSize(container!.offsetWidth, container!.offsetHeight)
      camera.perspective({
        aspect: gl.canvas.width / gl.canvas.height,
      })
    }
    resize()
    window.addEventListener('resize', resize)

    let animId: number
    function update() {
      animId = requestAnimationFrame(update)
      currentAngle += (targetAngle - currentAngle) * 0.08

      meshes.forEach((mesh, i) => {
        const angle = (i / N) * Math.PI * 2 - Math.PI / 2 + currentAngle
        mesh.position.x = Math.cos(angle) * radius
        mesh.position.z = Math.sin(angle) * radius
        mesh.rotation.y = -angle + Math.PI / 2
      })

      renderer.render({ scene, camera })
    }
    update()

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('wheel', handleScroll)
      window.removeEventListener('resize', resize)
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas)
      }
    }
  }, [items, bend])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'grab',
      }}
    />
  )
}
