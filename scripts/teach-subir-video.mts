/**
 * Sube el video de introducción a un bucket PRIVADO de Supabase Storage
 * ('teach-video') como 'intro.mp4'. El índice lo sirve con URL firmada
 * (server-side), así queda detrás de la lista blanca igual que los audios.
 *
 *   npx tsx scripts/teach-subir-video.mts
 *
 * Lee de Contenido-YetiBI-Teach/videos/ (fuera del repo). Toma el primer .mp4.
 * Si el archivo no es MP4 progresivo (faststart), lo remuxea con ffmpeg para
 * que el <video> pueda arrancar antes de descargar todo.
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
  process.env.TEACH_VIDEO_DIR ??
  resolve(process.cwd(), "../Contenido-YetiBI-Teach/videos");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = "teach-video";
const DEST = "intro.mp4";

const { error: berr } = await db.storage.createBucket(BUCKET, { public: false });
console.log(
  berr
    ? /exist/i.test(berr.message)
      ? "bucket ya existía"
      : `bucket: ${berr.message}`
    : "bucket privado creado",
);

const archivos = (await readdir(DIR)).filter((f) => /\.(mp4|mov|m4v)$/i.test(f));
if (archivos.length === 0) {
  console.error(`No hay video en ${DIR}`);
  process.exit(1);
}
const archivo = archivos[0];
let src = resolve(DIR, archivo);

// Remux a MP4 progresivo con el índice moov al inicio (+faststart), sin
// re-encodear, para que el navegador pueda empezar a reproducir enseguida.
const out = resolve(tmpdir(), "teach-intro.mp4");
try {
  await execFileP("ffmpeg", [
    "-y", "-i", src, "-c", "copy", "-movflags", "+faststart", out,
  ]);
  src = out;
  console.log("remuxeado con faststart");
} catch {
  console.log(`(sin ffmpeg: subo ${archivo} sin remux)`);
}

const buf = await readFile(src);
const { error: uperr } = await db.storage
  .from(BUCKET)
  .upload(DEST, buf, { contentType: "video/mp4", upsert: true });
if (uperr) {
  console.error(`upload ${DEST}: ${uperr.message}`);
  process.exit(1);
}
console.log(`✓ ${archivo}  =>  ${BUCKET}/${DEST}`);
