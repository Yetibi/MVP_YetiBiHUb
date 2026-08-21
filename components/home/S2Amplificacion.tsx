// ─── S2 · La ley de amplificación ────────────────────────────────────────────
// Split músculo transaccional vs semilla del criterio. Placeholders = copy
// pendiente de escribir sección por sección.

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

export function S2Amplificacion() {
  return (
    <section id="tesis" className="hs-section hs-bg-noche">
      <div className="hs-wrap">
        <p className="hs-kicker">LA LEY DE AMPLIFICACIÓN</p>
        <h2 className="hs-h2">
          La IA no es un filtro.
          <br />
          Es un <span className="acc">amplificador.</span>
        </h2>
        <p className="hs-bajada">
          Un filtro mejora lo que pasa por él. Un amplificador devuelve lo que
          ya había — con más volumen, más velocidad y más convicción.
        </p>

        <div className="hs-split">
          {/* Izquierda — el músculo */}
          <div>
            <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em", color: "#8B95A5", margin: "0 0 12px" }}>
              EL MÚSCULO TRANSACCIONAL
            </p>
            <h3 style={{ fontFamily: SG, fontWeight: 700, fontSize: 22, color: "#F2F6F9", margin: "0 0 10px" }}>
              Lo que la IA domina
            </h3>
            <Phs />
            <p style={{ fontFamily: SG, fontWeight: 700, fontSize: 56, color: "#8B95A5", margin: "26px 0 4px", lineHeight: 1 }}>
              40–70%
            </p>
            <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".2em", color: "#5D6B7A", margin: 0 }}>
              DEL TIEMPO OPERATIVO
            </p>
          </div>

          <div className="hs-split-div" aria-hidden="true" />

          {/* Derecha — la semilla */}
          <div>
            <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".2em", color: "var(--salmon)", margin: "0 0 12px" }}>
              LA SEMILLA DEL CRITERIO
            </p>
            <h3 style={{ fontFamily: SG, fontWeight: 700, fontSize: 22, color: "var(--salmon)", margin: "0 0 10px" }}>
              Lo que no se delega
            </h3>
            <Phs />
            <p style={{ fontFamily: SG, fontWeight: 700, fontSize: 56, color: "var(--salmon)", margin: "26px 0 4px", lineHeight: 1 }}>
              20%
            </p>
            <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".2em", color: "#5D6B7A", margin: 0 }}>
              IRREEMPLAZABLE
            </p>
          </div>
        </div>

        {/* Bloque destacado */}
        <div
          style={{
            border: "1px solid rgba(242,143,107,.25)",
            background: "rgba(242,143,107,.04)",
            borderRadius: 5,
            padding: "26px 30px",
            maxWidth: 820,
            marginTop: 56,
          }}
        >
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, lineHeight: 1.6, color: "#F2F6F9", margin: 0 }}>
            Si la semilla es pobre o el proceso está roto, la IA no lo corrige.
            Entrega{" "}
            <strong style={{ color: "var(--salmon)" }}>
              basura maravillosamente consolidada
            </strong>
            : ordenada, veloz, convincente y equivocada.
          </p>
        </div>

        <p className="hs-apertura">¿Qué va a encontrar la IA en tu operación?</p>
      </div>
    </section>
  );
}
