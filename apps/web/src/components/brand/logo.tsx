import Link from "next/link";
import Image from "next/image";

export function DropletMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand_logo.png"
      alt=""
      width={128}
      height={128}
      className={className}
      aria-hidden="true"
      unoptimized
      priority
    />
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="ALSAYED Food & Beverages home"
    >
      <DropletMark className="h-11 w-11 md:h-12 md:w-12" />
      <span className="leading-none">
        <span className="block font-serif text-xl font-bold tracking-tight text-ink">
          ALSAYED
        </span>
        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-brand-600">
          Food &amp; Beverages
        </span>
      </span>
    </Link>
  );
}
