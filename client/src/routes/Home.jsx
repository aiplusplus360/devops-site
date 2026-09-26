/* =============================================================================
   Home page — ported from index.html
   -----------------------------------------------------------------------------
   The markup order, classes and inline custom properties are the static page's,
   because the stylesheet and the interaction layer both address them by name:

     .stats            the count-up host the behaviour queries by
                       [data-count-target]; Stats.jsx renders the children only
     .marquee-stack    the two counter-scrolling tech rows live inside it
     ol.process        the step list; Process.jsx renders the <li>s only
     .faq-list         the accordion host; Faq.jsx renders the <details> rows
     .grid.grid--3     the testimonial and plan grids are page markup, the
                       components supply the cards
     .hero__media      tagged for parallax by mountPage() at runtime

   Nothing in the original was filled in by script for this page except the five
   hosts above, so this component is a transcription: the hero, the copy and the
   section headings are static, and only the data-driven parts are components.

   Legacy `.html` hrefs are translated with toRoute() so the data files stay
   readable as the static site's source and the links resolve to real routes.
   ========================================================================== */
import Seo from "@/lib/Seo.jsx";
import { SITE } from "@/data/site.js";
import { SERVICES } from "@/data/services.js";
import { toRoute } from "@/lib/routes.js";
import Terminal from "@/components/Terminal.jsx";
import AppLink from "@/components/AppLink.jsx";
import Stats from "@/components/Stats.jsx";
import Offer from "@/components/Offer.jsx";
import ServiceCard from "@/components/ServiceCard.jsx";
import TechStrip from "@/components/TechStrip.jsx";
import Process from "@/components/Process.jsx";
import Testimonials from "@/components/Testimonials.jsx";
import Plans from "@/components/Plans.jsx";
import Faq from "@/components/Faq.jsx";

/* The homepage grid shows the featured services, capped at nine so the section
   stays a taster rather than a second services page. Matches the comment in the
   data: "featured: true also pins it to the homepage grid (first 9 are shown)". */
const FEATURED = SERVICES.filter((s) => s.featured).slice(0, 9);

/* Twitter/OG description from index.html. Kept short because it is the social
   card's second line, not the meta description. */
const SOCIAL_DESCRIPTION =
  "CI/CD, Kubernetes, infrastructure as code, observability and security — " +
  "designed, automated and operated for you.";

