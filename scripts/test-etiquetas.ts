// Etiquetas del motor + validador post-modelo.
// Corre con: npx tsx scripts/test-etiquetas.ts
//
// 1. Cada opción del formulario (lib/copy.ts) tiene etiqueta en el motor y la
//    etiqueta empieza por el texto que vio el usuario (label; el `sub` va
//    después de un guion). Ninguna clave se inyecta cruda.
// 2. etiquetaDe lanza ante una clave fuera del contrato (nunca "undefined").
// 3. El validador rechaza: tensión repetida, "pronóstico", "tipo A/B/C" y el
//    nombre técnico fuera de la etiqueta; y acepta "tipo asistencial" y el
//    nombre dentro de la etiqueta/línea de tensión.

import "dotenv/config";
import assert from "node:assert/strict";
import {
  SENAL_OPTIONS,
  DATO_OPTIONS,
  FRECUENCIA_OPTIONS,
  ANTIGUEDAD_OPTIONS,
  FALLA_OPTIONS,
} from "../lib/copy";
import {
  LABELS_SENAL,
  LABELS_DATO,
  LABELS_FRECUENCIA,
  LABELS_ANTIGUEDAD,
  LABELS_FALLA,
  etiquetaDe,
  buildUserMessage,
  validarVeredicto,
} from "../lib/redactor-engine";
import { PLANTILLAS, TENSION_FUGA_BAJA } from "../lib/plantillas-veredicto";
import type { Clasificacion, IntakeAptitud } from "../types/aptitud";

let ok = 0;
const paso = (msg: string) => { ok++; console.log(`✓ ${msg}`); };

// ── 1. Diccionarios vs formulario ──
const pares: [string, readonly { value: string; label: string; sub?: string }[], Record<string, string>][] = [
  ["senal", SENAL_OPTIONS, LABELS_SENAL],
  ["dato", DATO_OPTIONS, LABELS_DATO],
  ["frecuencia", FRECUENCIA_OPTIONS, LABELS_FRECUENCIA],
  ["antiguedad", ANTIGUEDAD_OPTIONS, LABELS_ANTIGUEDAD],
  ["falla", FALLA_OPTIONS, LABELS_FALLA],
];
for (const [campo, opciones, dict] of pares) {
  for (const o of opciones) {
    const label = dict[o.value];
    assert.ok(label !== undefined, `${campo}.${o.value}: sin etiqueta en el motor`);
    assert.ok(
      label.startsWith(o.label),
      `${campo}.${o.value}: el motor dice "${label}", el formulario "${o.label}"`
    );
    // Excepción deliberada: dato.suelta NO replica el sub del formulario
    // ("Excel, PDF, correos, carpetas") porque inyectar una marca comercial
    // en el prompt hacía que el modelo la escribiera y la regla dura 1 la
    // rechazara. El label sí debe seguir coincidiendo.
    const SIN_SUB = new Set(["dato.suelta"]);
    if (o.sub && !SIN_SUB.has(`${campo}.${o.value}`)) {
      assert.ok(
        label.toLowerCase().includes(o.sub.toLowerCase()),
        `${campo}.${o.value}: falta el sub "${o.sub}" en "${label}"`
      );
    }
  }
  paso(`${campo}: ${opciones.length} opciones del formulario traducidas (diccionario con ${Object.keys(dict).length} claves)`);
}

// Ninguna etiqueta inyectada al prompt puede nombrar una herramienta que la
// regla dura 1 prohíbe escribir (contradicción prompt vs. validador).
for (const [campo, , dict] of pares) {
  for (const [clave, label] of Object.entries(dict)) {
    for (const h of ["excel", "power bi", "copilot", "chatgpt", "n8n", "zapier"]) {
      assert.ok(
        !new RegExp(`\\b${h}\\b`).test(label.toLowerCase()),
        `${campo}.${clave}: la etiqueta nombra "${h}", que el validador prohíbe: "${label}"`
      );
    }
  }
}
paso("ninguna etiqueta del motor nombra una herramienta prohibida");

// ── 2. Clave fuera del contrato → lanza ──
assert.throws(
  () => etiquetaDe(LABELS_FRECUENCIA, "quincenal", "frecuencia"),
  /no tiene etiqueta/
);
paso("etiquetaDe lanza ante clave desconocida (no imprime undefined)");

