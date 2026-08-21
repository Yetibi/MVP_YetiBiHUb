// ─── S5 · La ventaja que se compone — bloques escalonados ────────────────────
// El escalonamiento ES el argumento visual: la ventaja se acumula.

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

const BLOQUES = [
  { n: "01", clase: "", titulo: "Asimetría ", clave: "estructural" },
  { n: "02", clase: "e2", titulo: "Asimetría de ", clave: "composición" },
  { n: "03", clase: "e3", titulo: "Asimetría de ", clave: "visibilidad" },
];

export function S5Asimetria() {
  return (
    <section id="asimetria" className="hs-section hs-bg-acero2">
      <div className="hs-wrap">
        <p className="hs-kicker">LA VENTAJA QUE SE COMPONE</p>
        <h2 className="hs-h2">
          La distancia con tu competencia no crece. Se{" "}
          <span className="acc">compone.</span>
        </h2>

        <div className="hs-esc" style={{ marginTop: 56, maxWidth: 760 }}>
          {BLOQUES.map((b) => (
            <div
              key={b.n}
              className={b.clase}
              style={{ display: "flex", gap: 22, alignItems: "flex-start" }}
            >
              <span
                style={{
                  fontFamily: SG,
                  fontWeight: 700,
                  fontSize: 34,
                  lineHeight: 1,
                  color: "rgba(242,143,107,.35)",
                  flexShrink: 0,
                }}
              >
                {b.n}
              </span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: SG, fontWeight: 700, fontSize: 21, color: "#F2F6F9", margin: "0 0 8px" }}>
                  {b.titulo}
                  <span style={{ color: "var(--salmon)" }}>{b.clave}</span>
                </h3>
                <Phs n={2} />
              </div>
            </div>
          ))}
        </div>

        <p className="hs-apertura">
          ¿Cuánto llevas pagando la fuga que no aparece en ningún reporte?
        </p>
      </div>
    </section>
  );
}
