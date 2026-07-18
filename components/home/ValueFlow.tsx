'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

// Brand tokens
const C_BG     = '#0E0B14'
const C_NODE   = '#141020'
const C_ORANGE = '#E07B30'
const C_PURPLE = '#7B4F96'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%'

function useScramble(
  finalText: string,
  trigger: boolean,
  speed: number = 30,
): string {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!trigger) return
    const total = finalText.length
    let frame = 0
    setDisplay('')

    const iv = setInterval(() => {
      frame++
      const revealed = Math.min(total, Math.floor(frame * 0.8))
      let d = ''
      for (let i = 0; i < total; i++) {
        if (finalText[i] === ' ') d += ' '
        else if (i < revealed) d += finalText[i]
        else if (i < revealed + 8)
          d += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        else d += ' '
      }
      setDisplay(d)
      if (revealed >= total) clearInterval(iv)
    }, speed)

    return () => clearInterval(iv)
  }, [trigger, finalText, speed])

  return display
}

const CTA_TEXT = 'Antes de buscar inteligencia artificial, busca procesos inteligentes.'
const CTA_ACCENT = 'procesos inteligentes.'

export function ValueFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [animate, setAnimate] = useState(false)
  const rm = useReducedMotion()

  const [inViewport, setInViewport] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setInViewport(e.isIntersecting),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (isInView) setAnimate(true)
  }, [isInView])

  const [scrambleTrigger, setScrambleTrigger] = useState(false)
  const scrambleText = useScramble(CTA_TEXT, scrambleTrigger)

  useEffect(() => {
    if (isInView) setScrambleTrigger(true)
  }, [isInView])

  const shouldAnimate = animate && !rm && inViewport

  const p = (delay: string): React.CSSProperties => ({
    animation: shouldAnimate
      ? `flowParticle 2.6s ease-in-out ${delay} infinite`
      : 'none',
    strokeLinecap: 'round' as const,
    fill: 'none',
  })

  const titleId = 'vf-title'
  const descId  = 'vf-desc'

  return (
    <section
      id="el-enfoque"
      ref={ref}
      aria-labelledby="vf-section-title"
      style={{
        background: C_BG,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '24px 48px',
      }}
    >
      {/* Kicker */}
      <p style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--font-geist-mono)', fontSize: 10,
        letterSpacing: '2px', color: C_ORANGE,
        textTransform: 'uppercase', marginBottom: 16, marginTop: 0,
      }}>
        <span aria-hidden style={{ width: 28, height: 1, background: C_ORANGE, display: 'inline-block', flexShrink: 0 }} />
        EL FLUJO DE VALOR
      </p>

      {/* Titulo H2 */}
      <h2
        id="vf-section-title"
        style={{
          fontSize: 'clamp(18px,2.5vw,28px)', fontWeight: 900,
          fontFamily: 'var(--font-sans)', color: '#fff',
          lineHeight: 1.12, margin: '0 0 16px',
        }}
      >
        No todo es IA.{' '}
        <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontWeight: 700, color: C_ORANGE }}>
          Primero vienen las condiciones.
        </span>
      </h2>

      {/* Contexto — desktop only */}
      <p className="hidden md:block" style={{
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 'clamp(11px,1.2vw,18px)',
        color: 'rgba(255,255,255,0.50)',
        letterSpacing: '0.03em',
        lineHeight: 1.6,
        margin: '0 0 clamp(20px,3vw,32px)',
      }}>
        El vacío del mercado no es tecnológico,{' '}
        <span style={{ color: C_ORANGE }}>es operativo.</span>
      </p>

      {/* SVG diagrama — desktop only */}
      <div className="hidden md:flex" style={{ justifyContent: 'center', width: '100%' }}>
      <svg
        width="100%"
        viewBox="0 0 760 400"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        focusable="false"
        style={{ display: 'block', width: '100%', maxWidth: '1100px', margin: '0 auto', overflowX: 'hidden' }}
      >
        <title id={titleId}>Flujo de valor Yeti BI</title>
        <desc id={descId}>
          Proceso habilitado para tecnología y Dato confiable alimentan Automatización (RPA, SOPs, Flujos),
          que conecta directo al ROI medible con impacto del 70–80%.
          IA que Decide es una ruta opcional posterior a Automatización con impacto del 15–20%,
          solo si el diagnóstico lo justifica.
        </desc>

        {/* Labels de etapa */}
        <text x="162" y="22" textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)" letterSpacing="2">FUNDAMENTOS</text>
        <text x="400" y="22" textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)" letterSpacing="2">HABILITACIÓN TECNOLÓGICA</text>
        <text x="650" y="22" textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)" letterSpacing="2">IMPACTO MEDIBLE</text>

        {/* Divisores */}
        <line x1="320" y1="30" x2="320" y2="380" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="520" y1="30" x2="520" y2="380" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* CALLOUT 1 */}
        <rect x="12" y="32" width="172" height="96" rx="6"
          fill="rgba(224,123,48,0.10)" stroke="rgba(224,123,48,0.30)" strokeWidth=".8" />
        <text x="22" y="48"  fontSize="8" fontFamily="var(--font-geist-mono)" fontWeight="700" fill={C_ORANGE} letterSpacing="1">★ NUESTRO DIFERENCIAL</text>
        <text x="22" y="61"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.45)">Los procesos se degradan y</text>
        <text x="22" y="73"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.45)">quedan obsoletos. Mejorar</text>
        <text x="22" y="85"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.45)">esta base ya genera resultados</text>
        <text x="22" y="97"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.45)">— sin tecnología.</text>
        <text x="22" y="110" fontSize="8" fontFamily="var(--font-geist-mono)" fontStyle="italic" fill="rgba(224,123,48,0.7)">Habilitamos antes de automatizar.</text>
        <line x1="98" y1="128" x2="98" y2="234" stroke="rgba(224,123,48,0.4)" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="94,234 98,242 102,234" fill="rgba(224,123,48,0.5)" />

        {/* CALLOUT 2 */}
        <rect x="324" y="32" width="172" height="80" rx="6"
          fill="rgba(224,123,48,0.10)" stroke="rgba(224,123,48,0.30)" strokeWidth=".8" />
        <text x="334" y="48"  fontSize="8" fontFamily="var(--font-geist-mono)" fontWeight="700" fill={C_ORANGE} letterSpacing="1">ANTES DE LA IA</text>
        <text x="334" y="62"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">Sin automatización sólida,</text>
        <text x="334" y="75"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">la IA no tiene datos limpios</text>
        <text x="334" y="88"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">ni procesos para aprender.</text>
        <line x1="410" y1="112" x2="410" y2="194" stroke="rgba(224,123,48,0.4)" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="406,194 410,202 414,194" fill="rgba(224,123,48,0.5)" />

        {/* CALLOUT 3 */}
        <rect x="566" y="32" width="172" height="80" rx="6"
          fill="rgba(224,123,48,0.10)" stroke="rgba(224,123,48,0.35)" strokeWidth=".8" />
        <text x="576" y="48"  fontSize="8" fontFamily="var(--font-geist-mono)" fontWeight="700" fill={C_ORANGE} letterSpacing="1">PROPÓSITO SISTÉMICO</text>
        <text x="576" y="62"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">Si no impacta el ROI,</text>
        <text x="576" y="75"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">el proyecto no cumple</text>
        <text x="576" y="88"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">su propósito.</text>
        <line x1="652" y1="112" x2="652" y2="194" stroke="rgba(224,123,48,0.4)" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="648,194 652,202 656,194" fill="rgba(224,123,48,0.5)" />

        {/* TRACKS */}
        <path d="M148,270 L180,270" stroke="rgba(224,123,48,0.20)" strokeWidth="1.5" fill="none" />
        <path d="M304,270 C340,270 340,230 358,230" stroke="rgba(224,123,48,0.20)" strokeWidth="1.5" fill="none" />
        <path d="M482,230 C516,230 516,270 584,270" stroke="rgba(224,123,48,0.20)" strokeWidth="1.5" fill="none" />
        <path d="M420,262 L420,322" stroke="rgba(120,60,160,0.30)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <path d="M482,350 C516,350 516,270 584,270" stroke="rgba(120,60,160,0.20)" strokeWidth="1.5" fill="none" />

        {/* PARTICULAS */}
        <path className="vf-p" d="M148,270 L180,270"           stroke={C_ORANGE} strokeWidth="2.5" strokeDasharray="14 226" style={p('0s')} />
        <path className="vf-p" d="M304,270 C340,270 340,230 358,230" stroke={C_ORANGE} strokeWidth="2"   strokeDasharray="14 226" style={p('0.8s')} />
        <path className="vf-p" d="M482,230 C516,230 516,270 584,270" stroke={C_ORANGE} strokeWidth="2"   strokeDasharray="14 226" style={p('1.6s')} />
        <path className="vf-p" d="M420,262 L420,322"           stroke={C_PURPLE} strokeWidth="1.5" strokeDasharray="14 226" style={p('2.0s')} />
        <path className="vf-p" d="M482,350 C516,350 516,270 584,270" stroke={C_PURPLE} strokeWidth="1.5" strokeDasharray="14 226" style={p('2.6s')} />

        {/* N1 PROCESO */}
        <rect x="16" y="242" width="132" height="56" rx="10"
          fill={C_NODE} stroke="rgba(224,123,48,0.40)" strokeWidth="1" />
        <text x="82" y="264" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.95)">PROCESO</text>
        <text x="82" y="279" textAnchor="middle" fontSize="8"  fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">habilitado para tecnología</text>
        <circle cx="148" cy="270" r="3" fill={C_ORANGE} />

        {/* N2 DATO */}
        <rect x="180" y="242" width="124" height="56" rx="10"
          fill={C_NODE} stroke="rgba(224,123,48,0.35)" strokeWidth="1" />
        <text x="242" y="264" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.95)">DATO</text>
        <text x="242" y="279" textAnchor="middle" fontSize="9"  fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">confiable</text>
        <circle cx="180" cy="270" r="3" fill={C_ORANGE} />
        <circle cx="304" cy="270" r="4" fill="rgba(224,123,48,0.55)" />

        {/* N3 AUTOMATIZACION */}
        <rect x="358" y="202" width="124" height="60" rx="10"
          fill={C_NODE} stroke="rgba(224,123,48,0.50)" strokeWidth="1.2" />
        <text x="420" y="222" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.95)">AUTOMATIZACIÓN</text>
        <text x="420" y="236" textAnchor="middle" fontSize="9"  fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">RPA · SOPs · Flujos</text>
        <text x="420" y="252" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="var(--font-geist-mono)" fill={C_ORANGE}>70–80%</text>
        <rect x="488" y="207" width="80" height="16" rx="3"
          fill="rgba(224,123,48,0.15)" stroke="rgba(224,123,48,0.40)" strokeWidth=".8" />
        <text x="528" y="219" textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill={C_ORANGE}>ROI DIRECTO</text>
        <circle cx="358" cy="230" r="3" fill={C_ORANGE} />
        <circle cx="482" cy="230" r="3" fill={C_ORANGE} />
        <circle cx="420" cy="262" r="3" fill="rgba(120,60,160,0.70)" />

        {/* N4 IA QUE DECIDE */}
        <rect x="358" y="322" width="124" height="56" rx="10"
          fill={C_NODE} stroke="rgba(120,60,160,0.50)" strokeWidth="1" />
        <text x="420" y="342" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.95)">IA QUE DECIDE</text>
        <text x="420" y="356" textAnchor="middle" fontSize="9"  fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">Modelos · Decisión</text>
        <text x="420" y="372" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="var(--font-geist-mono)" fill={C_PURPLE}>15–20%</text>
        <rect x="488" y="327" width="86" height="16" rx="3"
          fill="rgba(120,60,160,0.12)" stroke="rgba(120,60,160,0.40)" strokeWidth=".8" />
        <text x="531" y="339" textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono)" fill="rgba(200,140,240,0.90)">SI LO JUSTIFICA</text>
        <circle cx="420" cy="322" r="3" fill={C_PURPLE} />
        <circle cx="482" cy="350" r="3" fill={C_PURPLE} />
        <text x="436" y="292" fontSize="8" fontFamily="var(--font-geist-mono)" fontStyle="italic" fill="rgba(255,255,255,0.50)">solo si el diagnóstico</text>
        <text x="436" y="304" fontSize="8" fontFamily="var(--font-geist-mono)" fontStyle="italic" fill="rgba(255,255,255,0.50)">lo justifica</text>

        {/* Leyenda */}
        <circle cx="220" cy="390" r="4" fill={C_ORANGE} />
        <text x="230" y="394" fontSize="8" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">Ruta principal (automatización → ROI)</text>
        <circle cx="460" cy="390" r="4" fill={C_PURPLE} />
        <text x="470" y="394" fontSize="8" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">Ruta opcional (IA, si el diagnóstico lo justifica)</text>

        {/* N5 ROI MEDIBLE */}
        {shouldAnimate && (
          <>
            <circle className="vf-rp" cx="630" cy="270" r="18" fill="none" stroke={C_ORANGE} strokeWidth="1"
              style={{ animation: 'roiPulse 2s ease-out infinite' }} />
            <circle className="vf-rp" cx="630" cy="270" r="18" fill="none" stroke={C_ORANGE} strokeWidth="1"
              style={{ animation: 'roiPulse 2s ease-out 1.1s infinite' }} />
          </>
        )}
        <circle cx="630" cy="270" r="46" fill="rgba(224,123,48,0.05)" stroke="rgba(224,123,48,0.10)" strokeWidth="1" />
        <circle cx="630" cy="270" r="32" fill="rgba(224,123,48,0.09)" stroke="rgba(224,123,48,0.18)" strokeWidth="1" />
        <circle cx="630" cy="270" r="18" fill="rgba(224,123,48,0.18)" stroke="rgba(224,123,48,0.35)" strokeWidth="1" />
        <circle cx="630" cy="270" r="7"  fill={C_ORANGE} />
        <text x="630" y="322" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.95)">ROI MEDIBLE</text>
        <text x="630" y="336" textAnchor="middle" fontSize="9"  fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">el único resultado</text>
        <circle cx="584" cy="270" r="3" fill={C_ORANGE} />
      </svg>
      </div>

      {/* CTA desktop — ScrambleText */}
      <div className="hidden md:block" style={{
        marginTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 16,
      }}>
        <p style={{
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          fontSize: 'clamp(13px,1.8vw,17px)',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1.5,
          textAlign: 'center',
          minHeight: '2.5em',
          margin: 0,
        }}>
          {(() => {
            const ai = scrambleText.indexOf(CTA_ACCENT)
            if (ai > -1 && scrambleTrigger) {
              return (
                <>
                  {scrambleText.slice(0, ai)}
                  <span style={{ color: C_ORANGE, fontWeight: 900 }}>
                    {scrambleText.slice(ai)}
                  </span>
                </>
              )
            }
            return scrambleText || ' '
          })()}
        </p>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="flex md:hidden flex-col" style={{ gap: 0, width: '100%', padding: '0 20px' }}>

        {/* BLOQUE 1 — FUNDAMENTOS */}
        <p style={{ fontSize: 9, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10, marginTop: 0 }}>FUNDAMENTOS</p>

        <div style={{ padding: '12px 14px', borderLeft: '2px solid #E07B30', background: 'rgba(224,123,48,0.06)', borderRadius: '0 6px 6px 0', marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', fontWeight: 700, color: C_ORANGE, margin: '0 0 5px' }}>★ NUESTRO DIFERENCIAL</p>
          <p style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 5px' }}>
            Los procesos se degradan y quedan obsoletos. Mejorar esta base ya genera resultados — sin tecnología.
          </p>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', fontStyle: 'italic', color: 'rgba(224,123,48,0.8)', margin: 0 }}>Habilitamos antes de automatizar.</p>
        </div>

        <div style={{ padding: 14, background: C_NODE, border: '1px solid rgba(224,123,48,0.3)', borderRadius: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-geist-mono)', color: '#fff', margin: '0 0 3px' }}>PROCESO</p>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>habilitado para tecnología</p>
        </div>

        {/* Conector entre PROCESO y DATO */}
        <div style={{ height: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 2, height: '100%', background: 'rgba(224,123,48,0.3)' }} />
        </div>

        <div style={{ padding: 14, background: C_NODE, border: '1px solid rgba(224,123,48,0.3)', borderRadius: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-geist-mono)', color: '#fff', margin: '0 0 3px' }}>DATO</p>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.5)', margin: 0 }}>confiable</p>
        </div>

        {/* Conector 1 — naranja */}
        <div style={{ height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 2, height: '100%', background: 'linear-gradient(to bottom, rgba(224,123,48,0.6), rgba(224,123,48,0.15))', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: C_ORANGE, left: '50%', transform: 'translateX(-50%)', animation: shouldAnimate ? 'mobileParticle 1.8s ease-in-out infinite' : 'none', top: -6 }} />
            <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: C_ORANGE, left: '50%', transform: 'translateX(-50%)', animation: shouldAnimate ? 'mobileParticle 1.8s ease-in-out 0.9s infinite' : 'none', top: -6 }} />
          </div>
          <div style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid rgba(224,123,48,0.5)', flexShrink: 0 }} />
        </div>

        {/* BLOQUE 2 — HABILITACION TECNOLOGICA */}
        <p style={{ fontSize: 9, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10, marginTop: 0 }}>HABILITACIÓN TECNOLÓGICA</p>

        <div style={{ padding: '12px 14px', borderLeft: '2px solid #7B4F96', background: 'rgba(120,60,160,0.06)', borderRadius: '0 6px 6px 0', marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', fontWeight: 700, color: 'rgba(180,100,220,0.9)', margin: '0 0 5px' }}>⚡ ANTES DE LA IA</p>
          <p style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 5px' }}>
            Sin automatización sólida, la IA no tiene datos limpios ni procesos para aprender.
          </p>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            McKinsey: 70% de proyectos de IA en pymes fallan por no automatizar primero.
          </p>
        </div>

        {/* Nodo AUTOMATIZACIÓN */}
        <div style={{ padding: 14, background: C_NODE, border: '1px solid rgba(224,123,48,0.4)', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-geist-mono)', color: '#fff', margin: 0 }}>AUTOMATIZACIÓN</p>
            <span style={{ background: 'rgba(224,123,48,0.1)', border: '1px solid rgba(224,123,48,0.3)', color: C_ORANGE, fontSize: 8, padding: '2px 7px', borderRadius: 3, fontFamily: 'var(--font-geist-mono)' }}>ROI DIRECTO</span>
          </div>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>RPA · SOPs · Flujos</p>
          <p style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-geist-mono)', color: C_ORANGE, marginTop: 8, marginBottom: 0 }}>70–80%</p>
        </div>

        {/* Zona de fork: naranja centro baja a ROI, punteado derecha baja a IA */}
        <div style={{ position: 'relative', height: 52 }}>
          {/* Naranja al centro — ruta principal */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, transform: 'translateX(-50%)', background: 'linear-gradient(to bottom, rgba(224,123,48,0.7), rgba(224,123,48,0.3))', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: C_ORANGE, left: '50%', transform: 'translateX(-50%)', animation: shouldAnimate ? 'mobileParticle 1.8s ease-in-out 1.2s infinite' : 'none', top: -6 }} />
            <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: C_ORANGE, left: '50%', transform: 'translateX(-50%)', animation: shouldAnimate ? 'mobileParticle 1.8s ease-in-out 2.1s infinite' : 'none', top: -6 }} />
          </div>
          {/* Punteado derecha — rama opcional IA */}
          <div style={{ position: 'absolute', right: '8%', top: 0, bottom: 0, width: 1, borderLeft: '1px dashed rgba(120,60,160,0.5)' }}>
            <div style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: C_PURPLE, left: '50%', transform: 'translateX(-50%)', animation: shouldAnimate ? 'mobileParticle 2s ease-in-out 0.4s infinite' : 'none', top: -5 }} />
          </div>
          {/* Flecha naranja */}
          <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid rgba(224,123,48,0.6)' }} />
          {/* Flecha punteada derecha */}
          <div style={{ position: 'absolute', right: '8%', bottom: 0, transform: 'translateX(50%)', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '6px solid rgba(120,60,160,0.5)' }} />
        </div>

        {/* IA QUE DECIDE — ancho completo, naranja pasa por su lado derecho */}
        <div style={{ position: 'relative' }}>
          {/* Línea naranja que pasa por el lado derecho de la caja de IA */}
          <div style={{ position: 'absolute', right: '8%', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, rgba(224,123,48,0.3), rgba(224,123,48,0.3))', zIndex: 1 }}>
            <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: C_ORANGE, left: '50%', transform: 'translateX(-50%)', animation: shouldAnimate ? 'mobileParticle 1.8s ease-in-out 1.5s infinite' : 'none', top: -6 }} />
          </div>
          <div style={{ padding: 14, background: C_NODE, border: '1px solid rgba(120,60,160,0.4)', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-geist-mono)', color: '#fff', margin: 0 }}>IA QUE DECIDE</p>
              <span style={{ background: 'rgba(120,60,160,0.12)', border: '1px solid rgba(120,60,160,0.3)', color: 'rgba(180,100,220,0.8)', fontSize: 8, padding: '2px 7px', borderRadius: 3, fontFamily: 'var(--font-geist-mono)', marginRight: 18 }}>SI LO JUSTIFICA</span>
            </div>
            <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>Modelos · Decisión</p>
            <p style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-geist-mono)', color: C_PURPLE, marginTop: 8, marginBottom: 0 }}>15–20%</p>
          </div>
        </div>

        {/* Conector: naranja sale del lado derecho y converge al centro hacia ROI */}
        <div style={{ position: 'relative', height: 52 }}>
          {/* Línea naranja derecha que baja y converge */}
          <div style={{ position: 'absolute', right: '8%', top: 0, height: '60%', width: 2, background: 'rgba(224,123,48,0.4)' }} />
          {/* Línea horizontal que une derecha con centro */}
          <div style={{ position: 'absolute', right: '8%', top: '60%', left: '50%', height: 2, background: 'rgba(224,123,48,0.4)', transform: 'translateY(-50%)' }} />
          {/* Línea naranja centro que baja a ROI */}
          <div style={{ position: 'absolute', left: '50%', top: '60%', bottom: 0, width: 2, transform: 'translateX(-50%)', background: 'linear-gradient(to bottom, rgba(224,123,48,0.5), rgba(224,123,48,0.2))', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: C_ORANGE, left: '50%', transform: 'translateX(-50%)', animation: shouldAnimate ? 'mobileParticle 1.8s ease-in-out 0.6s infinite' : 'none', top: -6 }} />
          </div>
          {/* Flecha al ROI */}
          <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '7px solid rgba(224,123,48,0.5)', flexShrink: 0 }} />
        </div>

        {/* BLOQUE 3 — IMPACTO MEDIBLE */}
        <p style={{ fontSize: 9, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10, marginTop: 0 }}>IMPACTO MEDIBLE</p>

        <div style={{ padding: '12px 14px', borderLeft: '2px solid rgba(224,123,48,0.6)', background: 'rgba(224,123,48,0.08)', borderRadius: '0 6px 6px 0', marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', fontWeight: 700, color: C_ORANGE, margin: '0 0 5px' }}>◆ PROPÓSITO SISTÉMICO</p>
          <p style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: '0 0 5px' }}>
            Si no impacta el ROI, el proyecto no cumple su propósito.
          </p>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', fontStyle: 'italic', color: C_ORANGE, margin: 0 }}>Medimos relaciones, no eventos.</p>
        </div>

        <div style={{ padding: '20px 14px', background: 'rgba(224,123,48,0.08)', border: '1px solid #E07B30', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: C_ORANGE, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(224,123,48,0.3)' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#0E0B14' }} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-geist-mono)', color: '#fff', margin: 0 }}>ROI MEDIBLE</p>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.5)', marginTop: 4, marginBottom: 0 }}>el único resultado</p>
        </div>

        {/* Leyenda — debajo de ROI, antes del CTA */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C_ORANGE, flexShrink: 0 }} />
            <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Ruta principal (automatización → ROI)</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C_PURPLE, flexShrink: 0 }} />
            <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Ruta opcional (IA, si el diagnóstico lo justifica)</p>
          </div>
        </div>

        {/* CTA narrativo mobile */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
            El vacío del mercado no es tecnológico,{' '}
            <span style={{ color: C_ORANGE, fontWeight: 700 }}>es operativo.</span>
          </p>
          <p style={{ fontSize: 15, fontFamily: 'var(--font-geist-mono)', color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginTop: 8, marginBottom: 0 }}>
            Antes de buscar inteligencia artificial,
          </p>
          <p style={{ fontSize: 15, fontFamily: 'var(--font-geist-mono)', color: C_ORANGE, fontWeight: 700, marginTop: 0, marginBottom: 0 }}>
            busca procesos inteligentes.
          </p>
        </div>

      </div>

    </section>
  )
}
