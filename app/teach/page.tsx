import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/teach/supabase-server";
import { estaAutorizado, esInterno } from "@/lib/teach/authorize";
import {
  listarUnidades,
  obtenerUnidad,
  minutosLectura,
} from "@/lib/teach/unidades";

export default async function TeachIndex({
  searchParams,
}: {
  searchParams: Promise<{ u?: string }>;
}) {
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

  // Unidad destacada en el panel: la del ?u=, si no la primera no vista.
  const { u } = await searchParams;
  const porParam = unidades.findIndex((x) => x.slug === u);
  const primeraNoVista = unidades.findIndex((x) => !x.visto);
  const idx =
    porParam >= 0 ? porParam : primeraNoVista >= 0 ? primeraNoVista : 0;
  const featured = unidades[idx];

  const vistas = unidades.filter((x) => x.visto).length;
  const total = unidades.length;

  let min = 1;
  if (featured) {
    const full = await obtenerUnidad(featured.slug, interno);
    if (full) min = minutosLectura(full.cuerpo);
  }
  const sigueDe = idx > 0 ? unidades[idx - 1] : null;

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

      <div className="teach-marco">
        <nav className="teach-nav">
          <div className="teach-nav-kicker">YETIBI TEACH</div>
          <h1>Material de capacitación</h1>
          <p className="teach-nav-lema">
            La herramienta predice; el criterio lo pones tú.
          </p>

          <div className="teach-lista">
            {unidades.map((x, i) => (
              <Link
                key={x.slug}
                href={`/teach?u=${x.slug}`}
                className={`teach-unidad${i === idx ? " activa" : ""}${
                  x.visto ? " vista" : ""
                }`}
              >
                <span className="n">{x.orden}</span>
                <span className="t">{x.titulo}</span>
              </Link>
            ))}
          </div>
        </nav>

        <section className="teach-panel">
          {featured ? (
            <>
              <div className="teach-num-fondo" aria-hidden="true">
                {featured.orden}
              </div>
              {!featured.publicada ? (
                <span className="teach-estado">BORRADOR</span>
              ) : null}
              <div className="teach-unidad-label">
                UNIDAD {featured.orden} · {min} MIN
              </div>
              <h2>{featured.titulo}</h2>
              {featured.objetivo ? (
                <p className="teach-objetivo">{featured.objetivo}</p>
              ) : null}
              <div className="teach-acciones">
                <Link href={`/teach/${featured.slug}`} className="teach-cta">
                  Empezar la unidad
                </Link>
                {sigueDe ? (
                  <span className="teach-meta">Sigue de: {sigueDe.titulo}</span>
                ) : null}
              </div>
              <div className="teach-progreso">
                {unidades.map((x) => (
                  <div
                    key={x.slug}
                    className={`teach-seg${x.visto ? " ok" : ""}`}
                  />
                ))}
                <span>
                  {vistas} de {total} completadas
                </span>
              </div>
            </>
          ) : (
            <p className="teach-objetivo">
              Todavía no hay unidades publicadas.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
