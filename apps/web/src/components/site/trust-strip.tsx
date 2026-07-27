import {
  DropIcon,
  LeafIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/brand/icons";

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
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:divide-x md:divide-border">
          {ITEMS.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-start gap-3 md:justify-center md:px-4"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-button bg-water text-primary transition-colors duration-300 hover:text-mint">
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
      </div>
    </section>
  );
}
