-- ─── YetiBI Teach · unidades de contenido ────────────────────────────────────
-- Material educativo transversal. El contenido fuente vive fuera del repo
-- (Contenido-YetiBI-Teach/) y se carga con scripts/teach-cargar-unidades.mts.

create table if not exists unidades (
  slug       text    primary key,          -- natural key, usado en /teach/[slug]
  titulo     text    not null,
  objetivo   text,
  orden      int     not null,
  cuerpo     text    not null,             -- markdown
  publicada  boolean not null default false
);

alter table unidades enable row level security;

-- Lectura: solo usuarios autenticados, solo unidades publicadas.
-- Los borradores NO se filtran por esta vía; el preview de Interno se hace del
-- lado servidor con service_role (que bypassa RLS), gateado por cliente='Interno'.
create policy "unidades_lectura_autenticados"
  on unidades for select
  to authenticated
  using (publicada = true);
-- Escritura: sin policy → solo service_role puede escribir (loader/admin).

-- ─── Progreso por usuario (visto / no visto) ─────────────────────────────────
create table if not exists progreso (
  correo       text        not null,
  unidad_slug  text        not null references unidades(slug) on delete cascade,
  visto        boolean     not null default false,
  actualizado  timestamptz not null default now(),
  constraint progreso_correo_unidad_key unique (correo, unidad_slug)
);

alter table progreso enable row level security;

-- Cada usuario lee y escribe SOLO su propio progreso (correo = email del JWT).
-- Un autenticado no puede consultar ni forjar el progreso de otros correos.
create policy "progreso_propio_select" on progreso for select
  to authenticated using (correo = (auth.jwt() ->> 'email'));
create policy "progreso_propio_insert" on progreso for insert
  to authenticated with check (correo = (auth.jwt() ->> 'email'));
create policy "progreso_propio_update" on progreso for update
  to authenticated using (correo = (auth.jwt() ->> 'email'))
  with check (correo = (auth.jwt() ->> 'email'));
