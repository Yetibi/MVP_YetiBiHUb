import type { Patologia, Severidad } from "@/types/aptitud";

// ─── Las 5 plantillas de veredicto (insumo v1.0 §4) ──────────────────────────
// El esqueleto es fijo; los huecos {{...}} los llena el modelo. La etiqueta,
// la glosa y la línea de tensión NUNCA cambian — son parte del instrumento.

export interface PlantillaVeredicto {
  etiqueta: string;      // "DIAGNÓSTICO: X" — debe aparecer literal en el cuerpo
  glosa: string;         // explicación llana fija, pegada a la etiqueta
  lineaTension: string;  // el cierre fijo antes de la invitación
  guiaContraste: string; // instrucción al redactor para el párrafo 2
}

const ESQUELETO = `ASUNTO: {{asunto — máx. 9 palabras, incluye el nombre del proceso del usuario}}

Evaluamos tu proceso de {{nombre del proceso en palabras del usuario}}.

[ETIQUETA] — [GLOSA]

{{párrafo 1 — el hallazgo: qué revelaron sus respuestas, 2–3 frases, citando lo que él mismo declaró}}

Lo que encontramos:
• {{hallazgo 1 ligado a una respuesta concreta}}
• {{hallazgo 2 ligado a una respuesta concreta}}
• {{hallazgo 3 — opcional}}

{{párrafo 2 — el contraste con la expectativa de IA, según la guía}}

[LÍNEA DE TENSIÓN]

{{pregunta específica del caso — casi siempre sobre la reasignación: ¿a qué se va a reasignar el tiempo que este proceso concreto liberaría? Nunca genérica. Sin mencionar fuga, costo ni cifras.}}

Responde este correo, o yetibi.com.

Yeti BI · Ingeniería de procesos y datos`;

export const PLANTILLAS: Record<Patologia, PlantillaVeredicto> = {
  inercia_activa: {
    etiqueta: "DIAGNÓSTICO: INERCIA ACTIVA",
    glosa:
      "tu proceso sigue ejecutándose igual aunque el contexto para el que fue diseñado ya cambió.",
    lineaTension:
      "La IA no corrige un proceso congelado — lo vuelve permanente. Automatizarlo así es pagar por hacer más rápido algo que quizás no debería hacerse.",
    guiaContraste:
      "La expectativa de IA del usuario aceleraría un diseño que nadie ha cuestionado en años; antes de amplificar, hay que preguntarse qué merece existir.",
  },
  ghost_data: {
    etiqueta: "DIAGNÓSTICO: GHOST DATA",
    glosa:
      "tu operación cree tener datos de este proceso, pero nunca se registraron de forma que algo pueda aprender de ellos.",
    lineaTension:
      "La IA no puede decidir sobre un dato que no existe. Hoy, cualquier respuesta que te dé sobre este proceso sería una opinión con buena redacción.",
    guiaContraste:
      "Lo que quiere que la IA haga presupone historia registrada; su propia respuesta ('en la cabeza de quien lo hace' / 'papel, WhatsApp, correos') muestra que esa historia no está en ningún lado consultable.",
  },
  patchwork: {
    etiqueta: "DIAGNÓSTICO: PATCHWORK DE SISTEMAS",
    glosa:
      "el dato existe, pero vive repartido en piezas que no se hablan — y una persona lo reconcilia a mano antes de cada decisión.",
    lineaTension:
      "Si conectas IA a un ecosistema en patchwork, no eliminas la reconciliación manual — la heredas. La IA consolidará versiones que se contradicen, y lo hará con total seguridad.",
    guiaContraste:
      "Su expectativa exige una fuente única de verdad (un solo lugar donde vive el dato oficial); hoy hay varias verdades parciales que alguien cruza a mano.",
  },
  variabilidad_artesanal: {
    etiqueta: "DIAGNÓSTICO: VARIABILIDAD ARTESANAL",
    glosa:
      "cada persona ejecuta el proceso a su manera — no hay un estándar del que la máquina pueda aprender ni contra el cual vigilar desviaciones.",
    lineaTension:
      "La IA aprende patrones. Donde cada quien hace lo suyo, no hay patrón — hay estilos. Automatizar un estilo es congelar la manera de una persona y llamarla proceso.",
    guiaContraste:
      "Su expectativa presupone un 'modo correcto' definido; su respuesta 'cada quien lo resuelve a su manera' muestra que ese modo no existe todavía por escrito.",
  },
  fuga_de_decision: {
    etiqueta: "DIAGNÓSTICO: FUGA DE DECISIÓN",
    glosa:
      "tu proceso camina y el dato existe — la pérdida está en el tiempo que tarda la señal en llegar a quien decide.",
    lineaTension:
      "El dato envejece en el trayecto: cuando llega, la silla vacía ya no se llenó y el error ya se repitió. Este es el único de los cinco veredictos donde la IA rinde rápido — precisamente porque el proceso ya hizo la tarea que los demás tienen pendiente.",
    guiaContraste:
      "Aquí el contraste es afirmativo — lo que quiere que la IA haga es alcanzable, y por eso mismo la decisión de diseño importa más, no menos.",
  },
};

// Variante de tensión para el veredicto apto con severidad baja
// (falla=controlado): proceso en condiciones de recibir inteligencia.
export const TENSION_FUGA_BAJA =
  "Tu proceso está en el grupo minoritario que sí está en condiciones de recibir inteligencia. La pregunta ya no es si puede — es dónde te devuelve más valor, y esa respuesta no es obvia: elegir mal el punto de entrada es la forma cara de acertar la tecnología.";

/** Plantilla renderizada para el prompt: esqueleto con etiqueta, glosa,
    tensión y guía del contraste ya resueltos por patología/severidad. */
export function plantillaPara(patologia: Patologia, severidad: Severidad): string {
  const p = PLANTILLAS[patologia];
  const tension =
    patologia === "fuga_de_decision" && severidad === "baja"
      ? TENSION_FUGA_BAJA
      : p.lineaTension;

  return (
    ESQUELETO
      .replace("[ETIQUETA] — [GLOSA]", `${p.etiqueta} — ${p.glosa}`)
      .replace(
        "{{párrafo 2 — el contraste con la expectativa de IA, según la guía}}",
        `{{párrafo 2 — el contraste: ${p.guiaContraste}}}`
      )
      .replace("[LÍNEA DE TENSIÓN]", tension)
  );
}
