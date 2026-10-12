import "dotenv/config";
import { clasificar } from "../lib/clasificador";
import { redactarVeredicto, evaluarEvidencia, palabrasLibres } from "../lib/redactor-engine";
import { PLANTILLAS, lineaTensionPara } from "../lib/plantillas-veredicto";
import type { IntakeAptitud } from "../types/aptitud";

const CASOS: { nombre: string; intake: IntakeAptitud }[] = [
  { nombre: "PROVEEDORES (prueba de precisión, evidencia rica)", intake: {
    nombre: "Marcela Ospina", email: "data@yetibi.com", sector: "alimentos_bebidas",
    proceso: "Pedidos a proveedores de materia prima",
    as_is: "Cada lunes el jefe de cocina revisa la nevera y el estante y anota en una libreta lo que hace falta. Le pasa la foto de la hoja por WhatsApp a la auxiliar administrativa, que transcribe todo a un formato en Excel. Ese formato se lo manda por correo al jefe de compras, que le pone los precios —los tiene en un archivo suyo que actualiza cuando los proveedores le avisan— y arma la orden. La orden se la manda al gerente para aprobación. El gerente firma y devuelve. La auxiliar llama o escribe a cada proveedor por separado. Cuando llega la mercancía, el jefe de cocina revisa contra la libreta original, no contra la orden, porque a veces le cambiaron cantidades y nadie le avisó.",
    ejecucion: "Jefe de cocina (libreta de papel), auxiliar administrativa (Excel y correo), jefe de compras (archivo propio de precios en Excel), gerente (correo). WhatsApp para todo lo informal.",
    senal: "cabeza", senal_detalle: "Nos damos cuenta de que faltó algo cuando el cocinero lo necesita en el turno y no está.",
    dato: "dispersa", dato_detalle: "Cada uno tiene su archivo. El de precios solo lo tiene el jefe de compras.",
    frecuencia: "semanal", antiguedad: "hace_anios",
    intento_previo: "Compramos un módulo de compras del software contable hace dos años. Nadie lo usó porque pedía datos que no teníamos a la mano y era más lento que el Excel.",
    falla: "repetido",
    to_be: "Que el pedido salga el mismo lunes sin que tres personas tengan que tocarlo, que sepamos qué se pidió y qué llegó sin tener que preguntar, y que el jefe de cocina esté en la cocina y no llenando papeles.",
  }},
  { nombre: "MENTORÍAS EN IA (brecha corta, evidencia media)", intake: {
    proceso: "seguimiento de mentorías",
    as_is: "El mentorado agenda por un enlace de calendario. Yo hago la sesión por videollamada, tomo notas en un documento distinto por persona, y le mando por WhatsApp las tareas para la siguiente sesión. Antes de cada sesión abro el documento, el chat y el calendario para recordar en qué íbamos. El pago lo registro en una hoja de cálculo aparte.",
    ejecucion: "Yo solo. Calendario en línea, documentos de notas, WhatsApp y una hoja de cálculo de pagos.",
    senal: "cabeza", dato: "dispersa",
    dato_detalle: "Cada herramienta tiene un pedazo: el calendario las fechas, el documento las notas, el chat las tareas.",
    frecuencia: "varias_veces_semana", antiguedad: "reciente", falla: "repetido",
    to_be: "Tener en un solo lugar el historial de cada mentorado (sesiones, tareas, avance y pagos) y que antes de cada sesión me llegue un resumen de dónde quedamos, sin armarlo yo a mano.",
    email: "mentor@prueba.yetibi.com", sector: "educacion_formacion",
  }},
];

for (const { nombre, intake } of CASOS) {
  const clasif = clasificar(intake);
  const ev = evaluarEvidencia(intake);
  console.log(`\n${"═".repeat(70)}\n${nombre}\n${"═".repeat(70)}`);
  console.log(`→ ${clasif.patologia} · ${clasif.severidad} · evidencia ${ev.tramo.toUpperCase()} (pide ${ev.min}-${ev.max}, techo ${Math.round(ev.max*1.25)})`);
  const r = await redactarVeredicto(intake, clasif);
  if (!r.ok) { console.log(`✗ revision_manual: ${r.errores.join(" | ")}`); continue; }
  const cuerpo = r.veredicto.cuerpo_texto;
  const pl = PLANTILLAS[clasif.patologia];
  const ten = lineaTensionPara(clasif.patologia, clasif.severidad);
  console.log(`\nASUNTO: ${r.veredicto.asunto}\n\n${cuerpo}\n`);
  console.log(`— métricas — total ${cuerpo.split(/\s+/).filter(Boolean).length} · libres ${palabrasLibres(cuerpo, `${pl.etiqueta} — ${pl.glosa}`)} · viñetas ${(cuerpo.match(/^\s*[•\-]\s/gm)||[]).length} · tensión ×${cuerpo.split(ten).length-1}`);
}
