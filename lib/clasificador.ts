import type {
  Clasificacion,
  IntakeAptitud,
  Patologia,
  Senal,
} from "@/types/aptitud";

// ─── Motor de clasificación · determinista ───────────────────────────────────
// Corre ANTES de llamar al modelo. El modelo nunca decide la patología.
//
// Regla de resolución: gana la patología MÁS PROFUNDA detectada, no la más
// frecuente — es la secuencia Eliminar → Simplificar → Optimizar → Automatizar
// → Medir convertida en precedencia: no tiene sentido diagnosticar el dato de
// un proceso que no debería existir así.
//
// Precedencia: 1 inercia_activa · 2 ghost_data · 3 patchwork ·
// 4 variabilidad_artesanal · 5 fuga_de_decision (default y único "apto").

type CampoClasificacion = Pick<
  IntakeAptitud,
  "senal" | "dato" | "antiguedad" | "falla"
>;

export function cmmiDe(senal: Senal): 1 | 2 | 3 {
  switch (senal) {
    case "queja":
      return 1;
    case "cabeza":
      return 1;
    case "registro_muerto":
      return 2;
    case "indicadores":
      return 3;
  }
}

/** Todas las señales presentes en el intake (la primaria se filtra después). */
function detectarSenales(i: CampoClasificacion): Patologia[] {
  const s: Patologia[] = [];
  if ((i.antiguedad === "fosil" || i.antiguedad === "nunca") && i.senal !== "indicadores") {
    s.push("inercia_activa");
  }
  if (i.dato === "no_existe" || i.dato === "suelta") s.push("ghost_data");
  if (i.dato === "dispersa") s.push("patchwork");
  if (i.falla === "cada_quien") s.push("variabilidad_artesanal");
  if (i.falla === "tarde" || i.falla === "cliente" || i.falla === "repetido") s.push("fuga_de_decision");
  return s;
}

export function clasificar(i: CampoClasificacion): Clasificacion {
  const todas = detectarSenales(i);
  const cmmiEstimado = cmmiDe(i.senal);

  const construir = (
    patologia: Patologia,
    severidad: Clasificacion["severidad"]
  ): Clasificacion => ({
    patologia,
    severidad,
    cmmiEstimado,
    senalesSecundarias: todas.filter((p) => p !== patologia),
  });

  // 1 · INERCIA ACTIVA — el propósito/diseño quedó congelado.
  //     Proceso sin cambios en 3+ años (o nunca) Y sin medición real.
  //     Si hay indicadores (senal=indicadores) NO es inercia: un proceso
  //     medido y estable puede simplemente estar maduro.
  if (
    (i.antiguedad === "fosil" || i.antiguedad === "nunca") &&
    i.senal !== "indicadores"
  ) {
    return construir(
      "inercia_activa",
      i.antiguedad === "nunca" ? "alta" : "media"
    );
  }

  // 2 · GHOST DATA — el dato nunca se instrumentó.
  if (i.dato === "no_existe" || i.dato === "suelta") {
    return construir("ghost_data", i.dato === "no_existe" ? "alta" : "media");
  }

  // 3 · PATCHWORK — el dato existe, disperso y reconciliado a mano.
  if (i.dato === "dispersa") {
    return construir("patchwork", "media");
  }

  // 4 · VARIABILIDAD ARTESANAL — dato sano, ejecución sin estándar.
  if (i.falla === "cada_quien") {
    return construir("variabilidad_artesanal", "media");
  }

  // 5 · FUGA DE DECISIÓN — default y único veredicto "apto".
  //     El proceso camina y el dato existe; el punto es la latencia
  //     entre la señal y la decisión.
  const severidad =
    i.falla === "tarde" || i.falla === "cliente" ? "alta" : i.falla === "repetido" ? "media" : "baja";
  return construir("fuga_de_decision", severidad);
}
