import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ValueFlow } from "@/components/home/ValueFlow";
import { CtaFinal } from "@/components/home/CtaFinal";
import { ContactForm } from "@/components/home/ContactForm";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main-content">
        <Problem />
        <HowItWorks />
        <ValueFlow />
        <CtaFinal />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
