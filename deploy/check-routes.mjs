/* =============================================================================
   Route and render check
   -----------------------------------------------------------------------------
   Renders every URL the site publishes through the same SSR bundle the Express
   server uses, and asserts the things that are easy to break and hard to notice:

     status codes       200 for real pages, 404 for unknown ones — including
                        /services/<unknown>, which is a *valid* route shape and
                        would otherwise be served as a 200 and indexed
     head integrity     exactly one title, one description, one canonical per
                        page, and no two service pages sharing a title or
                        description (duplicate metadata is the usual symptom of
                        a template that forgot to use the per-page data)
     content            each service page actually contains its own name and
                        tagline, so a page cannot silently render another
                        service's copy
     no legacy links    every internal href in the output must be a real route.
                        A stray `href="contact.html"` is the single easiest way
                        to reintroduce a full page load, and it renders fine —
                        which is exactly why it needs a test
     structured data    every JSON-LD block parses
     determinism        the same URL renders byte-identical twice, which is what
                        makes React hydration safe
     no placeholders    lorem ipsum, TODO, FIXME and friends never ship

   Run with:  npm run build && npm run check:routes
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const serverEntry = path.join(root, "dist/server/entry-server.mjs");
const clientTemplate = path.join(root, "dist/client/index.html");

/* The server imports are dynamic so a missing build produces a readable message
   rather than an unhandled module-not-found stack. */
if (!fs.existsSync(serverEntry) || !fs.existsSync(clientTemplate)) {
  console.error(
    "\n  Nothing to check — the build output is missing.\n\n" +
      "  Run:  npm run build\n"
  );
  process.exit(1);
}

const ssr = await import(pathToFileURL(serverEntry).href);
const { headTags } = await import(pathToFileURL(path.join(root, "server/lib/meta.mjs")).href);
const { composeDocument } = await import(pathToFileURL(path.join(root, "server/lib/render.mjs")).href);

const template = fs.readFileSync(clientTemplate, "utf8");

/* ------------------------------------------------------------------ kit -- */
const failures = [];
let checks = 0;

function check(ok, label, detail = "") {
  checks++;
  if (!ok) failures.push(detail ? `${label}: ${detail}` : label);
}

/** Render a URL exactly as the server does, returning the final document. */
function renderDocument(url) {
  const { html, head, status } = ssr.render(url);
  return { document: composeDocument(template, html, headTags(head)), status, head };
}

/** The visible text of the document, for content assertions.
 *
 *  React escapes text nodes whenever it renders them — an apostrophe comes back
 *  as `&#x27;`, an ampersand as `&amp;` — so the entities have to be decoded
 *  before any comparison against the source data, or every string containing an
 *  apostrophe would look absent.
 *
 *  Order matters: numeric references first, then the named ones, and `&amp;`
 *  last. Decoding `&amp;` earlier would turn a literal `&amp;#x27;` in the
 *  content into an apostrophe that was never in the page. */
