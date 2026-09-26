/* =============================================================================
   JSON API
   -----------------------------------------------------------------------------
   The marketing pages are server-rendered and never need these; they exist so
   the site data has one machine-readable source of truth for anything built on
   top of it — a status board, a proposal generator, a partner feed, or just a
   quick way to check what the site actually publishes.

     GET /api/services        all services, lightly summarised
     GET /api/services/:id    one service including its full page content
     GET /api/tech            technologies, grouped
     GET /api/health          liveness + what is configured
   ========================================================================== */
import express from "express";

/** Build the router. `getSsr` returns the bundled entry-server module. */
export function createContentRouter(getSsr) {
  const router = express.Router();

  /* This data only changes on deploy, so let clients and any CDN hold it. */
  router.use((req, res, next) => {
    res.set("Cache-Control", "public, max-age=300");
    next();
  });

  router.get("/services", (req, res) => {
    const { SERVICES, SERVICE_CONTENT, servicePath } = getSsr();

    const list = SERVICES.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      icon: s.icon,
      summary: s.summary,
      bullets: s.bullets,
      featured: Boolean(s.featured),
      url: servicePath(s.id),
      /* false means the page is not published yet — useful for spotting a
         service that still needs its copy written. */
      hasPage: Boolean(SERVICE_CONTENT[s.id]),
    }));

    res.json({ count: list.length, services: list });
  });

  router.get("/services/:id", (req, res) => {
    const { SERVICES, SERVICE_CONTENT, servicePath } = getSsr();
    const service = SERVICES.find((s) => s.id === req.params.id);

    if (!service) {
      return res.status(404).json({ ok: false, error: `No service with id "${req.params.id}".` });
    }

    const content = SERVICE_CONTENT[service.id] || null;
    if (!content) {
      return res.status(404).json({
        ok: false,
        error: `The page for "${service.id}" has no content yet.`,
      });
    }

    res.json({
      ...service,
      url: servicePath(service.id),
      content,
    });
  });

  router.get("/tech", (req, res) => {
    const { TECHNOLOGIES, TECH_GROUP_ORDER } = getSsr();

    res.json({
      count: TECHNOLOGIES.length,
      groups: TECH_GROUP_ORDER.map((group) => ({
        group,
        items: TECHNOLOGIES.filter((t) => t.group === group).map((t) => ({
          id: t.id,
          name: t.name,
          color: t.color,
          featured: Boolean(t.featured),
        })),
      })),
    });
  });

  router.get("/health", (req, res) => {
    const { SERVICES, SERVICE_CONTENT } = getSsr();
    const missing = SERVICES.filter((s) => !SERVICE_CONTENT[s.id]).map((s) => s.id);

    res.json({
      ok: missing.length === 0,
      services: SERVICES.length,
      servicesWithPages: SERVICES.length - missing.length,
      missingPages: missing,
      webhookConfigured: Boolean(process.env.CONTACT_WEBHOOK_URL),
    });
  });

  return router;
}
