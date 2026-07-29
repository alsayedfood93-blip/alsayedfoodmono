"use client";

import { motion, useReducedMotion } from "framer-motion";

export function GlassShine() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-1/3 top-0 h-full w-1/2 skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),rgba(255,255,255,0.42),rgba(255,255,255,0.12),transparent)] blur-md"
        animate={
          reduceMotion ? undefined : { x: ["0%", "180%", "0%"], opacity: [0, 0.55, 0] }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 20, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/50 via-white/10 to-transparent" />
    </div>
  );
}
