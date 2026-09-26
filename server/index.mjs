/* =============================================================================
   Production server
   -----------------------------------------------------------------------------
   Express serves four things, in this order:

     1. /api/*            the contact endpoint and the JSON content API
     2. /sitemap.xml      built from the same route table the app renders with
        /robots.txt
     3. static assets     dist/client, which also contains the untouched
                          assets/css and assets/img copied from the repo's
                          public directory
     4. everything else   server-rendered React

   Order matters: the catch-all renderer is last so it only handles routes no
   real file claimed.

   Start with:  npm run build && npm start
   ========================================================================== */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import express from "express";
import compression from "compression";

import { makeTemplateLoader, renderRequest } from "./lib/render.mjs";
import { headTags } from "./lib/meta.mjs";
import { createContactRouter, ensureDataDir, submissionsFile } from "./api/contact.mjs";
import { createContentRouter } from "./api/content.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, "..");
const CLIENT_DIR = path.join(ROOT, "dist/client");
const SERVER_ENTRY = path.join(ROOT, "dist/server/entry-server.mjs");

const PORT = Number(process.env.PORT || 3000);

/* Which interface to listen on.
 *
 * Defaults to all interfaces, which is what you want in development. In
 * production this is set to 127.0.0.1 so the app is reachable only through the
 * reverse proxy: the port is then not exposed to the internet at all, needs no
 * firewall rule, and cannot be reached by guessing the port number. */
const HOST = process.env.HOST || "0.0.0.0";

/* ------------------------------------------------------------- ssr bundle -- */
let ssr;
try {
  ssr = await import(pathToFileURL(SERVER_ENTRY).href);
} catch (err) {
  console.error(
    `\nCould not load the server bundle at:\n  ${SERVER_ENTRY}\n\n` +
      `Run "npm run build" first.\n\n${err.message}\n`
  );
  process.exit(1);
}

const getTemplate = makeTemplateLoader(path.join(CLIENT_DIR, "index.html"));

/* ---------------------------------------------------------------- the app -- */
const app = express();

/* Behind a reverse proxy (nginx, a load balancer, a PaaS) this makes req.ip the
   real client address, which the contact form's rate limiter relies on.

   Scoped to `loopback` rather than `true`. With `true`, Express believes the
   X-Forwarded-For header from *anyone*, so a client could send a fabricated
   address and walk straight past the rate limiter. The proxy runs on this same
   host, so only loopback needs to be trusted. */
app.set("trust proxy", "loopback");
app.disable("x-powered-by");

app.use(compression());

/* The contact form is posted as multipart/form-data and is parsed by multer in
   that route. These two handle the JSON API and any urlencoded client. */
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: false, limit: "64kb" }));

/* Small hardening header set. A full CSP is deliberately NOT set here — the
   correct policy depends on the fonts, analytics and any embed you add, and a
   wrong one silently breaks the page. See deploy/nginx.conf.example. */
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.set("X-Frame-Options", "SAMEORIGIN");
  next();
});

/* ------------------------------------------------------------ legacy urls -- */
/* The static site used .html filenames. They are redirected permanently so old
   links, bookmarks and search results keep working. */
const LEGACY = {
  "/index.html": "/",
  "/services.html": "/services",
  "/about.html": "/about",
  "/contact.html": "/contact",
};

app.get(/\.html$/, (req, res, next) => {
  const target = LEGACY[req.path];
  if (!target) return next();
  const qIndex = req.originalUrl.indexOf("?");
  const query = qIndex === -1 ? "" : req.originalUrl.slice(qIndex);
  res.redirect(301, target + query);
});

/* ------------------------------------------------------------------- api -- */
app.use("/api", createContactRouter());
app.use("/api", createContentRouter(() => ssr));

/* ------------------------------------------------------ sitemap + robots -- */
app.get("/sitemap.xml", (req, res) => {
  const base = (ssr.SITE.brand?.url || "").replace(/\/$/, "");
  const today = new Date().toISOString().slice(0, 10);

  const urls = ssr
    .allRoutes()
    .map(
      (r) =>
        `  <url>\n` +
        `    <loc>${base}${r.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority}</priority>\n` +
        `  </url>`
    )
    .join("\n");

  res
    .type("application/xml")
    .set("Cache-Control", "public, max-age=3600")
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
    );
});

app.get("/robots.txt", (req, res) => {
  const base = (ssr.SITE.brand?.url || "").replace(/\/$/, "");
  res
    .type("text/plain")
    .set("Cache-Control", "public, max-age=3600")
    .send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${base}/sitemap.xml\n`);
});

/* ---------------------------------------------------------------- static -- */
app.use(
  express.static(CLIENT_DIR, {
    index: false, // "/" is the renderer's job, not a directory listing
    /* Vite emits hashed filenames for bundled assets, so those can be cached
       forever. The stylesheet and images are served under their original names
       and can therefore change between deploys, so they revalidate hourly. */
    setHeaders(res, filePath) {
      const rel = path.relative(CLIENT_DIR, filePath).replace(/\\/g, "/");
      if (rel.startsWith("assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");
      }
    },
  })
);

/* ------------------------------------------------------ server rendering -- */
app.get("*", (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  try {
    const { document, status, head } = renderRequest(req.originalUrl, {
      ssr,
      getTemplate,
      headTags,
    });

    res
      .status(status)
      /* HTML must not be cached blindly, or a deploy would leave stale markup
         referencing asset hashes that no longer exist. */
      .set("Cache-Control", "no-cache")
      .type("html")
      .send(document);

    if (process.env.LOG_RENDERS) {
      console.log(`${status} ${req.originalUrl}  "${head.title}"`);
    }
  } catch (err) {
    next(err);
  }
});

/* ---------------------------------------------------------------- errors -- */
app.use((err, req, res, next) => {
  console.error(`[render] ${req.method} ${req.originalUrl}\n`, err);
  if (res.headersSent) return next(err);
  res.status(500).type("text/plain").send("Something went wrong rendering this page.");
});

/* ------------------------------------------------------------------ boot -- */
ensureDataDir();

const server = app.listen(PORT, HOST, () => {
  const missing = ssr.SERVICES.filter((s) => !ssr.SERVICE_CONTENT[s.id]).map((s) => s.id);

  const shown = HOST === "0.0.0.0" ? "localhost" : HOST;
  console.log(`\n  Site running at http://${shown}:${PORT}  (bound to ${HOST})`);
  console.log(`  Serving        ${CLIENT_DIR}`);
  console.log(`  Services       ${ssr.SERVICES.length - missing.length}/${ssr.SERVICES.length} pages published`);
  if (missing.length) console.log(`  Missing copy   ${missing.join(", ")}`);
  console.log(`  Submissions    ${submissionsFile}`);
  console.log(
    `  Webhook        ${process.env.CONTACT_WEBHOOK_URL ? "configured" : "not configured (writing to file only)"}`
  );
  console.log("");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    console.log(`\n${signal} received, shutting down.`);
    server.close(() => process.exit(0));
  });
}
