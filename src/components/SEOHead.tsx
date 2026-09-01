import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSiteOrigin, absoluteUrl } from "@/lib/seo";
import { getSEOSettings } from "@/lib/store";

const SITE_NAME = "CareHomeStaffUK";

// Master keyword pool — UK Health & Care Worker visa, all sponsorship pathways, all roles,
// all migrant audiences (PSW, dependants, switch routes, students, refugees, EU pre-settled, etc.)
const GLOBAL_KEYWORDS = [
  // Core jobs
  "care home jobs UK", "care worker jobs UK", "care assistant jobs UK", "carer jobs UK",
  "senior carer jobs", "senior care worker jobs UK", "nursing auxiliary jobs UK",
  "healthcare assistant jobs UK", "HCA jobs UK", "nursing assistant jobs UK",
  "support worker jobs UK", "live-in carer jobs UK", "domiciliary care jobs UK",
  "dementia carer jobs UK", "learning disability support worker UK",
  "mental health care worker jobs UK", "palliative care jobs UK",
  // Visa sponsorship
  "care home jobs with visa sponsorship", "UK visa sponsorship jobs",
  "Health and Care Worker visa", "Tier 2 health and care visa",
  "Skilled Worker visa care worker", "Certificate of Sponsorship UK",
  "apply for CoS UK", "CoS care worker UK", "sponsored care jobs UK",
  "free CoS care jobs UK", "care jobs no agency fee UK", "sponsored healthcare assistant UK",
  "UK sponsor licence register care homes", "licensed sponsors list UK care",
  "SOC 6131", "SOC 6135", "SOC 6136", "SOC 6145", "SOC 6146",
  // Audience: migrants & switch routes
  "PSW to skilled worker visa UK", "graduate visa to health care worker visa",
  "switch student visa to care worker visa UK", "Tier 4 to Tier 2 switch UK",
  "dependant visa care work UK", "spouse visa care worker UK",
  "BRP holder care jobs UK", "eVisa UKVI account care jobs",
  "EU pre-settled status care jobs", "refugee care worker jobs UK",
  "asylum seeker work permit care UK", "international nurse OSCE jobs UK",
  "overseas nurse UK NMC", "immigrants UK jobs with sponsorship",
  "Nigeria to UK care work visa", "India to UK care worker visa",
  "Philippines to UK nurse visa", "Ghana to UK care worker",
  "Kenya to UK care worker visa", "Zimbabwe to UK care worker visa",
  "Pakistan to UK care worker visa", "Bangladesh to UK care worker visa",
  "Nepal to UK care worker visa", "Sri Lanka to UK care visa",
  // Questions people ask
  "how to get UK care worker visa", "how to find a care home sponsor UK",
  "how to apply for a Certificate of Sponsorship", "minimum salary care worker visa UK",
  "how long does CoS take UK", "can care workers bring family UK",
  "care worker visa requirements 2026", "do I need IELTS for care worker visa",
  "is care worker job in UK shortage occupation", "how much does a CoS cost UK",
  "can I switch from visitor visa to skilled worker UK",
  "care worker visa refusal reasons UK", "how to check if a company is a licensed sponsor",
  // Locations
  "care jobs London", "care jobs Manchester", "care jobs Birmingham",
  "care jobs Liverpool", "care jobs Leeds", "care jobs Sheffield",
  "care jobs Bristol", "care jobs Newcastle", "care jobs Glasgow",
  "care jobs Edinburgh", "care jobs Aberdeen", "care jobs Dundee",
  "care jobs Cardiff", "care jobs Belfast", "care jobs Nottingham",
  // Recruitment & agency
  "UK care recruitment agency", "ethical international recruitment UK",
  "NHS care worker recruitment", "care home staffing UK", "CQC-registered care recruiter",
].join(", ");

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Care Home Jobs UK with Visa Sponsorship | Health & Care Worker Visa — CareHomeStaffUK",
    description:
      "UK care home jobs with Health and Care Worker visa sponsorship. Carers, healthcare assistants, senior carers, nursing auxiliaries (SOC 6131/6135/6136). Switch from PSW, student, dependant or spouse visa. Free Certificate of Sponsorship (CoS) through CQC-aligned partners.",
  },
  "/jobs": {
    title: "UK Care Worker Vacancies with Visa Sponsorship | Browse Jobs",
    description:
      "Browse live UK care jobs with visa sponsorship — care assistants, senior carers, HCAs and nursing auxiliaries. Filter by city, SOC code and salary. Sponsored roles for international applicants & PSW switchers.",
  },
  "/care-worker-jobs-with-visa-sponsorship": {
    title: "Care Worker Jobs with Visa Sponsorship UK 2026 | Sponsored Vacancies",
    description:
      "Live care worker jobs with UK visa sponsorship in 2026. Licensed sponsors hiring care assistants, senior carers and HCAs on the Health & Care Worker visa across England, Scotland, Wales and Northern Ireland.",
  },
  "/apply": {
    title: "Apply for a Sponsored UK Care Job | Free Application — CareHomeStaffUK",
    description:
      "Free application for sponsored UK care worker jobs. Open to international applicants, PSW/graduate visa switchers, dependants, spouses and BRP holders. Upload your CV — our team replies within 48h.",
  },
  "/apply-for-cos": {
    title: "Apply for a Certificate of Sponsorship (CoS) UK 2026 | CareHomeStaffUK",
    description:
      "Apply for a UK Certificate of Sponsorship with licensed care sponsors. One general application covers care assistant, senior carer, HCA and nursing auxiliary roles under the Health & Care Worker visa.",
  },
  "/visa-info": {
    title: "Health and Care Worker Visa UK 2026 | Sponsorship Guide & Requirements",
    description:
      "Complete 2026 guide to the UK Health and Care Worker visa: salary thresholds, IELTS/English, dependants, switching from student, PSW or spouse visa, Certificate of Sponsorship process, costs and timelines.",
  },
  "/certificate-of-sponsorship-guide": {
    title: "Certificate of Sponsorship (CoS) Guide UK 2026 | How CoS Works",
    description:
      "What a Certificate of Sponsorship is, who can issue one, how long a CoS takes, what it costs, and how to use your CoS reference number to apply for the UK Health & Care Worker visa.",
  },
  "/health-and-care-worker-visa": {
    title: "Health and Care Worker Visa 2026 | Eligibility, Salary & Switching",
    description:
      "Health and Care Worker visa explained for 2026: eligible SOC codes, salary thresholds, English requirement, dependants rules, in-country switching from Graduate/PSW and student visas, and settlement.",
  },
  "/about": {
    title: "About CareHomeStaffUK | Ethical UK Care Recruitment & Visa Sponsorship",
    description:
      "CareHomeStaffUK connects qualified and trainee carers worldwide with CQC-registered UK care homes offering Health & Care Worker visa sponsorship. Ethical recruitment, transparent fees.",
  },
  "/contact": {
    title: "Contact CareHomeStaffUK | Care Visa Sponsorship Enquiries UK",
    description:
      "Talk to our UK team about sponsored care jobs, Certificate of Sponsorship, visa switching from PSW/student/spouse routes, or staffing your care home. Email, phone & WhatsApp.",
  },
  "/faq": {
    title: "FAQ | UK Care Worker Visa, Sponsorship & Care Home Jobs",
    description:
      "Answers to common questions: How to get a UK care worker visa? Salary thresholds? Switching from PSW or student visa? Bringing dependants? Costs, timelines, IELTS, CoS — explained.",
  },
  "/uk-visa-sponsorship-faq": {
    title: "UK Visa Sponsorship FAQ 2026 | CoS, Salary, Switching & Dependants",
    description:
      "Frequently asked questions about UK visa sponsorship: how to get a Certificate of Sponsorship, minimum salaries, English requirements, dependants, switching from PSW, student or spouse visas, and timelines.",
  },
  "/testimonials": {
    title: "Testimonials | UK Care Worker Visa Success Stories — CareHomeStaffUK",
    description:
      "Real stories from international carers and care homes placed by CareHomeStaffUK — from CoS to UK arrival, including PSW and student visa switchers.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | CareHomeStaffUK | UK GDPR Compliant",
    description:
      "How CareHomeStaffUK collects, uses and protects applicant data, in line with the UK GDPR, Data Protection Act 2018 and PECR.",
  },
  "/terms": {
    title: "Terms & Conditions | CareHomeStaffUK Recruitment Services",
    description:
      "Terms of use for CareHomeStaffUK recruitment services, compliant with the Employment Agencies Act 1973 and UK employment legislation.",
  },
  "/book-appointment": {
    title: "Book a Free UK Care Visa Consultation | CareHomeStaffUK",
    description:
      "Book a 30-minute consultation with our UK care recruitment team. Discuss Health & Care Worker visa sponsorship, CoS, PSW switch routes, family visas and live job openings.",
  },
  "/appointments/manage": {
    title: "Manage Your Appointment | Reschedule or Cancel — CareHomeStaffUK",
    description:
      "Reschedule or cancel your CareHomeStaffUK consultation. Look up your booking by email and pick a new working-day slot.",
  },
  "/cv-builder": {
    title: "Free AI CV Builder & Cover Letter Generator — UK Jobs 2026 | CareHomeStaffUK",
    description:
      "Build a UK-style ATS-friendly CV and tailored cover letter in seconds — free, no signup. Optimised for care workers, healthcare assistants, nurses, hospitality, warehouse and Skilled Worker visa applicants.",
  },
  "/cover-letter": {
    title: "Free AI Cover Letter Generator for UK Jobs 2026 | CareHomeStaffUK",
    description:
      "Generate a tailored, ATS-friendly UK cover letter for care, NHS, hospitality and Skilled Worker visa roles. Free, instant, no signup required.",
  },
  "/sponsor-companies": {
    title: "UK CoS Sponsors Directory 2026 | Licensed Care Home Sponsors — CareHomeStaffUK",
    description:
      "Directory of UK Home Office licensed Certificate of Sponsorship (CoS) care providers hiring international carers, HCAs and senior care workers under the Health & Care Worker visa. Updated for 2026.",
  },
  "/cos-sponsors": {
    title: "Licensed CoS Sponsors UK 2026 | Care Home Visa Sponsors List",
    description:
      "Browse UK care companies with an active Home Office sponsor licence issuing Certificates of Sponsorship (CoS) for the Health & Care Worker visa. Apply through CareHomeStaffUK.",
  },
};

