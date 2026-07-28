"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";

interface ProjectFrameProps {
  src: string;
  alt: string;
  priority?: boolean;
  borderColor?: string;
  maxWidth?: string;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  onHoverRotateX?: number;
  onHoverRotateY?: number;
}

const frameVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } },
};

export function ProjectFrame({
  src,
  alt,
  priority = false,
  borderColor = "#E07B30",
  maxWidth = "920px",
  perspective = 1200,
  rotateX = -4,
  rotateY = 2,
  onHoverRotateX = -6,
  onHoverRotateY = 4,
}: ProjectFrameProps) {
  const rm = useReducedMotion();

  return (
    <div
      className="project-frame-perspective"
      style={{ perspective: rm ? undefined : perspective, width: "100%", maxWidth }}
    >
      <motion.div
        className="project-frame"
        initial={rm ? undefined : "hidden"}
        whileInView={rm ? undefined : "show"}
        viewport={{ once: true, margin: "-80px" }}
        variants={rm ? undefined : frameVariants}
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 24px 48px rgba(224,123,48,0.08)",
          transformStyle: rm ? undefined : "preserve-3d",
          transform: rm ? undefined : `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(0deg)`,
          transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
          ["--project-frame-hover-transform" as string]: `rotateX(${onHoverRotateX}deg) rotateY(${onHoverRotateY}deg) rotateZ(1deg) translateZ(12px)`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          sizes="(max-width: 960px) 100vw, 920px"
          quality={85}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            pointerEvents: "none",
          }}
        />
      </motion.div>

      <style>{`
        @media (min-width: 961px) {
          .project-frame:hover {
            transform: var(--project-frame-hover-transform) !important;
          }
        }
        @media (max-width: 960px) {
          .project-frame {
            transform: rotateX(-2deg) rotateY(1deg) rotateZ(0deg) !important;
            margin-bottom: 60px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .project-frame {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
