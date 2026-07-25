"use client";

import Link from "next/link";
import Image from "next/image";

const NAVBAR_BTN_EXTRA: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.08em",
  padding: "10px 16px",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
};

export function PowerBINavbar() {
  return (
    <nav
      aria-label="Navegación principal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 clamp(16px,4vw,40px)",
        borderBottom: "1px solid rgba(224,123,48,0.08)",
        background: "#0E0B14",
        zIndex: 100,
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <Image
          src="/yeti-logo.png"
          alt="Yeti BI"
          width={32}
          height={32}
          style={{ objectFit: "contain" }}
          priority
        />
        <span
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 700,
            fontSize: 13,
            color: "#fff",
            letterSpacing: "3px",
          }}
        >
          YETI·<span style={{ color: "#E07B30" }}>BI</span>
        </span>
      </Link>

      <Link href="/powerbi/formulario" className="btn-primary" style={NAVBAR_BTN_EXTRA}>
        Evalúa la viabilidad de tu proyecto
      </Link>
    </nav>
  );
}
