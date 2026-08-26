// Casos de prueba obligatorios del motor de clasificación (insumo v1.0 §2).
// Corre con: node scripts/test-clasificador.mjs
// (réplica JS 1:1 de lib/clasificador.ts para correr sin toolchain TS;
//  si cambias el clasificador, cambia ambos o este test miente)

import assert from "node:assert/strict";

// ── réplica del motor (mantener en sincronía con lib/clasificador.ts) ──
function cmmiDe(senal) {
  return { queja: 1, cabeza: 1, registro_muerto: 2, indicadores: 3 }[senal];
}
function detectarSenales(i) {
  const s = [];
  if ((i.antiguedad === "fosil" || i.antiguedad === "nunca") && i.senal !== "indicadores") s.push("inercia_activa");
  if (i.dato === "no_existe" || i.dato === "suelta") s.push("ghost_data");
  if (i.dato === "dispersa") s.push("patchwork");
  if (i.falla === "cada_quien") s.push("variabilidad_artesanal");
  if (i.falla === "tarde" || i.falla === "cliente" || i.falla === "repetido") s.push("fuga_de_decision");
  return s;
}
function clasificar(i) {
  const todas = detectarSenales(i);
  const cmmiEstimado = cmmiDe(i.senal);
  const construir = (patologia, severidad) => ({
    patologia, severidad, cmmiEstimado,
    senalesSecundarias: todas.filter((p) => p !== patologia),
  });
  if ((i.antiguedad === "fosil" || i.antiguedad === "nunca") && i.senal !== "indicadores")
    return construir("inercia_activa", i.antiguedad === "nunca" ? "alta" : "media");
  if (i.dato === "no_existe" || i.dato === "suelta")
    return construir("ghost_data", i.dato === "no_existe" ? "alta" : "media");
  if (i.dato === "dispersa") return construir("patchwork", "media");
  if (i.falla === "cada_quien") return construir("variabilidad_artesanal", "media");
  const severidad = i.falla === "tarde" || i.falla === "cliente" ? "alta" : i.falla === "repetido" ? "media" : "baja";
  return construir("fuga_de_decision", severidad);
}

// ── los 8 casos del insumo ──
const casos = [
  ["T1", { antiguedad: "nunca", senal: "queja", dato: "dispersa", falla: "tarde" },
    { patologia: "inercia_activa", severidad: "alta", secundarias: ["patchwork", "fuga_de_decision"] }],
  ["T2", { antiguedad: "fosil", senal: "indicadores", dato: "dispersa", falla: "controlado" },
    { patologia: "patchwork" }],
  ["T3", { antiguedad: "reciente", senal: "cabeza", dato: "no_existe", falla: "cada_quien" },
    { patologia: "ghost_data", severidad: "alta" }],
  ["T4", { antiguedad: "hace_anios", senal: "registro_muerto", dato: "suelta", falla: "repetido" },
    { patologia: "ghost_data", severidad: "media" }],
  ["T5", { antiguedad: "reciente", senal: "indicadores", dato: "dispersa", falla: "tarde" },
    { patologia: "patchwork" }],
  ["T6", { antiguedad: "reciente", senal: "registro_muerto", dato: "unica", falla: "cada_quien" },
    { patologia: "variabilidad_artesanal" }],
  ["T7", { antiguedad: "reciente", senal: "indicadores", dato: "unica", falla: "tarde" },
    { patologia: "fuga_de_decision", severidad: "alta" }],
  ["T8", { antiguedad: "reciente", senal: "indicadores", dato: "unica", falla: "controlado" },
    { patologia: "fuga_de_decision", severidad: "baja" }],
  // Mockup: "Se generan errores que llegan al cliente" = señal tardía vía cliente → fuga alta
  ["T9", { antiguedad: "reciente", senal: "indicadores", dato: "unica", falla: "cliente" },
    { patologia: "fuga_de_decision", severidad: "alta" }],
];

let ok = 0;
for (const [nombre, intake, esperado] of casos) {
  const r = clasificar(intake);
  assert.equal(r.patologia, esperado.patologia, `${nombre}: patología ${r.patologia} ≠ ${esperado.patologia}`);
  if (esperado.severidad) {
    assert.equal(r.severidad, esperado.severidad, `${nombre}: severidad ${r.severidad} ≠ ${esperado.severidad}`);
  }
  if (esperado.secundarias) {
    assert.deepEqual([...r.senalesSecundarias].sort(), [...esperado.secundarias].sort(),
      `${nombre}: secundarias ${JSON.stringify(r.senalesSecundarias)}`);
  }
  ok++;
  console.log(`✓ ${nombre} → ${r.patologia} (${r.severidad}) · cmmi ${r.cmmiEstimado} · secundarias [${r.senalesSecundarias.join(", ")}]`);
}
console.log(`\n${ok}/${casos.length} casos pasan`);
