// Los 4 casos de verificación del motor con llamadas REALES al modelo.
// Corre con: DOTENV_CONFIG_PATH=.env.local npx tsx scripts/test-engine-casos.ts [salida.json]
//
// Por caso: clasifica, imprime el mensaje de usuario (para auditar que no
// viaje ninguna clave cruda ni "undefined"), redacta, y verifica sobre el
// reporte: línea de tensión una sola vez, sin "pronóstico"/"tipo A/B/C",
// sin nombre técnico fuera de la etiqueta, extensión.

import "dotenv/config";
import { writeFileSync } from "node:fs";
import type { IntakeAptitud } from "../types/aptitud";

const CASOS: { nombre: string; intake: IntakeAptitud }[] = [
  {
    nombre: "1 · Agendamiento en spa · conocimiento tácito",
    intake: {
      proceso: "agendamiento de citas",
      as_is:
        "La recepcionista recibe llamadas y mensajes de WhatsApp durante todo el día. Revisa mentalmente qué terapeuta está libre, pregunta qué servicio quiere la clienta y anota la cita en una agenda física. Si la clienta pide una terapeuta específica, la recepcionista sabe de memoria quién atiende qué y a qué hora entra cada una. Al cierre del día pasa algunas citas a un cuaderno de caja.",
      ejecucion:
        "Una recepcionista en turno de mañana y otra en la tarde. Agenda física, WhatsApp del negocio y un cuaderno de caja.",
      senal: "cabeza",
      senal_detalle: "La de la tarde a veces no sabe qué prometió la de la mañana.",
      dato: "no_existe",
      dato_detalle: "Lo de la agenda física no se pasa a ningún lado; el cuaderno solo tiene lo que se cobró.",
      frecuencia: "varias_veces_dia",
      antiguedad: "hace_anios",
      intento_previo: "Probamos una app de agenda hace dos años y las chicas dejaron de usarla al mes.",
      falla: "cliente",
      to_be:
        "Que cualquier clienta pueda agendar sola sin que nadie esté pendiente del teléfono, que no se crucen citas y que yo pueda ver desde la casa cómo va la ocupación de la semana.",
      email: "spa@prueba.yetibi.com",
      sector: "belleza_bienestar",
    },
  },
  {
    nombre: "2 · Consolidación de informe logístico · dato estructurado, tarea mecánica",
    intake: {
      proceso: "consolidación del informe diario de despachos",
      as_is:
        "Cada mañana el coordinador descarga del sistema de transporte el listado de guías del día anterior, exporta del sistema de facturación las remisiones, y del WMS el listado de picking. Cruza los tres archivos en Excel con BUSCARV para armar el informe de cumplimiento de despachos por cliente y lo envía por correo a gerencia a las 9 a.m.",
      ejecucion:
        "El coordinador de logística. Sistema de transporte, sistema de facturación, WMS y Excel.",
      senal: "registro_muerto",
      dato: "dispersa",
      dato_detalle: "Cada sistema tiene su parte; ninguno tiene la foto completa del despacho.",
      frecuencia: "diario",
      antiguedad: "hace_anios",
      falla: "repetido",
      to_be:
        "Que el informe se arme solo y esté listo a las 7 a.m. sin que el coordinador gaste hora y media cruzando archivos, y que si una guía no cuadra con la remisión aparezca marcada.",
      email: "logistica@prueba.yetibi.com",
      sector: "logistica_transporte",
    },
  },
  {
    nombre: "3 · Cotización en manufactura · cuello de botella",
    intake: {
      proceso: "cotización de pedidos especiales",
      as_is:
        "El vendedor recibe la solicitud del cliente por correo o WhatsApp, la pasa al ingeniero de producto para que estime materiales y tiempos, el ingeniero la devuelve en un correo, y el vendedor arma la cotización en el ERP con el margen que él considera. Todo pedido especial pasa por el mismo ingeniero, así que cuando él está en planta las cotizaciones esperan uno o dos días.",
      ejecucion:
        "Tres vendedores, un ingeniero de producto y el ERP. El ingeniero usa una hoja de cálculo propia para estimar.",
      senal: "queja",
      senal_detalle: "El cliente llama a preguntar por la cotización y ahí nos damos cuenta de que sigue en la bandeja del ingeniero.",
      dato: "unica",
      frecuencia: "varias_veces_semana",
      antiguedad: "hace_anios",
      intento_previo: "Se intentó que los vendedores estimaran solos con una tabla de precios, pero cada uno la aplicaba distinto y salieron cotizaciones con pérdida.",
      falla: "cada_quien",
      to_be:
        "Que una cotización especial salga en menos de 24 horas sin depender de que el ingeniero esté en la oficina, y que el margen no dependa de quién la arma.",
      email: "manufactura@prueba.yetibi.com",
      sector: "manufactura_produccion",
    },
  },
  {
    nombre: "4 · Mentorías en IA · proceso reciente, brecha corta",
    intake: {
      proceso: "seguimiento de mentorías",
      as_is:
        "El mentorado agenda por un enlace de calendario. Yo hago la sesión por videollamada, tomo notas en un documento distinto por persona, y le mando por WhatsApp las tareas para la siguiente sesión. Antes de cada sesión abro el documento, el chat y el calendario para recordar en qué íbamos. El pago lo registro en una hoja de cálculo aparte.",
      ejecucion:
        "Yo solo. Calendario en línea, documentos de notas, WhatsApp y una hoja de cálculo de pagos.",
      senal: "cabeza",
      dato: "dispersa",
      dato_detalle: "Cada herramienta tiene un pedazo: el calendario las fechas, el documento las notas, el chat las tareas.",
      frecuencia: "varias_veces_semana",
      antiguedad: "reciente",
      falla: "repetido",
      to_be:
        "Tener en un solo lugar el historial de cada mentorado (sesiones, tareas, avance y pagos) y que antes de cada sesión me llegue un resumen de dónde quedamos, sin armarlo yo a mano.",
      email: "mentor@prueba.yetibi.com",
      sector: "educacion_formacion",
    },
  },
];

