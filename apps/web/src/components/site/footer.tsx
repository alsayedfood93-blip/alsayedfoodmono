import Link from "next/link";
import type { CategoryDto, SiteSettingsDto } from "@alsayed/shared-types";
import { DropletMark } from "@/components/brand/logo";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/brand/icons";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/#categories" },
  { label: "Our Story", href: "/#our-story" },
  { label: "About Us", href: "/#who-we-are" },
  { label: "Contact", href: "/#contact" },
];

const CUSTOMER_CARE = [
  { label: "FAQs", href: "/#contact" },
  { label: "Shipping & Delivery", href: "/#contact" },
  { label: "Return Policy", href: "/#contact" },
  { label: "Privacy Policy", href: "/#contact" },
];

export function Footer({
  settings,
  categories,
}: {
  settings: SiteSettingsDto | null;
  categories: CategoryDto[];
}) {
  const year = new Date().getFullYear();
  const socials = [
    { icon: FacebookIcon, href: settings?.facebookUrl, label: "Facebook" },
    { icon: InstagramIcon, href: settings?.instagramUrl, label: "Instagram" },
    { icon: TikTokIcon, href: settings?.tiktokUrl, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto border-t border-primary/30 bg-forest">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <DropletMark className="h-12 w-12" />
              <span className="leading-none">
                <span className="block font-serif text-xl font-bold tracking-tight text-water">
                  ALSAYED
                </span>
                <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-mint">
                  Food &amp; Beverages
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sky">
              Premium quality beverages rooted in purpose, crafted for those who
              believe a drink can mean more.
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-button bg-primary text-water transition-all duration-300 hover:-translate-y-0.5 hover:bg-mint hover:text-forest"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-water">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-sky transition-colors duration-300 hover:text-mint"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-water">Categories</h3>
            <ul className="mt-4 space-y-2.5">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-sm text-sky transition-colors duration-300 hover:text-mint"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-water">Customer Care</h3>
            <ul className="mt-4 space-y-2.5">
              {CUSTOMER_CARE.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-sky transition-colors duration-300 hover:text-mint"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-water">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-sky">
              {settings?.phone && (
                <li className="flex items-start gap-2">
                  <PhoneIcon className="mt-0.5 h-4 w-4 flex-none text-mint" />
                  <span>{settings.phone}</span>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-start gap-2">
                  <MailIcon className="mt-0.5 h-4 w-4 flex-none text-mint" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all transition-colors duration-300 hover:text-mint"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPinIcon className="mt-0.5 h-4 w-4 flex-none text-mint" />
                  <span>{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-water/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-sky/80 sm:flex-row lg:px-8">
          <p>
            © {year} {settings?.companyName ?? "ALSAYED Food & Beverages"}. All
            rights reserved.
          </p>
          <p>Built with purpose. Inspired by resilience.</p>
        </div>
      </div>
    </footer>
  );
}
