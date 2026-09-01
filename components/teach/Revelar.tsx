"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Revelado al entrar al viewport: opacidad 0→1 + translateY 8px→0 (~400ms).
// Solo para bandas, tarjetas y reglas — nunca párrafos de cuerpo.
// Respeta prefers-reduced-motion (aparece sin animación). Un solo disparo.
export function Revelar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`teach-revelar${visible ? " visible" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}
