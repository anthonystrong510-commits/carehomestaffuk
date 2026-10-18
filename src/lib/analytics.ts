export const COOKIE_CONSENT_KEY = "chsuk_cookie_consent";
export const COOKIE_CONSENT_EVENT = "chsuk-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function hasAnalyticsConsent(): boolean {
  try {
    return JSON.parse(localStorage.getItem(COOKIE_CONSENT_KEY) || "null")?.level === "all";
  } catch {
    return false;
  }
}

export function normaliseMeasurementId(value: unknown): string {
  const id = typeof value === "string" ? value.trim().toUpperCase() : "";
  return /^G-[A-Z0-9]+$/.test(id) ? id : "";
}

let activeId = "";
let lastPath = "";

export function trackPage(pathname: string, measurementId: unknown): boolean {
  const id = normaliseMeasurementId(measurementId);
  // Never transmit query strings: application and booking links can contain personal data.
  if (!id || !hasAnalyticsConsent() || /^\/(bestadmin|setup|appointments\/manage)(\/|$)/.test(pathname)) return false;
  window.dataLayer ||= [];
  if (!window.gtag) {
    window.gtag = function (..._args: unknown[]) {
      window.dataLayer?.push(arguments);
    };
  }
  if (activeId !== id) {
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied",
    });
    window.gtag("set", "developer_id.dZjgwMW", true);
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: false });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    script.dataset.chsukAnalytics = id;
    script.onerror = () => console.warn("Google Analytics could not load; check content blocking and website security settings.");
    document.head.appendChild(script);
    activeId = id;
    lastPath = "";
  }
  if (lastPath !== pathname) {
    window.gtag("event", "page_view", {
      send_to: id, page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
      page_referrer: document.referrer ? new URL(document.referrer).origin : "",
    });
    lastPath = pathname;
  }
  return true;
}