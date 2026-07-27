"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/** Time between slide changes */
const INTERVAL_MS = 6500;
/** Soft crossfade duration */
const FADE_MS = 1800;

function isLocalHostUrl(src: string): boolean {
  try {
    const host = new URL(src).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

export function HeroBackgroundSlider({
  images,
}: {
  images: { id: number; src: string }[];
}) {
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [incomingOpaque, setIncomingOpaque] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const activeRef = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Advance slides. Incoming fades in on top; outgoing stays fully visible
  // underneath so there is no mid-fade brightness dip.
  useEffect(() => {
    if (images.length <= 1 || reduceMotion) return;

    const timer = window.setInterval(() => {
      const current = activeRef.current;
      const next = (current + 1) % images.length;
      setOutgoing(current);
      setIncomingOpaque(false);
      setActive(next);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [images.length, reduceMotion]);

  // Start the fade-in on the next frame so opacity 0 paints first.
  useEffect(() => {
    if (incomingOpaque || reduceMotion) {
      if (reduceMotion) setIncomingOpaque(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIncomingOpaque(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [active, incomingOpaque, reduceMotion]);

  // Clear underlay after the crossfade finishes.
  useEffect(() => {
    if (outgoing === null) return;
    const timeout = window.setTimeout(() => setOutgoing(null), FADE_MS);
    return () => window.clearTimeout(timeout);
  }, [outgoing, active]);

  if (images.length === 0) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-ink"
      />
    );
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-ink">
      {images.map((image, index) => {
        const isIncoming = index === active;
        const isOutgoing = index === outgoing;

        let opacity = 0;
        if (isOutgoing) opacity = 1;
        if (isIncoming) opacity = reduceMotion || incomingOpaque ? 1 : 0;

        let zIndex = 0;
        if (isOutgoing) zIndex = 1;
        if (isIncoming) zIndex = 2;

        return (
          <div
            key={image.id}
            className="absolute inset-0 will-change-[opacity]"
            style={{
              opacity,
              zIndex,
              transition:
                reduceMotion || !isIncoming
                  ? "none"
                  : `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              pointerEvents: "none",
            }}
          >
            <Image
              src={image.src}
              alt=""
              fill
              priority={index <= 1}
              sizes="100vw"
              className="object-cover object-[78%_center] sm:object-[68%_center] md:object-[60%_center] lg:object-center"
              unoptimized={isLocalHostUrl(image.src)}
            />
          </div>
        );
      })}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/35 to-black/55 md:bg-gradient-to-r md:from-black/55 md:via-black/35 md:to-black/20" />
    </div>
  );
}
