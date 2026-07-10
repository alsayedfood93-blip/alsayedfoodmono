import type { SiteSettingsDto } from "@alsayed/shared-types";
import { WhatsAppIcon, MailIcon, PhoneIcon } from "@/components/brand/icons";
import { telLink, whatsappLink } from "@/lib/whatsapp";

export function ContactCta({ settings }: { settings: SiteSettingsDto | null }) {
  const wa = whatsappLink(
    settings?.whatsapp ?? settings?.phone,
    "Hi ALSAYED, I would like to know more about your beverages.",
  );
  const tel = telLink(settings?.phone);

  return (
    <section id="contact" className="scroll-mt-24 border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-12 text-center md:px-12 md:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/40 blur-3xl"
          />
          <div className="relative">
            <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
              Let&apos;s bring ALSAYED to you
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-brand-100">
              Reach out for orders, partnerships or wholesale enquiries. Our team
              is ready to help.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand-700 transition-transform hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              )}
              {tel && (
                <a
                  href={tel}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <PhoneIcon className="h-5 w-5" />
                  {settings?.phone}
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <MailIcon className="h-5 w-5" />
                  Email us
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
