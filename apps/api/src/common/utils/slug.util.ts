/**
 * Produce a URL-safe slug from arbitrary text.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

/**
 * Resolve a unique slug given a desired base and an async existence check.
 * Collisions are resolved deterministically by appending -2, -3, ...
 */
export async function resolveUniqueSlug(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const root = slugify(base) || 'item';
  let candidate = root;
  let counter = 2;
  while (await exists(candidate)) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }
  return candidate;
}
