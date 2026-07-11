'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

const FLOW_STEPS = [
  { label: 'PROCESO', sub: 'claro y sano', pct: null },
  { label: 'DATO', sub: 'confiable', pct: null },
  { label: 'AUTOMATIZACIÓN', sub: 'RPA · SOPs · Flujos', pct: '70–80%' },
  { label: 'IA QUE DECIDE', sub: 'Modelos · Decisión', pct: '15–20%' },
  { label: 'ROI MEDIBLE', sub: 'el único resultado', pct: null },
]

export function ValueFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [animate, setAnimate] = useState(false)
  const rm = useReducedMotion()

  useEffect(() => {
    if (isInView) setAnimate(true)
  }, [isInView])

  return (
    <section id="el-enfoque" ref={ref} style={{ padding: 'clamp(60px,10vw,120px) clamp(16px,5vw,40px)', background: '#2E2640', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Título */}
      <div style={{ marginBottom: 64, width: '100%' }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ width: 32, height: 1, background: '#E07B30', display: 'inline-block' }}/>
          EL FLUJO DE VALOR
        </p>
        <h2 style={{
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.1,
          maxWidth: 700
        }}>
          No todo es IA.{' '}
          <span style={{
            fontFamily: 'var(--font-playfair)',
            fontStyle: 'italic',
            color: '#E07B30'
          }}>
            La claridad es la condición para el éxito.
          </span>
        </h2>
      </div>

      {/* Fallback mobile — visible solo en <640px, oculto en md+ */}
      <ol
        className="flex flex-col w-full sm:hidden"
        style={{ gap: 0, listStyle: 'none', margin: '0 0 48px', padding: 0 }}
        aria-label="Flujo de valor Yeti BI"
      >
        {FLOW_STEPS.map((step, i) => (
          <li key={step.label} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 0' }}>
              {/* Conector vertical */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: step.pct ? 'rgba(224,123,48,0.5)' : '#E07B30',
                  border: '1.5px solid #E07B30', flexShrink: 0,
                  opacity: animate ? 1 : (rm ? 1 : 0),
                  transition: rm ? 'none' : `opacity 0.3s ease-out ${i * 0.15}s`,
                }} />
                {i < FLOW_STEPS.length - 1 && (
                  <div style={{ width: 1, flex: 1, minHeight: 20, background: 'rgba(224,123,48,0.2)', marginTop: 4 }} />
                )}
              </div>
              <div style={{ paddingBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.5px', margin: 0 }}>
                  {step.label}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
                  {step.sub}
                </p>
                {step.pct && (
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#E07B30', margin: '4px 0 0' }}>
                    {step.pct}
                  </p>
                )}
              </div>
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', width: '100%' }} />
            )}
          </li>
        ))}
      </ol>

      {/* SVG Tubería — oculto en mobile, visible en sm+ */}
      <svg
        className="hidden sm:block"
        width="100%"
        viewBox="0 0 680 300"
        role="img"
        aria-label="Diagrama de tubería animada del flujo de valor Yeti BI"
        style={{ overflow: 'visible', width: '100%', display: 'block' }}
      >
        <title>Flujo de valor Yeti BI</title>
        <desc>
          Proceso sano y Dato confiable se bifurcan en
          Automatización (70-80%) e IA que decide (15-20%),
          convergiendo en ROI Medible.
        </desc>

        <defs>
          <style>{`
            .pipe-base {
              stroke: rgba(255,255,255,0.06);
              stroke-width: 6;
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .pipe-track {
              stroke: rgba(224,123,48,0.12);
              stroke-width: 4;
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .pipe-flow {
              stroke: #E07B30;
              stroke-width: 3;
              fill: none;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              transition: stroke-dashoffset 0.7s ease-in-out;
            }
            .lbl-section {
              font-size: 9px;
              fill: rgba(255,255,255,0.3);
              letter-spacing: 2.5px;
              font-family: var(--font-geist-sans);
            }
            .lbl-title {
              font-size: 10px;
              fill: rgba(255,255,255,0.9);
              font-weight: 700;
              font-family: var(--font-geist-sans);
              letter-spacing: 0.5px;
            }
            .lbl-sub {
              font-size: 8px;
              fill: rgba(255,255,255,0.4);
              font-family: var(--font-geist-sans);
            }
            .lbl-pct {
              font-size: 11px;
              font-weight: 700;
              fill: #E07B30;
              font-family: var(--font-geist-sans);
            }
            .lbl-pct-dim {
              font-size: 10px;
              font-weight: 600;
              fill: rgba(224,123,48,0.55);
              font-family: var(--font-geist-sans);
            }

            @keyframes pulseRing {
              0%   { r: 14; opacity: 0.6; }
              100% { r: 26; opacity: 0; }
            }
            .pulse-ring {
              animation: pulseRing 1.8s ease-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .pulse-ring { animation: none; }
              .pipe-flow { transition: none !important; }
            }
          `}</style>
        </defs>

        {/* Labels de etapa */}
        <text className="lbl-section" x="55"  y="18" textAnchor="middle">LOS CIMIENTOS</text>
        <text className="lbl-section" x="370" y="18" textAnchor="middle">LA BIFURCACIÓN</text>
        <text className="lbl-section" x="615" y="18" textAnchor="middle">ROI</text>

        {/* Divisores */}
        <line x1="230" y1="24" x2="230" y2="270" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <line x1="510" y1="24" x2="510" y2="270" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

        {/* TRACKS base */}
        <path className="pipe-base" d="M 60 155 L 200 155"/>
        <path className="pipe-track" d="M 60 155 L 200 155"/>
        <path className="pipe-base" d="M 255 155 Q 295 155 325 100"/>
        <path className="pipe-track" d="M 255 155 Q 295 155 325 100"/>
        <path className="pipe-base" d="M 255 155 Q 295 155 325 210"/>
        <path className="pipe-track" d="M 255 155 Q 295 155 325 210"/>
        <path className="pipe-base" d="M 435 100 Q 485 100 520 155"/>
        <path className="pipe-track" d="M 435 100 Q 485 100 520 155"/>
        <path className="pipe-base" d="M 435 210 Q 485 210 520 155"/>
        <path className="pipe-track" d="M 435 210 Q 485 210 520 155"/>

        {/* FLUJO ANIMADO */}
        <path className="pipe-flow" d="M 22 155 L 200 155"
          style={{ strokeDashoffset: animate ? 0 : 1000, transitionDelay: '0.2s' }}/>
        <path className="pipe-flow" d="M 255 155 Q 295 155 325 100"
          style={{ strokeDashoffset: animate ? 0 : 1000, transitionDelay: '0.9s' }}/>
        <path className="pipe-flow" d="M 255 155 Q 295 155 325 210"
          style={{ strokeDashoffset: animate ? 0 : 1000, transitionDelay: '0.9s' }}/>
        <path className="pipe-flow" d="M 435 100 Q 485 100 520 155"
          style={{ strokeDashoffset: animate ? 0 : 1000, transitionDelay: '1.4s' }}/>
        <path className="pipe-flow" d="M 435 210 Q 485 210 520 155"
          style={{ strokeDashoffset: animate ? 0 : 1000, transitionDelay: '1.4s' }}/>

        {/* NODO 1 — Proceso sano */}
        <g style={{
          opacity: animate ? 1 : 0,
          transform: animate ? 'scale(1)' : 'scale(0.5)',
          transformOrigin: '46px 155px',
          transition: 'opacity 0.3s ease-out 0.1s, transform 0.3s ease-out 0.1s'
        }}>
          <circle cx="46" cy="155" r="22" fill="#2E2640" stroke="#E07B30" strokeWidth="1.5"/>
          <circle cx="46" cy="155" r="14" fill="rgba(224,123,48,0.1)" stroke="rgba(224,123,48,0.35)" strokeWidth="1"/>
          <circle cx="46" cy="155" r="5"  fill="#E07B30"/>
          <text className="lbl-title" x="46" y="186" textAnchor="middle">PROCESO</text>
          <text className="lbl-sub"   x="46" y="196" textAnchor="middle">claro y sano</text>
        </g>

        {/* NODO 2 — Dato confiable */}
        <g style={{
          opacity: animate ? 1 : 0,
          transform: animate ? 'scale(1)' : 'scale(0.5)',
          transformOrigin: '228px 155px',
          transition: 'opacity 0.3s ease-out 0.8s, transform 0.3s ease-out 0.8s'
        }}>
          <circle cx="228" cy="155" r="22" fill="#2E2640" stroke="#E07B30" strokeWidth="1.5"/>
          <circle cx="228" cy="155" r="14" fill="rgba(224,123,48,0.1)" stroke="rgba(224,123,48,0.35)" strokeWidth="1"/>
          <circle cx="228" cy="155" r="5"  fill="#E07B30"/>
          <text className="lbl-title" x="228" y="186" textAnchor="middle">DATO</text>
          <text className="lbl-sub"   x="228" y="196" textAnchor="middle">confiable</text>
        </g>

        {/* Fork dot */}
        <circle cx="255" cy="155" r="4" fill="#E07B30"
          style={{ opacity: animate ? 0.5 : 0, transition: 'opacity 0.3s ease-out 0.85s' }}/>

        {/* NODO 3 — Automatización */}
        <g style={{
          opacity: animate ? 1 : 0,
          transform: animate ? 'scale(1)' : 'scale(0.5)',
          transformOrigin: '380px 100px',
          transition: 'opacity 0.3s ease-out 1.3s, transform 0.3s ease-out 1.3s'
        }}>
          <rect x="326" y="68" width="108" height="64" rx="7"
            fill="#2E2640" stroke="rgba(224,123,48,0.55)" strokeWidth="1.2"/>
          <rect x="331" y="73" width="98"  height="54" rx="5"
            fill="rgba(224,123,48,0.05)"/>
          <text className="lbl-title" x="380" y="91"  textAnchor="middle">AUTOMATIZACIÓN</text>
          <text className="lbl-sub"   x="380" y="103" textAnchor="middle">RPA · SOPs · Flujos</text>
          <text className="lbl-pct"   x="380" y="122" textAnchor="middle"
            style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.4s ease-out 1.6s' }}>
            70–80%
          </text>
        </g>

        {/* NODO 4 — IA que decide */}
        <g style={{
          opacity: animate ? 1 : 0,
          transform: animate ? 'scale(1)' : 'scale(0.5)',
          transformOrigin: '380px 210px',
          transition: 'opacity 0.3s ease-out 1.3s, transform 0.3s ease-out 1.3s'
        }}>
          <rect x="326" y="178" width="108" height="64" rx="7"
            fill="#2E2640" stroke="rgba(224,123,48,0.3)" strokeWidth="1"/>
          <rect x="331" y="183" width="98"  height="54" rx="5"
            fill="rgba(224,123,48,0.03)"/>
          <text className="lbl-title" x="380" y="201" textAnchor="middle">IA QUE DECIDE</text>
          <text className="lbl-sub"   x="380" y="213" textAnchor="middle">Modelos · Decisión</text>
          <text className="lbl-pct-dim" x="380" y="232" textAnchor="middle"
            style={{ opacity: animate ? 1 : 0, transition: 'opacity 0.4s ease-out 1.8s' }}>
            15–20%
          </text>
        </g>

        {/* NODO 5 — ROI Medible */}
        <g style={{
          opacity: animate ? 1 : 0,
          transform: animate ? 'scale(1)' : 'scale(0.5)',
          transformOrigin: '600px 155px',
          transition: 'opacity 0.4s ease-out 2.0s, transform 0.4s ease-out 2.0s'
        }}>
          {animate && (
            <circle className="pulse-ring" cx="600" cy="155" r="14"
              fill="none" stroke="#E07B30" strokeWidth="1"/>
          )}
          <circle cx="600" cy="155" r="38" fill="rgba(224,123,48,0.1)"
            stroke="rgba(224,123,48,0.25)" strokeWidth="1"/>
          <circle cx="600" cy="155" r="28" fill="rgba(224,123,48,0.15)"
            stroke="#E07B30" strokeWidth="1.5"/>
          <circle cx="600" cy="155" r="10" fill="#E07B30"/>
          <text className="lbl-title" x="600" y="202" textAnchor="middle">ROI</text>
          <text className="lbl-title" x="600" y="214" textAnchor="middle">MEDIBLE</text>
          <text className="lbl-sub"   x="600" y="225" textAnchor="middle">el único resultado</text>
        </g>
      </svg>

      {/* Texto de cierre */}
      <div style={{
        marginTop: 'clamp(40px,6vw,80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'clamp(24px,4vw,48px)',
        width: '100%'
      }}>
        <p style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.4)',
          fontStyle: 'italic',
          lineHeight: 1.7,
          borderLeft: '2px solid rgba(224,123,48,0.3)',
          paddingLeft: 20
        }}>
          El enfoque tradicional compra la tecnología y luego busca el problema.
        </p>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 22px)',
          color: '#E07B30',
          fontFamily: 'var(--font-playfair)',
          fontStyle: 'italic',
          lineHeight: 1.5
        }}>
          El nuestro encuentra la fuga de valor y te dice cuál camino la cierra — a veces ni siquiera es IA.
        </p>
      </div>
    </section>
  )
}


