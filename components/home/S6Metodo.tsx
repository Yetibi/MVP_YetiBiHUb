// ─── S6 · El método y la promesa — secuencia + 6 dimensiones + prueba ────────
// Dimensiones 04–06 sin título deliberadamente: pendientes de definición.

const MONO = "var(--font-geist-mono)";
const SG = "var(--font-space-grotesk)";

function Phs({ n = 2 }: { n?: number }) {
  return (
    <div className="hs-phs" aria-label="Contenido pendiente">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

const SECUENCIA = ["ELIMINAR", "SIMPLIFICAR", "OPTIMIZAR", "AUTOMATIZAR", "MEDIR"];

const DIMENSIONES = [
  { n: "DIMENSIÓN 01", titulo: "Acceso" },
  { n: "DIMENSIÓN 02", titulo: "Calidad" },
  { n: "DIMENSIÓN 03", titulo: "Volumen" },
  { n: "DIMENSIÓN 04", titulo: "—" },
  { n: "DIMENSIÓN 05", titulo: "—" },
  { n: "DIMENSIÓN 06", titulo: "—" },
];

export function S6Metodo() {
  return (
    <section id="metodo" className="hs-section hs-bg-noche">
      <div className="hs-wrap">
        <p className="hs-kicker">EL MÉTODO Y LA PROMESA</p>
        <h2 className="hs-h2">
          No ahorramos horas. Movemos la <span className="acc">utilidad.</span>
        </h2>

        {/* Secuencia */}
        <div className="hs-seq" style={{ marginTop: 48 }}>
          {SECUENCIA.map((s, i) => (
            <span key={s} style={{ display: "contents" }}>
              {i > 0 && (
                <span className="fl" aria-hidden="true">
                  →
                </span>
              )}
              <span className={`sq${s === "MEDIR" ? " acc" : ""}`}>{s}</span>
            </span>
          ))}
        </div>

        {/* 6 dimensiones de valor */}
        <div className="hs-grid3" style={{ gap: 0, marginBottom: 56 }}>
          {DIMENSIONES.map((d) => (
            <div
              key={d.n}
              style={{
                borderTop: "1px solid rgba(139,149,165,.18)",
                padding: "20px 18px 26px 0",
              }}
            >
              <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".22em", color: "#5D6B7A", margin: "0 0 8px" }}>
                {d.n}
              </p>
              <h3 style={{ fontFamily: SG, fontWeight: 700, fontSize: 19, color: d.titulo === "—" ? "#5D6B7A" : "#F2F6F9", margin: "0 0 10px" }}>
                {d.titulo}
              </h3>
              <Phs />
            </div>
          ))}
        </div>

        {/* Bloque de prueba */}
        <div
          style={{
            background: "#1C2836",
            border: "1px solid rgba(242,143,107,.2)",
            borderRadius: 5,
            padding: "30px 34px",
            display: "flex",
            gap: 34,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ fontFamily: SG, fontWeight: 700, fontSize: 78, lineHeight: 1, color: "var(--salmon)", margin: 0 }}>
              55%
            </p>
            <p style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: ".14em", color: "#5D6B7A", margin: "8px 0 0" }}>
              FUENTE PENDIENTE DE VERIFICAR
            </p>
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 16.5, lineHeight: 1.6, color: "#8B95A5", margin: 0, flex: 1, minWidth: 260 }}>
            de las empresas de alto desempeño en IA rediseñaron sus procesos de
            fondo — el triple que el resto.
          </p>
        </div>

        <p style={{ margin: "48px 0 0" }}>
          <a className="hs-link" href="/evaluacion">
            → EVALUAR UN PROCESO
          </a>
        </p>
      </div>
    </section>
  );
}
