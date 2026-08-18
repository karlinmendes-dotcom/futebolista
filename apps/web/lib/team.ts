/**
 * Client-safe helpers (no Node.js imports).
 * Anything imported here can be bundled into client components.
 */

/** Turns a team name into a URL-friendly slug: "Athletico-PR" -> "athletico-pr". */
export function teamSlug(name: string): string {
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
