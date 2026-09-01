/**
 * Sube los audios de las unidades a un bucket PRIVADO de Supabase Storage
 * ('teach-audio') y guarda la ruta en unidades.audio. El reproductor usa
 * URLs firmadas (server-side), así el audio queda detrás de la lista blanca.
 *
 *   npx tsx scripts/teach-subir-audio.mts
 *
 * Lee de Contenido-YetiBI-Teach/audio/ (fuera del repo). El número de unidad
 * se detecta del nombre ("...Unidad 2.m4a" -> orden 2).
 */
import { config } from "dotenv";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";

const execFileP = promisify(execFile);
config({ path: ".env.local", quiet: true });

const DIR =
  process.env.TEACH_AUDIO_DIR ??
  resolve(process.cwd(), "../Contenido-YetiBI-Teach/audio");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = "teach-audio";

const { error: berr } = await db.storage.createBucket(BUCKET, { public: false });
console.log(
  berr
    ? /exist/i.test(berr.message)
      ? "bucket ya existía"
      : `bucket: ${berr.message}`
    : "bucket privado creado",
);

const { data: unidades, error: uerr } = await db
  .from("unidades")
  .select("slug, orden");
if (uerr) {
  console.error(uerr.message);
  process.exit(1);
}
const slugPorOrden = new Map<number, string>(
  (unidades ?? []).map((u) => [u.orden as number, u.slug as string]),
);

const archivos = (await readdir(DIR)).filter((f) =>
  /\.(m4a|mp3|wav|aac|ogg)$/i.test(f),
);
if (archivos.length === 0) {
  console.error(`No hay audios en ${DIR}`);
  process.exit(1);
}

for (const archivo of archivos) {
  const m = archivo.match(/unidad\s*(\d+)/i);
  if (!m) {
    console.log(`sin número de unidad, salto: ${archivo}`);
    continue;
  }
  const orden = Number(m[1]);
  const slug = slugPorOrden.get(orden);
  if (!slug) {
    console.log(`no existe unidad orden ${orden} para: ${archivo}`);
    continue;
  }
  const ext = archivo.split(".").pop()!.toLowerCase();
  const remuxeable = ["m4a", "mp4", "aac"].includes(ext);
  const dest = `${slug}.${remuxeable ? "m4a" : ext}`;
  let src = resolve(DIR, archivo);

  // NotebookLM exporta MP4 fragmentado (DASH), que un <audio> no reproduce.
  // Remux a MP4 progresivo (faststart), sin re-encodear. Requiere ffmpeg.
  if (remuxeable) {
    const out = resolve(tmpdir(), `teach-${slug}.m4a`);
    try {
      await execFileP("ffmpeg", [
        "-y", "-i", src, "-c", "copy", "-movflags", "+faststart", out,
      ]);
      src = out;
    } catch {
      console.log(`  (sin ffmpeg: subo ${archivo} sin remux — puede no reproducir)`);
    }
  }

  const buf = await readFile(src);
  const contentType = remuxeable ? "audio/mp4" : `audio/${ext}`;
  const { error: uperr } = await db.storage
    .from(BUCKET)
    .upload(dest, buf, { contentType, upsert: true });
  if (uperr) {
    console.error(`upload ${dest}: ${uperr.message}`);
    continue;
  }
  const { error: dberr } = await db
    .from("unidades")
    .update({ audio: dest })
    .eq("slug", slug);
  if (dberr) {
    console.error(`db ${slug}: ${dberr.message}`);
    continue;
  }
  console.log(`✓ unidad ${orden} (${slug}) <- ${archivo}  =>  ${dest}`);
}
console.log("listo");
