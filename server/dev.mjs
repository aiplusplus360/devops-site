/* =============================================================================
   Development server
   -----------------------------------------------------------------------------
   One process, one port. Vite runs in middleware mode inside the same Express
   app as the API, so:

     - the API is on the same origin as the page (no CORS, no proxy config, and
       the contact form posts to a relative /api/contact exactly as it will in
       production)
     - server rendering happens through Vite, so an edit to a component reloads
       both the rendered HTML and the client bundle
     - there is no separate "frontend dev server" to keep in sync

   Start with:  npm run dev
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

import { composeDocument } from "./lib/render.mjs";
import { headTags } from "./lib/meta.mjs";
import { createContactRouter, ensureDataDir } from "./api/contact.mjs";
import { createContentRouter } from "./api/content.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, "..");
const INDEX_HTML = path.join(ROOT, "client/index.html");

const PORT = Number(process.env.PORT || 5173);

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "custom",
});

/* Vite loads the server entry through its own module runner, so edits are picked
   up without restarting the process. Held in a mutable binding so the API
   routers can read the site data from the same module instance the renderer
   uses. */
const loadSsr = () => vite.ssrLoadModule("/src/entry-server.jsx");

let currentSsr = await loadSsr();

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

/* API first, so nothing dev-server related can shadow it. */
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: false, limit: "64kb" }));
app.use("/api", createContactRouter());
app.use("/api", createContentRouter(() => currentSsr));

/* Vite's own middleware: module transforms, HMR, and the files in assets/. */
app.use(vite.middlewares);

/* Same permanent redirects as production, so legacy links behave identically. */
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

/* Held in a module-level binding so the API routers can read the site data from
   the same module instance the renderer uses. */

app.get("*", async (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  const url = req.originalUrl;

  try {
    currentSsr = await loadSsr();

    const raw = fs.readFileSync(INDEX_HTML, "utf8");
    /* Lets Vite inject the HMR client and rewrite the entry script. */
    const template = await vite.transformIndexHtml(url, raw);

    const { html, head, status } = currentSsr.render(url);

    res
      .status(status)
      .set("Cache-Control", "no-store")
      .type("html")
      .send(composeDocument(template, html, headTags(head)));
  } catch (err) {
    /* Show the real stack in the browser instead of an opaque 500. */
    vite.ssrFixStacktrace(err);
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(`[dev] ${req.method} ${req.originalUrl}\n`, err);
  if (res.headersSent) return next(err);
  res
    .status(500)
    .type("html")
    .send(
      `<pre style="padding:2rem;font:13px/1.6 ui-monospace,monospace;white-space:pre-wrap">` +
        `${String(err.stack || err).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]))}` +
        `</pre>`
    );
});

ensureDataDir();

app.listen(PORT, () => {
  console.log(`\n  Dev server at http://localhost:${PORT}`);
  console.log(`  Rendering: server-side, with HMR on the client bundle`);
  console.log(`  API:       /api/contact, /api/services, /api/tech, /api/health\n`);
});
