/** Build a wa.me link from an arbitrary phone/whatsapp string. */
export function whatsappLink(
  value?: string | null,
  message?: string,
): string | null {
  if (!value) {
    return null;
  }
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) {
    return null;
  }
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function telLink(value?: string | null): string | null {
  if (!value) return null;
  const digits = value.replace(/[^0-9+]/g, "");
  return digits ? `tel:${digits}` : null;
}
