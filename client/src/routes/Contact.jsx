/* Contact page, ported from contact.html — form, contact details and FAQs.
   Renders only the page content; the announcement bar, header, footer and fixed
   chrome come from the layout. Form submission and status messaging are handled
   by the `wireForm` behaviour, which looks for the `data-*` hooks below. */
import { SITE } from "@/data/site.js";
import { SERVICES } from "@/data/services.js";
import { toRoute } from "@/lib/routes.js";
import Seo from "@/lib/Seo.jsx";
import AppLink from "@/components/AppLink.jsx";
import Faq from "@/components/Faq.jsx";

export default function Contact() {
  const c = SITE.contact || {};
  const loc = c.location || {};
  const location = [loc.city, loc.region].filter(Boolean).join(", ");

  return (
    <>
      <Seo
        title="Contact — Book a Free DevOps Audit"
        description="Book a free 30-minute DevOps audit. Tell us about your pipeline, infrastructure or reliability problem and we'll come back with an honest recommendation."
        path="/contact"
      />

      <section className="page-head">
        <div className="container">
          <p className="breadcrumb">
            <AppLink to={toRoute("index.html")}>Home</AppLink>
            <span>/</span>
            Contact
          </p>
          <p className="eyebrow">Get in touch</p>
          <h1
            className="display"
            style={{ fontSize: "clamp(2rem, 1.4rem + 3vw, 3.4rem)" }}
          >
            Tell us what's <span className="gradient-text">breaking</span>
          </h1>
          <p className="lead" style={{ marginTop: "1.25rem" }}>
            Fill in the form and we'll reply within one business day — usually with a
            couple of sharp questions and a proposed time to talk.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container contact-grid">
          {/* ------------------------------------------------------------ FORM */}
          <div className="card">
            <h2 className="h3" style={{ marginBottom: "1.5rem" }}>Request a free audit</h2>

            <form data-contact-form="" noValidate>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-name">
                    Name <span className="req">*</span>
                  </label>
                  <input
                    id="f-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-email">
                    Work email <span className="req">*</span>
                  </label>
                  <input
                    id="f-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    required
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-company">Company</label>
                  <input
                    id="f-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Company Inc."
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-size">Team size</label>
                  <select id="f-size" name="team_size">
                    <option value="">Select…</option>
                    <option>1–10 engineers</option>
                    <option>11–50 engineers</option>
                    <option>51–200 engineers</option>
                    <option>200+ engineers</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="f-topic">
                  What do you need help with? <span className="req">*</span>
                </label>
                <select id="f-topic" name="topic" required data-topic-options="">
                  <option value="">Select a topic…</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  <option value="Something else">Something else / not sure yet</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="f-message">
                  Tell us a bit more <span className="req">*</span>
                </label>
                <textarea
                  id="f-message"
                  name="message"
                  rows="6"
                  required
                  placeholder="Current setup, what's painful, and what a good outcome looks like…"
                ></textarea>
              </div>

              {/* Spam trap: hidden from humans, tempting to bots. */}
              <div className="visually-hidden" aria-hidden="true">
                <label htmlFor="f-website">Website</label>
                <input
                  id="f-website"
                  name="_gotcha"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button className="btn btn--primary btn--lg btn--block" type="submit">
                Send request
              </button>

              <p className="form-status" data-form-status="" hidden role="status" aria-live="polite"></p>
              <p className="form-note">
                We reply to every enquiry personally. No newsletters, no drip campaigns,
                and we never share your details.
              </p>
            </form>
          </div>

          {/* --------------------------------------------------------- DETAILS */}
          <div>
            <h2 className="h3" style={{ marginBottom: "1.25rem" }}>Other ways to reach us</h2>

            <div className="contact-list">
              <div className="contact-item">
                <span className="contact-item__icon" aria-hidden="true">
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <div>
                  <h3>Email</h3>
                  <a href={`mailto:${c.email || ""}`}>{c.email}</a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-item__icon" aria-hidden="true">
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4Z" />
                  </svg>
                </span>
                <div>
                  <h3>Phone</h3>
                  <a href={`tel:${c.phoneHref || ""}`}>{c.phone}</a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-item__icon" aria-hidden="true">
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <div>
                  <h3>Based</h3>
                  <span>{location}</span>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-item__icon" aria-hidden="true">
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
                <div>
                  <h3>Availability</h3>
                  <span>{c.hours}</span>
                </div>
              </div>
            </div>

            <div className="note" style={{ marginTop: "1.5rem" }}>
              <strong>On-call emergency?</strong> Mention it in the subject line and we'll
              escalate immediately — existing clients get priority routing.
            </div>

            <div className="card" style={{ marginTop: "1.5rem" }}>
              <h3 className="h3" style={{ fontSize: "1rem", marginBottom: "0.85rem" }}>
                What happens next
              </h3>
              <ul className="checklist">
                <li>We reply within one business day</li>
                <li>30-minute call to understand your setup</li>
                <li>Written recommendation and fixed-fee quote</li>
                <li>No obligation to proceed</li>
              </ul>
            </div>

            <div className="photo-panel" style={{ marginTop: "1.5rem" }}>
              <img
                src="/img/contact-desk.jpg"
                alt="A laptop, notebook and coffee mug on a desk, ready for a working session."
                width="1500"
                height="950"
                loading="lazy"
                decoding="async"
              />
              <div className="photo-panel__caption">
                The first call is a working session, not a sales pitch — bring a real problem.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================================== FAQ */}
      <section className="section section--alt section--edge" id="faq">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="h2">Before you get in touch</h2>
          </div>
          <div className="faq-list" data-faqs="">
            <Faq />
          </div>
        </div>
      </section>
    </>
  );
}
