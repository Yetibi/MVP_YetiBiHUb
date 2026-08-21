// ─── S8 · Evidencia — el marco aplicado ──────────────────────────────────────
// ⚠ Sin insumo de casos: la nota inferior es un recordatorio deliberado.

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

const CASOS = [
  { label: "SOI · CONVERGENCIA", titulo: "Caso por definir", href: null },
  { label: "SOI · GREENFIELD", titulo: "Caso por definir", href: null },
  { label: "INTELIGENCIA DE NEGOCIO", titulo: "Caso por definir", href: "/powerbi" },
];

export function S8Evidencia() {
  return (
    <section id="resultados" className="hs-section hs-bg-noche">
      <div className="hs-wrap">
        <p className="hs-kicker">EVIDENCIA</p>
        <h2 className="hs-h2">
          El marco, <span className="acc">aplicado.</span>
        </h2>

        <div className="hs-grid3" style={{ marginTop: 48 }}>
          {CASOS.map((c) => {
            const card = (
              <article
                style={{
                  border: "1px solid rgba(139,149,165,.14)",
                  borderRadius: 5,
                  overflow: "hidden",
                  background: "#141F2E",
                  height: "100%",
                }}
              >
                {/* Marcador de imagen */}
                <div
                  aria-hidden="true"
                  style={{
                    height: 112,
                    background: "linear-gradient(135deg, rgba(79,209,224,.10), rgba(242,143,107,.07))",
                  }}
                />
                <div style={{ padding: 22 }}>
                  <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".2em", color: "var(--salmon)", margin: "0 0 8px" }}>
                    {c.label}
                  </p>
                  <h3 style={{ fontFamily: SG, fontWeight: 700, fontSize: 18, color: "#F2F6F9", margin: "0 0 10px" }}>
                    {c.titulo}
                  </h3>
                  <Phs n={2} />
                </div>
              </article>
            );
            return c.href ? (
              <a key={c.label} href={c.href} style={{ textDecoration: "none" }}>
                {card}
              </a>
            ) : (
              <div key={c.label}>{card}</div>
            );
          })}
        </div>

        <p style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: ".12em", color: "#5D6B7A", margin: "36px 0 0" }}>
          ⚠ SECCIÓN SIN INSUMO — DEFINIR NIVEL DE ANONIMATO Y CASOS PUBLICABLES
        </p>
      </div>
    </section>
  );
}