/** Reusable question bank — powers FAQPage rich results on the FAQ, visa and apply routes. */
export const UK_VISA_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I apply for a Certificate of Sponsorship (CoS) in the UK?",
    a: "You cannot apply for a CoS yourself. A UK employer holding a Home Office sponsor licence assigns it to you after offering you a job. Submit one application through CareHomeStaffUK and our team matches you with a licensed care sponsor who assigns the CoS reference number you then use in your visa application.",
  },
  {
    q: "Can I switch from a Graduate (PSW) visa to the Health and Care Worker visa?",
    a: "Yes. Graduate/PSW holders can switch in-country to the Health and Care Worker visa once a licensed sponsor assigns a Certificate of Sponsorship. You do not need to leave the UK to switch.",
  },
  {
    q: "Can I switch from a student visa to a UK care worker visa?",
    a: "Students can usually switch once their course has finished, or from the course completion date shown on their CAS, provided a licensed sponsor has assigned a CoS for an eligible role.",
  },
  {
    q: "What is the minimum salary for a UK care worker visa in 2026?",
    a: "Health and Care Worker roles use role-specific going rates rather than a single figure. Our team confirms the exact threshold for each vacancy at the time the Certificate of Sponsorship is assigned, so your application is never under the required rate.",
  },
  {
    q: "Do I need IELTS for the Health and Care Worker visa?",
    a: "You need approved English at CEFR level B1. IELTS for UKVI, a degree taught in English, or holding a majority English-speaking nationality all satisfy the requirement.",
  },
  {
    q: "Can I bring my family on the Health and Care Worker visa?",
    a: "Care worker (SOC 6135) and senior care worker (SOC 6136) applicants who applied after 11 March 2024 cannot bring new dependants. Pre-existing dependants and nursing auxiliary (SOC 6131) applicants may still qualify — we confirm eligibility case by case.",
  },
  {
    q: "How long does it take to get a CoS and a UK visa decision?",
    a: "Once an employer confirms an offer, a defined or undefined CoS is typically assigned within a few working days. Entry-clearance visa decisions usually take about three weeks, and in-country switching decisions about eight weeks, or faster with priority services.",
  },
  {
    q: "Which SOC codes are eligible for care visa sponsorship?",
    a: "SOC 6131 (nursing auxiliaries and assistants), SOC 6135 (care workers and home carers) and SOC 6136 (senior care workers) are the main eligible occupations for the UK Health and Care Worker visa.",
  },
  {
    q: "Do I have to pay for a Certificate of Sponsorship?",
    a: "Sponsor licence and CoS assignment costs are the employer's responsibility and must never be recharged to a worker. Applicants are responsible only for their own visa fee, immigration health surcharge, biometrics, and any optional legal or priority services they choose.",
  },
  {
    q: "Can I apply for UK care work sponsorship from Nigeria, India, Ghana, Kenya or the Philippines?",
    a: "Yes. We work with candidates worldwide, including Nigeria, India, Ghana, Kenya, Zimbabwe, Pakistan, Bangladesh, Nepal and the Philippines, as well as applicants already in the UK on other visa routes.",
  },
];

