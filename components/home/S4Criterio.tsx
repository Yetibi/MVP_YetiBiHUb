// ─── S4 · El criterio aplicado — factores de no-delegación ───────────────────

const MONO = "var(--font-geist-mono)";
const SG = "var(--font-space-grotesk)";

const FACTORES = [
  {
    n: "FACTOR 01",
    pregunta: "¿Requiere criterio que no se puede escribir en reglas?",
  },
  {
    n: "FACTOR 02",
    pregunta: "¿Alguien debe dar la cara y rendir cuentas por el resultado?",
  },
];

export function S4Criterio() {
  return (
    <section id="piloto-automatico" className="hs-section hs-bg-noche">
      <div className="hs-wrap">
        <p className="hs-kicker">EL CRITERIO APLICADO</p>
        <h2 className="hs-h2">
          No todo debe <span className="acc">automatizarse.</span>
        </h2>
        <p className="hs-bajada">
          Un paso lo ejecuta la IA sola únicamente si la respuesta a todas estas
          preguntas es NO. Un solo SÍ obliga a mantener a una persona en el
          flujo.
        </p>

        <div className="hs-grid3">
          {FACTORES.map((f) => (
            <div
              key={f.n}
              style={{
                border: "1px solid rgba(139,149,165,.14)",
                borderRadius: 5,
                background: "#141F2E",
                padding: 24,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".22em", color: "#5D6B7A", margin: "0 0 12px" }}>
                {f.n}
              </p>
              <p style={{ fontFamily: SG, fontWeight: 700, fontSize: 19, lineHeight: 1.3, color: "#F2F6F9", margin: "0 0 20px", flex: 1 }}>
                {f.pregunta}
              </p>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: 10.5,
                  letterSpacing: ".14em",
                  color: "var(--salmon)",
                  margin: 0,
                  paddingTop: 14,
                  borderTop: "1px solid rgba(139,149,165,.14)",
                }}
              >
                SÍ → HUMANO EN EL FLUJO
              </p>
            </div>
          ))}

          {/* Tarjeta 3 — el resto del marco */}
          <a
            href="/tesis"
            style={{
              border: "1px dashed rgba(139,149,165,.3)",
              borderRadius: 5,
              background: "transparent",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              textDecoration: "none",
            }}
          >
            <span style={{ fontFamily: SG, fontWeight: 700, fontSize: 22, color: "#8B95A5" }}>
              + 4 FACTORES
            </span>
            <span className="hs-link cian">VER EL MARCO COMPLETO →</span>
          </a>
        </div>

        <p className="hs-apertura">
          ¿Qué pasos de tu operación no deberían delegarse?
        </p>
      </div>
    </section>
  );
}
