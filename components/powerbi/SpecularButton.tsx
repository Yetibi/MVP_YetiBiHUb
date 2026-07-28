"use client";

import type { ReactNode } from "react";
import Link from "next/link";

interface SpecularButtonProps {
  children: ReactNode;
  href: string;
  size?: "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  darkenColor?: string;
  textColor?: string;
  ariaLabel?: string;
}

const SIZE_PADDING: Record<"md" | "lg", string> = {
  md: "12px 24px",
  lg: "13px 28px",
};

const SIZE_FONT: Record<"md" | "lg", number> = {
  md: 13,
  lg: 13,
};

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function SpecularButton({
  children,
  href,
  size = "lg",
  radius = 0,
  tint = "#E07B30",
  tintOpacity = 0.5,
  darkenColor = "#C45A2A",
  textColor = "#0E0B14",
  ariaLabel,
}: SpecularButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="specular-button relative inline-flex items-center justify-center overflow-hidden"
      style={{
        borderRadius: radius,
        padding: SIZE_PADDING[size],
        fontSize: SIZE_FONT[size],
        fontWeight: 700,
        color: textColor,
        backgroundColor: hexToRgba(tint, tintOpacity),
        textDecoration: "none",
      }}
    >
      <span
        aria-hidden
        className="specular-fill"
        style={{
          position: "absolute",
          inset: 0,
          width: "0%",
          backgroundColor: darkenColor,
          transition: "width 0.3s ease",
          zIndex: 0,
        }}
      />
      <span className="relative z-10">{children}</span>

      <style>{`
        .specular-button:hover .specular-fill,
        .specular-button:active .specular-fill,
        .specular-button:focus-visible .specular-fill {
          width: 100%;
        }
      `}</style>
    </Link>
  );
}
