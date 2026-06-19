export interface IntakeData {
  perfil: "negocio" | "lider_area" | "emprendedor";
  sector: string;
  alcance: string;
  dolor_declarado: string;
  to_be_objetivo: string;
  to_be_nivel: number | null;
  tecnologia_visible: string | null;
  metrica_declarada: string | null;
  respuestas_capacidad: {
    painDetail: string | null;
    capacityQ1: string | null;
    capacityQ2: string | null;
    capacityQ3: string | null;
  };
}

export type NivelCMMI = 1 | 2 | 3 | 4 | 5;

export type MudaTipo =
  | "sobreproduccion"
  | "espera"
  | "transporte"
  | "sobreprocesamiento"
  | "inventario"
  | "movimiento"
  | "defectos"
  | "talento_no_utilizado";

export interface DiagnosticoResult {
  suficiencia: {
    nivel: "rica" | "intermedia" | "pobre";
    score: number;
    razon: string;
  };
  cmmi: {
    nivel_actual_estimado: NivelCMMI;
    nivel_objetivo: NivelCMMI | null;
    brecha: number | null;
    descripcion: string;
  };
  mudas: {
    identificadas: MudaTipo[];
    descripcion: string;
  };
  oportunidades: {
    lista: string[];
    prioridad_sugerida: string;
  };
  resumen_ejecutivo: string;
}
