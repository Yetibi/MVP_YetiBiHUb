/**
 * Carga las unidades de YetiBI Teach a Supabase.
 *
 * Lee los .md de Contenido-YetiBI-Teach/unidades/ (FUERA del repo: el repo es
 * el contenedor, no el contenido), parsea el frontmatter a columnas y el cuerpo
 * a `cuerpo`, y hace upsert por `slug` con la service_role key. Re-ejecutable.
 *
 *   npx tsx scripts/teach-cargar-unidades.mts
 *
 * Ruta del contenido: por defecto ../Contenido-YetiBI-Teach/unidades relativo
 * a la raíz del repo; override con la env TEACH_CONTENIDO_DIR.
 */
import { config } from "dotenv";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const DIR =
  process.env.TEACH_CONTENIDO_DIR ??
  resolve(process.cwd(), "../Contenido-YetiBI-Teach/unidades");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

type Fila = {
  slug: string;
  titulo: string;
  objetivo: string | null;
  orden: number;
  cuerpo: string;
  publicada: boolean;
};

function parsear(md: string, archivo: string): { meta: Record<string, string>; cuerpo: string } {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`Sin frontmatter válido: ${archivo}`);
  const meta: Record<string, string> = {};
  for (const linea of m[1].split(/\r?\n/)) {
    const i = linea.indexOf(":");
    if (i === -1) continue;
    meta[linea.slice(0, i).trim()] = linea.slice(i + 1).trim();
  }
  return { meta, cuerpo: m[2].trim() };
}

// Filtro opcional por nombre de archivo: `npx tsx ...mts 04` carga solo 04-*.
const soloArg = process.argv[2];
const archivos = (await readdir(DIR))
  .filter((f) => f.endsWith(".md"))
  // Solo unidades NN-slug con NN de 01 a 99; excluye 00- (maestro/compilado)
  // y el índice (00_INDICE.md).
  .filter((f) => /^\d{2}-/.test(f) && !/^00-/.test(f))
  .filter((f) => (soloArg ? f.includes(soloArg) : true))
  .sort();
if (archivos.length === 0) {
  console.error(`No hay .md en ${DIR}${soloArg ? ` que coincidan con "${soloArg}"` : ""}`);
  process.exit(1);
}
if (soloArg) console.log(`Filtro: solo archivos que incluyen "${soloArg}"`);

const filas: Fila[] = [];
for (const archivo of archivos) {
  const md = await readFile(resolve(DIR, archivo), "utf8");
  const { meta, cuerpo } = parsear(md, archivo);
  const slug = (meta.slug || archivo.replace(/\.md$/, "").replace(/^\d+-/, "")).trim();
  if (!meta.titulo || !meta.orden) throw new Error(`Falta titulo u orden en ${archivo}`);
  filas.push({
    slug,
    titulo: meta.titulo,
    objetivo: meta.objetivo ?? null,
    orden: Number(meta.orden),
    cuerpo,
    publicada: String(meta.publicada).toLowerCase() === "true",
  });
}

const { error } = await db.from("unidades").upsert(filas, { onConflict: "slug" });
if (error) {
  console.error("Error al cargar unidades:", error.message);
  process.exit(1);
}

console.log(`✓ ${filas.length} unidades cargadas desde ${DIR}`);
for (const f of [...filas].sort((a, b) => a.orden - b.orden)) {
  console.log(`  ${f.orden}. ${f.slug} — ${f.titulo}${f.publicada ? "" : "  (borrador)"}`);
}
