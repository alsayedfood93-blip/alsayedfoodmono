"use client";

import { motion, useReducedMotion } from "framer-motion";

const PARTICLES = [
  { left: "8%", top: "18%", size: 6, delay: 0, duration: 16 },
  { left: "18%", top: "62%", size: 4, delay: 2, duration: 20 },
  { left: "28%", top: "34%", size: 8, delay: 1.2, duration: 18 },
  { left: "42%", top: "14%", size: 5, delay: 3.4, duration: 22 },
  { left: "55%", top: "48%", size: 7, delay: 0.8, duration: 19 },
  { left: "66%", top: "22%", size: 4, delay: 4.1, duration: 17 },
  { left: "74%", top: "68%", size: 9, delay: 1.8, duration: 24 },
  { left: "84%", top: "36%", size: 5, delay: 2.6, duration: 21 },
  { left: "12%", top: "78%", size: 3, delay: 5, duration: 15 },
  { left: "91%", top: "58%", size: 6, delay: 0.4, duration: 23 },
  { left: "48%", top: "78%", size: 4, delay: 3, duration: 18 },
  { left: "35%", top: "52%", size: 3, delay: 4.8, duration: 16 },
] as const;

export function FloatingParticles() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full border border-white/50 bg-white/40 shadow-[0_0_18px_rgba(180,235,255,0.35)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -28, 10, 0],
                  x: [0, 12, -8, 0],
                  opacity: [0.25, 0.7, 0.35, 0.25],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  );
}
