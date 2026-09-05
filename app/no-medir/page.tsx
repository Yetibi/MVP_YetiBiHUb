"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Exclusión de la analítica para los equipos internos.

   GA4 no puede excluir "un computador": no existe tal identificador. Lo único
   persistente que un sitio puede dejar en un navegador es almacenamiento
   local, así que la marca vive en localStorage y GTM la lee para no disparar
   las etiquetas de medición.

   Alcance real: un navegador, en un perfil. Sobrevive a cambios de IP y de
   red — que es lo que falla con el filtro por IP, porque las conexiones
   domésticas suelen ser dinámicas — pero hay que repetirlo en cada navegador
   y se pierde al borrar los datos del sitio.

   La página se excluye del sitemap y de los buscadores: es una herramienta
   interna, no contenido.
   ────────────────────────────────────────────────────────────────────────── */

const CLAVE = "yetibi_no_medir";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function leer(): boolean {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    // Modo privado o almacenamiento bloqueado.
    return false;
  }
}

export default function NoMedirPage() {
  // null mientras no se ha leído el navegador: en el servidor no hay
  // localStorage y pintar "activado" antes de saberlo sería mentir.
  const [excluido, setExcluido] = useState<boolean | null>(null);
  const [sinSoporte, setSinSoporte] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("__prueba", "1");
      localStorage.removeItem("__prueba");
    } catch {
      setSinSoporte(true);
    }
    setExcluido(leer());
  }, []);

  function cambiar(activar: boolean) {
    try {
      if (activar) localStorage.setItem(CLAVE, "1");
      else localStorage.removeItem(CLAVE);
      setExcluido(activar);
      // Se avisa al dataLayer para que GTM reaccione sin recargar.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "yetibi_no_medir", no_medir: activar });
    } catch {
      setSinSoporte(true);
    }
  }

  return (
    <main className="nm-main">
      <div className="nm-card">
        <p className="nm-kicker">YETI BI · INTERNO</p>
        <h1>Excluir este navegador de la analítica</h1>
        <p className="nm-desc">
          Guarda una marca en este navegador para que tus visitas no se cuenten
          en las estadísticas del sitio. Funciona desde cualquier red, sin
          depender de tu dirección IP.
        </p>

        {sinSoporte ? (
          <p className="nm-aviso">
            Este navegador no permite guardar la marca (modo privado o
            almacenamiento bloqueado). Probá en una ventana normal.
          </p>
        ) : excluido === null ? (
          <p className="nm-aviso">Comprobando…</p>
        ) : (
          <>
            <div className={`nm-estado ${excluido ? "ok" : "no"}`}>
              <span className="punto" aria-hidden="true" />
              <span>
                {excluido
                  ? "Este navegador NO se está midiendo."
                  : "Este navegador SÍ se está midiendo."}
              </span>
            </div>

            <button
              type="button"
              className={`nm-btn ${excluido ? "sec" : ""}`}
              onClick={() => cambiar(!excluido)}
            >
              {excluido ? "Volver a medir" : "Excluir este navegador"}
            </button>
          </>
        )}

        <p className="nm-nota">
          La marca vive solo en este navegador y en este perfil. Hay que
          repetirlo en cada navegador que uses, y se pierde si borrás los datos
          del sitio.
        </p>
      </div>
    </main>
  );
}
