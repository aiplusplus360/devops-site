/* "How We Work" page, ported from about.html. Renders only the page content —
   the announcement bar, header, footer and fixed chrome come from the layout. */
import { toRoute } from "@/lib/routes.js";
import Seo from "@/lib/Seo.jsx";
import Process from "@/components/Process.jsx";
import Plans from "@/components/Plans.jsx";
import AppLink from "@/components/AppLink.jsx";

export default function About() {
  return (
    <>
      <Seo
        title="How We Work — DevOps & Cloud Engineering"
        description="Our four-step engagement process: discover, design, automate and operate. Transparent scoping, documented handover, no vendor lock-in."
        path="/about"
      />

      {/* The photo backdrop comes from the `--photo-about-head` token in the
          stylesheet, exactly as the static page referenced it. */}
      <section
        className="page-head page-head--photo"
        style={{ "--head-photo": "var(--photo-about-head)" }}
      >
        <div className="container">
          <p className="breadcrumb">
            <AppLink to={toRoute("index.html")}>Home</AppLink>
            <span>/</span>
            How we work
          </p>
          <p className="eyebrow">Our approach</p>
          <h1
            className="display"
            style={{ fontSize: "clamp(2rem, 1.4rem + 3vw, 3.4rem)" }}
          >
            Boring infrastructure, <span className="gradient-text">shipped deliberately</span>
          </h1>
          <p className="lead" style={{ marginTop: "1.25rem" }}>
            Good DevOps work is invisible. If we do our job well, your deploys become
            uneventful, your on-call pages get quiet, and nobody outside the team
            notices anything changed at all.
          </p>
        </div>
      </section>

      {/* =========================================================== PRINCIPLES */}
      <section className="section section--tight">
        <div className="container">
          <div className="grid grid--3">
            <article className="card reveal" style={{ "--i": 0 }}>
              <div className="service-card__top">
                <span className="service-card__icon">
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
                  </svg>
                </span>
              </div>
              <h3>You keep the keys</h3>
              <p className="service-card__summary">
                Repositories, cloud accounts and billing stay in your name from day
                one. We work inside your estate, never beside it.
              </p>
            </article>

            <article className="card reveal" style={{ "--i": 1 }}>
              <div className="service-card__top">
                <span className="service-card__icon">
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                    <path d="m3 13 9 5 9-5" />
                  </svg>
                </span>
              </div>
              <h3>Small, reviewable changes</h3>
              <p className="service-card__summary">
                Every change lands as a pull request with a rationale attached. Your
                team reviews it, learns from it, and can revert it.
              </p>
            </article>

            <article className="card reveal" style={{ "--i": 2 }}>
              <div className="service-card__top">
                <span className="service-card__icon">
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Z" />
                    <path d="M8 3v18" />
                  </svg>
                </span>
              </div>
              <h3>Documented, then handed over</h3>
              <p className="service-card__summary">
                Runbooks, diagrams and a recorded walkthrough come standard. Nobody
                should need us to explain your own platform.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================= PROCESS */}
      <section className="section section--alt section--edge">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The process</p>
            <h2 className="h2">Four steps from audit to autonomy</h2>
          </div>
          <ol className="process" data-process="">
            <Process />
          </ol>
        </div>
      </section>

      {/* ============================================================== STACK */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">What we bring</p>
              <h2 className="h2">Senior engineers, not a body shop</h2>
              <p className="lead" style={{ marginTop: "1rem" }}>
                You work directly with the people writing the automation. No account
                managers relaying messages, no junior hand-offs after the sales call.
              </p>
              <ul className="checklist" style={{ marginTop: "1.75rem", fontSize: "0.95rem" }}>
                <li>Named engineer assigned to your engagement</li>
                <li>Shared Slack or Teams channel for the duration</li>
                <li>Weekly written progress updates with blockers surfaced early</li>
                <li>Cost, reliability and security reviewed at every stage</li>
                <li>Exit plan documented from the start — no lock-in by design</li>
              </ul>
            </div>

            <div className="card">
              <p className="eyebrow">Typical week</p>
              <div
                className="terminal"
                style={{ boxShadow: "none", background: "rgba(0,0,0,0.25)" }}
              >
                <div className="terminal__bar">
                  <span className="terminal__dot terminal__dot--a"></span>
                  <span className="terminal__dot terminal__dot--b"></span>
                  <span className="terminal__dot terminal__dot--c"></span>
                  <span className="terminal__title">engagement-log</span>
                </div>
                {/* Whitespace inside <pre> is load-bearing, so the line breaks
                    are literal text nodes rather than JSX indentation. */}
                <pre className="terminal__body">
                  <span className="tline" style={{ "--n": 0 }}><span className="c-dim">Mon</span>  refinement + sprint plan</span>{"\n"}
                  <span className="tline" style={{ "--n": 1 }}><span className="c-dim">Tue</span>  <span className="c-cmd">terraform plan</span> reviewed in PR</span>{"\n"}
                  <span className="tline" style={{ "--n": 2 }}><span className="c-dim">Wed</span>  pipeline migration, paired</span>{"\n"}
                  <span className="tline" style={{ "--n": 3 }}><span className="c-dim">Thu</span>  observability dashboards live</span>{"\n"}
                  <span className="tline" style={{ "--n": 4 }}><span className="c-dim">Fri</span>  <span className="c-ok">demo + written update</span></span>{"\n"}
                  <span className="tline" style={{ "--n": 5 }}>     <span className="c-dim">backlog groomed for next week</span></span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== IN PRACTICE */}
      <section className="section section--edge">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">In practice</p>
            <h2 className="h2">What the work actually looks like</h2>
            <p className="lead">
              Small changes, reviewed and reversible — plus the documentation that
              lets your team own it afterwards.
            </p>
          </div>

          <div className="grid grid--2">
            <figure className="figure figure--wide">
              <img
                src="/img/about-workspace.jpg"
                alt="A laptop and notebook on a clean desk, with a build pipeline open on screen."
                width="1280"
                height="940"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                Every change is raised as a pull request your team reviews and can revert.
              </figcaption>
            </figure>

            <figure className="figure figure--wide">
              <img
                src="/img/about-desk.jpg"
                alt="A desk viewed from above with a laptop, notebook and written notes laid out."
                width="1100"
                height="820"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                Runbooks, diagrams and a recorded walkthrough ship with every engagement.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* =========================================================== PRICING */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow">Engagement models</p>
            <h2 className="h2">Pick the level of involvement you want</h2>
          </div>
          <div className="grid grid--3" data-plans="">
            <Plans />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="cta-band reveal">
            <h2 className="h2">Still reading? Let's just talk.</h2>
            <p className="lead">
              Bring your messiest problem to a 30-minute call. Worst case, you leave
              with a second opinion for free.
            </p>
            <div className="btn-row">
              <AppLink className="btn btn--primary btn--lg" to={toRoute("contact.html")}>Book a free audit</AppLink>
              <AppLink className="btn btn--ghost btn--lg" to={toRoute("services.html")}>Browse services</AppLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
