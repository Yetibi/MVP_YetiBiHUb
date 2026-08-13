import Hero from "@/components/home/Hero";

import  DifferentiatorSection from "@/components/home/DifferentiatorSection"; // Asegúrate de que esta ruta sea correcta
import { HowItWorks } from "@/components/home/HowItWorks";
import { ValueFlow } from "@/components/home/ValueFlow";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Footer } from "@/components/home/Footer";


export default function Home() {
  return (
    <>
      <Hero />
      <main id="main-content">
        <HowItWorks />
        <ValueFlow />
        <DifferentiatorSection />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}