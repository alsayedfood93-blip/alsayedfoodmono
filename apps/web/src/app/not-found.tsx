import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center justify-center px-5 py-28 text-center">
      <p className="font-serif text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-ink">
        Page not found
      </h1>
      <p className="mt-3 text-ink-soft">
        The page you are looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn-primary mt-8 px-6 py-3.5">
        Back to Home
      </Link>
    </main>
  );
}
