-- ─── YetiBI Teach · lista blanca de acceso ───────────────────────────────────
-- Acceso por magic link (Supabase Auth) restringido a correos autorizados.
-- Revocar acceso = borrar la fila o poner activo = false. Sin registro abierto.

create table if not exists usuarios_autorizados (
  correo      text        not null,
  cliente     text,
  activo      boolean     not null default true,
  fecha_alta  timestamptz not null default now(),
  constraint usuarios_autorizados_correo_key unique (correo)
);

-- Unicidad case-insensitive: evita duplicar Correo@x.com vs correo@x.com.
create unique index if not exists usuarios_autorizados_correo_lower_idx
  on usuarios_autorizados (lower(correo));

-- RLS activo SIN políticas: la tabla es ilegible con anon/authenticated key.
-- Todo acceso a la lista blanca pasa por el servidor con service_role.
alter table usuarios_autorizados enable row level security;

-- Carga de correos autorizados (ejemplo — descomentar y ajustar):
-- insert into usuarios_autorizados (correo, cliente) values
--   ('persona@cliente.com', 'Cliente X')
-- on conflict (correo) do nothing;
