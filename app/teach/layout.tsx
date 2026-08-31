import type { ReactNode } from "react";
import "./teach.css";

// Envuelve /teach en el scope del tema claro (define las variables --teach-*)
// y carga la tipografía de lectura. Estilos class-scoped: no afectan al resto
// del sitio, que es oscuro. La página de login usa su propio fondo oscuro.
export default function TeachLayout({ children }: { children: ReactNode }) {
  return <div className="teach">{children}</div>;
}
