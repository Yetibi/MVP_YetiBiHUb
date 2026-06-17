export { motion, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";

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

// Fade simple para mensajes de validación y elementos condicionales.
export const fadeIn: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.15 } },
};
