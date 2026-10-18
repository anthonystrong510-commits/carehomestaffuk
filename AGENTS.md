# Project rules
- Initialize Google Analytics through the consent-aware analytics module mounted inside the router; exclude private paths and query strings to protect applicant data.
- Preserve the existing dynamic sitemap function and hosting rewrites; sitemap dates must come from page-specific content timestamps, never a global fallback.
- Use the shared SEO origin helper for public canonical and structured-data URLs so admin domain settings remain consistent.