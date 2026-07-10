export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
      {children}
    </span>
  );
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}
