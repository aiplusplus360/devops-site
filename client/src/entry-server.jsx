/* =============================================================================
   Server render entry
   -----------------------------------------------------------------------------
   Imported by Express (server/lib/render.mjs) to turn a URL into HTML plus the
   tags that belong in <head>.

   `renderToString` is synchronous, which is what allows <Seo> to write into a
   plain collector object during render without any subscription machinery. The
   collector is created per request, so concurrent requests cannot see each
   other's tags.

   This module also re-exports the site data the server needs (brand info for
   sitemap.xml and robots.txt, the service list for the API and the sitemap).
   Doing it here rather than importing `client/src/data/*` from the Express code
   means every client module is resolved by the bundler, so the server never has
   to reason about module formats.
   ========================================================================== */
import { renderToString } from "react-dom/server";
import { StaticRouter, matchRoutes } from "react-router";
import App from "./App.jsx";
import { routes, NOT_FOUND_PATH } from "./routes.jsx";
import { HeadContext, createHeadCollector } from "@/lib/Seo.jsx";
import { SITE } from "@/data/site.js";
import { SERVICES, CATEGORY_ORDER } from "@/data/services.js";
import { TECHNOLOGIES, TECH_GROUP_ORDER } from "@/data/tech.js";
import { SERVICE_CONTENT } from "@/data/content.js";
import { servicePath } from "@/lib/routes.js";

export {
  SITE,
  SERVICES,
  CATEGORY_ORDER,
  TECHNOLOGIES,
  TECH_GROUP_ORDER,
  SERVICE_CONTENT,
  /* Re-exported so the Express API can build canonical URLs without keeping its
     own copy of the routing rules. */
  servicePath,
};

/**
 * @param {string} url  the request path, including query string and hash
 * @returns {{ html: string, head: object, status: number }}
 */
export function render(url) {
  const head = createHeadCollector();

  const html = renderToString(
    <HeadContext.Provider value={head}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HeadContext.Provider>
  );

  /* Decide the status from the same route table the app renders with, so the
     server and the client can never disagree about which URLs exist. */
  let status = 200;
  const matched = matchRoutes(routes, url);
  const last = matched && matched[matched.length - 1];
  if (!last || last.route.path === NOT_FOUND_PATH) status = 404;

  /* A page can override that — /services/:id is a valid route even when the id
     names no service, and that must not be served as a 200. */
  if (head.status) status = head.status;

  return { html, head, status };
}

/**
 * Every URL the site publishes, for sitemap.xml and for crawl checks.
 * Services without a written content file are excluded rather than linked to a
 * half-empty page.
 */
export function allRoutes() {
  const published = SERVICES.filter((s) => SERVICE_CONTENT[s.id]);
  return [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/services", priority: "0.9", changefreq: "weekly" },
    { path: "/about", priority: "0.7", changefreq: "monthly" },
    { path: "/contact", priority: "0.8", changefreq: "monthly" },
    ...published.map((s) => ({
      path: servicePath(s.id),
      priority: "0.8",
      changefreq: "monthly",
    })),
  ];
}
