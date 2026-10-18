import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { COOKIE_CONSENT_EVENT, trackPage } from "@/lib/analytics";

export function AnalyticsTracker() {
  const { pathname } = useLocation();
  const [consentVersion, setConsentVersion] = useState(0);
  useEffect(() => {
    const update = () => setConsentVersion(value => value + 1);
    window.addEventListener(COOKIE_CONSENT_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  useEffect(() => {
    trackPage(pathname, import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY);
  }, [pathname, consentVersion]);
  return null;
}