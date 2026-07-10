/** Base URL of the NestJS API (server-to-server and image host). */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3002";

/**
 * Resolve a stored relative image path (e.g. `/uploads/products/x.png`) to an
 * absolute URL served by the API. Returns null when there is no image so
 * callers can render an intentional placeholder.
 */
export function resolveImageUrl(path?: string | null): string | null {
  if (!path) {
    return null;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
