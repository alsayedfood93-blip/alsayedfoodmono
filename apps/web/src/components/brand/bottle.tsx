/**
 * Neutral bottle placeholder illustration. Deliberately carries NO product
 * label or brand text so real transparent product PNG/WebP assets can replace
 * it later without any layout change. Used only where a real product image is
 * not yet available.
 */
export function BottlePlaceholder({
  tone = "brand",
  className = "",
}: {
  tone?: "brand" | "blue" | "amber" | "red" | "lime";
  className?: string;
}) {
  const tones: Record<string, { body: string; cap: string; shine: string }> = {
    brand: { body: "#1f8a5b", cap: "#12593b", shine: "#8fd3b0" },
    blue: { body: "#3f8fd0", cap: "#245f92", shine: "#bfe0f7" },
    amber: { body: "#e8933a", cap: "#b76a1c", shine: "#f8d9ab" },
    red: { body: "#cf4436", cap: "#932a20", shine: "#f3b3ab" },
    lime: { body: "#a6c93f", cap: "#6f8f22", shine: "#e2f0af" },
  };
  const c = tones[tone] ?? tones.brand;
  return (
    <svg
      viewBox="0 0 80 220"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect x="32" y="2" width="16" height="14" rx="2" fill={c.cap} />
      <path
        d="M30 16h20v10c0 4 8 10 8 22v150a12 12 0 0 1-12 12H34a12 12 0 0 1-12-12V48c0-12 8-18 8-22V16Z"
        fill={c.body}
      />
      <rect x="24" y="92" width="32" height="60" rx="6" fill="#fff" fillOpacity="0.9" />
      <rect
        x="30"
        y="40"
        width="6"
        height="150"
        rx="3"
        fill={c.shine}
        fillOpacity="0.7"
      />
    </svg>
  );
}
