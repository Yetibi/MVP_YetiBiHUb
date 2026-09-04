import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/teach/supabase-server";
import { estaAutorizado, esInterno } from "@/lib/teach/authorize";
import { listarUnidades, urlVideoFirmada } from "@/lib/teach/unidades";
import { FooterTeach } from "@/components/teach/FooterTeach";

export default async function TeachIndex() {
  const sb = await createSupabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user?.email) redirect("/teach/login");
  if (!(await estaAutorizado(user.email))) {
    await sb.auth.signOut();
    redirect("/teach/login?error=sin_acceso");
  }

  const interno = await esInterno(user.email);
  const unidades = await listarUnidades(interno);

  // La "siguiente" es la primera no vista (o la primera si están todas vistas).
  const nextIdx = unidades.findIndex((u) => !u.visto);
  const next = nextIdx >= 0 ? unidades[nextIdx] : unidades[0];
  const vistas = unidades.filter((u) => u.visto).length;
  const total = unidades.length;

  // Video de introducción (bucket privado, URL firmada). Autoarranca muteado
  // al abrir la página; el usuario activa el sonido con los controles. El
  // poster evita que se vea un recuadro negro vacío antes de reproducir.
  const [videoUrl, posterUrl] = await Promise.all([
    urlVideoFirmada(),
    urlVideoFirmada("intro-poster.jpg"),
  ]);

  return (
    <main
      id="main-content"
      style={{ background: "var(--teach-nieve)", minHeight: "100vh" }}
    >
      <div className="teach-topbar">
        <span className="teach-logo">
          YETI<span className="bi">BI</span>{" "}
          <span className="slash">/ teach</span>
        </span>
        <span className="teach-mono">{user.email}</span>
      </div>

      {/* HERO — banda oscura a sangre completa */}
      <section className="teach-hero">
        <div className="teach-hero-inner">
          <div>
            <div className="teach-hero-kick">MATERIAL DE CAPACITACIÓN</div>
            <h1 className="teach-hero-h1">
              Entender la IA
              <br />
              antes de usarla
            </h1>
            <p className="teach-hero-lema">
              La herramienta predice; el criterio lo pones tú.
            </p>
            <p className="teach-hero-sub">
              Siete unidades cortas sobre qué es la IA, qué puedes esperar de
              ella, y qué no. Sin tecnicismos.
            </p>
            <div className="teach-hero-fila">
              {next ? (
                <Link href={`/teach/${next.slug}`} className="teach-cta">
                  {nextIdx >= 0
                    ? `Continuar en la unidad ${next.orden}`
                    : "Repasar el material"}
                </Link>
              ) : null}
              <span className="teach-cta2">Ver el video · 5 min</span>
            </div>
          </div>

          {/* Video de introducción — arranca muteado al abrir la página */}
          <div className="teach-video">
            {videoUrl ? (
              <video
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
        </div>
      </section>

      {/* RECORRIDO — las 7 unidades como cards horizontales */}
      <section className="teach-recorrido">
        <div className="teach-recorrido-cab">
          <h2>El recorrido</h2>
          <div className="teach-prog">
            {unidades.map((u) => (
              <span
                key={u.slug}
                className={`teach-prog-s${u.visto ? " ok" : ""}`}
              />
            ))}
            <em>
              {vistas} / {total}
            </em>
          </div>
        </div>

        <div className="teach-lista">
          {unidades.map((u, i) => {
            const estado = u.visto ? "ok" : i === nextIdx ? "next" : "";
            const est = u.visto
              ? "✓ COMPLETADA"
              : i === nextIdx
                ? "CONTINUAR →"
                : `${u.minutos} MIN`;
            return (
              <Link
                key={u.slug}
                href={`/teach/${u.slug}`}
                className={`teach-u${estado ? ` ${estado}` : ""}`}
              >
                <span className="teach-u-n">
                  {String(u.orden).padStart(2, "0")}
                </span>
                <span>
                  <span className="teach-u-tit">{u.titulo}</span>
                  <span className="teach-u-obj">{u.objetivo}</span>
                </span>
                <span className="teach-u-est">{est}</span>
              </Link>
            );
          })}

          {/* Cierre del recorrido, DENTRO de la misma sección: el footer ya es
              la banda oscura del final y dos bandas seguidas se ven mal. */}
          <div className="teach-sep">
            <span>PARA LLEVAR</span>
            <span className="ln" />
          </div>

          <a className="teach-pdf" href="/teach/descargar">
            {/* Miniatura del documento, en la casilla del número de unidad.
                Decorativa: el título ya dice qué es. */}
            <span className="teach-doc" aria-hidden="true">
              <i /><i /><i /><i /><i />
            </span>
            <span>
              <span className="teach-u-tit">Las siete unidades en un PDF</span>
              <span className="teach-u-obj">
                Para leer sin conexión, imprimir o compartir dentro de tu
                equipo. 17 páginas.
              </span>
            </span>
            <span className="teach-pdf-accion">↓ Descargar</span>
          </a>
        </div>
      </section>

      <FooterTeach email={user.email} />
    </main>
  );
}