export default function Home() {
  return (
    <>
      <Seo
        title="DevOps & Cloud Engineering Services"
        description="DevOps and cloud engineering: CI/CD pipelines, Kubernetes platforms, infrastructure as code, observability and DevSecOps — designed, automated and operated for you."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: SITE.brand.name,
            description: SOCIAL_DESCRIPTION,
            url: (SITE.brand.url || "").replace(/\/$/, ""),
            areaServed: "Worldwide",
            serviceType: [
              "DevOps Consulting",
              "CI/CD Automation",
              "Cloud Infrastructure",
              "Kubernetes",
              "Site Reliability Engineering",
              "DevSecOps",
            ],
          },
        ]}
      />

      {/* ============================================================== HERO */}
      <section className="hero">
        {/* aria-hidden: the photograph is atmosphere, not content. */}
        <div className="hero__media" aria-hidden="true">
          <img
            src="/img/hero-desk.jpg"
            alt=""
            width="1920"
            height="1180"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">DevOps &amp; Cloud Engineering</p>

            <h1 className="display hero__title">
              Ship software <span className="gradient-text">faster</span>,
              <br />
              break things <em>less</em>.
            </h1>

            <p className="lead">
              We build and operate the pipelines, platforms and guardrails behind your
              product — so your engineers spend their time writing features instead of
              babysitting deployments.
            </p>

            <div className="btn-row hero__actions">
              <AppLink className="btn btn--primary btn--lg" to={toRoute("contact.html")}>
                Book a free audit
              </AppLink>
              <AppLink className="btn btn--ghost btn--lg" to={toRoute("services.html")}>
                Explore services
              </AppLink>
            </div>

            <ul className="hero__trust">
              {/* The tick is written out rather than taken from Icon.jsx: the
                  original used stroke-width 1.8 here, not the 1.6 the shared
                  `icon()` helper emits, and these read at large sizes. */}
              {["Fixed-fee assessment", "You own every account & repo", "24/7 on-call available"].map(
                (label) => (
                  <li className="hero__trust-item" key={label}>
                    <svg
                      className="icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                    {label}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="hero__panel">
            <Terminal />

            <div className="hero__badge">
              <span className="hero__badge-dot" aria-hidden="true"></span>
              <span>
                <strong>All systems operational</strong>
                <span className="dim">99.95% uptime this month</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= STATS */}
      <section className="section section--tight">
        <div className="container">
          <div className="stats">
            <Stats />
          </div>
        </div>
      </section>

      {/* ======================================================= FREE OFFER */}
      {/* Offer.jsx returns null when SITE.offer.enabled is false, which is how
          the static page removed this whole section. */}
      <section className="section section--tight" id="free-offer">
        <div className="container">
          <Offer />
        </div>
      </section>

      {/* ========================================================== SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What we do</p>
            <h2 className="h2">Everything between a commit and production</h2>
            <p className="lead">
              Forty services across delivery automation, cloud, platform, reliability,
              security and cost. Pick a single problem or hand us the whole delivery
              lifecycle — each engagement is scoped in writing before a line of
              automation is written.
            </p>
          </div>

          <div className="grid grid--auto">
            {FEATURED.map((service, i) => (
              <ServiceCard service={service} index={i} key={service.id} />
            ))}
          </div>

          <div className="btn-row" style={{ marginTop: "2.5rem" }}>
            <AppLink className="btn btn--ghost" to={toRoute("services.html")}>
              See all {SERVICES.length} services &amp; capabilities
            </AppLink>
          </div>
        </div>
      </section>

      {/* ====================================================== TECHNOLOGIES */}
      <section className="section section--edge" id="technologies">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow">Tooling</p>
            <h2 className="h2">Fluent in the tools you already run</h2>
            <p className="lead">
              We work inside your existing stack rather than forcing a rewrite —
              these are the platforms we touch every week.
            </p>
          </div>

          <div className="marquee-stack">
            <TechStrip variant="marquee" />
          </div>

          <div className="btn-row" style={{ justifyContent: "center", marginTop: "2.5rem" }}>
            <AppLink className="btn btn--ghost" to={toRoute("services.html#technologies")}>
              See the full stack
            </AppLink>
          </div>
        </div>
      </section>

      {/* ======================================================= PHOTO BAND */}
      <section className="band band--full">
        <img
          className="band__img"
          src="/img/band-workspace.jpg"
          alt=""
          width="1600"
          height="900"
          loading="lazy"
          decoding="async"
        />
        <div className="band__body reveal">
          <p className="eyebrow">Inside an engagement</p>
          <h2 className="h2">You'll see exactly what we're changing, as we change it</h2>
          <p className="lead">
            Every change lands as a reviewed pull request with the reasoning attached,
            a written update each week, and a recorded walkthrough before we hand over.
            If you ever want to take it in-house, the exit plan is already written.
          </p>
          <div className="btn-row">
            <AppLink
              className="btn btn--primary btn--lg"
              to={toRoute("contact.html?service=advisory")}
            >
              Start with a free audit
            </AppLink>
            <AppLink className="btn btn--ghost btn--lg" to={toRoute("about.html")}>
              How we work
            </AppLink>
          </div>
        </div>
      </section>

      {/* ========================================================== PROCESS */}
      <section className="section section--alt section--edge" id="process">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How we work</p>
            <h2 className="h2">Four steps, no surprises</h2>
            <p className="lead">
              We start small, prove value quickly, and hand your team the keys at
              every stage. No black boxes, no vendor lock-in.
            </p>
          </div>
          <ol className="process">
            <Process />
          </ol>
        </div>
      </section>

      {/* ===================================================== TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow">Results</p>
            <h2 className="h2">Teams that stopped firefighting</h2>
          </div>
          <div className="grid grid--3">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* ============================================================ PLANS */}
      <section className="section section--edge" id="plans">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow">Engagement models</p>
            <h2 className="h2">Start where it makes sense</h2>
            <p className="lead">
              Most clients begin with a short audit. From there you can run the
              roadmap yourself or keep us on the hook.
            </p>
          </div>
          <div className="grid grid--3">
            <Plans />
          </div>
        </div>
      </section>

      {/* ============================================================== FAQ */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="h2">Before you get in touch</h2>
          </div>
          <div className="faq-list">
            <Faq />
          </div>
        </div>
      </section>

      {/* ============================================================== CTA */}
      <section className="section section--tight">
        <div className="container">
          <div className="cta-band reveal">
            <h2 className="h2">Let's find out what's slowing you down</h2>
            <p className="lead">
              A 30-minute call, a short review of your setup, and an honest
              recommendation — whether or not you hire us.
            </p>
            <div className="btn-row">
              <AppLink className="btn btn--primary btn--lg" to={toRoute("contact.html")}>
                Book a free audit
              </AppLink>
              {/* The static page left this as `data-email href="#"` for the
                  header script to fill in. Resolved at render time here, so the
                  link is correct in the server's HTML as well. */}
              <a className="btn btn--ghost btn--lg" href={`mailto:${SITE.contact.email}`}>
                Email us instead
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
