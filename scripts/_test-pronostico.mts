import { clasificar } from "@/lib/clasificador";
import { redactarVeredicto } from "@/lib/redactor-engine";
import type { IntakeAptitud } from "@/types/aptitud";

const CASOS: Record<string, IntakeAptitud> = {
  "1-spa": {
    proceso: "Agendamiento y confirmación de citas del spa",
    ejecucion: "La recepcionista agenda por WhatsApp según lo que recuerda de cada clienta; nadie más sabe cómo prioriza; agenda de papel y Excel en paralelo",
    senal: "cabeza", dato: "dispersa", frecuencia: "varias_veces_dia",
    antiguedad: "nunca", falla: "cada_quien",
    expectativa_ia: "Que la IA agende sola y sugiera servicios según la historia de cada clienta",
    email: "t@t.co", sector: "belleza_bienestar",
  },
  "2-logistica": {
    proceso: "Consolidación del informe semanal de despachos",
    ejecucion: "Un analista exporta datos del sistema de bodega y del de transporte, y los cruza a mano en un Excel cada viernes; los dos sistemas registran bien pero no se hablan",
    senal: "indicadores", dato: "dispersa", frecuencia: "semanal",
    antiguedad: "hace_anios", falla: "controlado",
    expectativa_ia: "Que la IA arme el informe consolidado sola cada semana",
    email: "t@t.co", sector: "logistica_transporte",
  },
  "3-manufactura": {
    proceso: "Cotización de pedidos especiales",
    ejecucion: "Solo el jefe de planta sabe cotizar; anota en su cuaderno y responde por correo cuando puede; los pedidos esperan a que él esté disponible",
    senal: "cabeza", dato: "suelta", frecuencia: "diario",
    antiguedad: "hace_anios", falla: "tarde",
    expectativa_ia: "Que la IA cotice automáticamente los pedidos entrantes",
    email: "t@t.co", sector: "manufactura_produccion",
  },
};

const cuerpos: Record<string, string> = {};
for (const [nombre, intake] of Object.entries(CASOS)) {
  const clasif = clasificar(intake);
  const r = await redactarVeredicto(intake, clasif);
  if (!r.ok) { console.log(`${nombre}: FALLÓ VALIDACIÓN`, r.errores); continue; }
  cuerpos[nombre] = r.veredicto.cuerpo_texto;
  console.log(`\n═══════════ ${nombre} · ${clasif.patologia} (${clasif.severidad}) ═══════════`);
  console.log(r.veredicto.cuerpo_texto);
}

console.log("\n═══════════ CHECKLIST ═══════════");
const todos = Object.entries(cuerpos);
const chk = (nombre: string, ok: boolean) => console.log(`${ok ? "✓" : "✗"} ${nombre}`);
chk("Los tres dicen DIAGNÓSTICO: y ninguno VEREDICTO", todos.every(([, t]) => t.includes("DIAGNÓSTICO:") && !t.includes("VEREDICTO")));
chk("Ninguno menciona fuga/costo/pesos/$", todos.every(([, t]) => !/fuga|costo|pesos|\$|COP/i.test(t.split("Responde este correo")[0].slice(-500))));
chk("Ninguno mezcla usted", todos.every(([, t]) => !/\busted\b/i.test(t)));
chk("Los tres cierran con pregunta antes del contacto", todos.every(([, t]) => { const pre = t.split("Responde este correo")[0].trim(); return pre.slice(-250).includes("?"); }));
chk("Caso 2 dice que probablemente no necesita IA", /no es IA|no necesita IA|ni siquiera.*IA/i.test(cuerpos["2-logistica"] ?? ""));
const frases = (t: string) => t.split(/[.!?]\s/).map(x => x.trim().toLowerCase()).filter(x => x.split(" ").length > 8);
let rep = 0;
const n = Object.keys(cuerpos);
for (let i = 0; i < n.length; i++) for (let j = i + 1; j < n.length; j++)
  for (const f of frases(cuerpos[n[i]])) if (frases(cuerpos[n[j]]).includes(f)) rep++;
chk(`Cero frases repetidas entre cuerpos (${rep} encontradas)`, rep === 0);
