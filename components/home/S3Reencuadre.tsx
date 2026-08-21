// ─── S3 · El reencuadre — las 3 capas como estratos ──────────────────────────

const MONO = "var(--font-geist-mono)";
const SG = "var(--font-space-grotesk)";

function Phs({ n = 3 }: { n?: number }) {
  return (
    <div className="hs-phs" aria-label="Contenido pendiente">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

const CAPAS = [
  {
    label: "Capa 3 · Flujo",
    color: "#4FD1E0",
    fondo: "#141F2E",
    pregunta: "¿En qué orden ocurre?",
  },
  {
    label: "Capa 2 · Personas",
    color: "var(--salmon)",
    fondo: "#1C2836",
    pregunta: "¿Quién responde por el resultado?",
  },
  {
    label: "Capa 1 · Propósito",
    color: "var(--salmon)",
    fondo: "#1C2836",
    pregunta: "¿Este proceso necesita existir?",
  },
];

export function S3Reencuadre() {
  return (
    <section id="capas" className="hs-section hs-bg-acero2">
      <div className="hs-wrap">
        {/* Frase madre — sin kicker */}
        <div style={{ maxWidth: 900, margin: "0 auto 72px", textAlign: "center" }}>
          <h2
            className="hs-h2"
            style={{ fontSize: 38, maxWidth: "none", margin: "0 0 18px" }}
          >
            La IA no automatiza tareas. Automatiza{" "}
            <span className="acc">decisiones.</span>
          </h2>
          <p style={{ fontFamily: SG, fontWeight: 400, fontSize: 22, lineHeight: 1.4, color: "#8B95A5", margin: 0 }}>
            Por eso no evaluamos eventos — evaluamos{" "}
            <span style={{ color: "#4FD1E0" }}>
              el sistema con el que se toman las decisiones
            </span>
            .
          </p>
        </div>

        {/* Estratos: eje + tarjetas */}
        <div style={{ display: "flex", gap: 24 }}>
          {/* Eje vertical */}
          <div
            className="hs-eje"
            style={{
              width: 96,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 0",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: ".22em", color: "#4FD1E0", writingMode: "vertical-rl" }}>
              VISIBLE
            </span>
            <span
              aria-hidden="true"
              style={{
                flex: 1,
                width: 1,
                margin: "14px 0",
                background: "linear-gradient(180deg, #4FD1E0, var(--salmon))",
              }}
            />
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: ".22em", color: "var(--salmon)", writingMode: "vertical-rl" }}>
              SUMERGIDO
            </span>
          </div>

          {/* Tarjetas apiladas */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            {CAPAS.map((c) => (
              <div
                key={c.label}
                style={{
                  borderLeft: `3px solid ${c.color}`,
                  background: c.fondo,
                  borderRadius: "0 5px 5px 0",
                  padding: "22px 26px",
                }}
              >
                <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em", textTransform: "uppercase", color: c.color, margin: "0 0 8px" }}>
                  {c.label}
                </p>
                <p style={{ fontFamily: SG, fontWeight: 700, fontSize: 19, color: "#F2F6F9", margin: "0 0 10px" }}>
                  {c.pregunta}
                </p>
                <Phs n={2} />
              </div>
            ))}
          </div>
        </div>

        <p className="hs-apertura">
          ¿Reconoces tu operación en estas tres capas?{" "}
        </p>
        <p style={{ margin: "18px 0 0" }}>
          <a className="hs-link" href="/evaluacion">
            → EVALUAR UN PROCESO
          </a>
        </p>
      </div>
    </section>
  );
}
