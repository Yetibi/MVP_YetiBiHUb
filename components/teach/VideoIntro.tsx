"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Video de introducción del hero de /teach, con portada propia.

   La portada es HTML/CSS (variante A de
   _ARCHIVO/diseno/portada-video-final.html), no una miniatura: se controla el
   texto, escala con el ancho y no baja una imagen aparte.

   El <video> no se monta hasta que alguien pulsa "Ver el video". Antes
   autoarrancaba muteado: un video que se mueve solo compite con el titular
   del hero y consume datos de quien quizá no lo va a ver. Ahora el gesto del
   usuario es el que lo carga y, de paso, es lo que habilita el audio (los
   navegadores bloquean el autoplay con sonido).

   El video vive en un bucket privado de Supabase con URL firmada, no en
   YouTube: no hay UI ni cookies de terceros que diferir.

   Dosis de coral: esta pieza lleva más del 3% que fija la carta. Es
   deliberado — es una portada de enganche. No extender al resto de /teach.
   ────────────────────────────────────────────────────────────────────────── */

const VIDEO_ID = "teach-video-intro";
const DURACION = "2:41";
const ARIA_PLAY =
  "Reproducir video: Lo que debes saber antes de usar IA, 2 minutos 41 segundos";

type Props = { videoUrl: string | null; posterUrl: string | null; minutos: string };

// Safari expone las de webkit en vez de las estándar.
type VideoConFullscreen = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitRequestFullscreen?: () => void;
};

/** Lleva el video a pantalla completa con sonido, desde el principio. */
async function reproducir(pantallaCompleta: boolean) {
  const v = document.getElementById(VIDEO_ID) as VideoConFullscreen | null;
  if (!v) return;

  v.muted = false;
  v.currentTime = 0;

  if (pantallaCompleta) {
    try {
      if (v.requestFullscreen) await v.requestFullscreen();
      else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
      // iPhone: el <video> no entra al fullscreen del documento, solo al
      // reproductor nativo del sistema.
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    } catch {
      // Si el navegador lo rechaza, igual reproduce con sonido.
    }
  }

  try {
    await v.play();
  } catch {
    // Reproducción bloqueada: queda desmuteado y visible.
  }
}

/** Botón del hero. Vive en .teach-hero-fila, junto a "Continuar", así que no
    comparte árbol con el <video>: se comunica por un evento. */
export function VerVideoBoton({ minutos, disponible }: { minutos: string; disponible: boolean }) {
  return (
    <button
      type="button"
      className="teach-cta2"
      disabled={!disponible}
      aria-label={ARIA_PLAY}
      onClick={() => window.dispatchEvent(new CustomEvent("teach:ver-video"))}
    >
      Ver el video · {minutos}
    </button>
  );
}

export function VideoIntro({ videoUrl, posterUrl }: Omit<Props, "minutos">) {
  const [abierto, setAbierto] = useState(false);

  function abrir(pantallaCompleta = false) {
    setAbierto(true);
    // Un frame para que el <video> exista antes de pedirle play.
    requestAnimationFrame(() => void reproducir(pantallaCompleta));
  }

  // El botón del hero vive en otra rama del árbol: se comunica por evento.
  useEffect(() => {
    const abrirPantallaCompleta = () => abrir(true);
    window.addEventListener("teach:ver-video", abrirPantallaCompleta);
    return () => window.removeEventListener("teach:ver-video", abrirPantallaCompleta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="teach-video">
      {!videoUrl ? (
        <div className="teach-video-pie">
          YETIBI TEACH · INTRODUCCIÓN (video no disponible)
        </div>
      ) : abierto ? (
        <video
          id={VIDEO_ID}
          className="teach-video-el"
          src={videoUrl}
          poster={posterUrl ?? undefined}
          playsInline
          controls
          autoPlay
          preload="metadata"
          aria-label="Video de introducción: Lo que debes saber antes de usar IA"
        >
          Tu navegador no reproduce video.
        </video>
      ) : (
        <Portada onPlay={() => abrir(false)} />
      )}
    </div>
  );
}

function Portada({ onPlay }: { onPlay: () => void }) {
  return (
    <div className="tv-portada">
      <div className="tv-lienzo" aria-hidden="true">
        <svg viewBox="0 0 640 360" fill="none" stroke="#4FD1E0" strokeWidth="1.2">
          <rect x="382" y="30" width="216" height="100" rx="14" />
          <rect x="306" y="176" width="290" height="150" rx="16" stroke="#F28F6B" />
          <path d="M330 214h236M330 240h180M330 266h210" stroke="#F28F6B" strokeDasharray="4 6" />
          <circle cx="600" cy="152" r="20" />
        </svg>
      </div>
      <div className="tv-diag" aria-hidden="true" />

      <div className="tv-cap">
        <p className="tv-kick">YETIBI TEACH · LO QUE DEBES SABER ANTES DE USAR IA</p>
        <h2 className="tv-h2">
          No es magia.
          <br />
          <span className="no">Es predicción.</span>
        </h2>
        <p className="tv-sig">
          Dos minutos y medio para entender qué hay realmente detrás.
        </p>

        <button type="button" className="tv-play" onClick={onPlay} aria-label={ARIA_PLAY}>
          Ver el video
        </button>
      </div>

      <span className="tv-marca" aria-hidden="true">
        YETI·<span className="bi">BI</span>
      </span>
      <span className="tv-dur" aria-hidden="true">{DURACION}</span>
    </div>
  );
}
