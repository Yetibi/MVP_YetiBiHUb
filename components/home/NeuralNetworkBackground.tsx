"use client";

import { useEffect, useRef } from "react";

// ─── Red neuronal viva — efecto constelación en canvas 2D puro ───────────────
// Decorativa (aria-hidden, pointer-events none). Nodos cian que flotan lento y
// se conectan al acercarse; ~8% son nodos de "energía" coral con glow, y
// pulsos coral ocasionales viajan por las conexiones.
// prefers-reduced-motion (prop reduced) → un solo frame estático, sin rAF loop.

const CIAN = "79,209,224";
// Antes 242,146,29 (naranja brillante). Coral, como el resto del acento.
const NARANJA = "242,143,107";
const LINK_DIST = 130;

type Nodo = { x: number; y: number; vx: number; vy: number; r: number; energy: boolean };
type Pulso = { a: Nodo; b: Nodo; t: number };

export function NeuralNetworkBackground({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let running = true;
    let nodos: Nodo[] = [];
    let pulsos: Pulso[] = [];
    let W = 0;
    let H = 0;

    const init = () => {
      // DPR limitado a 2 para no renderizar de más en retina
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // densidad adaptativa: menos nodos en áreas pequeñas (móvil)
      const n = Math.min(Math.floor((W * H) / 14000), 90);
      nodos = Array.from({ length: n }, () => {
        const energy = Math.random() < 0.08;
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.44,
          vy: (Math.random() - 0.5) * 0.44,
          r: energy ? 2.4 : 0.8 + Math.random() * 1.3,
          energy,
        };
      });
      pulsos = [];
    };

    const drawFrame = (mover: boolean) => {
      ctx.clearRect(0, 0, W, H);

      if (mover) {
        for (const n of nodos) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
        }
      }

      // Conexiones (constelación)
      const L2 = LINK_DIST * LINK_DIST;
      for (let i = 0; i < nodos.length; i++) {
        for (let j = i + 1; j < nodos.length; j++) {
          const a = nodos[i];
          const b = nodos[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < L2) {
            const alpha = 1 - d2 / L2;
            ctx.strokeStyle = (a.energy || b.energy)
              ? `rgba(${NARANJA},${(alpha * 0.28).toFixed(3)})`
              : `rgba(${CIAN},${(alpha * 0.22).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodos
      for (const n of nodos) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        if (n.energy) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${NARANJA},0.9)`;
          ctx.fillStyle = `rgba(${NARANJA},0.9)`;
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(${CIAN},0.7)`;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!mover) return;

      // Pulsos de energía viajando por las conexiones
      if (pulsos.length < 3 && Math.random() < 0.012) {
        const energias = nodos.filter((n) => n.energy);
        if (energias.length) {
          const a = energias[Math.floor(Math.random() * energias.length)];
          let mejor: Nodo | null = null;
          let mejorD = Infinity;
          for (const b of nodos) {
            if (b === a) continue;
            const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
            if (d < mejorD) { mejorD = d; mejor = b; }
          }
          if (mejor) pulsos.push({ a, b: mejor, t: 0 });
        }
      }
      for (const p of pulsos) {
        p.t += 0.02;
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${NARANJA},1)`;
        ctx.fillStyle = `rgba(${NARANJA},0.95)`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      pulsos = pulsos.filter((p) => p.t <= 1);
    };

    const loop = () => {
      if (!running) return;
      if (document.visibilityState !== "hidden") drawFrame(true);
      animId = requestAnimationFrame(loop);
    };

    init();
    if (reduced) {
      drawFrame(false); // un frame estático: red visible, sin movimiento
    } else {
      loop();
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        init();
        if (reduced) drawFrame(false);
      }, 120);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