// ── 3. Mensaje de usuario sin claves crudas ──
const intake: IntakeAptitud = {
  proceso: "cotización de pedidos",
  as_is: "El vendedor recibe el pedido por WhatsApp y arma la cotización en una plantilla.",
  ejecucion: "Tres vendedores, cada uno con su plantilla.",
  senal: "queja",
  dato: "dispersa",
  frecuencia: "mensual_o_menos",
  antiguedad: "hace_anios",
  falla: "cliente",
  to_be: "Que la cotización salga el mismo día sin errores.",
  email: "test@yetibi.com",
};
const clasif: Clasificacion = {
  patologia: "patchwork",
  severidad: "media",
  cmmiEstimado: 1,
  senalesSecundarias: ["fuga_de_decision"],
};
const msg = buildUserMessage(intake, clasif);
const clavesCrudas = [
  ...FRECUENCIA_OPTIONS.map((o) => o.value),
  ...ANTIGUEDAD_OPTIONS.map((o) => o.value),
  ...SENAL_OPTIONS.map((o) => o.value),
  ...DATO_OPTIONS.map((o) => o.value),
  ...FALLA_OPTIONS.map((o) => o.value),
  "semanal", "nunca", "controlado",
];
const respuestas = msg.slice(msg.indexOf("RESPUESTAS DEL USUARIO"));
// Una clave cruda solo puede aparecer inyectada justo tras ": " (así se
// imprimía antes); palabras como "cliente" o "tarde" dentro de una etiqueta
// o de un texto libre no son claves.
for (const k of clavesCrudas) {
  assert.ok(!new RegExp(`: ${k}\\b`).test(respuestas), `clave cruda "${k}" en el mensaje de usuario`);
}
for (const [campo, dict] of pares.map(([c, , d]) => [c, d] as const)) {
  const label = dict[intake[campo as keyof typeof intake] as string];
  assert.ok(respuestas.includes(label), `${campo}: la etiqueta "${label}" no está en el mensaje`);
}
assert.ok(!msg.includes("undefined"), "'undefined' en el mensaje de usuario");
paso("buildUserMessage: sin claves crudas ni 'undefined'");

// ── 4. Validador ──
const p = PLANTILLAS.patchwork;
const base = (cuerpoMedio: string, cierre = p.lineaTension) =>
  `Evaluamos tu proceso de cotización de pedidos.\n\n${p.etiqueta} — ${p.glosa}\n\n${cuerpoMedio}\n\n${cierre}\n\n¿A qué se reasigna el tiempo?\n\nResponde este correo, o yetibi.com.\n\nYeti BI · Ingeniería de procesos y datos`;
const ver = (cuerpo_texto: string) =>
  validarVeredicto({ asunto: "x", cuerpo_texto, cuerpo_html: "<p>x</p>" }, clasif, intake);

assert.deepEqual(ver(base("Cuerpo limpio sin nombres técnicos.")), { valido: true });
paso("acepta un cuerpo limpio (nombre técnico solo en etiqueta y línea de tensión)");

const rTension = ver(base(`Como dijimos: ${p.lineaTension}`));
assert.ok(!rTension.valido && /línea de tensión aparece 2 veces/.test(rTension.error), "no detectó tensión repetida");
paso("rechaza la línea de tensión repetida");

const rPron = ver(base("Este es un pronóstico favorable."));
assert.ok(!rPron.valido && /pronóstico/.test(rPron.error));
paso('rechaza "pronóstico"');

const rTipo = ver(base("Tu proceso es de tipo A, mecánico."));
assert.ok(!rTipo.valido && /tipo A\/B\/C/.test(rTipo.error));
paso('rechaza "tipo A"');

assert.deepEqual(ver(base("Es un servicio de tipo asistencial, con prototipo a mano.")), { valido: true });
paso('acepta "tipo asistencial" / "prototipo a" (límite de palabra)');

const rNombre = ver(base("El patchwork que describes obliga a cruzar a mano."));
assert.ok(!rNombre.valido && /nombre técnico "patchwork"/.test(rNombre.error));
paso("rechaza el nombre técnico fuera de la etiqueta");

const rNombre2 = ver(base("Aquí hay ghost data en la práctica."));
assert.ok(!rNombre2.valido && /ghost data/.test(rNombre2.error));
paso("rechaza el nombre de OTRA patología en el cuerpo");

// Herramientas con límite de palabra (bug previo: "erp" ⊂ "cuerpo"/"interpretar").
assert.deepEqual(ver(base("Hay que interpretar el cuerpo del pedido; el resultado es excelente.")), { valido: true });
paso('acepta "interpretar", "cuerpo", "excelente" (límite de palabra en herramientas)');
const rErp = ver(base("Podrías conectar el ERP con la tienda."));
assert.ok(!rErp.valido && /"erp"/.test(rErp.error));
paso('sigue rechazando "ERP" como palabra');

