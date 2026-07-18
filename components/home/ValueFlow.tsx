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
        padding: 'clamp(48px,7vw,80px) clamp(16px,5vw,40px) clamp(48px,7vw,80px)',
      }}
    >
      {/* ── Kicker ── */}
      <p style={{
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'var(--font-geist-mono)', fontSize: 10,
        letterSpacing: '2px', color: C_ORANGE,
        textTransform: 'uppercase', marginBottom: 16, marginTop: 0,
      }}>
        <span aria-hidden style={{ width: 28, height: 1, background: C_ORANGE, display: 'inline-block', flexShrink: 0 }} />
        EL FLUJO DE VALOR
      </p>

      {/* ── Título H2 ── */}
      <h2
        id="vf-section-title"
        style={{
          fontSize: 'clamp(24px,3vw,38px)', fontWeight: 900,
          fontFamily: 'var(--font-sans)', color: '#fff',
          lineHeight: 1.12, margin: '0 0 clamp(24px,4vw,40px)',
        }}
      >
        No todo es IA.{' '}
        <span style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontWeight: 700, color: C_ORANGE }}>
          Primero vienen las condiciones.
        </span>
      </h2>

      {/* ── Contexto encima del diagrama ── */}
      <p style={{
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

      {/* ── SVG diagrama ── */}
      <svg
        width="100%"
        viewBox="0 0 760 400"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        focusable="false"
        style={{ display: 'block', maxWidth: '100%', overflowX: 'hidden' }}
      >
        <title id={titleId}>Flujo de valor Yeti BI</title>
        <desc id={descId}>
          Proceso habilitado para tecnología y Dato confiable alimentan Automatización (RPA, SOPs, Flujos),
          que conecta directo al ROI medible con impacto del 70–80%.
          IA que Decide es una ruta opcional posterior a Automatización con impacto del 15–20%,
          solo si el diagnóstico lo justifica.
        </desc>

        {/* ── Labels de etapa ── */}
        <text x="162" y="22" textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)" letterSpacing="2">FUNDAMENTOS</text>
        <text x="400" y="22" textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)" letterSpacing="2">HABILITACIÓN TECNOLÓGICA</text>
        <text x="650" y="22" textAnchor="middle" fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)" letterSpacing="2">IMPACTO MEDIBLE</text>

        {/* Divisores */}
        <line x1="320" y1="30" x2="320" y2="380" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="520" y1="30" x2="520" y2="380" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* ── CALLOUTS — width=172 height=80 los 3 ── */}

        {/* CALLOUT 1 */}
        <rect x="12" y="32" width="172" height="80" rx="6"
          fill="rgba(224,123,48,0.10)" stroke="rgba(224,123,48,0.30)" strokeWidth=".8" />
        <text x="22" y="48"  fontSize="8" fontFamily="var(--font-geist-mono)" fontWeight="700" fill={C_ORANGE} letterSpacing="1">NUESTRO DIFERENCIAL</text>
        <text x="22" y="62"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">Los procesos se degradan y</text>
        <text x="22" y="75"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">quedan obsoletos. Habilitamos</text>
        <text x="22" y="88"  fontSize="9" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.75)">antes de automatizar o IA.</text>
        <line x1="98" y1="112" x2="98" y2="234" stroke="rgba(224,123,48,0.4)" strokeWidth="1" strokeDasharray="3 3" />
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

        {/* ── TRACKS ── */}
        <path d="M148,270 L180,270" stroke="rgba(224,123,48,0.20)" strokeWidth="1.5" fill="none" />
        <path d="M304,270 C340,270 340,230 358,230" stroke="rgba(224,123,48,0.20)" strokeWidth="1.5" fill="none" />
        <path d="M482,230 C516,230 516,270 584,270" stroke="rgba(224,123,48,0.20)" strokeWidth="1.5" fill="none" />
        <path d="M420,262 L420,322" stroke="rgba(120,60,160,0.30)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <path d="M482,350 C516,350 516,270 584,270" stroke="rgba(120,60,160,0.20)" strokeWidth="1.5" fill="none" />

        {/* ── PARTÍCULAS ── */}
        <path className="vf-p" d="M148,270 L180,270"           stroke={C_ORANGE} strokeWidth="2.5" strokeDasharray="14 226" style={p('0s')} />
        <path className="vf-p" d="M304,270 C340,270 340,230 358,230" stroke={C_ORANGE} strokeWidth="2"   strokeDasharray="14 226" style={p('0.8s')} />
        <path className="vf-p" d="M482,230 C516,230 516,270 584,270" stroke={C_ORANGE} strokeWidth="2"   strokeDasharray="14 226" style={p('1.6s')} />
        <path className="vf-p" d="M420,262 L420,322"           stroke={C_PURPLE} strokeWidth="1.5" strokeDasharray="14 226" style={p('2.0s')} />
        <path className="vf-p" d="M482,350 C516,350 516,270 584,270" stroke={C_PURPLE} strokeWidth="1.5" strokeDasharray="14 226" style={p('2.6s')} />

        {/* ── NODOS ── */}

        {/* N1 — PROCESO */}
        <rect x="16" y="242" width="132" height="56" rx="10"
          fill={C_NODE} stroke="rgba(224,123,48,0.40)" strokeWidth="1" />
        <text x="82" y="264" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.95)">PROCESO</text>
        <text x="82" y="279" textAnchor="middle" fontSize="8"  fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">habilitado para tecnología</text>
        <circle cx="148" cy="270" r="3" fill={C_ORANGE} />

        {/* N2 — DATO */}
        <rect x="180" y="242" width="124" height="56" rx="10"
          fill={C_NODE} stroke="rgba(224,123,48,0.35)" strokeWidth="1" />
        <text x="242" y="264" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.95)">DATO</text>
        <text x="242" y="279" textAnchor="middle" fontSize="9"  fontFamily="var(--font-geist-mono)" fill="rgba(255,255,255,0.70)">confiable</text>
        <circle cx="180" cy="270" r="3" fill={C_ORANGE} />
        <circle cx="304" cy="270" r="4" fill="rgba(224,123,48,0.55)" />

        {/* N3 — AUTOMATIZACIÓN */}
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

        {/* N4 — IA QUE DECIDE */}
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

        {/* N5 — ROI MEDIBLE */}
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

      {/* ── CTA con ScrambleText debajo del diagrama ── */}
      <div style={{
        marginTop: 24,
        padding: '0 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 24,
      }}>
        <p style={{
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          fontSize: 'clamp(16px,2.5vw,22px)',
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
            return scrambleText || ' '
          })()}
        </p>
      </div>

    </section>
  )
}
