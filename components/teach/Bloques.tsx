import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseBloques, type Bloque } from "@/lib/teach/bloques";
import { Revelar } from "./Revelar";

// Render de una unidad. Cuerpo de lectura sobre fondo claro (columna 1200/66ch);
// destacado y cierre son bandas oscuras a sangre completa; regla es franja
// salmón. Bandas, tarjetas y reglas se revelan al entrar al viewport.
export function Bloques({ md }: { md: string }) {
  const bloques = parseBloques(md);
  return (
    <div className="teach-bloques">
      {bloques.map((b, i) => (
        <BloqueRender key={i} bloque={b} />
      ))}
    </div>
  );
}

function MD({ children }: { children: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}

// "**Título**" en la primera línea → h3; el resto, cuerpo.
function partirTarjeta(contenido: string): { titulo: string | null; cuerpo: string } {
  const lineas = contenido.split("\n");
  const primera = (lineas[0] ?? "").trim();
  const m = primera.match(/^\*\*(.+)\*\*$/);
  if (m) {
    return { titulo: m[1].trim(), cuerpo: lineas.slice(1).join("\n").trim() };
  }
  return { titulo: null, cuerpo: contenido };
}

// 2 columnas si hay 4 tarjetas; 3 si hay 3 o 6; si no, auto-fit.
function colsTarjetas(n: number): string {
  if (n === 4) return " cols-2";
  if (n === 3 || n === 6) return " cols-3";
  return "";
}

function BloqueRender({ bloque: b }: { bloque: Bloque }) {
  switch (b.tipo) {
    case "texto":
      return (
        <div className="teach-texto">
          <MD>{b.contenido}</MD>
        </div>
      );
    case "destacado":
      return (
        <Revelar className="teach-full teach-destacado">
          <div className="teach-banda-inner">
            <MD>{b.contenido}</MD>
          </div>
        </Revelar>
      );
    case "regla":
      // APUNTE — variante F2 (pestaña oscura). La etiqueta va primero en el DOM
      // para que el lector de pantalla la lea antes del cuerpo; la rotación es
      // solo visual (writing-mode), el texto sigue seleccionable y en orden.
      return (
        <Revelar className="teach-apunte">
          <div className="teach-apunte-tab">APUNTE</div>
          <div className="teach-apunte-in">
            <MD>{b.contenido}</MD>
          </div>
        </Revelar>
      );
    case "cierre":
      return (
        <Revelar className="teach-full teach-cierre">
          <div className="teach-banda-inner">
            <div className="teach-cierre-k">Lo que te llevas</div>
            <MD>{b.contenido}</MD>
          </div>
        </Revelar>
      );
    case "dos-columnas":
      return (
        <Revelar className="teach-cols">
          {b.columnas.map((c, i) => (
            <div key={i} className="teach-col">
              <MD>{c}</MD>
            </div>
          ))}
        </Revelar>
      );
    case "tarjetas":
      return (
        <Revelar className={`teach-tarjetas${colsTarjetas(b.tarjetas.length)}`}>
          {b.tarjetas.map((c, i) => {
            const { titulo, cuerpo } = partirTarjeta(c);
            return (
              <div key={i} className="teach-tarjeta">
                {titulo ? <h3>{titulo}</h3> : null}
                {cuerpo ? <MD>{cuerpo}</MD> : null}
              </div>
            );
          })}
        </Revelar>
      );
  }
}
