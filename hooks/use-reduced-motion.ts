"use client";

import { useEffect, useState } from "react";

/** Lee prefers-reduced-motion en cliente y reacciona a cambios en vivo.
    Arranca en false (SSR) y se corrige al hidratar. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