const FAQ_ROUTES = new Set([
  "/faq",
  "/uk-visa-sponsorship-faq",
  "/visa-info",
  "/certificate-of-sponsorship-guide",
  "/health-and-care-worker-visa",
  "/apply",
  "/apply-for-cos",
]);

function resolveMetaKey(pathname: string) {
  if (pathname.startsWith("/appointments/manage")) return "/appointments/manage";
  if (pathname.startsWith("/jobs/") && pathname !== "/jobs") return "/jobs";
  return pathname;
}

export function SEOHead() {
  const { pathname } = useLocation();
  const [origin, setOrigin] = useState(() => getSiteOrigin());
  const [verification, setVerification] = useState("");

  // Pull the admin-configured live domain (cached to localStorage by the store),
  // so canonicals/og:url/JSON-LD always reflect the current public domain.
  useEffect(() => {
    let cancelled = false;
    getSEOSettings()
      .then((s) => {
        if (cancelled) return;
        setVerification(s.searchConsoleId || "");
        setOrigin(getSiteOrigin());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const metaKey = resolveMetaKey(pathname);
  const meta = pageMeta[metaKey] || pageMeta["/"]!;
  const canonicalUrl = absoluteUrl(pathname === "/" ? "/" : pathname, origin);
  const noIndex = pathname.startsWith("/bestadmin") || pathname.startsWith("/setup");

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    "@id": `${origin}/#organization`,
    name: SITE_NAME,
    url: origin,
    description:
      "Ethical UK recruitment agency for care homes — sponsoring Health and Care Worker visas for carers, healthcare assistants, senior carers and nursing auxiliaries (SOC 6131, 6135, 6136). Supports PSW, student, dependant and spouse visa switchers.",
    address: { "@type": "PostalAddress", addressCountry: "GB" },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    serviceType: [
      "Healthcare Recruitment", "UK Visa Sponsorship", "Care Home Staffing",
      "Certificate of Sponsorship (CoS)", "Skilled Worker Visa Switching",
    ],
    knowsAbout: [
      "SOC 6131 Nursing Auxiliaries and Assistants",
      "SOC 6135 Care Workers and Home Carers",
      "SOC 6136 Senior Care Workers",
      "Health and Care Worker Visa UK",
      "Certificate of Sponsorship (CoS) assignment",
      "Skilled Worker visa switch from Graduate / PSW visa",
      "Student visa to care worker visa switch",
      "Dependant and spouse visa care work",
      "UK CQC-registered care home recruitment",
    ],
  };

  const faqJsonLd = FAQ_ROUTES.has(metaKey)
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: UK_VISA_FAQS.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }
    : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      ...(pathname !== "/"
        ? [{ "@type": "ListItem", position: 2, name: meta.title.split("|")[0]!.trim(), item: canonicalUrl }]
        : []),
    ],
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: origin,
    name: SITE_NAME,
    inLanguage: "en-GB",
    publisher: { "@id": `${origin}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${origin}/jobs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: meta.title,
    description: meta.description,
    inLanguage: "en-GB",
    isPartOf: { "@id": `${origin}/#website` },
    about: { "@id": `${origin}/#organization` },
  };

  return (
    <Helmet>
      <html lang="en-GB" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-GB" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      {verification ? <meta name="google-site-verification" content={verification} /> : null}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}
      />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-GB" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 days" />
      <meta name="target" content="all" />
      <meta name="audience" content="international care workers, UK visa applicants, migrants, PSW switchers" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="global" />

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:locale:alternate" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:site" content="@CareHomeStaffUK" />

      <meta name="keywords" content={GLOBAL_KEYWORDS} />

      <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteLd)}</script>
      <script type="application/ld+json">{JSON.stringify(webPageLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
    </Helmet>
  );
}
