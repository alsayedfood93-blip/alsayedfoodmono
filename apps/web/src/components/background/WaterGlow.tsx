"use client";

import { motion, useReducedMotion } from "framer-motion";

export function WaterGlow() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Soft sky wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(248,253,255,0.95)_0%,rgba(238,249,255,0.55)_38%,rgba(221,245,255,0.35)_62%,transparent_82%)]" />

      {/* Water-like light beams */}
      <motion.div
        className="absolute -left-[10%] top-[-20%] h-[70vh] w-[55vw] rotate-12 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.35)_28%,rgba(180,235,255,0.22)_48%,transparent_70%)] blur-2xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 60, -20, 0],
                opacity: [0.35, 0.55, 0.4, 0.35],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 22, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="absolute right-[-15%] top-[10%] h-[55vh] w-[45vw] -rotate-6 bg-[linear-gradient(250deg,transparent_0%,rgba(255,255,255,0.28)_30%,rgba(221,245,255,0.2)_52%,transparent_75%)] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -40, 25, 0],
                opacity: [0.3, 0.48, 0.34, 0.3],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 26, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Soft blue ambient glow */}
      <div className="absolute left-1/2 top-[35%] h-[50vw] max-h-[640px] w-[70vw] max-w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(180,235,255,0.35)_0%,rgba(221,245,255,0.18)_42%,transparent_72%)] blur-3xl" />

      {/* Water reflection band */}
      <motion.div
        className="absolute inset-x-0 bottom-[12%] h-40 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.28)_35%,rgba(221,245,255,0.18)_60%,transparent)] blur-xl"
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.25, 0.45, 0.3, 0.25], y: [0, -8, 4, 0] }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}
