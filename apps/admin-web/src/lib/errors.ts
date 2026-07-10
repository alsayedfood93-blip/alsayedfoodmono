/** Extract a human-readable message from an RTK Query error. */
export function getErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null) {
    const e = err as { data?: { message?: string | string[] }; error?: string };
    const msg = e.data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
    if (typeof e.error === "string") return e.error;
  }
  return "Something went wrong. Please try again.";
}
