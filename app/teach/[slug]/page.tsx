import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/teach/supabase-server";
import { estaAutorizado, esInterno } from "@/lib/teach/authorize";
import { obtenerUnidadConVecinas, minutosLectura } from "@/lib/teach/unidades";
import { Bloques } from "@/components/teach/Bloques";
import { marcarVista } from "./actions";

export default async function UnidadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
  const res = await obtenerUnidadConVecinas(slug, interno);
  if (!res) notFound();
  const { actual, anterior, siguiente, posicion, total } = res;

  const { data: prog } = await sb
    .from("progreso")
    .select("visto")
    .eq("unidad_slug", slug)
    .maybeSingle();
  const visto = prog?.visto === true;

  const min = minutosLectura(actual.cuerpo);

  return (
    <main
      id="main-content"
      style={{ background: "var(--teach-nieve)", minHeight: "100vh" }}
    >
      <div className="teach-topbar teach-topbar-sticky">
        <Link href="/teach">← Índice</Link>
        <span className="teach-logo">
          YETI<span className="bi">BI</span>{" "}
          <span className="slash">/ teach</span>
        </span>
        <div className="teach-mono">
          {posicion} · {total}
        </div>
      </div>

      <header className="teach-portada">
        <div className="teach-wrap">
          <div className="teach-num-fondo" aria-hidden="true">
            {actual.orden}
          </div>
          <div className="teach-fila-meta">
            <span className="teach-kicker">
              UNIDAD {actual.orden} · {min} MIN
            </span>
            {!actual.publicada ? (
              <span className="teach-badge">BORRADOR</span>
            ) : null}
          </div>
          <h1>{actual.titulo}</h1>
          {actual.objetivo ? (
            <p className="teach-objetivo">{actual.objetivo}</p>
          ) : null}
        </div>
      </header>

      <div className="teach-cuerpo">
        <Bloques md={actual.cuerpo} />
      </div>

      <div className="teach-vista">
        <form action={marcarVista.bind(null, slug)}>
          <button type="submit" disabled={visto} className="teach-vista-btn">
            {visto ? "✓ Vista" : "Marcar como vista"}
          </button>
        </form>
      </div>

      <nav className="teach-pie">
        {anterior ? (
          <Link href={`/teach/${anterior.slug}`} className="teach-nav-card">
            <div className="dir">← ANTERIOR</div>
            <div className="titulo">{anterior.titulo}</div>
          </Link>
        ) : (
          <span className="teach-nav-spacer" />
        )}
        {siguiente ? (
          <Link href={`/teach/${siguiente.slug}`} className="teach-nav-card sig">
            <div className="dir">SIGUIENTE →</div>
            <div className="titulo">{siguiente.titulo}</div>
          </Link>
        ) : (
          <span className="teach-nav-spacer" />
        )}
      </nav>
    </main>
  );
}
