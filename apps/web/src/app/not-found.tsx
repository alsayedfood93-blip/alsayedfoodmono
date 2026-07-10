import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-5 py-28 text-center">
      <p className="font-serif text-7xl font-semibold text-brand-600">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">
        Page not found
      </h1>
      <p className="mt-3 text-ink-soft">
        The page you are looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Back to Home
      </Link>
    </main>
  );
}
