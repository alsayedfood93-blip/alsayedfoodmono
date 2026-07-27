import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getCategories, getSiteSettings } from "@/lib/api";
import { whatsappLink } from "@/lib/whatsapp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alsayedfood.com"),
  title: {
    default: "ALSAYED Food & Beverages — Every sip carries meaning",
    template: "%s | ALSAYED Food & Beverages",
  },
  description:
    "Premium beverages crafted with care, delivered with purpose. Explore ALSAYED mineral water, fizzy drinks, energy drinks and cola.",
  openGraph: {
    title: "ALSAYED Food & Beverages",
    description:
      "Premium beverages crafted with care, delivered with purpose.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);
  const orderLink =
    whatsappLink(
      settings.whatsapp ?? settings.phone,
      "Hi ALSAYED, I would like to place an order.",
    ) ?? "/#contact";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <Navbar orderLink={orderLink} />
        <div className="flex-1">{children}</div>
        <Footer settings={settings} categories={categories} />
      </body>
    </html>
  );
}
