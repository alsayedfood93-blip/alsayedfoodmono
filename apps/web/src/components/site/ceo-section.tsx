import type { CeoMessageDto } from "@alsayed/shared-types";
import { resolveImageUrl } from "@/lib/config";
import { Eyebrow } from "@/components/ui/section-heading";
import { GlobeIcon, HeartIcon, ShieldIcon } from "@/components/brand/icons";

const VALUES = [
  {
    icon: ShieldIcon,
    title: "Quality First",
    text: "We never compromise on quality.",
  },
  {
    icon: HeartIcon,
    title: "Made with Purpose",
    text: "Every product is crafted with care and intention.",
  },
  {
    icon: GlobeIcon,
    title: "Rooted in Heritage",
    text: "Inspired by our land, made for the world.",
  },
];

export function CeoSection({ ceo }: { ceo: CeoMessageDto | null }) {
  if (!ceo || !ceo.isActive) {
    return null;
  }
  const imageUrl = resolveImageUrl(ceo.imagePath);

  return (
    <section id="our-story" className="scroll-mt-24 border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-cream">
          <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-[280px_1fr] md:gap-10 md:p-10 lg:grid-cols-[300px_1fr_260px]">
            {/* Photo */}
            <div className="mx-auto w-40 md:mx-0 md:w-full">
              <div className="aspect-square overflow-hidden rounded-2xl bg-brand-100">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={ceo.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-serif text-5xl font-semibold text-brand-600">
                      {ceo.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col justify-center">
              <Eyebrow>From Our CEO</Eyebrow>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-ink sm:text-3xl">
                A Message from Our Founder
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                {ceo.description}
              </p>
              <div className="mt-6">
                <p className="font-serif text-lg font-semibold text-ink">
                  {ceo.name}
                </p>
                <p className="text-sm text-muted">{ceo.title}</p>
              </div>
            </div>

            {/* Values */}
            <div className="flex flex-col justify-center gap-5 border-t border-ink/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-muted">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
