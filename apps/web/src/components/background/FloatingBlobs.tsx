"use client";

import { motion, useReducedMotion } from "framer-motion";

const BLOBS: Array<{
  className: string;
  duration: number;
  x: number[];
  y: number[];
  scale: number[];
}> = [
  {
    className:
      "left-[-12%] top-[-8%] h-[42vw] max-h-[520px] w-[42vw] max-w-[520px] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),rgba(221,245,255,0.45)_45%,rgba(180,235,255,0.18)_70%,transparent_78%)]",
    duration: 28,
    x: [0, 40, -18, 0],
    y: [0, 28, 12, 0],
    scale: [1, 1.08, 0.96, 1],
  },
  {
    className:
      "right-[-10%] top-[18%] h-[36vw] max-h-[460px] w-[36vw] max-w-[460px] bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.65),rgba(238,249,255,0.4)_40%,rgba(180,235,255,0.2)_68%,transparent_78%)]",
    duration: 24,
    x: [0, -32, 16, 0],
    y: [0, 36, -20, 0],
    scale: [1, 0.94, 1.06, 1],
  },
  {
    className:
      "bottom-[8%] left-[18%] h-[30vw] max-h-[400px] w-[30vw] max-w-[400px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.55),rgba(221,245,255,0.35)_42%,rgba(180,235,255,0.16)_70%,transparent_80%)]",
    duration: 32,
    x: [0, 26, -30, 0],
    y: [0, -24, 18, 0],
    scale: [1, 1.1, 0.98, 1],
  },
  {
    className:
      "right-[18%] bottom-[-6%] h-[28vw] max-h-[360px] w-[28vw] max-w-[360px] bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.5),rgba(238,249,255,0.32)_48%,transparent_75%)]",
    duration: 26,
    x: [0, -20, 28, 0],
    y: [0, -30, 10, 0],
    scale: [1, 1.05, 0.93, 1],
  },
];

export function FloatingBlobs() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl will-change-transform ${blob.className}`}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: blob.x,
                  y: blob.y,
                  scale: blob.scale,
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  );
}
