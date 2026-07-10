/**
 * DEVELOPMENT FALLBACK DATA ONLY.
 *
 * These values are used exclusively when the NestJS API is unreachable during
 * local development, and their use is logged. They are NOT official ALSAYED
 * production content and must never be treated as real business data.
 */
import type {
  CategoryDto,
  CeoMessageDto,
  HeroContentDto,
  ProductDto,
  SiteSettingsDto,
} from "@alsayed/shared-types";

const now = new Date(0).toISOString();

export const FALLBACK_HERO: HeroContentDto = {
  id: 0,
  eyebrow: "Purpose-driven beverages",
  title: "Every sip",
  highlightedText: "carries meaning.",
  description: "Premium beverages crafted with care, delivered with purpose.",
  primaryButtonText: "Explore Products",
  primaryButtonLink: "/products",
  secondaryButtonText: "View Categories",
  secondaryButtonLink: "/#categories",
  isActive: true,
  createdAt: now,
  updatedAt: now,
};

export const FALLBACK_CATEGORIES: CategoryDto[] = [
  {
    id: 1,
    title: "Mineral Water",
    slug: "mineral-water",
    description: "Pure, refreshing mineral water for everyday hydration.",
    imagePath: null,
    isActive: true,
    sortOrder: 1,
    productCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    title: "Fizzy Drinks",
    slug: "fizzy-drinks",
    description: "Sparkling flavoured beverages crafted for a lively taste.",
    imagePath: null,
    isActive: true,
    sortOrder: 2,
    productCount: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    title: "Energy Drinks",
    slug: "energy-drinks",
    description: "Bold energy blends to power your day.",
    imagePath: null,
    isActive: true,
    sortOrder: 3,
    productCount: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    title: "Cola Drinks",
    slug: "cola-drinks",
    description: "Classic cola refreshment with a premium twist.",
    imagePath: null,
    isActive: true,
    sortOrder: 4,
    productCount: 2,
    createdAt: now,
    updatedAt: now,
  },
];

function cat(slug: string) {
  const c = FALLBACK_CATEGORIES.find((x) => x.slug === slug)!;
  return { id: c.id, title: c.title, slug: c.slug };
}

export const FALLBACK_PRODUCTS: ProductDto[] = [
  {
    id: 1,
    title: "ALSAYED Mineral Water 1.5L",
    slug: "alsayed-mineral-water-1-5l",
    description: "Naturally sourced mineral water in a 1.5L bottle.",
    size: "1.5L",
    price: 1,
    ingredients: ["Purified water", "Natural minerals"],
    imagePath: null,
    categoryId: 1,
    category: cat("mineral-water"),
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    title: "Falastin Fizz Orange",
    slug: "falastin-fizz-orange",
    description: "Sparkling orange soda with a bright, citrus flavour.",
    size: "330ml",
    price: 1,
    ingredients: ["Carbonated water", "Orange flavour", "Sugar"],
    imagePath: null,
    categoryId: 2,
    category: cat("fizzy-drinks"),
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    title: "Gaza Max Energy",
    slug: "gaza-max-energy",
    description: "High-energy blend for an instant boost.",
    size: "250ml",
    price: 2,
    ingredients: ["Carbonated water", "Taurine", "Caffeine", "Sugar"],
    imagePath: null,
    categoryId: 3,
    category: cat("energy-drinks"),
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    title: "ALSAYED Cola Classic",
    slug: "alsayed-cola-classic",
    description: "Premium classic cola with a smooth finish.",
    size: "500ml",
    price: 1,
    ingredients: ["Carbonated water", "Cola flavour", "Sugar", "Caffeine"],
    imagePath: null,
    categoryId: 4,
    category: cat("cola-drinks"),
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
];

export const FALLBACK_CEO: CeoMessageDto = {
  id: 0,
  name: "Malik Saed",
  title: "Founder & CEO",
  description:
    "At Alsayed Food & Beverages, our mission is simple: to deliver premium quality beverages that make a positive difference in people's lives. Every product we create is a reflection of our values — purity, trust, and purpose.",
  imagePath: null,
  isActive: true,
  createdAt: now,
  updatedAt: now,
};

export const FALLBACK_SITE_SETTINGS: SiteSettingsDto = {
  id: 0,
  companyName: "ALSAYED Food & Beverages",
  email: "alsayedfood93@gmail.com",
  phone: "+92 303 8555100",
  whatsapp: "+92 303 8555100",
  address: "Karachi, Pakistan",
  facebookUrl: "https://facebook.com/",
  instagramUrl: "https://instagram.com/",
  tiktokUrl: "https://tiktok.com/",
  logoPath: null,
  createdAt: now,
  updatedAt: now,
};
