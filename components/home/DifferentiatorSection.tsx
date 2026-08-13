"use client";

export default function DifferentiatorSection() {
  // Banda marino full-width: el fondo va en el <section>, el ancho máximo en el
  // div interno, para que el color llegue a los bordes del viewport.
  return (
    <section
      className="relative w-full"
      style={{ background: "linear-gradient(180deg, rgba(79,209,224,0.10) 0%, rgba(79,209,224,0.05) 100%), #0B1420" }}
    >
    <div
      className="relative mx-auto px-6 md:px-12 lg:px-16 py-16"
      style={{
        maxWidth: "1280px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span className="block text-sm uppercase tracking-widest text-gray-400 mb-8">
        S3 · DIFERENCIADOR
      </span>

      <h2
        className="text-3xl md:text-4xl font-bold text-white mb-12"
        style={{ lineHeight: 1.2 }}
      >
        La diferencia está en dónde empezamos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Enfoque Tradicional */}
        <div className="opacity-60">
          <p className="text-sm font-semibold text-gray-400 uppercase mb-4">
            ENFOQUE TRADICIONAL
          </p>
          <h3 className="text-xl font-bold text-white mb-4">
            Conectan datos, construyen dashboards
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Toman tus fuentes tal como están, las conectan a Power BI y
            construyen visualizaciones. Si el proceso que genera esos datos
            tiene variabilidad, errores de captura o excepciones manuales, el
            dashboard los hereda. Resultado: un instrumento que miente bonito.
          </p>
          <p className="text-xs text-gray-400">
            Entregan → desaparecen → en 6 meses el dashboard ya no refleja la
            operación real.
          </p>
        </div>

        {/* Enfoque Yeti BI */}
        <div
          className="relative border-l-4 pl-6"
          style={{ borderColor: "#4FD1E0" }}
        >
          <p className="text-sm font-semibold text-(--primary) uppercase mb-4">
            ENFOQUE YETI BI
          </p>
          <h3 className="text-xl font-bold text-white mb-4">
            Diagnosticamos el proceso que genera los datos
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Antes de construir, evaluamos: ¿el proceso captura lo que necesita
            capturar? ¿El dato es confiable en origen? ¿Las decisiones que
            quieres tomar son sostenibles con esta arquitectura? Si la respuesta
            es no, te lo decimos antes de facturar una sola línea.
          </p>
          <p className="text-xs text-gray-400 font-semibold">
            Diagnosticamos → construimos con propósito → programamos checkpoints
            de pertinencia.
          </p>
        </div>
      </div>

      <a
        href="#proceso"
        className="inline-block mt-12 text-sm font-semibold text-(--primary) hover:underline"
      >
        Conoce el proceso completo ↓
      </a>
    </div>
    </section>
  );
}