import {
  DropIcon,
  LeafIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/brand/icons";
import { GlassSection } from "@/components/background";

const ITEMS = [
  {
    icon: LeafIcon,
    title: "100% Quality",
    subtitle: "Premium ingredients you can trust",
  },
  {
    icon: DropIcon,
    title: "Pure & Refreshing",
    subtitle: "Crafted for purity, made for you",
  },
  {
    icon: ShieldIcon,
    title: "Safe & Certified",
    subtitle: "International standards, local pride",
  },
  {
    icon: UsersIcon,
    title: "10K+ Happy Customers",
    subtitle: "Trusted by thousands across the region",
  },
];

export function TrustStrip() {
  return (
    <GlassSection
      tone="frost"
      blend="both"
      innerClassName="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8"
      panelClassName="px-4 py-5 md:px-6 md:py-6"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:divide-x md:divide-white/35">
        {ITEMS.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="flex items-start gap-3 md:justify-center md:px-4"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-button border border-white/50 bg-white/55 text-primary shadow-[0_8px_20px_rgba(120,180,220,0.12)] backdrop-blur-md transition-colors duration-300 hover:text-mint">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted">
                {subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassSection>
  );
}
