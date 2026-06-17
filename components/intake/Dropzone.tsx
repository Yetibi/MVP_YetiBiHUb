"use client";

import { useRef, useState } from "react";
import type { UploadedFile } from "@/types/intake";
import { motion, AnimatePresence, fadeIn } from "@/lib/motion";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];
const ACCEPTED_EXT = ".pdf,.xlsx,.csv,.docx,.jpg,.jpeg,.png";
const MAX_FILES = 5;
const MAX_PER_FILE = 10 * 1024 * 1024; // 10 MB
const MAX_TOTAL = 25 * 1024 * 1024;    // 25 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DropzoneProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

export function Dropzone({ files, onChange }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function processFiles(incoming: File[]) {
    const newErrors: string[] = [];
    const valid: UploadedFile[] = [];
    const totalExisting = files.reduce((acc, f) => acc + f.size, 0);
    let runningTotal = totalExisting;

    for (const file of incoming) {
      // Tipo
      if (!ACCEPTED_TYPES.includes(file.type)) {
        newErrors.push(`"${file.name}" no es un tipo de archivo permitido.`);
        continue;
      }
      // Tamaño individual
      if (file.size > MAX_PER_FILE) {
        newErrors.push(`"${file.name}" supera los 10 MB permitidos por archivo.`);
        continue;
      }
      // Total
      if (runningTotal + file.size > MAX_TOTAL) {
        newErrors.push(`"${file.name}" supera el límite total de 25 MB.`);
        continue;
      }
      // Cantidad
      if (files.length + valid.length >= MAX_FILES) {
        newErrors.push(`Solo se permiten hasta ${MAX_FILES} archivos en total.`);
        break;
      }
      runningTotal += file.size;
      valid.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
      });
    }

    setErrors(newErrors);
    if (valid.length > 0) onChange([...files, ...valid]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(Array.from(e.target.files));
    e.target.value = "";
  }

  function removeFile(id: string) {
    onChange(files.filter((f) => f.id !== id));
    setErrors([]);
  }

  return (
    <div className="space-y-3">
      {/* Zona de drop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Zona para subir archivos. Haz clic o arrastra archivos aquí."
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
          transition-colors duration-200 select-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B30]
          ${isDragging
            ? "border-[#E07B30] bg-[#E07B30]/10"
            : "border-white/20 hover:border-white/40 bg-white/3"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXT}
          className="sr-only"
          onChange={handleInputChange}
          aria-hidden="true"
        />
        <p className="text-3xl mb-3 select-none">📎</p>
        <p className="text-sm text-white/80 font-medium">
          Arrastra archivos aquí o{" "}
          <span className="text-[#E07B30] underline underline-offset-2">
            selecciónalos
          </span>
        </p>
        <p className="text-xs text-white/40 mt-2">
          PDF, XLSX, CSV, DOCX, JPG, PNG · máx. 5 archivos · 10 MB/archivo · 25 MB total
        </p>
      </div>

      {/* Errores de validación */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.ul
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-1"
            aria-live="polite"
          >
            {errors.map((err, i) => (
              <li key={i} className="text-xs text-red-400 flex items-start gap-1.5">
                <span aria-hidden>⚠</span>
                <span>{err}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Lista de archivos cargados */}
      <AnimatePresence>
        {files.map((f) => (
          <motion.div
            key={f.id}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-base select-none" aria-hidden>📄</span>
              <div className="min-w-0">
                <p className="text-sm text-white/90 truncate">{f.name}</p>
                <p className="text-xs text-white/40">{formatBytes(f.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(f.id)}
              aria-label={`Eliminar ${f.name}`}
              className="text-white/30 hover:text-white/70 transition-colors ml-3 shrink-0 text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B30] rounded"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Advertencia de legibilidad */}
      {files.length > 0 && (
        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-xs text-[#E07B30]/80 flex items-start gap-1.5"
          role="note"
        >
          <span aria-hidden className="mt-0.5">💡</span>
          Antes de continuar, verifica que los documentos se vean legibles y que
          la información relevante esté visible — no tienes que tener un
          documento formal, una foto clara también sirve.
        </motion.p>
      )}
    </div>
  );
}
