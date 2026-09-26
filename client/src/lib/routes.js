/* =============================================================================
   Route helpers
   -----------------------------------------------------------------------------
   `SITE.nav`, the offer CTA and the footer all carry the paths the static site
   used ("services.html", "contact.html?service=advisory", "services.html#cicd").
   Those are left untouched in the data so the original static pages keep working
   as a reference, and translated to clean routes here instead.

   Express also 301s the old .html URLs to the new ones, so existing links and
   search-engine results keep resolving.
   ========================================================================== */

/** Legacy filename -> canonical route. */
const LEGACY_PATHS = {
  "index.html": "/",
  "": "/",
  "services.html": "/services",
  "about.html": "/about",
  "contact.html": "/contact",
  "404.html": "/404",
};

/** Canonical route -> legacy filename, for building redirects. */
export const REDIRECTS = {
  "index.html": "/",
  "services.html": "/services",
  "about.html": "/about",
  "contact.html": "/contact",
};

/**
 * Translate a legacy href from the site data into a route path, preserving any
 * query string and fragment.
 *
 *   "services.html"                 -> "/services"
 *   "contact.html?service=advisory" -> "/contact?service=advisory"
 *   "services.html#cicd"            -> "/services#cicd"
 */
export function toRoute(href) {
  if (!href) return "/";

  const [beforeHash, hash] = href.split("#");
  const [file, query] = beforeHash.split("?");

  const mapped = LEGACY_PATHS[file] ?? (file.startsWith("/") ? file : `/${file}`);

  return mapped + (query ? `?${query}` : "") + (hash ? `#${hash}` : "");
}

/** The canonical path for one service's page. */
export function servicePath(id) {
  return `/services/${id}`;
}

/** True when `href` (already routed) points at the page currently showing. */
export function isCurrent(pathname, href) {
  const target = toRoute(href).split("?")[0].split("#")[0];
  if (target === "/") return pathname === "/";
  return pathname === target || pathname.startsWith(`${target}/`);
}

/**
 * The `data-page` value for a path, matching the attribute the static pages
 * carried on <body>. Nothing in the stylesheet depends on it, but it is kept for
 * parity and for analytics.
 */
export function pageNameFor(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/services") return "services";
  if (pathname.startsWith("/services/")) return "service";
  if (pathname === "/about") return "about";
  if (pathname === "/contact") return "contact";
  return "404";
}
