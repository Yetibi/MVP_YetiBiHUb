"use client";

/* ─────────────────────────────────────────────────────────────────────────────
   Video de introducción + su CTA.

   Antes "Ver el video · N min" era un <span>: parecía un botón, pero no hacía
   nada y ni siquiera era enfocable con teclado. Ahora es un <button> real que
   lleva el video a pantalla completa, lo desmutea y lo reproduce desde el
   principio — que es lo que el texto promete.

   El video sigue autoarrancando muteado (los navegadores bloquean el autoplay
   con sonido); el CTA es el gesto del usuario que habilita el audio.
   ────────────────────────────────────────────────────────────────────────── */

const VIDEO_ID = "teach-video-intro";

type Props = { videoUrl: string | null; posterUrl: string | null; minutos: string };

// Safari expone las de webkit en vez de las estándar.
type VideoConFullscreen = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitRequestFullscreen?: () => void;
};

/** Botón del hero. Vive en .teach-hero-fila, junto a "Continuar", así que no
    comparte árbol con el <video>: lo encuentra por id. */
export function VerVideoBoton({ minutos, disponible }: { minutos: string; disponible: boolean }) {
  async function verVideo() {
    const v = document.getElementById(VIDEO_ID) as VideoConFullscreen | null;
    if (!v) return;

    v.muted = false;
    v.currentTime = 0;

    try {
      if (v.requestFullscreen) await v.requestFullscreen();
      else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
      // iPhone: el <video> no entra en fullscreen del documento, solo en el
      // reproductor nativo del sistema.
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    } catch {
      // Si el navegador rechaza el fullscreen, igual se reproduce con sonido:
      // mejor eso que no hacer nada.
    }

    try {
      await v.play();
    } catch {
      // Reproducción bloqueada: al menos queda desmuteado y visible.
    }
    v.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <button type="button" className="teach-cta2" onClick={verVideo} disabled={!disponible}>
      Ver el video · {minutos}
    </button>
  );
}

export function VideoIntro({ videoUrl, posterUrl }: Omit<Props, "minutos">) {
  return (
    <>
      <div className="teach-video">
        {videoUrl ? (
          <video
            id={VIDEO_ID}
            className="teach-video-el"
            src={videoUrl}
            poster={posterUrl ?? undefined}
            autoPlay
            muted
            playsInline
            controls
            preload="metadata"
            aria-label="Video de introducción: El mecanismo y el operador"
          >
            Tu navegador no reproduce video.
          </video>
        ) : (
          <div className="teach-video-pie">
            YETIBI TEACH · INTRODUCCIÓN (video no disponible)
          </div>
        )}
      </div>
    </>
  );
}
