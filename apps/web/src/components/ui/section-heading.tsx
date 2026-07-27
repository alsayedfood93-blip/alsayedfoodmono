export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-[0.24em] ${
        className || "text-primary"
      }`}
    >
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
      className={`font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}
