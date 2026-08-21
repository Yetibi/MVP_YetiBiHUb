# Spec — Héroe del Home de marca (`/`)

> Fuente de verdad del héroe. Actualizado tras la decisión tipográfica:
> **la mono del héroe es Geist Mono** (`var(--font-geist-mono)`), NO IBM Plex
> Mono — es la mono establecida en todos los kickers y etiquetas técnicas de
> `/evaluacion`, y la consistencia Home ↔ producto manda. Valores ópticos ya
> ajustados para una mono más ancha que IBM Plex.

## Qué es
Pantalla completa, video de fondo protagonista (Yeti-constelación que despierta
la red neuronal), nav mínima superpuesta, kicker arriba, titular de marca abajo.
**Sin botones** — héroe declarativo, no transaccional.

## Video
```
public/video/hero-yeti-red-neuronal.mp4          (16 s · ~1.6 MB · sin audio)
public/video/hero-yeti-red-neuronal-poster.jpg   (frame de respaldo)
```
Atributos: `autoPlay muted loop playsInline preload="metadata"` + `poster`.
Reduced motion: hook cliente (`hooks/use-reduced-motion.ts`) decide `<video>`
vs `<img>` poster — no solo CSS.

## Tokens
Paleta Plano Glaciar + `--salmon: #F28F6B` (acento del héroe — no el naranja
#F2921D de otras secciones). Cromática intencional: **cian = lo ya resuelto**,
**salmón = el diferencial**.

## Desktop
- Gradientes (sin velo plano): inferior 40% `linear-gradient(180deg, transparent, rgba(11,20,32,.5) 55%, rgba(11,20,32,.9))`; viñeta `radial-gradient(ellipse 120% 90% at 50% 40%, transparent 65%, rgba(11,20,32,.5))`.
- Video: `absolute inset:0; object-fit:cover; object-position:center`.
- Nav: max 1400px, padding 22px 50px. Marca `YETI·BI` Space Grotesk 700 17px
  ls .14em (`·` cian, `BI` salmón, `YETI` nieve). Links 13px niebla gap 30px
  hover nieve: La tesis `#tesis` · Las 3 capas `#capas` · SOI `#soi` ·
  Resultados `#resultados` · Contacto `#contacto`. Sin CTA.
- Kicker: `top:76px` centrado — **Geist Mono 500 · 11px · ls .26em** uppercase
  niebla; "IA" salmón + `text-shadow: 0 0 16px rgba(242,143,107,.4)`.
- Titular: bloque `0 30px 64px`, max 1180px, Space Grotesk ls -.02em lh 1.1.
  - Línea A 26px/400 niebla: "Hoy, cuando **construir con IA es cada vez más
    fácil,**" (negrita = cian 600). Margen inferior 6px.
  - Línea B 50px/700 nieve: "lo escaso ya no es la herramienta.<br/>Es
    [el criterio] para usarla bien."
  - "el criterio": salmón, `text-shadow 0 0 24px rgba(242,143,107,.45)`,
    inline-block `padding:2px 10px`, corchetes de esquina salmón vía
    `::before` (inf-izq) / `::after` (sup-der), 13px, trazo 2.5px, offset -4px.

## Móvil (≤768px)
- Video: `top:46%; left:50%; transform:translate(-47%,-50%); height:85%;
  width:auto` sobre fondo `--noche`.
- Gradientes: inferior 48% (`.5` al 50%, `.95` final); viñeta
  `ellipse 130% 90% at 50% 38%, transparent 58%, rgba(11,20,32,.6)`.
- Nav: padding 26px 22px 0, marca 15px, links → hamburguesa (3 líneas 1.5px
  niebla, 22px, gap 5px; desplegable fuera de alcance).
- Kicker: `top:66px` — **9px · ls .18em**.
- Titular: `0 22px 42px`; A 14px; B 20.5px; criterio `1px 7px`, corchetes 9px
  trazo 2px.
- Indicador scroll: `DESLIZA ↓` — **Geist Mono 9.5px · ls .11em** dim,
  bucle 2.4s ±4px Y; oculto con reduced-motion. Solo móvil.
- Altura: `100dvh` (no `100vh`).

## Prohibido en este héroe
Botones/CTA · badges de estado · velo plano sobre el video · secciones 2+.

## Implementación
`components/home/HeroMarca.tsx` + bloque "Hero de marca" en `app/globals.css`
+ `hooks/use-reduced-motion.ts`. La evaluación vive en `/evaluacion`.
