import { getHomePageData } from "@/lib/api";
import { Hero } from "@/components/site/hero";
import { TrustStrip } from "@/components/site/trust-strip";
import { CategoriesSection } from "@/components/site/categories-section";
import { FeaturedProducts } from "@/components/site/featured-products";
import { WhoWeAre } from "@/components/site/who-we-are";
import { CeoSection } from "@/components/site/ceo-section";
import { HeritageSection } from "@/components/site/heritage-section";
import { ContactCta } from "@/components/site/contact-cta";
import { DevFallbackBanner } from "@/components/site/dev-fallback-banner";

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      <DevFallbackBanner show={data.usedFallback} />
      <Hero hero={data.hero} products={data.featuredProducts} />
      <TrustStrip />
      <CategoriesSection categories={data.categories} />
      <FeaturedProducts products={data.featuredProducts} />
      <WhoWeAre />
      <CeoSection ceo={data.ceo} />
      <HeritageSection />
      <ContactCta settings={data.siteSettings} />
    </>
  );
}
