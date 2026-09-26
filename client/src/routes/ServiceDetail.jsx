/* =============================================================================
   Service detail page — renders all 40 service pages
   -----------------------------------------------------------------------------
   There is one template and one content model. Every service's page is produced
   from `content/services/<id>.json`, so the 40 pages cannot drift apart in
   layout, imagery or animation — only the words and the pictures differ.

   Structure, in order:
     1. photo page-head     breadcrumb, category, title, tagline, calls to action
     2. what this does      overview prose + the symptoms it removes
     3. what's included     six capability cards
     4. outcomes            the numbers, using the site's count-up strip
     5. what you keep       deliverables + the tools used on this work
     6. how the work runs   four steps
     7. questions           objections
     8. related services    cross-links, so no page is a dead end
     9. closing call to action

   Two conventions worth knowing:
     - Section headings use the `.section-head .h2` shape because the heading
       wipe animation is applied by the interaction layer to exactly that
       selector — the class is added at runtime, never written in markup.
     - Cards use `reveal` plus a `--i` index, which is the site's stagger
       convention (the delay is `calc(var(--i) * 55ms)` in the stylesheet).
   ========================================================================== */
import { useParams } from "react-router-dom";
import Seo from "@/lib/Seo.jsx";
import { SITE } from "@/data/site.js";
import { TECHNOLOGIES } from "@/data/tech.js";
import { SERVICES } from "@/data/services.js";
import { getService, getRelated } from "@/data/content.js";
import { servicePath } from "@/lib/routes.js";
import Icon from "@/components/Icon.jsx";
import AppLink from "@/components/AppLink.jsx";
import ServiceCard from "@/components/ServiceCard.jsx";
import Stats from "@/components/Stats.jsx";
import Process from "@/components/Process.jsx";
import Faq from "@/components/Faq.jsx";
import TechTiles from "@/components/TechTiles.jsx";
import NotFound from "@/routes/NotFound.jsx";

/* Each category gets its own page-head photograph, so browsing between two
   services does not feel like the same page reloading. These are the same
   photographs already used elsewhere on the site, referenced by their public
   paths. */
const HEAD_PHOTO = {
  "Delivery Automation": "/img/band-code.jpg",
  "Infrastructure & Cloud": "/img/services-hero.jpg",
  "Platform & Containers": "/img/band-workspace.jpg",
  "Reliability & Performance": "/img/about-desk.jpg",
  "Security & Compliance": "/img/band-desk.jpg",
  "Networking & Data": "/img/about-workspace.jpg",
  "Optimisation & Advisory": "/img/contact-desk.jpg",
};

const FALLBACK_PHOTO = "/img/services-hero.jpg";

