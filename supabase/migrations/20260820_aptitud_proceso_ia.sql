-- ─── Diagnóstico de Aptitud del Proceso para IA · v1.0 ───────────────────────
-- Migración aditiva: las columnas del flujo viejo se conservan (filas
-- históricas intactas); el instrumento nuevo escribe en las nuevas.

-- intakes: campos del nuevo formulario (7 pasos + email)
alter table intakes
  add column if not exists proceso text,
  add column if not exists ejecucion text,
  add column if not exists senal text,
  add column if not exists dato text,
  add column if not exists frecuencia text,
  add column if not exists antiguedad text,
  add column if not exists falla text,
  add column if not exists expectativa_ia text,
  add column if not exists intentos_procesamiento int default 0;

-- Estados del intake (§6.4): recibido → clasificado → redactado → aprobado →
-- enviado (+ atascado, cuando el cron agota los 3 reintentos).
-- El CHECK viejo solo admitía recibido/procesando/enviado:
alter table intakes drop constraint if exists intakes_estado_check;
alter table intakes add constraint intakes_estado_check
  check (estado = any (array[
    'recibido'::text, 'procesando'::text, 'clasificado'::text,
    'redactado'::text, 'aprobado'::text, 'enviado'::text, 'atascado'::text
  ]));

-- Campos del flujo viejo que el instrumento nuevo ya no envía:
alter table intakes
  alter column perfil drop not null,
  alter column sector drop not null,
  alter column alcance drop not null,
  alter column dolor_declarado drop not null,
  alter column to_be_objetivo drop not null;

-- diagnosticos: el veredicto clasificado por código
alter table diagnosticos
  add column if not exists patologia text,
  add column if not exists severidad text,
  add column if not exists cmmi_estimado int,
  add column if not exists senales_secundarias jsonb,
  add column if not exists veredicto_completo jsonb;

-- El flujo nuevo ya no escribe: evidencia_suficiente, score_sustancialidad,
-- nivel_evidencia, razonamiento_suficiencia (columnas conservadas por las
-- filas históricas; hacerlas nullable si tenían NOT NULL). Tolerante a
-- columnas que no existan en este entorno:
do $$
declare
  col text;
begin
  foreach col in array array[
    'evidencia_suficiente', 'score_sustancialidad', 'nivel_evidencia',
    'razonamiento_suficiencia', 'diagnostico_completo', 'diagnostico_resumido'
  ] loop
    begin
      execute format('alter table diagnosticos alter column %I drop not null', col);
    exception when undefined_column then
      null;
    end;
  end loop;
end $$;

-- Índices de apoyo del cron y las guardas
create index if not exists idx_intakes_estado_created
  on intakes (estado, created_at);
create index if not exists idx_diagnosticos_padre
  on diagnosticos (diagnostico_padre_id);
create index if not exists idx_diagnosticos_intake_version
  on diagnosticos (intake_id, version desc);
