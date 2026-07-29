import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { DropIcon, LeafIcon, ShieldIcon } from "@/components/brand/icons";
import { GlassSection } from "@/components/background";

const VALUES = [
  {
    icon: LeafIcon,
    title: "Crafted with care",
    text: "Every recipe is developed with attention to quality, taste and consistency.",
  },
  {
    icon: DropIcon,
    title: "Pure ingredients",
    text: "We select clean, dependable ingredients for a refreshing experience.",
  },
  {
    icon: ShieldIcon,
    title: "Made to standard",
    text: "Our beverages are produced to meet high quality and safety standards.",
  },
];

export function WhoWeAre() {
  return (
    <GlassSection
      id="who-we-are"
      tone="clear"
      blend="both"
      innerClassName="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"
      panelClassName="px-5 py-8 md:px-10 md:py-12"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Who We Are</Eyebrow>
          <SectionHeading className="mt-3">
            A modern beverage brand with purpose
          </SectionHeading>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
            ALSAYED Food &amp; Beverages brings together premium quality and
            meaningful values. We create drinks that people can enjoy and trust,
            crafted with care and rooted in a story worth sharing.
          </p>
        </div>

        <div className="grid gap-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-[24px] border border-white/45 bg-white/50 p-5 shadow-[0_14px_36px_rgba(120,180,220,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(120,180,220,0.16)]"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-button border border-white/55 bg-white/60 text-primary transition-colors duration-300 hover:text-mint">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassSection>
  );
}