export default function ServiceDetail() {
  const { id } = useParams();
  const service = getService(id);

  /* The route matches any /services/:id, so an unknown id has to be handled
     here. NotFound sets its own 404 status through <Seo>. */
  if (!service) return <NotFound />;

  const content = service.content;

  /* A service whose copy has not been written yet would otherwise render a page
     with headings and no substance, which is worse than an honest 404. */
  if (!content) return <NotFound />;

  const base = (SITE.brand?.url || "").replace(/\/$/, "");
  const path = servicePath(service.id);
  const related = getRelated(service.id, 3);
  const stack = content.stack
    .map((tid) => TECHNOLOGIES.find((t) => t.id === tid))
    .filter(Boolean);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      serviceType: service.name,
      description: content.seo.description,
      url: `${base}${path}`,
      areaServed: "Worldwide",
      provider: {
        "@type": "Organization",
        name: SITE.brand.name,
        url: base,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${base}/services` },
        { "@type": "ListItem", position: 3, name: service.name, item: `${base}${path}` },
      ],
    },
  ];

  return (
    <>
      <Seo
        title={content.seo.title}
        description={content.seo.description}
        path={path}
        jsonLd={jsonLd}
      />

      {/* ---------------------------------------------------------- head -- */}
      <section
        className="page-head page-head--photo"
        style={{ "--head-photo": `url(${HEAD_PHOTO[service.category] || FALLBACK_PHOTO})` }}
      >
        <div className="container">
          <p className="breadcrumb">
            <AppLink to="/">Home</AppLink>
            <span>/</span>
            <AppLink to="/services">Services</AppLink>
            <span>/</span>
            {service.name}
          </p>

          <p className="eyebrow">{service.category}</p>

          <h1 className="display" style={{ fontSize: "clamp(1.9rem, 1.25rem + 2.7vw, 3.1rem)" }}>
            {service.name}
          </h1>

          <p className="lead" style={{ marginTop: "1.15rem" }}>
            {content.tagline}
          </p>

          <div className="btn-row" style={{ marginTop: "1.7rem" }}>
            <AppLink className="btn btn--primary btn--lg" to={`/contact?service=${service.id}`}>
              Discuss this service
            </AppLink>
            <a className="btn btn--ghost btn--lg" href="#whats-included">
              See what's included
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ overview -- */}
      <section className="section section--tight">
        <div className="container split">
          <div>
            <div className="section-head">
              <p className="eyebrow">The work</p>
              <h2 className="h2">What this actually does</h2>
            </div>
            {content.overview.map((paragraph) => (
              <p className="lead" key={paragraph.slice(0, 40)} style={{ marginBottom: "1.1rem" }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="note">
            <strong>If any of these sound familiar</strong>
            <ul className="checklist" style={{ marginTop: "0.9rem" }}>
              {content.problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ included -- */}
      <section className="section section--alt" id="whats-included">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Scope</p>
            <h2 className="h2">What's included</h2>
            <p className="lead">
              Every engagement on this page covers the following, sized to your setup rather
              than delivered as a fixed package. If something here is not relevant to you, it
              comes off the scope and off the price.
            </p>
          </div>

          <div className="grid grid--auto">
            {content.includes.map((item, i) => (
              <article className="card service-card spot reveal" style={{ "--i": i }} key={item.title}>
                <div className="service-card__top">
                  <span className="service-card__icon">
                    <Icon name={item.icon} />
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p className="service-card__summary">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ outcomes -- */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What changes</p>
            <h2 className="h2">What teams typically see</h2>
          </div>
          <div className="stats">
            <Stats items={content.outcomes} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------- deliverables and stack -- */}
      <section className="section">
        <div className="container split">
          <div>
            <div className="section-head">
              <p className="eyebrow">Handover</p>
              <h2 className="h2">What you keep</h2>
              <p className="lead">
                Everything produced during the engagement is yours: the repositories, the
                accounts, the documentation. There is no proprietary layer and nothing to
                unlicense if you take the work in-house.
              </p>
            </div>
            <ul className="checklist">
              {content.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="section-head">
              <p className="eyebrow">Tooling</p>
              <h2 className="h2">Tools we use here</h2>
              <p className="lead">
                A starting point, not a requirement. We work in whatever you already run
                wherever it does the job.
              </p>
            </div>
            <TechTiles items={stack} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- process -- */}
      <section className="section section--alt section--edge">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How it runs</p>
            <h2 className="h2">From first call to handover</h2>
            <p className="lead">
              The same four steps on every engagement. You see each one before it starts and
              can stop at any of them.
            </p>
          </div>
          <ol className="process">
            <Process steps={content.process} />
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------------------- faq -- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="h2">Asked before we start</h2>
          </div>
          <div className="faq-list">
            <Faq items={content.faqs} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- related -- */}
      {related.length ? (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{service.category}</p>
              <h2 className="h2">Often needed alongside this</h2>
            </div>
            <div className="grid grid--auto">
              {related.map((r, i) => (
                <ServiceCard service={r} index={i} key={r.id} />
              ))}
            </div>
            <div className="btn-row" style={{ marginTop: "2.5rem" }}>
              <AppLink className="btn btn--ghost" to="/services">
                See all {SERVICES.length} services &amp; capabilities
              </AppLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* ----------------------------------------------------------- cta -- */}
      <section className="section section--tight">
        <div className="container">
          <div className="cta-band reveal">
            <h2 className="h2">Worth a conversation about {service.name}?</h2>
            <p className="lead">
              Bring the specific problem. We will tell you honestly whether this is the service
              that fixes it, and what it would take.
            </p>
            <div className="btn-row">
              <AppLink className="btn btn--primary btn--lg" to={`/contact?service=${service.id}`}>
                Start the conversation
              </AppLink>
              <AppLink className="btn btn--ghost btn--lg" to="/services">
                Browse other services
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
