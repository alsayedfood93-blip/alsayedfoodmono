/**
 * Explicit development-only notice shown when the customer site is rendering
 * with fallback data because the NestJS API was unreachable. This keeps
 * fallback usage visible rather than silent.
 */
export function DevFallbackBanner({ show }: { show: boolean }) {
  if (!show || process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <div className="bg-amber-500 px-4 py-2 text-center text-xs font-semibold text-amber-950">
      Development notice: API unreachable — showing local fallback data (not
      real business content).
    </div>
  );
}
