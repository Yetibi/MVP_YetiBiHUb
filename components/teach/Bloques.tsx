import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseBloques, type Bloque } from "@/lib/teach/bloques";

// Render de una unidad como secuencia de bloques, según el mockup:
// texto normal en columna de lectura (~66ch); destacado, regla, tarjetas,
// dos-columnas y cierre rompen la medida y ocupan el ancho del contenedor.
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

// Una tarjeta trae "**Título**" en la primera línea y el cuerpo debajo.
function partirTarjeta(contenido: string): { titulo: string | null; cuerpo: string } {
  const lineas = contenido.split("\n");
  const primera = (lineas[0] ?? "").trim();
  const m = primera.match(/^\*\*(.+)\*\*$/);
  if (m) {
    return { titulo: m[1].trim(), cuerpo: lineas.slice(1).join("\n").trim() };
  }
  return { titulo: null, cuerpo: contenido };
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
        <div className="teach-destacado">
          <MD>{b.contenido}</MD>
        </div>
      );
    case "regla":
      return (
        <div className="teach-regla">
          <MD>{b.contenido}</MD>
        </div>
      );
    case "cierre":
      return (
        <aside className="teach-cierre">
          <div className="teach-cierre-k">Lo que te llevas</div>
          <MD>{b.contenido}</MD>
        </aside>
      );
    case "dos-columnas":
      return (
        <div className="teach-cols">
          {b.columnas.map((c, i) => (
            <div key={i} className="teach-col">
              <MD>{c}</MD>
            </div>
          ))}
        </div>
      );
    case "tarjetas":
      return (
        <div className="teach-tarjetas">
          {b.tarjetas.map((c, i) => {
            const { titulo, cuerpo } = partirTarjeta(c);
            return (
              <div key={i} className="teach-tarjeta">
                {titulo ? <h3>{titulo}</h3> : null}
                {cuerpo ? <MD>{cuerpo}</MD> : null}
              </div>
            );
          })}
        </div>
      );
  }
}
