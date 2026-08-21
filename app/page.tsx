import { HeroMarca } from "@/components/home/HeroMarca";
import { Footer } from "@/components/home/Footer";

// Home de marca. Por ahora solo el héroe — las secciones (#tesis, #capas,
// #soi, #resultados, #contacto) se construyen por separado.
export default function Home() {
  return (
    <>
      <main id="main-content">
        <HeroMarca />
      </main>
      <Footer />
    </>
  );
}
