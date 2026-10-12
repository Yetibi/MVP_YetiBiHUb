import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
const env = readFileSync(".env.local","utf-8");
const key = env.split("\n").find(l=>l.startsWith("ANTHROPIC_API_KEY")).split("=").slice(1).join("=").trim();
const src = readFileSync("lib/redactor-engine.ts", "utf-8");
const sys = src.split("const SYSTEM_REDACTOR = `")[1].split("`;")[0];
const c = new Anthropic({ apiKey: key });
const tool = { name:"entregar_veredicto", description:"x", input_schema:{ type:"object", required:["asunto","cuerpo_html","cuerpo_texto"], properties:{ asunto:{type:"string",maxLength:90}, cuerpo_texto:{type:"string"}, cuerpo_html:{type:"string"} } } };
const r = await c.messages.create({
  model: "claude-sonnet-4-6", max_tokens: 4000, system: sys,
  tools: [tool], tool_choice: { type:"tool", name:"entregar_veredicto" },
  messages: [{ role:"user", content: "PATOLOGÍA ASIGNADA: patchwork · severidad media · madurez nivel 2\n\nPLANTILLA A LLENAR:\n(esqueleto)\n\nRESPUESTAS DEL USUARIO:\n- Proceso: \"consolidación de informe diario\"\n- AS-IS: \"Cada mañana el coordinador cruza tres archivos y manda el informe.\"\n- Quién lo ejecuta: \"El coordinador.\"\n- Frecuencia: Todos los días · Hace cuánto: Entre uno y cinco años\n- Cuando falla: Hay que rehacer el trabajo\n- TO-BE: \"Que el informe se arme solo.\"\n\nLlena la plantilla y entrega el resultado con la herramienta entregar_veredicto." }],
});
const tu = r.content.find(b => b.type === "tool_use");
console.log("stop:", r.stop_reason, "output:", r.usage.output_tokens);
console.log("--- cuerpo_texto (primeros 1200 chars) ---");
console.log(String(tu.input.cuerpo_texto).slice(0,1200));
console.log("--- longitud total cuerpo_texto:", String(tu.input.cuerpo_texto).length);
