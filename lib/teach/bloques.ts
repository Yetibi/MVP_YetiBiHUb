// Parser de bloques de contenido para las unidades de /teach.
// El material pasó de markdown plano a markdown con directivas de bloque:
//
//   :::destacado ... :::            idea central
//   :::dos-columnas A ||| B :::     dos columnas (||| separa)
//   :::tarjetas A ---card--- B :::  2 a 5 tarjetas (---card--- separa)
//   :::regla ... :::                regla de acción
//   :::cierre ... :::               "Lo que te llevas"
//
// Todo lo no marcado es texto normal. El parseo es a nivel de línea; el
// contenido interno de cada bloque sigue siendo markdown (se renderiza aparte).

export type Bloque =
  | { tipo: "texto"; contenido: string }
  | { tipo: "destacado"; contenido: string }
  | { tipo: "regla"; contenido: string }
  | { tipo: "cierre"; contenido: string }
  | { tipo: "dos-columnas"; columnas: string[] }
  | { tipo: "tarjetas"; tarjetas: string[] };

const ABRE = /^:::([a-z-]+)\s*$/;
const CIERRA = /^:::\s*$/;

export function parseBloques(md: string): Bloque[] {
  const lineas = md.replace(/\r\n/g, "\n").split("\n");
  const bloques: Bloque[] = [];
  let texto: string[] = [];

  const volcarTexto = () => {
    const t = texto.join("\n").trim();
    if (t) bloques.push({ tipo: "texto", contenido: t });
    texto = [];
  };

  for (let i = 0; i < lineas.length; i++) {
    const abre = lineas[i].match(ABRE);
    if (!abre) {
      texto.push(lineas[i]);
      continue;
    }

    volcarTexto();
    const nombre = abre[1];
    const cuerpo: string[] = [];
    i++;
    while (i < lineas.length && !CIERRA.test(lineas[i])) {
      cuerpo.push(lineas[i]);
      i++;
    }
    const contenido = cuerpo.join("\n").trim();

    switch (nombre) {
      case "destacado":
      case "regla":
      case "cierre":
        bloques.push({ tipo: nombre, contenido });
        break;
      case "dos-columnas":
        bloques.push({ tipo: "dos-columnas", columnas: dividir(contenido, "|||") });
        break;
      case "tarjetas":
        bloques.push({ tipo: "tarjetas", tarjetas: dividir(contenido, "---card---") });
        break;
      default:
        // Directiva desconocida: degradar con gracia como texto normal.
        bloques.push({ tipo: "texto", contenido });
    }
  }

  volcarTexto();
  return bloques;
}

// Divide por una línea que sea exactamente el separador.
function dividir(contenido: string, sep: string): string[] {
  const escapado = sep.replace(/[|\\^$.*+?()[\]{}]/g, "\\$&");
  return contenido
    .split(new RegExp(`^\\s*${escapado}\\s*$`, "m"))
    .map((s) => s.trim())
    .filter(Boolean);
}
