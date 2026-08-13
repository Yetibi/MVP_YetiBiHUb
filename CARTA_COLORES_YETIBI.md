# Carta de colores — Sitio web Yeti BI

> Insumo para IA / diseño. Extraído del código real del sitio (`app/globals.css` + componentes).
> El sitio es **siempre oscuro** (no existe modo claro). Fecha: 2026-08-13.

## 1. Colores de marca (núcleo)

| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Fondo base | Noche | `#0E0B14` | Fondo global de todas las páginas. Equiv. `oklch(0.19 0.05 291)` |
| Primario / CTA | Coral | `#F28F6B` | Botones, foco (`ring`), highlights, gráficos. Color de acción principal |
| Acento | Teal | `#00D4C6` | SOLO acentos: links, bordes destacados, texto resaltado, partículas/canvas. **Prohibido como fondo de sección u overlay** |
| Superficie | Marino | `#003D66` | Solo como superficie/overlay de franja en `rgba(0,61,102,0.05–0.12)`. **No usar como tinta de texto** (contraste 1.73:1 sobre el fondo). Encima van blanco (18.8:1) o coral (8.0:1) |
| Secundario | Morado | `#7B4F96` | Overlay de franja en `rgba(123,79,150,0.04–0.08)` y detalles |

## 2. Texto

| Rol | Hex | Uso |
|---|---|---|
| Texto principal | `#FFFFFF` (foreground real: blanco con tinte morado, `oklch(0.94 0.01 291)`) | Títulos y texto sobre fondo oscuro |
| Texto secundario | `#C3B9D6` | Párrafos, descripciones |
| Texto atenuado | `#A89DC0` | Labels, captions, texto muted (el más usado del sitio para copy secundario) |

## 3. Superficies y neutros oscuros

| Hex | Uso |
|---|---|
| `#141020` | Cards / paneles (un nivel más claro que el fondo) |
| `#1C1426`, `#171225`, `#150D20`, `#241E38` | Variantes de superficie oscura (gradientes, capas) |
| `oklch(0.27 0.045 291)` | `secondary` / `accent` (hover de superficies) |
| Bordes | `rgba(255,255,255,0.12)` — inputs `rgba(255,255,255,0.10)` |

## 4. Variantes funcionales

| Hex | Rol |
|---|---|
| `#C45A2A` | Coral oscuro (hover/sombras del primario) |
| `#00A89D` | Teal oscuro (variante del acento) |
| `#4ADE80` | Verde éxito (confirmaciones) |
| `#4A9FD8` | Azul informativo (detalles de dashboard/gráficos) |
| `oklch(0.62 0.22 25)` | Destructive / error |

## 5. Escala de gráficos (charts, monocromática coral)

`chart-1` `oklch(0.62 0.155 47)` ≈ `#F28F6B` → `chart-2` `oklch(0.72 0.12 47)` (más claro) → `chart-3` `oklch(0.52 0.13 47)` → `chart-4` `oklch(0.42 0.1 47)` → `chart-5` `oklch(0.32 0.07 47)` (más oscuro).

## 6. Reglas de sistema (obligatorias)

1. Teal `#00D4C6` es exclusivamente de acento; nunca fondo de sección, overlay o tinte de superficie.
2. Fondos de franja permitidos (únicos): `#0E0B14` base, `rgba(0,61,102,0.05–0.12)` marino, `rgba(123,79,150,0.04–0.08)` morado.
3. Marino `#003D66` nunca como color de texto; es superficie. Sobre él: blanco o coral.
4. Coral `#F28F6B` es el color de acción (CTA, foco, ring); el teal acompaña, no compite.
5. Todo el sitio opera en modo oscuro único sobre `#0E0B14`; los radios usan base `0.5rem`.