// Calibración por evidencia: el validador rechaza el exceso, no la brevedad.
const relleno = (n: number) => Array.from({ length: n }, (_, i) => `palabra${i}`).join(" ");
// `intake` de arriba: as_is corto, sin ampliaciones, to_be corto → ESCASA (máx 200, techo 220)
const rLargo = ver(base(relleno(400)));
assert.ok(!rLargo.valido && /ESCASA/.test(rLargo.error) && /máximo son 200/.test(rLargo.error), rLargo.valido ? "no rechazó" : rLargo.error);
paso("rechaza un cuerpo que excede el tramo de evidencia (ESCASA)");
assert.deepEqual(ver(base(relleno(120))), { valido: true });
paso("acepta un cuerpo corto (la brevedad nunca se penaliza)");
// ESCASA: máx 200, techo 250. ~230 palabras libres (relleno + pregunta y
// contraste del esqueleto) = el desborde típico del modelo, debe pasar.
assert.deepEqual(ver(base(relleno(190))), { valido: true });
paso("acepta el desborde normal del modelo (~15%) sin mandar a revisión manual");

// ── Anglicismos (regla dura 13) ──
for (const [txt, term] of [["Tu to-be exige otra cosa.", "to-be"], ["El to be del proceso.", "to-be"], ["Revisa el as-is del flujo.", "as-is"], ["Ese workflow no ayuda.", "workflow"], ["Un dashboard no lo resuelve.", "dashboard"], ["Falta un insight.", "insight"], ["El gap es grande.", "gap"]] as [string, string][]) {
  const r = ver(base(txt));
  assert.ok(!r.valido && r.error.includes(term), `no rechazó "${term}": ${JSON.stringify(r)}`);
}
paso("rechaza anglicismos: to-be, to be, as-is, workflow, dashboard, insight, gap");
// "patchwork" dentro de la etiqueta y de la línea de tensión NO se penaliza
assert.deepEqual(ver(base("Cuerpo en español, sin jerga.")), { valido: true });
paso('"patchwork" en la etiqueta fija no dispara el filtro de anglicismos');

// ── Línea de tensión: ausencia y posición (regla dura 11) ──
const sinTension = `Evaluamos tu proceso.\n\n${p.etiqueta} — ${p.glosa}\n\nCuerpo sin remate.\n\n¿Pregunta?\n\nResponde este correo, o yetibi.com.`;
const rSin = ver(sinTension);
assert.ok(!rSin.valido && /Falta la línea de tensión/.test(rSin.error), rSin.valido ? "aceptó sin tensión" : rSin.error);
paso("rechaza la AUSENCIA de la línea de tensión (antes pasaba)");

const parafraseada = `Evaluamos tu proceso.\n\n${p.etiqueta} — ${p.glosa}\n\nConectar IA sobre ese esquema no elimina la reconciliación manual; la hereda. La IA consolidará versiones que se contradicen, y lo hará con total seguridad.\n\n¿Pregunta?\n\nResponde este correo, o yetibi.com.`;
const rPar = ver(parafraseada);
assert.ok(!rPar.valido && /PARAFRASEADA/.test(rPar.error), rPar.valido ? "aceptó paráfrasis" : rPar.error);
paso("detecta la línea PARAFRASEADA (el caso real de la prueba de precisión)");

// Tensión al ~30% del cuerpo: usada como argumento en el contraste, no como
// remate. Los reportes correctos la ponen entre 80% y 85%.
const aMitad = `Evaluamos tu proceso.\n\n${p.etiqueta} — ${p.glosa}\n\n${relleno(30)}\n\n${p.lineaTension}\n\n${relleno(150)}\n\n¿Pregunta?\n\nResponde este correo, o yetibi.com.`;
const rMit = ver(aMitad);
assert.ok(!rMit.valido && /no es el remate/.test(rMit.error), rMit.valido ? "aceptó tensión a mitad" : rMit.error);
paso("rechaza la línea de tensión a mitad del cuerpo (debe ser el remate)");

// fuga baja: la tensión efectiva es TENSION_FUGA_BAJA
const clasifFuga: Clasificacion = { patologia: "fuga_de_decision", severidad: "baja", cmmiEstimado: 3, senalesSecundarias: [] };
const f = PLANTILLAS.fuga_de_decision;
const cuerpoFuga = `Evaluamos tu proceso.\n\n${f.etiqueta} — ${f.glosa}\n\nCuerpo.\n\n${TENSION_FUGA_BAJA}\n\n¿Pregunta?\n\nResponde este correo, o yetibi.com.`;
assert.deepEqual(
  validarVeredicto({ asunto: "x", cuerpo_texto: cuerpoFuga, cuerpo_html: "x" }, clasifFuga, intake),
  { valido: true }
);
const rFugaDoble = validarVeredicto(
  { asunto: "x", cuerpo_texto: cuerpoFuga + "\n" + TENSION_FUGA_BAJA, cuerpo_html: "x" },
  clasifFuga,
  intake
);
assert.ok(!rFugaDoble.valido);
paso("fuga baja: usa TENSION_FUGA_BAJA como línea efectiva y la exige una sola vez");

console.log(`\n${ok} comprobaciones pasan`);
