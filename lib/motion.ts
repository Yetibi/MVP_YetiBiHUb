export { motion, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";

// Hero: entrada del contenedor con stagger sobre hijos.
export const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Hero: cada hijo entra desde abajo con fade.
export const heroItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Transición entre pasos: slide + fade con dirección (forward/backward).
// Usar con custom={direction} en el elemento motion y en AnimatePresence.
export const stepVariants: Variants = {
  initial: (direction: "forward" | "backward") => ({
    opacity: 0,
    x: direction === "forward" ? 48 : -48,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (direction: "forward" | "backward") => ({
    opacity: 0,
    x: direction === "forward" ? -48 : 48,
    transition: { duration: 0.2, ease: [0.55, 0, 1, 0.45] },
  }),
};

// Diagrama: aparición de nodos con fade + escala leve.
export const nodeReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Diagrama: trazado progresivo de paths SVG (pathLength 0→1).
export const pathDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeInOut" },
  },
};

// Diagrama: pop-in de porcentajes al cerrar el trazo.
export const pctPop: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },
};

// Fade desde abajo para elementos en scroll — compatible con listContainer.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Lista editorial: contenedor con stagger activado por scroll (whileInView).
export const listContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

// Lista editorial: cada fila entra desde la izquierda con fade.
export const listItem: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Fade simple para mensajes de validación y elementos condicionales.
export const fadeIn: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.15 } },
};

// Formulario: entrada de campo individual desde abajo.
export const fieldReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Formulario: stagger para el bloque de campos.
export const formContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// ValueFlow: trazado de path SVG (pathLength 0→1) con ease orgánico.
export const flowPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

// ValueFlow: aparición de nodo (escala + fade).
export const flowNode: Variants = {
  hidden: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  },
};

// ValueFlow: labels de porcentaje (fade + slide sutil).
export const flowLabel: Variants = {
  hidden: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};
