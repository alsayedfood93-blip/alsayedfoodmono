import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { DropIcon, LeafIcon, ShieldIcon } from "@/components/brand/icons";

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
    <section id="who-we-are" className="scroll-mt-24 bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
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
              className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white p-5"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink">
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
    </section>
  );
}
