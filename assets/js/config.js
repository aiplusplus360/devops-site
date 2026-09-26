/* =============================================================================
   SITE CONFIG
   -----------------------------------------------------------------------------
   This is your single source of truth. Change values here and they update
   everywhere on the site automatically (header, footer, contact page, meta).

   Loaded as a plain script (NOT a module) so the site works even when you
   just double-click index.html — no server or build step required.
   ========================================================================== */

window.SITE = {
  /* ---------------------------------------------------------------- BRAND -- */
  brand: {
    name: "TerraTemporal",
    monogram: "TT",                  // 1-2 letters shown in the logo mark
    legalName: "TerraTemporal",      // shown in the footer copyright
    tagline: "DevOps & Cloud Engineering",
    // Shown as <title> on pages that don't set their own.
    defaultTitle: "DevOps & Cloud Engineering Services",
    description:
      "We design, automate and operate the cloud platforms that ship your software " +
      "safely and fast — CI/CD, Kubernetes, infrastructure as code, observability " +
      "and security, delivered as managed DevOps services.",
    url: "https://devops.theaimax.com",   // live domain, no trailing slash
  },

  /* -------------------------------------------------------------- CONTACT -- */
  contact: {
    email: "info@theaimax.com",
    phone: "+1 934 203 2612",
    phoneHref: "+19342032612",       // digits only, for tel: links
    whatsapp: "",                    // optional: digits only, e.g. "15550102030"
    calendly: "",                    // optional: full booking URL
    location: {
      city: "Remote-first",
      region: "Worldwide",
      // Set to a street address string to show it, or leave "" to hide.
      address: "",
    },
    hours: "Mon–Fri · 9:00–18:00 · 24/7 on-call for managed plans",
    // How the contact form submits.
    //
    // This points at the Express server's own endpoint, which validates the
    // submission, appends it to server/data/submissions.jsonl and (when
    // CONTACT_WEBHOOK_URL is set) forwards it to Slack/Zapier/n8n. Without this
    // the form would fall back to opening the visitor's mail client, which
    // loses the enquiry whenever the visitor has no mail client configured.
    form: {
      // Option A: our own API. Leave as-is to keep submissions on disk.
      endpoint: "/api/contact",
      // Option B (zero setup): mailto fallback address, used only if the
      // endpoint above is emptied.
      fallbackEmail: "info@theaimax.com",
    },
  },

  /* ------------------------------------------------------------- SOCIALS -- */
  // Remove any you don't want — the footer renders whatever is listed here.
  socials: [
    { label: "LinkedIn", icon: "linkedin", url: "https://linkedin.com/company/your-company" },
    { label: "GitHub",   icon: "github",   url: "https://github.com/your-company" },
    { label: "X",        icon: "x",        url: "https://x.com/your-company" },
  ],

  /* ---------------------------------------------------------- NAVIGATION -- */
  nav: [
    { label: "Services", href: "services.html" },
    { label: "How We Work", href: "about.html" },
    { label: "Contact", href: "contact.html" },
  ],

  /* ------------------------------------------------------------- CURSOR -- */
  /* The custom animated pointer (a dot with a trailing ring). Set enabled:false
     to get the plain system cursor back everywhere.
     It is skipped automatically on touch devices and for anyone whose system
     asks for reduced motion — those visitors always get the normal cursor. */
  cursor: {
    enabled: true,
  },

  /* ------------------------------------------------------- FREE OFFER ---- */
  /* The lead-magnet panel. Set `enabled: false` to remove it everywhere.
     This is deliberately punchy — edit the copy to match what you can
     genuinely deliver, then honour it.                                    */
  offer: {
    enabled: true,
    badge: "100% free · worth $1,500",
    title: "The 2-Hour Pipeline Rescue",
    intro:
      "Get on a call with a senior engineer, point us at the deployment that " +
      "scares you most, and we'll fix one real bottleneck live while you watch. " +
      "You keep everything — the fixes, the config, the notes.",
    deliverables: [
      {
        icon: "pulse",
        title: "Live bottleneck hunt",
        text: "We trace one slow or fragile pipeline end to end and show you exactly where the time goes.",
      },
      {
        icon: "gears",
        title: "One fix, shipped",
        text: "A real change to your build, deploy or infra — committed to a branch, not just advice.",
      },
      {
        icon: "shield",
        title: "Risk & cost scan",
        text: "We flag anything in that path that's insecure or quietly burning money.",
      },
      {
        icon: "book",
        title: "Written action plan",
        text: "A prioritised list of what to fix next, with effort estimates. Yours to keep either way.",
      },
    ],
    scarcity: "Only 5 free slots each month",
    guarantee:
      "If we can't find anything worth fixing in the first 20 minutes, we'll say so and " +
      "we'll both get our time back. No pitch, no follow-up sequence.",
    ctaLabel: "Claim a free slot",
    ctaHref: "contact.html?service=advisory",
    secondaryLabel: "See all services",
    secondaryHref: "services.html",
    fine: "No credit card. No obligation. No lock-in — you keep every artefact we produce.",
  },

  /* ----------------------------------------------------- HEADLINE NUMBERS -- */
  // The credibility strip under the hero. Set to [] to hide the section.
  stats: [
    { value: "120+", label: "Pipelines shipped" },
    { value: "99.95%", label: "Avg. platform uptime" },
    { value: "40%", label: "Faster release cycles" },
    { value: "15 min", label: "Median incident response" },
  ],

  /* --------------------------------------------------------- ANNOUNCEMENT -- */
  // Thin bar above the header. Set show:false to hide.
  announcement: {
    show: true,
    text: "Free DevOps maturity audit for new clients",
    linkLabel: "Book a 30-min call",
    linkHref: "contact.html",
  },
};
