/* Content + design-token integrity check. Safe to delete.
   Run:  node check-content.js                                              */
const fs = require("fs");
const path = require("path");
global.window = global;
const ROOT = path.join(__dirname, "..");
require(path.join(ROOT, "assets/js/data.js"));
require(path.join(ROOT, "assets/js/tech.js"));

const problems = [];
const S = window.SERVICES;
const I = window.ICONS;
const O = window.CATEGORY_ORDER;
const T = window.TECHNOLOGIES;
const TG = window.TECH_GROUP_ORDER;

/* ---------------------------------------------------------------- services */
const ids = new Set();
S.forEach((s) => {
  ["id", "icon", "category", "name", "summary"].forEach((k) => {
    if (!s[k]) problems.push(`service ${s.id || "?"}: missing ${k}`);
  });
  if (!Array.isArray(s.bullets) || !s.bullets.length) problems.push(`service ${s.id}: bad bullets`);
  if (ids.has(s.id)) problems.push(`duplicate service id: ${s.id}`);
  ids.add(s.id);
  if (!I[s.icon]) problems.push(`service ${s.id}: unknown icon "${s.icon}"`);
  if (O.indexOf(s.category) === -1) problems.push(`service ${s.id}: unknown category "${s.category}"`);
});

/* ----------------------------------------------------------- technologies */
const tids = new Set();
T.forEach((t) => {
  ["id", "name", "group", "color"].forEach((k) => {
    if (!t[k]) problems.push(`tech ${t.id || "?"}: missing ${k}`);
  });
  if (tids.has(t.id)) problems.push(`duplicate tech id: ${t.id}`);
  tids.add(t.id);
  if (!t.svg && !t.file) problems.push(`tech ${t.id}: needs either svg or file`);
  if (TG.indexOf(t.group) === -1) problems.push(`tech ${t.id}: unknown group "${t.group}"`);
  if (!/^#[0-9a-f]{6}$/i.test(t.color)) problems.push(`tech ${t.id}: colour "${t.color}" is not a 6-digit hex`);
  if (/NaN|undefined/.test(t.svg || "")) problems.push(`tech ${t.id}: svg contains undefined/NaN`);
  // Extremely rough SVG sanity: tags must be balanced.
  const open = (t.svg.match(/<(?!\/)[a-zA-Z]+/g) || []).length;
  const close = (t.svg.match(/<\/[a-zA-Z]+>/g) || []).length;
  const selfClose = (t.svg.match(/\/>/g) || []).length;
  if (!t.svg) return;
  if (open - selfClose !== close) {
    problems.push(`tech ${t.id}: unbalanced SVG (${open} open, ${selfClose} self-closing, ${close} close)`);
  }
});

/* ------------------------------------------------------------------- offer */
const cfgSrc = fs.readFileSync(path.join(ROOT, "assets/js/config.js"), "utf8");
global.window.SITE = {};
eval(cfgSrc.replace(/^window\./m, "window."));
const offer = window.SITE.offer;
if (offer && offer.enabled) {
  ["badge", "title", "intro", "scarcity", "ctaLabel", "ctaHref"].forEach((k) => {
    if (!offer[k]) problems.push(`offer: missing ${k}`);
  });
  (offer.deliverables || []).forEach((d, i) => {
    if (!d.title) problems.push(`offer deliverable ${i}: no title`);
    if (!d.text) problems.push(`offer deliverable ${i}: no text`);
    if (!I[d.icon]) problems.push(`offer deliverable ${i}: unknown icon "${d.icon}"`);
  });
}

/* ------------------------------------------------------- CSS custom props */
const css = fs.readFileSync(path.join(ROOT, "assets/css/styles.css"), "utf8");
const declared = new Set((css.match(/^\s*(--[a-z0-9-]+)\s*:/gim) || []).map((s) => s.trim().replace(":", "")));
const used = new Set((css.match(/var\((--[a-z0-9-]+)/g) || []).map((s) => s.slice(4)));
/* These are set inline per-element — by the HTML or by main.js — and always
   carry a CSS fallback (e.g. var(--brand, var(--border-strong))), so they are
   expected to be absent from the stylesheet.
     --brand / --brand-soft  per-technology accent, from tech.js
     --i                     reveal stagger index
     --head-photo            page-header backdrop, set in page markup
     --n                     terminal line index, set in markup
     --chars                 typewriter width, set in markup
     --mx / --my             pointer spotlight coords, set by main.js
     --py                    parallax offset, set by main.js                */
const INLINE_OK = [
  "--brand", "--brand-soft", "--i", "--head-photo",
  "--n", "--chars", "--mx", "--my", "--py",
];
const undeclared = [...used].filter((v) => !declared.has(v) && !INLINE_OK.includes(v));
if (undeclared.length) problems.push("CSS uses undeclared variables: " + undeclared.join(", "));

/* Every class the renderers emit should have a rule in the stylesheet. */
["offer", "offer__inner", "offer__badge", "offer__title", "offer__grid", "offer__item",
 "offer__item-icon", "offer__foot", "offer__scarcity", "offer__actions", "offer__fine",
 "tech-grid", "tech-tile", "tech-tile__mark", "tech-tile__name", "tech-group", "tech-group__head",
].forEach((c) => {
  if (!css.includes("." + c)) problems.push(`styles.css has no rule for .${c}`);
});

/* -------------------------------------------------------------- page hooks */
[["index.html", ["data-offer", "data-tech-marquee", "data-services-featured"]],
 ["services.html", ["data-offer", "data-tech-full", "data-tech-count", "data-services-full", "data-services-jump"]],
].forEach(([file, hooks]) => {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  hooks.forEach((h) => { if (!html.includes(h)) problems.push(`${file}: missing ${h}`); });
  if (!html.includes("assets/js/tech.js")) problems.push(`${file}: missing tech.js script tag`);
});

/* ---------------------------------------------------------------- imagery */
/* Every image a page references must exist on disk, and every <img> must have
   alt text plus explicit dimensions (to avoid layout shift). */
const IMG_DIR = path.join(ROOT, "assets/img");
const PAGES_ALL = ["index.html", "services.html", "about.html", "contact.html", "404.html"];
const imgReport = { referenced: 0, files: 0, bytes: 0 };

PAGES_ALL.forEach((file) => {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");

  // <img src="assets/img/x.jpg" ...>
  const tags = html.match(/<img\b[^>]*>/g) || [];
  tags.forEach((tag) => {
    imgReport.referenced++;
    const src = (tag.match(/src="([^"]+)"/) || [])[1];
    if (!src) { problems.push(`${file}: <img> with no src`); return; }
    if (!fs.existsSync(path.join(ROOT, src))) problems.push(`${file}: image not found on disk -> ${src}`);
    // alt must be present; empty is fine for decorative wrappers, but the
    // attribute itself has to be there.
    if (!/\balt="/.test(tag)) problems.push(`${file}: <img> missing alt attribute -> ${src}`);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) {
      problems.push(`${file}: <img> missing width/height (causes layout shift) -> ${src}`);
    }
    // Anything below the fold should be lazy-loaded.
    if (!/\bloading="lazy"/.test(tag) && !/\bfetchpriority="high"/.test(tag)) {
      problems.push(`${file}: <img> is neither lazy nor high priority -> ${src}`);
    }
  });

  // Any og:image must point at a real file (ignoring the absolute origin).
  const og = (html.match(/og:image" content="[^"]*?(\/assets\/[^"]+)"/) || [])[1];
  if (og && !fs.existsSync(path.join(ROOT, og.replace(/^\//, "")))) {
    problems.push(`${file}: og:image missing on disk -> ${og}`);
  }
  // Pages that opt out of indexing (e.g. the 404) deliberately carry no social
  // tags — there is nothing to share.
  const noindex = /name="robots"[^>]*noindex/.test(html);
  if (!html.includes("og:image") && !noindex) {
    problems.push(`${file}: no og:image (social previews will be blank)`);
  }
});

/* CSS background photos must resolve relative to the stylesheet. */
const cssDir = path.join(ROOT, "assets/css");
const urlRefs = [...new Set((css.match(/url\("\.\.\/img\/([^"]+)"\)/g) || [])
  .map((u) => u.match(/url\("\.\.\/img\/([^"]+)"\)/)[1]))];
urlRefs.forEach((name) => {
  if (!fs.existsSync(path.join(IMG_DIR, name))) problems.push(`styles.css references missing photo: ${name}`);
});

/* Report on the image payload. */
if (fs.existsSync(IMG_DIR)) {
  fs.readdirSync(IMG_DIR).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).forEach((f) => {
    const st = fs.statSync(path.join(IMG_DIR, f));
    imgReport.files++;
    imgReport.bytes += st.size;
    if (st.size > 300 * 1024) problems.push(`assets/img/${f} is ${Math.round(st.size / 1024)}KB — compress it (aim <200KB)`);
  });
}

/* ------------------------------------------------------------------ report */
const byCat = {};
S.forEach((s) => (byCat[s.category] = (byCat[s.category] || 0) + 1));
const byGrp = {};
T.forEach((t) => (byGrp[t.group] = (byGrp[t.group] || 0) + 1));

console.log(`services        : ${S.length}  (featured on home: ${S.filter((s) => s.featured).length})`);
O.forEach((c) => console.log(`   ${c.padEnd(30)}${byCat[c] || 0}`));
console.log(`technologies    : ${T.length}  (featured on home: ${T.filter((t) => t.featured).length})`);TG.forEach((g) => console.log(`   ${g.padEnd(30)}${byGrp[g] || 0}`));
console.log(`icons           : ${Object.keys(I).length} defined`);
console.log(`css variables   : ${declared.size} declared, ${used.size} referenced, ${undeclared.length} undeclared`);
console.log(`imagery         : ${imgReport.files} files, ${imgReport.referenced} <img> refs, ${Math.round(imgReport.bytes / 1024)}KB total`);

console.log(problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : "\nAll checks passed.");
process.exit(problems.length ? 1 : 0);