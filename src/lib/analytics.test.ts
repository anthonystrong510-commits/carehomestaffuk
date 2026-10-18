import { beforeEach, describe, expect, it } from "vitest";
import { COOKIE_CONSENT_KEY, hasAnalyticsConsent, normaliseMeasurementId, trackPage } from "./analytics";

beforeEach(() => localStorage.clear());
describe("analytics privacy", () => {
  it("does not load Google tracking for essential-only consent", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ level: "essential" }));
    expect(trackPage("/jobs", "G-TEST123")).toBe(false);
    expect(document.querySelector('script[data-chsuk-analytics]')).toBeNull();
  });
  it("treats malformed consent as denied", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "invalid");
    expect(hasAnalyticsConsent()).toBe(false);
  });
  it("does not track private booking-management pages", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ level: "all" }));
    expect(trackPage("/appointments/manage/123", "G-TEST123")).toBe(false);
  });
  it("requires a GA4 measurement ID, not a Search Console token", () => {
    expect(normaliseMeasurementId("google-site-verification=abc")).toBe("");
    expect(normaliseMeasurementId(" g-TEST123 ")).toBe("G-TEST123");
  });
  it("tracks consented navigation once without query parameters", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ level: "all" }));
    expect(trackPage("/jobs", "G-TEST123")).toBe(true);
    expect(trackPage("/jobs", "G-TEST123")).toBe(true);
    expect(trackPage("/cos-guide", "G-TEST123")).toBe(true);
    const events = (window.dataLayer || []).map(value => Array.from(value as ArrayLike<unknown>)).filter(args => args[0] === "event");
    expect(events).toHaveLength(2);
    expect(events[0][2]).toMatchObject({ page_path: "/jobs", page_location: "http://localhost:3000/jobs" });
  });
});