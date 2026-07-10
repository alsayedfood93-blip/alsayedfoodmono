import Link from "next/link";

export function DropletMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 2C16 2 6 13.5 6 20.5C6 26 10.5 30 16 30C21.5 30 26 26 26 20.5C26 13.5 16 2 16 2Z"
        fill="currentColor"
      />
      <path
        d="M16 9c-3 3.2-4.4 6-4.4 9.1 0 2.2 1 3.9 2.6 4.9-.5-2.7.2-5.6 2.2-8.4 1.3-1.8 1.1-3.9-.4-5.6Z"
        fill="#fff"
        fillOpacity="0.55"
      />
    </svg>
  );
}

export function Logo({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const wordColor = variant === "light" ? "text-white" : "text-ink";
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="ALSAYED Food & Beverages home">
      <DropletMark className="h-8 w-8 text-brand-600" />
      <span className="leading-none">
        <span
          className={`block font-serif text-xl font-bold tracking-tight ${wordColor}`}
        >
          ALSAYED
        </span>
        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-brand-600">
          Food &amp; Beverages
        </span>
      </span>
    </Link>
  );
}