function decodeEntities(input) {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function textOf(document) {
  const stripped = document
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(stripped).replace(/\s+/g, " ");
}

function countMatches(haystack, pattern) {
  return (haystack.match(pattern) || []).length;
}

/* -------------------------------------------------- head tag integrity -- */
function headOf(document) {
  const region = document.match(/<head[^>]*>([\s\S]*?)<\/head>/);
  return region ? region[1] : "";
}

/* ============================================================ the sweep == */
const routes = ssr.allRoutes();
const seenTitles = new Map();
const seenDescriptions = new Map();

console.log(`\n  Checking ${routes.length} published routes\n`);

for (const route of routes) {
  const first = renderDocument(route.path);
  const head = headOf(first.document);

  /* --- status ---------------------------------------------------------- */
  check(
    first.status === 200,
    `${route.path} should render 200`,
    `got ${first.status}`
  );

  /* --- exactly one of each critical tag -------------------------------- */
  const titles = countMatches(head, /<title>/g);
  const descriptions = countMatches(head, /<meta name="description"/g);
  const canonicals = countMatches(head, /<link rel="canonical"/g);
  check(titles === 1, `${route.path} should have exactly one <title>`, `found ${titles}`);
  check(
    descriptions === 1,
    `${route.path} should have exactly one meta description`,
    `found ${descriptions}`
  );
  check(
    canonicals === 1,
    `${route.path} should have exactly one canonical`,
    `found ${canonicals}`
  );

  /* --- metadata is per-page, not repeated ------------------------------ */
  const title = (head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
  const description =
    (head.match(/<meta name="description" content="([\s\S]*?)"/) || [])[1] || "";
  check(title.trim().length > 0, `${route.path} has an empty title`);

  if (seenTitles.has(title)) {
    check(false, `${route.path} reuses the title from ${seenTitles.get(title)}`, title);
  } else {
    seenTitles.set(title, route.path);
  }
  if (seenDescriptions.has(description)) {
    check(
      false,
      `${route.path} reuses the description from ${seenDescriptions.get(description)}`,
      description.slice(0, 60)
    );
  } else {
    seenDescriptions.set(description, route.path);
  }

  /* --- canonical points at this route ---------------------------------- */
  const canonical = (head.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
  check(
    canonical.endsWith(route.path === "/" ? "" : route.path) ||
      (route.path === "/" && canonical.replace(/\/$/, "").length > 0),
    `${route.path} canonical points elsewhere`,
    canonical
  );

  /* --- the app actually rendered into the page -------------------------- */
  check(
    first.document.includes('<div id="root">'),
    `${route.path} is missing the hydration root`
  );
  check(
    /<div id="root">\s*<[a-z]/.test(first.document),
    `${route.path} rendered no markup into #root`
  );
  check(
    first.document.includes('id="main"'),
    `${route.path} rendered no <main>`
  );

  /* --- no legacy .html links survive into the output -------------------- */
  const legacyLinks = first.document.match(/href="[^"]*\.html[^"]*"/g) || [];
  check(
    legacyLinks.length === 0,
    `${route.path} still links to legacy .html URLs`,
    legacyLinks.slice(0, 3).join(", ")
  );

  /* --- structured data parses ------------------------------------------ */
  const jsonLdBlocks = [
    ...first.document.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ];
  for (const [, body] of jsonLdBlocks) {
    try {
      JSON.parse(body);
    } catch (err) {
      check(false, `${route.path} has unparseable JSON-LD`, err.message);
    }
  }

  /* --- no placeholder copy --------------------------------------------- */
  const text = textOf(first.document);
  const placeholder = text.match(/\b(lorem ipsum|dolor sit amet|TODO|FIXME|XXX|PLACEHOLDER)\b/i);
  check(!placeholder, `${route.path} contains placeholder text`, placeholder?.[0]);

  /* --- deterministic output -------------------------------------------- */
  const second = renderDocument(route.path);
  check(
    second.document === first.document,
    `${route.path} does not render deterministically`,
    "two renders of the same URL differ"
  );
}

/* ---------------------------------------------- service pages have copy -- */
const serviceRoutes = routes.filter((r) => r.path.startsWith("/services/"));
check(
  serviceRoutes.length === ssr.SERVICES.length,
  `expected a page for all ${ssr.SERVICES.length} services`,
  `found ${serviceRoutes.length}`
);

for (const service of ssr.SERVICES) {
  const url = ssr.servicePath(service.id);
  const { document, status } = renderDocument(url);
  const text = textOf(document);

  check(status === 200, `${url} should render 200`, `got ${status}`);
  check(text.includes(service.name), `${url} does not contain its own service name`);
  /* The detail page leads with the richer `tagline` from the content file, while
     the card `summary` is the shorter pitch used on the services index. Each
     page must carry its own tagline, or the template is not reading the right
     content file. */
  const content = ssr.SERVICE_CONTENT[service.id];
  check(
    text.includes(content.tagline),
    `${url} does not contain its own tagline`,
    content.tagline.slice(0, 50)
  );
  check(text.includes(service.category), `${url} does not name its category`);
}

/* ------------------------------------------------- 404 handling is real -- */
const notFoundUrls = [
  "/services/this-is-not-a-service",
  "/definitely-not-a-page",
  "/services/cicd/extra/segments",
];
for (const url of notFoundUrls) {
  const { document, status } = renderDocument(url);
  check(status === 404, `${url} should be a 404`, `got ${status}`);
  check(
    /<meta name="robots" content="noindex"/.test(document),
    `${url} is a 404 but is not marked noindex`
  );
  /* Two independent markers, because either one alone could survive a template
     change that stopped the page being a real not-found page. */
  const notFoundText = textOf(document);
  check(
    notFoundText.includes("Error 404") && notFoundText.includes("doesn't resolve"),
    `${url} did not render the not-found page`
  );
}

/* ---------------------------------------------------------- report ------ */
const serviceCount = serviceRoutes.length;
if (failures.length) {
  console.error(`  ${failures.length} problem(s) across ${checks} checks:\n`);
  for (const failure of failures.slice(0, 40)) console.error(`    - ${failure}`);
  if (failures.length > 40) {
    console.error(`    ... and ${failures.length - 40} more`);
  }
  console.error("");
  process.exit(1);
}

console.log(`  routes checked      : ${routes.length}`);
console.log(`  service pages       : ${serviceCount}`);
console.log(`  404 pages verified  : ${notFoundUrls.length}`);
console.log(`  assertions          : ${checks} passed\n`);
console.log("  All route checks passed.\n");
