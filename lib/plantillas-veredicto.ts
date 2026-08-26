import type { Patologia, Severidad } from "@/types/aptitud";

// ─── Las 5 plantillas de veredicto (insumo v1.0 §4) ──────────────────────────
// El esqueleto es fijo; los huecos {{...}} los llena el modelo. La etiqueta,
// la glosa y la línea de tensión NUNCA cambian — son parte del instrumento.
//
// Las ETIQUETAS son lenguaje llano, no la taxonomía interna: son las primeras
// palabras que lee el cliente y "PATCHWORK DE SISTEMAS" o "GHOST DATA" hacían
// que el reporte se leyera como jerga. Las claves internas (patchwork,
// ghost_data, …) NO cambian: siguen en el clasificador, en Supabase y en la
// columna `patologia`. Aquí solo cambia el texto impreso.

export interface PlantillaVeredicto {
  etiqueta: string;      // "DIAGNÓSTICO: X" — debe aparecer literal en el cuerpo
  glosa: string;         // profundiza la etiqueta (ya no es muleta para explicarla)
  lineaTension: string;  // el cierre fijo antes de la invitación
  guiaContraste: string; // instrucción al redactor para el movimiento 3
}

// Cinco movimientos con espacio propio. Sin encabezados impresos: son bloques
// de prosa separados por saltos de línea — el reporte se lee como una carta,
// no como un formulario.
const ESQUELETO = `ASUNTO: {{asunto — máx. 9 palabras, incluye el nombre del proceso del usuario}}

Evaluamos tu proceso de {{nombre del proceso en palabras del usuario}}.

[ETIQUETA] — [GLOSA]

{{MOVIMIENTO 1 · DÓNDE ESTÁS HOY — 2 o 3 frases. Devuélvele el proceso descrito con claridad, con los términos que él usó. No es un resumen del formulario: es una lectura de lo que describió. Verse descrito con precisión genera confianza antes de cualquier hallazgo.}}

Lo que encontramos:
• {{hallazgo 1 — el del nivel más profundo que tenga material: propósito antes que actores, actores antes que flujo}}
• {{hallazgo 2 ligado a una respuesta concreta}}
• {{hallazgo 3 — solo si el material lo sostiene}}

{{MOVIMIENTO 3 · QUÉ HAY EN MEDIO — 1 párrafo corto. Lo que específicamente impide llegar de donde está a donde quiere llegar, en su idioma. Este párrafo SOLO hace ese trabajo: no dimensiona la distancia, eso va en el movimiento siguiente. Guía: [GUIA_CONTRASTE]}}

{{MOVIMIENTO 4 · QUÉ TAN LEJOS ESTÁS — 2 o 3 frases. Dimensiona la distancia SIN cifras, sin tiempos, sin costos. El lector debe salir sabiendo si tiene enfrente un paso o una reconstrucción. Señales: proceso reciente + falla controlada → está agregando un paso a algo que apenas empieza, mucho más barato que desarmar años; dilo. Proceso de años + error repetido → hay complejidad acumulada que desarmar antes. Si declaró un intento previo → alguien ya trató y no funcionó: úsalo para explicar por qué el próximo intento necesita algo distinto. Cuando la brecha sea corta, dilo sin rodeos: decir "esto sí se resuelve" genera más autoridad que advertir siempre.}}

[LÍNEA DE TENSIÓN]

{{pregunta específica del caso — casi siempre sobre la reasignación: ¿a qué se va a reasignar el tiempo que este proceso concreto liberaría? Nunca genérica. Sin mencionar fuga, costo ni cifras.}}

Responde este correo, o yetibi.com.

Yeti BI · Ingeniería de procesos y datos`;

