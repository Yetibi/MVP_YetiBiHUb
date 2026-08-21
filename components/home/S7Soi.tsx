// ─── S7 · SOI — Sistema Operacional Inteligente ──────────────────────────────
// Cierre sobrio, sin CTA (deliberado).

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

const NEGACIONES = ["un dashboard", "un ERP", "automatización suelta", "un proyecto que termina"];

const CAPACIDADES = [
  { n: "CAPACIDAD 01", titulo: "Captura en origen" },
  { n: "CAPACIDAD 02", titulo: "Fuente de verdad única" },
  { n: "CAPACIDAD 03", titulo: "Decisiones automáticas" },
  { n: "CAPACIDAD 04", titulo: "Evolución continua" },
];

export function S7Soi() {
  return (
    <section id="soi" className="hs-section hs-bg-acero">
      <div className="hs-wrap">
        <p className="hs-kicker cian">SISTEMA OPERACIONAL INTELIGENTE</p>
        <h2 className="hs-h2">
          El destino no es un dashboard. Es una operación que{" "}
          <span className="cian">piensa.</span>
        </h2>

        {/* Negaciones */}
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", margin: "36px 0 52px" }}>
          {NEGACIONES.map((n) => (
            <span
              key={n}
              style={{
                fontFamily: MONO,
                fontSize: 11.5,
                letterSpacing: ".1em",
                color: "#5D6B7A",
                textDecoration: "line-through",
                textDecorationColor: "rgba(242,143,107,.55)",
                textDecorationThickness: "1.5px",
              }}
            >
              {n}
            </span>
          ))}
        </div>

        {/* 4 capacidades */}
        <div className="hs-grid4">
          {CAPACIDADES.map((c) => (
            <div
              key={c.n}
              style={{
                border: "1px solid rgba(79,209,224,.18)",
                borderRadius: 5,
                padding: 20,
              }}
            >
              <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".22em", color: "#4FD1E0", margin: "0 0 10px" }}>
                {c.n}
              </p>
              <h3 style={{ fontFamily: SG, fontWeight: 700, fontSize: 17, color: "#F2F6F9", margin: "0 0 10px" }}>
                {c.titulo}
              </h3>
              <Phs />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
