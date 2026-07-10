"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { WhatsAppIcon, ArrowRight } from "@/components/brand/icons";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/#categories" },
  { label: "Our Story", href: "/#our-story" },
  { label: "About", href: "/#who-we-are" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar({ orderLink }: { orderLink?: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const order = orderLink ?? "/#contact";

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_rgba(19,32,26,0.06)]"
          : "bg-cream/60 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={order}
            target={order.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Order Now
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink lg:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-transform ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${open ? "block" : "hidden"} border-t border-ink/10 bg-cream`}
      >
        <div className="mx-auto max-w-7xl px-5 py-4">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-ink/5 py-3.5 text-base font-medium text-ink"
              >
                {link.label}
                <ArrowRight className="h-4 w-4 text-brand-500" />
              </Link>
            ))}
          </div>
          <a
            href={order}
            target={order.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3.5 text-base font-semibold text-white"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Order Now
          </a>
        </div>
      </div>
    </header>
  );
}
