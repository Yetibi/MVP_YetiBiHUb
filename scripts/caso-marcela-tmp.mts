// Caso de prueba de precisión — pipeline real (clasificador + redactor),
// sin tocar el motor. Imprime el mensaje que ve el modelo y el reporte.
import "dotenv/config";
import { clasificar } from "../lib/clasificador";
import { buildUserMessage, redactarVeredicto, evaluarEvidencia, palabrasLibres } from "../lib/redactor-engine";
import { PLANTILLAS, lineaTensionPara } from "../lib/plantillas-veredicto";
import type { IntakeAptitud } from "../types/aptitud";

const intake: IntakeAptitud = {
  nombre: "Marcela Ospina",
  email: "data@yetibi.com",
  sector: "alimentos_bebidas",
  proceso: "Pedidos a proveedores de materia prima",
  as_is:
    "Cada lunes el jefe de cocina revisa la nevera y el estante y anota en una libreta lo que hace falta. Le pasa la foto de la hoja por WhatsApp a la auxiliar administrativa, que transcribe todo a un formato en Excel. Ese formato se lo manda por correo al jefe de compras, que le pone los precios —los tiene en un archivo suyo que actualiza cuando los proveedores le avisan— y arma la orden. La orden se la manda al gerente para aprobación. El gerente firma y devuelve. La auxiliar llama o escribe a cada proveedor por separado. Cuando llega la mercancía, el jefe de cocina revisa contra la libreta original, no contra la orden, porque a veces le cambiaron cantidades y nadie le avisó.",
  ejecucion:
    "Jefe de cocina (libreta de papel), auxiliar administrativa (Excel y correo), jefe de compras (archivo propio de precios en Excel), gerente (correo). WhatsApp para todo lo informal.",
  senal: "cabeza",
  senal_detalle: "Nos damos cuenta de que faltó algo cuando el cocinero lo necesita en el turno y no está.",
  dato: "dispersa",
  dato_detalle: "Cada uno tiene su archivo. El de precios solo lo tiene el jefe de compras.",
  frecuencia: "semanal",
  antiguedad: "hace_anios", // "entre_uno_cinco" del spec = etiqueta "Entre uno y cinco años"
  intento_previo:
    "Compramos un módulo de compras del software contable hace dos años. Nadie lo usó porque pedía datos que no teníamos a la mano y era más lento que el Excel.",
  falla: "repetido",
  to_be:
    "Que el pedido salga el mismo lunes sin que tres personas tengan que tocarlo, que sepamos qué se pidió y qué llegó sin tener que preguntar, y que el jefe de cocina esté en la cocina y no llenando papeles.",
};

const clasif = clasificar(intake);
const ev = evaluarEvidencia(intake);
console.log(`CLASIFICACIÓN: ${clasif.patologia} · severidad ${clasif.severidad} · cmmi ${clasif.cmmiEstimado}`);
console.log(`Secundarias: [${clasif.senalesSecundarias.join(", ") || "ninguna"}]`);
console.log(`EVIDENCIA: ${ev.tramo.toUpperCase()} → ${ev.min}-${ev.max} palabras (techo ${Math.round(ev.max * 1.25)})\n`);
const msg = buildUserMessage(intake, clasif);
console.log("=== MENSAJE AL MODELO (bloque de calibración) ===");
console.log(msg.slice(msg.indexOf("EVIDENCIA DE ESTE INTAKE"), msg.indexOf("PLANTILLA A LLENAR")));

const r = await redactarVeredicto(intake, clasif);
if (!r.ok) { console.log("✗ revision_manual:", r.errores.join(" | ")); process.exit(1); }
const cuerpo = r.veredicto.cuerpo_texto;
const etiq = `${PLANTILLAS[clasif.patologia].etiqueta} — ${PLANTILLAS[clasif.patologia].glosa}`;
console.log("=== REPORTE ===\n");
console.log(`ASUNTO: ${r.veredicto.asunto}\n\n${cuerpo}\n`);
console.log("=== MÉTRICAS ===");
console.log(`palabras totales: ${cuerpo.split(/\s+/).filter(Boolean).length} · libres (sin plantilla): ${palabrasLibres(cuerpo, etiq)} · esperado ${ev.min}-${ev.max}`);
console.log(`viñetas: ${(cuerpo.match(/^\s*[•\-]\s/gm) || []).length}`);
console.log(`tensión ×${cuerpo.split(lineaTensionPara(clasif.patologia, clasif.severidad)).length - 1}`);
