import { Transform } from 'class-transformer';

/**
 * Coerce multipart/form-data string values ("true"/"false"/"1"/"0") and real
 * booleans into a boolean.
 */
export function ToBoolean() {
  return Transform((params) => {
    const value: unknown = params.value;
    if (typeof value === 'boolean') {
      return value;
    }
    if (value === 'true' || value === '1') {
      return true;
    }
    if (value === 'false' || value === '0') {
      return false;
    }
    return value;
  });
}

/**
 * Convert empty/whitespace-only strings to undefined so optional validators
 * (IsEmail, IsUrl, ...) do not reject a cleared multipart field.
 */
export function EmptyToUndefined() {
  return Transform((params) => {
    const value: unknown = params.value;
    return typeof value === 'string' && value.trim() === '' ? undefined : value;
  });
}

/**
 * Split a comma-separated string or JSON array string into a string[].
 * Accepts real arrays untouched.
 */
export function ToStringArray() {
  return Transform((params) => {
    const value: unknown = params.value;
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return [];
      }
      if (trimmed.startsWith('[')) {
        try {
          const parsed: unknown = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean);
          }
        } catch {
          // fall through to comma splitting
        }
      }
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return value;
  });
}
