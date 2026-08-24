import type { Metadata } from "next";

// ─── /tesis — El marco Yeti BI (versión mínima de referencia) ────────────────
// Página de referencia, no de venta: sin CTAs prominentes, sin formularios,
// sin botones sólidos. Registro idéntico al home. Crece con cada pieza que
// se formaliza.

export const metadata: Metadata = {
  title: { absolute: "El marco Yeti BI — Primero el proceso, después la IA" },
  description:
    "El marco de Yeti BI: la ley de amplificación, las tres capas del sistema de decisión, los seis factores de piloto automático y las dimensiones de valor.",
  alternates: { canonical: "https://yetibi.com/tesis" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://yetibi.com/tesis",
    siteName: "Yeti BI",
    title: "El marco Yeti BI — Primero el proceso, después la IA",
    description:
      "La ley de amplificación, las tres capas del sistema de decisión, los seis factores de piloto automático, la secuencia y las seis dimensiones de valor.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const CAPAS = [
  { lbl: "CAPA 3 · FLUJO", color: "#4FD1E0", preg: "¿En qué orden ocurre?" },
  { lbl: "CAPA 2 · PERSONAS", color: "#F28F6B", preg: "¿Quién decide, y con qué autoridad?" },
  { lbl: "CAPA 1 · PROPÓSITO", color: "#F28F6B", preg: "¿Esta decisión necesita tomarse?" },
];

const FACTORES = [
  {
    preg: "¿Requiere criterio que no se puede escribir en reglas?",
    exp: "Juicios de valor que dependen del contexto, no de un patrón.",
  },
  {
    preg: "¿Construye una relación de confianza?",
    exp: "Pasos donde el vínculo humano con el cliente o socio es el activo principal.",
  },
  {
    preg: "¿Alguien tiene que responder por el resultado?",
    exp: "Consecuencias éticas, legales o comerciales que exigen un responsable con nombre.",
  },
  {
    preg: "¿Tiene excepciones impredecibles?",
    exp: "Casos que se salen de cualquier patrón histórico documentado.",
  },
  {
    preg: "¿Su resultado debe defenderse en vivo?",
    exp: "Interacciones en tiempo real ante quien cuestiona el resultado.",
  },
  {
    preg: "¿Los datos de entrada tienen calidad suficiente?",
    exp: "Sin dato confiable no hay piloto automático: la IA solo amplificaría el error.",
  },
];

const DIMENSIONES = [
  { nom: "ACCESO", kpi: "LATENCIA DE DECISIÓN" },
  { nom: "CALIDAD", kpi: "ERROR QUE LLEGA AL CLIENTE" },
  { nom: "VOLUMEN", kpi: "CAPACIDAD SIN COSTO FIJO NUEVO" },
  { nom: "COSTO", kpi: "COSTO POR TRANSACCIÓN" },
  { nom: "EXPERIENCIA", kpi: "FRICCIÓN PARA CLIENTE Y EQUIPO" },
  { nom: "EXPECTATIVAS", kpi: "CONFIABILIDAD DEL ESTÁNDAR" },
];

export default function Tesis() {
  return (
    <main id="main-content" className="tz-main">
      <div className="tz-wrap">
        {/* Encabezado */}
        <p className="tz-kicker">EL MARCO YETI BI</p>
        <h1 className="tz-h1">
          Primero el proceso.
          <br />
          Después la IA.
        </h1>
        <p className="tz-intro">
          El marco completo detrás de yetibi.com. En construcción — esta página
          crece con cada pieza que se formaliza.
        </p>

        {/* 1 · Ley de amplificación */}
        <section className="tz-bloque" aria-labelledby="tz-ley">
          <h2 id="tz-ley">
            La ley de <span className="acc">amplificación</span>
          </h2>
          <p className="tz-p">
            La IA no es un filtro. Es un megáfono. No purifica lo que le
            entregas: lo repite más fuerte, más rápido y con más convicción.
          </p>
          <p className="tz-p">
            No puede adivinar la intención detrás de un dato mal capturado —
            solo puede propagarlo.
          </p>
        </section>

        {/* 2 · Sistema de decisión */}
        <section className="tz-bloque" aria-labelledby="tz-capas">
          <h2 id="tz-capas">
            El sistema de decisión: <span className="cian">las 3 capas</span>
          </h2>
          <ol className="tz-lista">
            {CAPAS.map((c) => (
              <li key={c.lbl} className="tz-capa" style={{ borderLeftColor: c.color }}>
                <p className="lbl" style={{ color: c.color }}>
                  {c.lbl}
                </p>
                <p className="preg">{c.preg}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 3 · Los 6 factores de piloto automático */}
        <section className="tz-bloque" aria-labelledby="tz-factores">
          <h2 id="tz-factores">
            Los 6 factores de <span className="acc">piloto automático</span>
          </h2>
          <ol className="tz-lista">
            {FACTORES.map((f, i) => (
              <li key={f.preg} className="tz-factor">
                <p className="num">FACTOR 0{i + 1}</p>
                <p className="preg">{f.preg}</p>
                <p className="exp">{f.exp}</p>
              </li>
            ))}
          </ol>
          <p className="tz-cierre">
            Un solo SÍ obliga a mantener a una persona en el flujo.
          </p>
        </section>

        {/* 4 · La secuencia */}
        <section className="tz-bloque" aria-labelledby="tz-secuencia">
          <h2 id="tz-secuencia">
            La <span className="acc">secuencia</span>
          </h2>
          <ol className="hs-seq" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {["ELIMINAR", "SIMPLIFICAR", "OPTIMIZAR", "AUTOMATIZAR", "MEDIR"].map((s, i) => (
              <li key={s} style={{ display: "contents" }}>
                {i > 0 && (
                  <span className="fl" aria-hidden="true">
                    →
                  </span>
                )}
                <span className={`sq${s === "MEDIR" ? " acc" : ""}`}>{s}</span>
              </li>
            ))}
          </ol>
          <p className="s6-secuencia-nota">
            El orden no es negociable. Automatizar es el cuarto paso, nunca el
            primero.
          </p>
        </section>

        {/* 5 · Las 6 dimensiones de valor */}
        <section className="tz-bloque" aria-labelledby="tz-dims">
          <h2 id="tz-dims">
            Las 6 dimensiones de <span className="acc">valor</span>
          </h2>
          <ul className="tz-lista">
            {DIMENSIONES.map((d) => (
              <li key={d.nom} className="tz-dim">
                <span className="nom">{d.nom}</span>
                <span className="kpi">{d.kpi}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Salida */}
        <nav className="tz-salida" aria-label="Salida">
          <a className="hs-link" href="/">
            ← VOLVER AL INICIO
          </a>
          <a className="hs-link cian" href="/evaluacion">
            EVALUAR UN PROCESO →
          </a>
        </nav>
      </div>
    </main>
  );
}
