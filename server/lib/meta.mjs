/* =============================================================================
   Serialise the per-route head into HTML
   -----------------------------------------------------------------------------
   The tags have to be in the first byte of the response, because the crawlers
   and social scrapers that read them mostly do not execute JavaScript. So this
   writes them from the collector the render pass filled in, and never relies on
   the browser fixing them up afterwards.
   ========================================================================== */

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape for use inside an HTML attribute or text node. */
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** JSON-LD must not be able to close its own <script> element. */
function safeJson(obj) {
  return JSON.stringify(obj).replace(/</g, "\\u003c").replace(/\u2028|\u2029/g, "");
}

/**
 * @param {object} head  as filled in by <Seo> during rendering
 * @returns {string}     the inner HTML for the head placeholder
 */
export function headTags(head) {
  const title = head.title || "";
  const description = head.description || "";
  const canonical = head.canonical || "";
  const image = head.image || "";
  const type = head.type || "website";
  const noindex = Boolean(head.noindex);

  const tags = [
    `<title>${esc(title)}</title>`,
    /* Ahead of the description on purpose: nothing else in the head matters if
       the page is asking not to be indexed. */
    noindex ? `<meta name="robots" content="noindex">` : "",
    description ? `<meta name="description" content="${esc(description)}">` : "",
    canonical ? `<link rel="canonical" href="${esc(canonical)}">` : "",

    `<meta property="og:type" content="${esc(type)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    description ? `<meta property="og:description" content="${esc(description)}">` : "",
    canonical ? `<meta property="og:url" content="${esc(canonical)}">` : "",
    image ? `<meta property="og:image" content="${esc(image)}">` : "",
    image ? `<meta property="og:image:width" content="1200">` : "",
    image ? `<meta property="og:image:height" content="630">` : "",
    image ? `<meta property="og:image:alt" content="${esc(title)}">` : "",

    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    description ? `<meta name="twitter:description" content="${esc(description)}">` : "",
    image ? `<meta name="twitter:image" content="${esc(image)}">` : "",
  ];

  for (const block of head.jsonLd || []) {
    tags.push(`<script type="application/ld+json">${safeJson(block)}</script>`);
  }

  return tags.filter(Boolean).join("\n");
}
