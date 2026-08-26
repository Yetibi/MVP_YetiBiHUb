-- Rediseño del formulario de intake (as-is → to-be)
-- ⚠ PENDIENTE DE APROBACIÓN — no ejecutada aún.
-- Columnas nuevas; expectativa_ia se conserva por las filas históricas
-- (el flujo nuevo escribe to_be).
alter table intakes
  add column if not exists as_is text,
  add column if not exists senal_detalle text,
  add column if not exists dato_detalle text,
  add column if not exists intento_previo text,
  add column if not exists to_be text;