export const PLANTILLAS: Record<Patologia, PlantillaVeredicto> = {
  inercia_activa: {
    etiqueta: "DIAGNÓSTICO: SIEMPRE SE HA HECHO ASÍ",
    glosa:
      "el negocio cambió y el proceso no: sigue ejecutándose igual aunque el contexto para el que fue diseñado ya es otro.",
    lineaTension:
      "La IA no corrige un proceso congelado — lo vuelve permanente. Automatizarlo así es pagar por hacer más rápido algo que quizás no debería hacerse.",
    guiaContraste:
      "Lo que quiere lograr aceleraría un diseño que nadie ha cuestionado en años; antes de amplificar, hay que preguntarse qué merece existir.",
  },
  ghost_data: {
    etiqueta: "DIAGNÓSTICO: DATOS QUE NUNCA SE GUARDARON",
    glosa:
      "tu operación cree tener información de este proceso, pero nunca quedó registrada de una forma que sirva para aprender de ella.",
    lineaTension:
      "La IA no puede decidir sobre un dato que no existe. Hoy, cualquier respuesta que te dé sobre este proceso sería una opinión con buena redacción.",
    guiaContraste:
      "Lo que quiere lograr presupone historia registrada; lo que él mismo respondió sobre dónde queda el dato (memoria, conversaciones, archivos sueltos) muestra que esa historia no está en ningún lado consultable. Describe la idea con tus palabras; no cites la opción del formulario entre comillas.",
  },
  patchwork: {
    etiqueta: "DIAGNÓSTICO: SISTEMAS QUE NO SE HABLAN",
    glosa:
      "el dato existe, pero vive repartido en piezas que no se comunican, y alguien las reconcilia a mano antes de cada decisión.",
    lineaTension:
      "Si conectas IA a sistemas que no se hablan, no eliminas la reconciliación manual — la heredas. La IA consolidará versiones que se contradicen, y lo hará con total seguridad.",
    guiaContraste:
      "Lo que quiere lograr exige una fuente única de verdad (un solo lugar donde vive el dato oficial); hoy hay varias verdades parciales que alguien cruza a mano.",
  },
  variabilidad_artesanal: {
    etiqueta: "DIAGNÓSTICO: CADA QUIEN A SU MANERA",
    glosa:
      "no hay un estándar del que aprender ni contra el cual detectar desviaciones: cada persona ejecuta el proceso a su modo.",
    lineaTension:
      "La IA aprende patrones. Donde cada quien hace lo suyo, no hay patrón — hay estilos. Automatizar un estilo es congelar la manera de una persona y llamarla proceso.",
    guiaContraste:
      "Lo que quiere lograr presupone un modo correcto definido; lo que él mismo respondió sobre cómo se resuelve la falla (cada persona por fuera del proceso) muestra que ese modo no existe todavía por escrito. Describe la idea con tus palabras; no cites la opción del formulario entre comillas.",
  },
  fuga_de_decision: {
    etiqueta: "DIAGNÓSTICO: LA INFORMACIÓN LLEGA TARDE",
    glosa:
      "el proceso camina y el dato existe; la pérdida está en el tiempo que tarda la señal en llegar a quien decide.",
    lineaTension:
      "El dato envejece en el trayecto: cuando llega, la silla vacía ya no se llenó y el error ya se repitió. Este es el único de los cinco diagnósticos donde la IA rinde rápido — precisamente porque el proceso ya hizo la tarea que los demás tienen pendiente.",
    guiaContraste:
      "Aquí el contraste es afirmativo — lo que quiere lograr es alcanzable, y por eso mismo la decisión de diseño importa más, no menos.",
  },
};

// Variante de tensión para el diagnóstico apto con severidad baja
// (falla=controlado): proceso en condiciones de recibir inteligencia.
export const TENSION_FUGA_BAJA =
  "Tu proceso está en el grupo minoritario que sí está en condiciones de recibir inteligencia. La pregunta ya no es si puede — es dónde te devuelve más valor, y esa respuesta no es obvia: elegir mal el punto de entrada es la forma cara de acertar la tecnología.";

/** Línea de tensión efectiva por patología/severidad (la que el validador
    exige una sola vez, en el remate). */
export function lineaTensionPara(patologia: Patologia, severidad: Severidad): string {
  return patologia === "fuga_de_decision" && severidad === "baja"
    ? TENSION_FUGA_BAJA
    : PLANTILLAS[patologia].lineaTension;
}

/** Plantilla renderizada para el prompt: esqueleto con etiqueta, glosa,
    tensión y guía del contraste ya resueltos por patología/severidad. */
export function plantillaPara(patologia: Patologia, severidad: Severidad): string {
  const p = PLANTILLAS[patologia];
  const tension = lineaTensionPara(patologia, severidad);

  return ESQUELETO
    .replace("[ETIQUETA] — [GLOSA]", `${p.etiqueta} — ${p.glosa}`)
    .replace("[GUIA_CONTRASTE]", p.guiaContraste)
    .replace("[LÍNEA DE TENSIÓN]", tension);
}
