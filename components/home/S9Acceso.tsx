// ─── S9 · Acceso — quién está detrás + tres puertas + footer ─────────────────

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

const PUERTAS = [
  {
    tag: "AUTOSERVICIO",
    titulo: "Evaluar un proceso",
    href: "/evaluacion",
    primaria: true,
    cta: "EVALUAR →",
  },
  {
    tag: "SERVICIO",
    titulo: "Inteligencia de negocio",
    href: "/powerbi",
    primaria: false,
    cta: "CONOCER →",
  },
  {
    tag: "CONVERSACIÓN",
    titulo: "Diseñar un SOI",
    href: "/evaluacion#contacto-form",
    primaria: false,
    cta: "CONVERSAR →",
  },
];

export function S9Acceso() {
  return (
    <section id="contacto" className="hs-section hs-bg-acero2" style={{ borderBottom: "none" }}>
      <div className="hs-wrap">
        {/* Bloque quién */}
        <div
          className="hs-quien"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.25fr",
            gap: 44,
            alignItems: "start",
            marginBottom: 96,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              aspectRatio: "1 / 1",
              border: "1px dashed rgba(139,149,165,.3)",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: ".14em",
              color: "#5D6B7A",
            }}
          >
            [ RETRATO / PERFIL π ]
          </div>
          <div>
            <p className="hs-kicker">QUIÉN ESTÁ DETRÁS</p>
            <h2 className="hs-h2" style={{ fontSize: 32 }}>
              Ingeniería de producción, no{" "}
              <span className="acc">marketing de IA.</span>
            </h2>
            <Phs n={4} />
          </div>
        </div>

        {/* Tres puertas */}
        <div className="hs-grid3">
          {PUERTAS.map((p) => (
            <div
              key={p.tag}
              style={{
                border: p.primaria
                  ? "1px solid rgba(242,143,107,.4)"
                  : "1px solid rgba(139,149,165,.14)",
                background: p.primaria ? "rgba(242,143,107,.05)" : "transparent",
                borderRadius: 5,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".22em", color: "#5D6B7A", margin: 0 }}>
                {p.tag}
              </p>
              <h3 style={{ fontFamily: SG, fontWeight: 700, fontSize: 20, color: "#F2F6F9", margin: 0, flex: 1 }}>
                {p.titulo}
              </h3>
              <p style={{ margin: 0 }}>
                <a className={`hs-btn${p.primaria ? "" : " hs-btn-ghost"}`} href={p.href}>
                  {p.cta}
                </a>
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer
          role="contentinfo"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 96,
            paddingTop: 26,
            borderTop: "1px solid rgba(139,149,165,.14)",
          }}
        >
          <span
            translate="no"
            style={{ fontFamily: SG, fontWeight: 700, fontSize: 14, letterSpacing: ".14em", color: "#F2F6F9" }}
          >
            YETI<span style={{ color: "#4FD1E0" }}>·</span>
            <span style={{ color: "var(--salmon)" }}>BI</span>
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".18em", color: "#5D6B7A" }}>
            MEDELLÍN · BOGOTÁ — COLOMBIA
          </span>
        </footer>
      </div>
    </section>
  );
}
