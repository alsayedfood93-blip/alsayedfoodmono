import type { SiteSettingsDto } from "@alsayed/shared-types";
import { WhatsAppIcon, MailIcon, PhoneIcon } from "@/components/brand/icons";
import { telLink, whatsappLink } from "@/lib/whatsapp";
import { GlassSection } from "@/components/background";

export function ContactCta({ settings }: { settings: SiteSettingsDto | null }) {
  const wa = whatsappLink(
    settings?.whatsapp ?? settings?.phone,
    "Hi ALSAYED, I would like to know more about your beverages.",
  );
  const tel = telLink(settings?.phone);

  return (
    <GlassSection
      id="contact"
      tone="none"
      blend="top"
      innerClassName="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-white/25 bg-[linear-gradient(145deg,rgba(10,77,54,0.92),rgba(23,75,60,0.88))] px-6 py-12 text-center shadow-[0_24px_60px_rgba(12,51,40,0.22)] backdrop-blur-[22px] md:px-12 md:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(180,235,255,0.35),transparent_70%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-mint/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
        />
        <div className="relative">
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s bring ALSAYED to you
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-water">
            Reach out for orders, partnerships or wholesale enquiries. Our team
            is ready to help.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-button bg-card px-6 py-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-premium-hover"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            )}
            {tel && (
              <a
                href={tel}
                className="inline-flex items-center justify-center gap-2 rounded-button border border-water/35 px-6 py-3.5 text-sm font-semibold text-water transition-colors duration-300 hover:bg-water/10"
              >
                <PhoneIcon className="h-5 w-5" />
                {settings?.phone}
              </a>
            )}
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-button border border-water/35 px-6 py-3.5 text-sm font-semibold text-water transition-colors duration-300 hover:bg-water/10"
              >
                <MailIcon className="h-5 w-5" />
                Email us
              </a>
            )}
          </div>
        </div>
      </div>
    </GlassSection>
  );
}
