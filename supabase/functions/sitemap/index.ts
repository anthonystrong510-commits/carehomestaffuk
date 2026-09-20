import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const xmlHeaders = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=1800',
  'Access-Control-Allow-Origin': '*',
};

const txtHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'public, max-age=1800',
  'Access-Control-Allow-Origin': '*',
};

function xmlEscape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

function urlEntry(base: string, path: string, changefreq: string, priority: string, hreflang = false) {
  const loc = `${base}${path}`;
  const lines = [`  <url>`, `    <loc>${xmlEscape(loc)}</loc>`];
  if (hreflang) {
    lines.push(`    <xhtml:link rel="alternate" hreflang="en-GB" href="${xmlEscape(loc)}"/>`);
    lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(loc)}"/>`);
  }
  lines.push(`    <changefreq>${changefreq}</changefreq>`, `    <priority>${priority}</priority>`, `  </url>`);
  return lines.join('\n');
}

const PAGE_ROUTES: Array<[string, string, string, boolean]> = [
  ['/', 'daily', '1.0', true],
  ['/jobs', 'daily', '0.95', false],
  ['/apply', 'weekly', '0.9', false],
  ['/cv-builder', 'weekly', '0.85', false],
  ['/cover-letter', 'weekly', '0.8', false],
  ['/book-appointment', 'weekly', '0.85', false],
  ['/faq', 'weekly', '0.8', false],
  ['/testimonials', 'monthly', '0.6', false],
  ['/about', 'monthly', '0.6', false],
  ['/contact', 'monthly', '0.6', false],
  ['/privacy-policy', 'yearly', '0.3', false],
  ['/terms', 'yearly', '0.3', false],
];

const COS_ROUTES: Array<[string, string, string]> = [
  ['/sponsor-companies', 'weekly', '0.95'],
  ['/cos-sponsors', 'weekly', '0.9'],
  ['/visa-info', 'weekly', '0.9'],
];

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const file = url.searchParams.get('file') || 'sitemap.xml';

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Base URL: admin-set domain wins; otherwise fall back to the request host.
  let base = '';
  try {
    const { data } = await supabase.from('admin_settings').select('value').eq('key', 'seo').maybeSingle();
    const d = (data?.value as any)?.siteDomain || '';
    if (d) base = `https://${String(d).replace(/^https?:\/\//, '').replace(/\/.*$/, '')}`;
  } catch (e) {
    console.error('seo settings fetch failed', e);
  }
  if (!base) {
    const candidates = [
      url.searchParams.get('host'),
      req.headers.get('x-forwarded-host'),
      req.headers.get('host'),
    ];
    const bad = /supabase|edge-runtime|localhost|127\.0\.0\.1/i;
    const host = candidates.find((h) => h && !bad.test(h)) || 'assistantjobuk.online';
    base = `https://${host.split(':')[0].replace(/^www\./, '')}`;
  }

  if (file === 'robots.txt') {
    const body = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /bestadmin',
      'Disallow: /setup',
      'Disallow: /appointments/manage',
      '',
      'User-agent: AhrefsBot',
      'Disallow: /',
      'User-agent: SemrushBot',
      'Disallow: /',
      'User-agent: MJ12bot',
      'Disallow: /',
      'User-agent: DotBot',
      'Disallow: /',
      '',
      `Sitemap: ${base}/sitemap.xml`,
      '',
    ].join('\n');
    return new Response(body, { headers: txtHeaders });
  }

  if (file === 'sitemap.xml') {
    const body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      `  <sitemap><loc>${base}/sitemap-pages.xml</loc></sitemap>`,
      `  <sitemap><loc>${base}/sitemap-cos.xml</loc></sitemap>`,
      '</sitemapindex>',
    ].join('\n');
    return new Response(body, { headers: xmlHeaders });
  }

  if (file === 'sitemap-pages.xml') {
    const body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      ...PAGE_ROUTES.map(([p, cf, pr, hl]) => urlEntry(base, p, cf, pr, hl)),
      '</urlset>',
    ].join('\n');
    return new Response(body, { headers: xmlHeaders });
  }

  if (file === 'sitemap-cos.xml') {
    const entries = COS_ROUTES.map(([p, cf, pr]) => urlEntry(base, p, cf, pr));
    try {
      const { data: jobs } = await supabase.from('jobs').select('slug, created_at').eq('is_active', true);
      for (const j of jobs || []) {
        if (!j.slug) continue;
        const lastmod = (j.created_at || '').slice(0, 10);
        entries.push([
          '  <url>',
          `    <loc>${base}/jobs/${xmlEscape(j.slug)}</loc>`,
          lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
          '    <changefreq>weekly</changefreq>',
          '    <priority>0.85</priority>',
          '  </url>',
        ].filter(Boolean).join('\n'));
      }
    } catch (e) {
      console.error('jobs fetch failed', e);
    }
    const body = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries,
      '</urlset>',
    ].join('\n');
    return new Response(body, { headers: xmlHeaders });
  }

  return new Response('Not found', { status: 404 });
});
