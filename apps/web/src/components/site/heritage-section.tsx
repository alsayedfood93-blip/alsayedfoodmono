import { Eyebrow } from "@/components/ui/section-heading";
import { LeafIcon, MapPinIcon } from "@/components/brand/icons";

const PLACES = [
  { name: "Gaza", tone: "from-brand-400 to-brand-700" },
  { name: "Al-Quds", tone: "from-amber-300 to-brand-600" },
  { name: "Rafah", tone: "from-brand-300 to-brand-600" },
  { name: "Nablus", tone: "from-brand-500 to-brand-800" },
  { name: "Hebron", tone: "from-emerald-300 to-brand-700" },
];

export function HeritageSection() {
  return (
    <section id="heritage" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-12">
          <div className="relative">
            <LeafIcon className="mb-4 h-10 w-10 text-brand-500" />
            <Eyebrow>Our Heritage</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              From Our Land to Their Freedom
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              Every purchase you make supports communities and empowers a better
              tomorrow. Together, we create impact — rooted in our land and
              inspired by resilience.
            </p>
          </div>

          <div className="flex snap-x gap-4 overflow-x-auto pb-2 no-scrollbar lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible">
            {PLACES.map((place) => (
              <div
                key={place.name}
                className="w-32 flex-none snap-start overflow-hidden rounded-2xl border border-ink/10 bg-white lg:w-auto"
              >
                <div
                  className={`flex h-24 items-end bg-gradient-to-br ${place.tone} p-3`}
                >
                  <span className="rounded-md bg-black/20 px-1.5 py-0.5 text-[0.65rem] font-medium text-white backdrop-blur-sm">
                    Palestine
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-2.5">
                  <MapPinIcon className="h-3.5 w-3.5 text-brand-600" />
                  <span className="text-sm font-semibold text-ink">
                    {place.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