const CLAVES_CRUDAS = [
  "varias_veces_dia", "diario", "varias_veces_semana", "semanal", "mensual_o_menos",
  "reciente", "hace_anios", "fosil", "nunca",
  "queja", "cabeza", "registro_muerto", "indicadores",
  "no_existe", "suelta", "dispersa", "unica",
  "cada_quien", "tarde", "repetido", "cliente", "controlado",
];
const NOMBRES = ["ghost data", "patchwork", "inercia activa", "variabilidad artesanal", "fuga de decisión"];

function contar(t: string, f: string) { return t.split(f).length - 1; }

async function main() {
  const { clasificar } = await import("../lib/clasificador");
  const { buildUserMessage, redactarVeredicto } = await import("../lib/redactor-engine");
  const { PLANTILLAS, lineaTensionPara } = await import("../lib/plantillas-veredicto");

  const salida: unknown[] = [];
  let fallos = 0;

  for (const { nombre, intake } of CASOS) {
    console.log(`\n${"═".repeat(72)}\nCASO ${nombre}\n${"═".repeat(72)}`);
    const clasif = clasificar(intake);
    console.log(`→ ${clasif.patologia} · ${clasif.severidad} · cmmi ${clasif.cmmiEstimado} · secundarias [${clasif.senalesSecundarias.join(", ")}]`);

    // Mensaje de usuario: auditoría de claves crudas / undefined
    const msg = buildUserMessage(intake, clasif);
    const respuestas = msg.slice(msg.indexOf("RESPUESTAS DEL USUARIO"));
    const crudas = CLAVES_CRUDAS.filter((k) => new RegExp(`: ${k}\\b`).test(respuestas)); // clave inyectada tras ": "
    const undef = msg.includes("undefined");
    console.log(`\n--- MENSAJE DE USUARIO (bloque RESPUESTAS) ---\n${respuestas}\n---`);
    console.log(`claves crudas: ${crudas.length ? "✗ " + crudas.join(", ") : "✓ ninguna"} · undefined: ${undef ? "✗" : "✓ no"}`);
    if (crudas.length || undef) fallos++;

    const t0 = Date.now();
    const r = await redactarVeredicto(intake, clasif);
    const ms = Date.now() - t0;
    if (!r.ok) {
      fallos++;
      console.log(`✗ revision_manual (${ms} ms): ${r.errores.join(" | ")}`);
      salida.push({ caso: nombre, clasif, ok: false, errores: r.errores, mensajeUsuario: msg });
      continue;
    }
    const v = r.veredicto;
    const cuerpo = v.cuerpo_texto;
    const lower = cuerpo.toLowerCase();
    const etiqueta = PLANTILLAS[clasif.patologia].etiqueta;
    const tension = lineaTensionPara(clasif.patologia, clasif.severidad);
    const sinFijos = cuerpo.split(etiqueta).join(" ").split(tension).join(" ").toLowerCase();
    const checks = {
      tensionVeces: contar(cuerpo, tension),
      tensionEnCierre: (() => {
        const i = cuerpo.indexOf(tension);
        return i >= 0 && i > cuerpo.length * 0.5;
      })(),
      pronostico: lower.includes("pronóstico"),
      tipoABC: /\btipo [abc]\b/.test(lower),
      nombresFuera: NOMBRES.filter((n) => sinFijos.includes(n)),
      palabras: cuerpo.split(/\s+/).filter(Boolean).length,
      ms,
    };
    console.log(`\nASUNTO: ${v.asunto}\n\n${cuerpo}\n`);
    console.log(`checks: tensión ×${checks.tensionVeces}${checks.tensionEnCierre ? " (en cierre)" : checks.tensionVeces === 0 ? " (adaptada — verificar remate)" : " (¡NO en cierre!)"} · pronóstico: ${checks.pronostico ? "✗" : "✓"} · tipo A/B/C: ${checks.tipoABC ? "✗" : "✓"} · nombres fuera: ${checks.nombresFuera.length ? "✗ " + checks.nombresFuera.join(",") : "✓"} · ${checks.palabras} palabras · ${ms} ms`);
    if (checks.tensionVeces > 1 || checks.pronostico || checks.tipoABC || checks.nombresFuera.length) fallos++;
    salida.push({ caso: nombre, clasif, ok: true, asunto: v.asunto, cuerpo_texto: cuerpo, checks, mensajeUsuario: msg });
  }

  const out = process.argv[2];
  if (out) writeFileSync(out, JSON.stringify(salida, null, 2));
  console.log(`\n${fallos === 0 ? "✓ 4/4 casos limpios" : `✗ ${fallos} caso(s) con observaciones`}`);
  process.exit(fallos === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
