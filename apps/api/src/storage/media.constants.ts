export const UPLOAD_PUBLIC_PREFIX = '/uploads';

/** Domain-specific upload directories. */
export const MEDIA_DOMAINS = [
  'products',
  'categories',
  'ceo',
  'hero',
  'branding',
  'legacy',
] as const;

export type MediaDomain = (typeof MEDIA_DOMAINS)[number];

/** Maximum accepted image size in bytes (5 MB). */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

/** Accepted image MIME types mapped to their canonical file extension. */
export const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};
