/* =============================================================================
   Services index
   -----------------------------------------------------------------------------
   All 40 services, grouped by category in the site's canonical order, with a
   jump nav. Every card links to that service's own page.

   Ported from services.html plus `renderServices()` in assets/js/main.js (L212).
   A category that is not listed in CATEGORY_ORDER still gets rendered, at the
   end, so adding a category to the data can never silently drop its services.
   ========================================================================== */
import Seo from "@/lib/Seo.jsx";
import { SERVICES, CATEGORY_ORDER } from "@/data/services.js";
import { TECHNOLOGIES } from "@/data/tech.js";
import ServiceCard from "@/components/ServiceCard.jsx";
import TechStrip from "@/components/TechStrip.jsx";
import Plans from "@/components/Plans.jsx";
import AppLink from "@/components/AppLink.jsx";
import Offer from "@/components/Offer.jsx";

/** "Delivery Automation" -> "cat-delivery-automation", matching the original. */
function slugFor(category) {
  return `cat-${category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export default function Services() {
  /* Group, then append any category the canonical order does not mention. */
  const order = [...CATEGORY_ORDER];
  const groups = {};
  for (const service of SERVICES) {
    const key = service.category || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(service);
    if (!order.includes(key)) order.push(key);
  }

  const sections = order
    .filter((category) => groups[category]?.length)
    .map((category) => ({ category, list: groups[category] }));

  return (
    <>
      <Seo
        title="Services — DevOps & Cloud Engineering"
        description="CI/CD pipelines, infrastructure as code, Kubernetes, observability, DevSecOps, SRE and cloud cost optimisation — delivered as scoped engagements."
        path="/services"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "DevOps and cloud engineering services",
            numberOfItems: SERVICES.length,
            itemListElement: sections.flatMap(({ list }, groupIndex) =>
              list.map((s, i) => ({
                "@type": "ListItem",
                position: groupIndex + i + 1,
                name: s.name,
                url: `/services/${s.id}`,
              }))
            ),
          },
        ]}
      />

      {/* ---------------------------------------------------------- head -- */}
      <section
        className="page-head page-head--photo"
        style={{ "--head-photo": "url(/img/services-hero.jpg)" }}
      >
        <div className="container">
          <p className="breadcrumb">
            <AppLink to="/">Home</AppLink>
            <span>/</span>
            Services
          </p>
          <p className="eyebrow">Capabilities</p>
          <h1 className="display" style={{ fontSize: "clamp(2rem, 1.4rem + 3vw, 3.4rem)" }}>
            Services built around your <span className="gradient-text">delivery pipeline</span>
          </h1>
          <p className="lead" style={{ marginTop: "1.25rem" }}>
            <strong>{SERVICES.length}</strong> services, grouped by what they actually solve.
            Every one is delivered as a scoped engagement with written deliverables, a named
            engineer and a handover at the end. Mix and match — most clients start with two or
            three.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- groups -- */}
      <section className="section section--tight">
        <div className="container">
          <nav className="service-jump" aria-label="Jump to service category">
            {sections.map(({ category, list }) => (
              <a className="tag" href={`#${slugFor(category)}`} key={category}>
                {category} <span className="dim">{list.length}</span>
              </a>
            ))}
          </nav>

          {sections.map(({ category, list }) => {
            const slug = slugFor(category);
            return (
              <section className="service-group" id={slug} aria-labelledby={`${slug}-h`} key={category}>
                <div className="service-group__head">
                  <h2 className="h3" id={`${slug}-h`}>
                    {category}
                  </h2>
                  <span className="service-group__count">{list.length} services</span>
                </div>
                <div className="grid grid--auto">
                  {/* The stagger index resets per group, so the last card in a
                      group never waits longer than the group above it. */}
                  {list.map((s, i) => (
                    <ServiceCard service={s} index={i} key={s.id} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------- tooling -- */}
      <section className="section section--alt section--edge" id="technologies">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Tooling</p>
            <h2 className="h2">We work with your stack, not against it</h2>
            <p className="lead">
              <strong>{TECHNOLOGIES.length}</strong> platforms and tools we work with week to
              week. If yours isn't listed, it's almost certainly something we've used — just ask.
            </p>
          </div>

          <div className="note" style={{ marginBottom: "2.5rem", maxWidth: "46rem" }}>
            <strong>Opinionated where it helps, pragmatic where it matters.</strong> We'll
            recommend a target stack in discovery, but we won't ask you to migrate something that
            is working simply to match our preferences.
          </div>

          <TechStrip variant="full" />

          <div className="btn-row" style={{ marginTop: "2.5rem" }}>
            <AppLink className="btn btn--primary" to="/contact">
              Discuss your stack
            </AppLink>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- photo band -- */}
      <section className="band band--full">
        <img
          className="band__img"
          src="/img/band-code.jpg"
          alt=""
          width="1600"
          height="900"
          loading="lazy"
          decoding="async"
        />
        <div className="band__body reveal">
          <p className="eyebrow">Delivery</p>
          <h2 className="h2">Every engagement is scoped in writing before work starts</h2>
          <p className="lead">
            You get a written statement of deliverables, a named engineer, a fixed price and a
            handover date. If we think a service on this page isn't the right fit for your
            problem, we'll say so and point you elsewhere.
          </p>
          <div className="btn-row">
            <AppLink className="btn btn--primary btn--lg" to="/contact">
              Describe your problem
            </AppLink>
            <AppLink className="btn btn--ghost btn--lg" to="/#free-offer">
              See the free audit
            </AppLink>
          </div>
        </div>
      </section>

      {/* --------------------------------------------- engagement models -- */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow">Engagement models</p>
            <h2 className="h2">Three ways to work with us</h2>
          </div>
          <Plans />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Offer />
        </div>
      </section>
    </>
  );
}
