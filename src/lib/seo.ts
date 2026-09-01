/**
 * Single source of truth for the site origin used in canonicals, og:url,
 * JSON-LD and any absolute URL we emit.
 *
 * Priority:
 *   1. Admin-configured domain (SEO tab -> "Live domain"), cached in
 *      localStorage so the very first synchronous render is already correct.
 *   2. window.location.origin (always the current domain the visitor is on).
 *   3. The published fallback, for SSR-less build tooling / tests.
 */

export const SEO_DOMAIN_STORAGE_KEY = "seo_site_domain";
const FALLBACK_ORIGIN = "https://carehomestaffuk.com";

/** Normalise anything the admin types ("example.com", "https://example.com/") into an origin. */
export function normaliseDomain(input?: string | null): string {
  const raw = (input || "").trim();
  if (!raw) return "";
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withProto).origin;
  } catch {
    return "";
  }
}

/** Preview / sandbox hosts should never be baked into canonicals of the live site. */
function isPreviewHost(origin: string) {
  return /localhost|127\.0\.0\.1|id-preview--|\.lovableproject\.com/.test(origin);
}

export function getSiteOrigin(): string {
  if (typeof window === "undefined") return FALLBACK_ORIGIN;
  const stored = normaliseDomain(window.localStorage.getItem(SEO_DOMAIN_STORAGE_KEY));
  if (stored) return stored;
  const origin = window.location.origin;
  if (origin && !isPreviewHost(origin)) return origin;
  return origin || FALLBACK_ORIGIN;
}

export function cacheSiteOrigin(domain?: string | null) {
  if (typeof window === "undefined") return;
  const clean = normaliseDomain(domain);
  if (clean) window.localStorage.setItem(SEO_DOMAIN_STORAGE_KEY, clean);
  else window.localStorage.removeItem(SEO_DOMAIN_STORAGE_KEY);
}

export function absoluteUrl(path: string, origin = getSiteOrigin()) {
  if (!path || path === "/") return `${origin}/`;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
