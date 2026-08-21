import { HeroMarca } from "@/components/home/HeroMarca";
import { ConceptRail } from "@/components/home/ConceptRail";
import { S2Amplificacion } from "@/components/home/S2Amplificacion";
import { S3Reencuadre } from "@/components/home/S3Reencuadre";
import { S4Criterio } from "@/components/home/S4Criterio";
import { S5Asimetria } from "@/components/home/S5Asimetria";
import { S6Metodo } from "@/components/home/S6Metodo";
import { S7Soi } from "@/components/home/S7Soi";
// S8 oculta hasta definir casos publicables — no borrar
// import { S8Evidencia } from "@/components/home/S8Evidencia";
import { S9Acceso } from "@/components/home/S9Acceso";

// Home de marca: héroe + esqueleto de 8 secciones (iterables una a una).
// El raíl de conceptos es la firma — índice de la doctrina, fijo a la izquierda.
export default function Home() {
  return (
    <>
      <ConceptRail />
      <main id="main-content">
        <HeroMarca />
        <div className="hs-shift">
          <S2Amplificacion />
          <S3Reencuadre />
          <S4Criterio />
          <S5Asimetria />
          <S6Metodo />
          <S7Soi />
          {/* S8 oculta hasta definir casos publicables — no borrar */}
          {/* Restaurar "Resultados" en nav al reactivar S8 */}
          {/* <S8Evidencia /> */}
          <S9Acceso />
        </div>
      </main>
    </>
  );
}
