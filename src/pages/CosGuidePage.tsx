import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/seo";
import { ArrowRight, HelpCircle } from "lucide-react";

const faqs: { q: string; a: string }[] = [
  { q: "What is a Certificate of Sponsorship (CoS)?", a: "A Certificate of Sponsorship is an electronic record with a unique reference number issued by a UK employer holding a Home Office sponsor licence. You need a CoS to apply for a Skilled Worker visa or a Health and Care Worker visa." },
  { q: "How do I get a Certificate of Sponsorship for a care job in the UK?", a: "Secure a job offer from a licensed UK sponsor (care home, home care provider or NHS trust). The employer assigns you a CoS through the Sponsor Management System. You can apply for CoS care jobs through our single application form and we match you to a licensed sponsor." },
  { q: "What is the difference between a defined and undefined CoS?", a: "A defined CoS is used by applicants applying from outside the UK. An undefined CoS is used by applicants already in the UK who are switching visa (for example Student, Graduate/PSW or Dependant to Skilled Worker)." },
  { q: "How much does a Certificate of Sponsorship cost?", a: "The Home Office charges the employer the CoS fee (currently £525 for Skilled Worker). The Immigration Skills Charge is also paid by the employer. Under UK law, sponsors must not pass the CoS fee or Immigration Skills Charge to the worker." },
  { q: "How long is a CoS valid?", a: "A CoS is valid for 3 months from the date it is assigned. You must submit your visa application within that time." },
  { q: "Can I get a free CoS for a care worker job?", a: "Yes. Genuine licensed UK sponsors do not charge workers for a CoS. Be careful of anyone selling a CoS — buying a CoS is illegal and can lead to visa refusal and a ban." },
  { q: "Which SOC codes qualify for a care worker CoS?", a: "SOC 6131 (Nursing auxiliaries and assistants), SOC 6135 (Care workers and home carers) and SOC 6136 (Senior care workers) are the main care occupation codes under the Health and Care Worker visa." },
  { q: "Can I switch from a Student or PSW (Graduate) visa to a Skilled Worker visa with a CoS?", a: "Yes. If you are in the UK on a Student, Graduate (PSW) or Dependant visa, you can switch to a Skilled Worker or Health and Care Worker visa inside the UK with an undefined CoS from a licensed sponsor." },
  { q: "How do I check if a UK company has a sponsor licence?", a: "Search the official GOV.UK Register of Licensed Sponsors: Workers. Always confirm the employer is listed before accepting a CoS." },
  { q: "What documents do I need after receiving my CoS?", a: "Valid passport, CoS reference number, English language evidence (B1), TB test certificate where required, criminal record certificate for care roles, and proof of maintenance funds unless your sponsor certifies maintenance." },
  { q: "What is the minimum salary for a care worker CoS in 2026?", a: "Care roles must meet the Health and Care Worker salary threshold or going rate for the SOC code. Check the latest GOV.UK guidance as thresholds change." },
  { q: "Can I bring my family on a CoS visa?", a: "Rules for dependants have changed for some care roles. Check current GOV.UK guidance for whether your SOC code allows dependants before applying." },
  { q: "How long does it take to receive a CoS after a job offer?", a: "Most licensed sponsors assign a CoS within 1–4 weeks after interview, right-to-work and compliance checks." },
  { q: "Can a CoS be withdrawn or cancelled?", a: "Yes. A sponsor can withdraw an unused CoS, and a CoS cannot be reused once a visa decision is made. If withdrawn, you need a new CoS from a licensed sponsor." },
  { q: "Do I need IELTS for a Certificate of Sponsorship?", a: "You must prove English at CEFR B1 level, usually via an approved SELT such as IELTS for UKVI, a degree taught in English, or nationality from a majority English-speaking country." },
];

const keywords = "certificate of sponsorship, CoS UK, how to get CoS UK, CoS for care workers, free CoS UK, CoS sponsorship jobs, defined CoS, undefined CoS, CoS for health and care worker visa, CoS skilled worker visa, CoS cost UK, CoS validity, licensed sponsor UK, register of licensed sponsors, UK visa sponsorship jobs, care home CoS, CoS switch student visa, PSW to skilled worker CoS, CoS SOC 6135, CoS SOC 6136, CoS SOC 6131, apply for CoS online";

const CosGuidePage = () => {
  const url = absoluteUrl("/cos-guide");
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Certificate of Sponsorship (CoS) UK 2026 Guide | Care Worker CoS FAQ</title>
        <meta name="description" content="Complete UK Certificate of Sponsorship guide: how to get a CoS, defined vs undefined CoS, cost, validity, SOC 6131/6135/6136, switching from Student or PSW visa, and licensed sponsors." />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Certificate of Sponsorship (CoS) UK Guide & FAQ" />
        <meta property="og:url" content={url} />
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-hero py-12">
          <div className="container max-w-4xl space-y-3">
            <h1 className="font-heading text-3xl sm:text-4xl text-hero-foreground">Certificate of Sponsorship (CoS) UK — Complete Guide</h1>
            <p className="text-hero-foreground/80">Everything care workers, carers, healthcare assistants, nursing assistants, students, PSW graduates and migrants need to know about getting a UK CoS for the Health and Care Worker and Skilled Worker visa.</p>
            <Link to="/apply"><Button size="lg" className="bg-hero-accent text-hero-foreground hover:bg-hero-accent/90 mt-2">Apply for CoS <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
          </div>
        </section>
        <section className="container max-w-3xl py-10 space-y-6">
          {faqs.map((f, i) => (
            <article key={i}>
              <h2 className="font-heading text-lg font-semibold flex gap-2 items-start"><HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />{f.q}</h2>
              <p className="text-muted-foreground mt-1 leading-relaxed">{f.a}</p>
            </article>
          ))}
          <div className="border rounded-lg p-5 bg-primary/5 text-sm">
            Browse <Link to="/sponsor-companies" className="text-primary underline">UK companies offering CoS</Link>, see <Link to="/jobs" className="text-primary underline">visa sponsorship care jobs</Link>, or read the <Link to="/visa-info" className="text-primary underline">Health and Care Worker visa guide</Link>. Always verify rules on <a href="https://www.gov.uk/skilled-worker-visa" target="_blank" rel="noopener noreferrer" className="text-primary underline">GOV.UK</a>.
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CosGuidePage;
