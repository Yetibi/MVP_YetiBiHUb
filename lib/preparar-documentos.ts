import { SupabaseClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

const LIMITE_BYTES = 15 * 1024 * 1024; // 15MB efectivos acumulados

export type DocumentoPreparado =
  | { tipo: "imagen"; media_type: "image/jpeg" | "image/png"; base64: string; nombre: string }
  | { tipo: "pdf";    base64: string; nombre: string }
  | { tipo: "texto";  contenido: string; nombre: string };

export interface ResultadoPreparacion {
  documentos: DocumentoPreparado[];
  advertencias: string[];
}

interface FilaDocumento {
  storage_path: string;
  nombre_original: string;
  tipo_archivo: string;
  tamano_bytes: number;
}

export async function prepararDocumentos(
  db: SupabaseClient,
  intakeId: string
): Promise<ResultadoPreparacion> {
  const documentos: DocumentoPreparado[] = [];
  const advertencias: string[] = [];

  const { data: filas, error } = await db
    .from("intake_documentos")
    .select("storage_path, nombre_original, tipo_archivo, tamano_bytes")
    .eq("intake_id", intakeId)
    .order("created_at", { ascending: true });

  if (error) {
    advertencias.push(`No se pudieron listar documentos: ${error.message}`);
    return { documentos, advertencias };
  }

  if (!filas || filas.length === 0) {
    return { documentos, advertencias };
  }

  let bytesAcumulados = 0;

  for (const fila of filas as FilaDocumento[]) {
    if (bytesAcumulados + fila.tamano_bytes > LIMITE_BYTES) {
      advertencias.push(
        `"${fila.nombre_original}" omitido: supera el límite acumulado de 15MB`
      );
      continue;
    }

    const { data: blob, error: dlError } = await db.storage
      .from("intake-documentos")
      .download(fila.storage_path);

    if (dlError || !blob) {
      advertencias.push(
        `"${fila.nombre_original}" no se pudo descargar: ${dlError?.message ?? "blob vacío"}`
      );
      continue;
    }

    const buffer = Buffer.from(await blob.arrayBuffer());
    const mime = fila.tipo_archivo;

    try {
      if (mime === "image/jpeg" || mime === "image/png") {
        documentos.push({
          tipo: "imagen",
          media_type: mime,
          base64: buffer.toString("base64"),
          nombre: fila.nombre_original,
        });
        bytesAcumulados += fila.tamano_bytes;

      } else if (mime === "application/pdf") {
        documentos.push({
          tipo: "pdf",
          base64: buffer.toString("base64"),
          nombre: fila.nombre_original,
        });
        bytesAcumulados += fila.tamano_bytes;

      } else if (mime === "text/csv" || mime === "text/plain") {
        documentos.push({
          tipo: "texto",
          contenido: buffer.toString("utf-8"),
          nombre: fila.nombre_original,
        });
        bytesAcumulados += fila.tamano_bytes;

      } else if (
        mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        mime === "application/vnd.ms-excel"
      ) {
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const hojas = workbook.SheetNames.map((nombre) => {
          const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[nombre]);
          return `=== Hoja: ${nombre} ===\n${csv}`;
        }).join("\n\n");
        documentos.push({
          tipo: "texto",
          contenido: hojas,
          nombre: fila.nombre_original,
        });
        bytesAcumulados += Buffer.byteLength(hojas, "utf-8");

      } else if (
        mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const resultado = await mammoth.extractRawText({ buffer });
        if (resultado.messages.length > 0) {
          advertencias.push(
            `"${fila.nombre_original}" parseado con avisos: ${resultado.messages.map((m) => m.message).join("; ")}`
          );
        }
        documentos.push({
          tipo: "texto",
          contenido: resultado.value,
          nombre: fila.nombre_original,
        });
        bytesAcumulados += Buffer.byteLength(resultado.value, "utf-8");

      } else {
        advertencias.push(
          `"${fila.nombre_original}" ignorado: tipo "${mime}" no soportado`
        );
      }

    } catch (parseErr) {
      advertencias.push(
        `"${fila.nombre_original}" falló al procesarse: ${String(parseErr)}`
      );
    }
  }

  return { documentos, advertencias };
}
