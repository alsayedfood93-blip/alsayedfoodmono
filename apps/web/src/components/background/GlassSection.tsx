import type { ElementType, ReactNode } from "react";

type GlassSectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  innerClassName?: string;
  panelClassName?: string;
  as?: ElementType;
  tone?: "clear" | "frost" | "deep" | "none";
  blend?: "top" | "bottom" | "both" | "none";
};

const TONE_CLASSES: Record<NonNullable<GlassSectionProps["tone"]>, string> = {
  clear:
    "border border-white/35 bg-white/25 shadow-[0_18px_50px_rgba(120,180,220,0.10)] backdrop-blur-[25px] [-webkit-backdrop-filter:blur(25px)]",
  frost:
    "border border-white/40 bg-white/45 shadow-[0_20px_55px_rgba(120,180,220,0.12)] backdrop-blur-[28px] [-webkit-backdrop-filter:blur(28px)]",
  deep:
    "border border-white/20 bg-[linear-gradient(145deg,rgba(23,75,60,0.82),rgba(10,77,54,0.78))] shadow-[0_24px_60px_rgba(12,51,40,0.22)] backdrop-blur-[22px] [-webkit-backdrop-filter:blur(22px)]",
  none: "",
};

export function GlassSection({
  children,
  id,
  className = "",
  innerClassName = "mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-18",
  panelClassName = "",
  as: Tag = "section",
  tone = "clear",
  blend = "both",
}: GlassSectionProps) {
  return (
    <Tag id={id} className={`relative scroll-mt-24 ${className}`}>
      {blend !== "none" && (blend === "top" || blend === "both") ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#F8FDFF]/80 to-transparent md:h-24"
        />
      ) : null}

      {blend !== "none" && (blend === "bottom" || blend === "both") ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#EEF9FF]/75 to-transparent md:h-24"
        />
      ) : null}

      <div className={innerClassName}>
        {tone === "none" ? (
          children
        ) : (
          <div
            className={`relative overflow-hidden rounded-[32px] ${TONE_CLASSES[tone]} ${panelClassName}`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(180,235,255,0.35),transparent_70%)] blur-2xl"
            />
            <div className="relative">{children}</div>
          </div>
        )}
      </div>
    </Tag>
  );
}
