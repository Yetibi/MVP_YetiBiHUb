import { redirect } from "next/navigation";

// ─── TEMPORAL ────────────────────────────────────────────────────────────────
// La evaluación se movió a /evaluacion. Este redirect ocupa la raíz solo
// mientras llega el video del héroe (public/video/hero-yeti-red-neuronal.mp4);
// la Parte 2 lo reemplaza por el Home de marca.
export default function Home() {
  redirect("/evaluacion");
}
