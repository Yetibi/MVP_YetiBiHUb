-- Migración: crear tabla powerbi_leads
-- Leads del formulario de pre-reunión de la landing de Power BI
-- Ejecutar en el SQL Editor de Supabase (Dashboard > SQL Editor)

CREATE TABLE powerbi_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  empresa TEXT NOT NULL,
  sector TEXT NOT NULL,
  sector_otro TEXT,
  fuentes_datos TEXT[] NOT NULL,
  decision_bloqueada TEXT NOT NULL,
  herramientas_previas TEXT NOT NULL,
  herramienta_otra TEXT,
  resultado_ideal TEXT NOT NULL,
  scoring INTEGER NOT NULL DEFAULT 0,
  scoring_detalle JSONB,
  ip_address TEXT,
  user_agent TEXT
);

-- RLS: solo service_role puede insertar
ALTER TABLE powerbi_leads ENABLE ROW LEVEL SECURITY;
-- No crear políticas para anon — solo service_role bypasea RLS
