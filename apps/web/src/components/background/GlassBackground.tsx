"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { FloatingBlobs } from "./FloatingBlobs";
import { FloatingParticles } from "./FloatingParticles";
import { GlassShine } from "./GlassShine";
import { WaterGlow } from "./WaterGlow";

type GlassBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export function GlassBackground({
  children,
  className = "",
}: GlassBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20, mass: 0.4 });
  const parallaxTransform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0)`;

  useEffect(() => {
    if (reduceMotion) return;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 24;
      const y = (event.clientY / window.innerHeight - 0.5) * 18;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, reduceMotion]);

  return (
    <div className="relative isolate min-h-full flex-1">
      {/* Layer 1 — soft base gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-30 bg-[linear-gradient(180deg,#F8FDFF_0%,#EEF9FF_42%,#DDF5FF_78%,#F8FDFF_100%)]"
      />

      {/* Layers 2–4 — ambient motion field */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
        style={reduceMotion ? undefined : { transform: parallaxTransform }}
      >
        <WaterGlow />
        <FloatingBlobs />
        <GlassShine />
        <FloatingParticles />
      </motion.div>

      {/* Subtle grain for premium texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Layer 5 — content */}
      <div className={`relative z-0 min-h-full ${className}`}>{children}</div>
    </div>
  );
}
