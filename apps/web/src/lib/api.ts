import type {
  CategoryDto,
  CeoMessageDto,
  HeroContentDto,
  ProductDto,
  SiteSettingsDto,
} from "@alsayed/shared-types";
import { API_BASE_URL } from "./config";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_CEO,
  FALLBACK_HERO,
  FALLBACK_PRODUCTS,
  FALLBACK_SITE_SETTINGS,
} from "./fallback";

const REVALIDATE_SECONDS = 30;

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`API ${path} responded with ${res.status}`);
  }
  return (await res.json()) as T;
}

/**
 * Wrap an API call with an explicit development fallback. When the API is
 * unreachable during local development, a clearly-labelled fallback value is
 * returned and a warning is logged — mock data is never used silently.
 */
async function withFallback<T>(
  label: string,
  loader: () => Promise<T>,
  fallback: T,
): Promise<{ data: T; usedFallback: boolean }> {
  try {
    return { data: await loader(), usedFallback: false };
  } catch (error) {
    console.warn(
      `[ALSAYED][dev-fallback] ${label} failed; using development fallback data.`,
      error instanceof Error ? error.message : error,
    );
    return { data: fallback, usedFallback: true };
  }
}

export interface HomePageData {
  hero: HeroContentDto | null;
  categories: CategoryDto[];
  featuredProducts: ProductDto[];
  ceo: CeoMessageDto | null;
  siteSettings: SiteSettingsDto | null;
  usedFallback: boolean;
}

export async function getHomePageData(): Promise<HomePageData> {
  const [hero, categories, featured, ceo, settings] = await Promise.all([
    withFallback("hero", () => fetchApi<HeroContentDto>("/content/hero"), FALLBACK_HERO),
    withFallback(
      "categories",
      () => fetchApi<CategoryDto[]>("/categories"),
      FALLBACK_CATEGORIES,
    ),
    withFallback(
      "featured products",
      () => fetchApi<ProductDto[]>("/products?featured=true"),
      FALLBACK_PRODUCTS.filter((p) => p.isFeatured),
    ),
    withFallback("ceo", () => fetchApi<CeoMessageDto>("/content/ceo"), FALLBACK_CEO),
    withFallback(
      "site settings",
      () => fetchApi<SiteSettingsDto>("/site-settings"),
      FALLBACK_SITE_SETTINGS,
    ),
  ]);

  return {
    hero: hero.data,
    categories: categories.data,
    featuredProducts: featured.data,
    ceo: ceo.data,
    siteSettings: settings.data,
    usedFallback:
      hero.usedFallback ||
      categories.usedFallback ||
      featured.usedFallback ||
      ceo.usedFallback ||
      settings.usedFallback,
  };
}

export async function getSiteSettings(): Promise<SiteSettingsDto> {
  const { data } = await withFallback(
    "site settings",
    () => fetchApi<SiteSettingsDto>("/site-settings"),
    FALLBACK_SITE_SETTINGS,
  );
  return data;
}

export async function getCategories(): Promise<CategoryDto[]> {
  const { data } = await withFallback(
    "categories",
    () => fetchApi<CategoryDto[]>("/categories"),
    FALLBACK_CATEGORIES,
  );
  return data;
}

export async function getAllProducts(query?: {
  category?: string;
  search?: string;
}): Promise<ProductDto[]> {
  const params = new URLSearchParams();
  if (query?.category) params.set("category", query.category);
  if (query?.search) params.set("search", query.search);
  const qs = params.toString();
  const { data } = await withFallback(
    "products",
    () => fetchApi<ProductDto[]>(`/products${qs ? `?${qs}` : ""}`),
    FALLBACK_PRODUCTS,
  );
  return data;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDto | null> {
  try {
    return await fetchApi<ProductDto>(`/products/${slug}`);
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryDto | null> {
  try {
    return await fetchApi<CategoryDto>(`/categories/${slug}`);
  } catch {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
}

export async function getCategoryProducts(
  slug: string,
): Promise<ProductDto[]> {
  try {
    return await fetchApi<ProductDto[]>(`/categories/${slug}/products`);
  } catch {
    return FALLBACK_PRODUCTS.filter((p) => p.category?.slug === slug);
  }
}
