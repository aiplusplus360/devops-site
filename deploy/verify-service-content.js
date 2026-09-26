/* =============================================================================
   Service page content validator
   -----------------------------------------------------------------------------
   The 40 service pages are generated from one template, so the copy is data.
   This enforces the contract in client/src/content/BRIEF.md so that a page can
   never render half-empty, contradict the site data, or reuse another page's
   sentences.

   Run:  node deploy/verify-service-content.js
         node deploy/verify-service-content.js cicd gitops    (subset)
   Exits non-zero if anything fails. Safe to run while content is incomplete:
   missing files are reported as problems, not crashes.
   ========================================================================== */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "client/src/content/services");

global.window = global;
require(path.join(ROOT, "assets/js/data.js"));
require(path.join(ROOT, "assets/js/tech.js"));

const SERVICES = window.SERVICES;
const ICONS = window.ICONS;
const TECH_IDS = new Set(window.TECHNOLOGIES.map((t) => t.id));
const SERVICE_IDS = new Set(SERVICES.map((s) => s.id));

const problems = [];
const notes = [];

/* ------------------------------------------------------------------ helpers */
const isStr = (v) => typeof v === "string";
const words = (s) => (isStr(s) ? s.trim().split(/\s+/).filter(Boolean).length : 0);
const chars = (s) => (isStr(s) ? s.length : 0);

function range(where, value, lo, hi, unit) {
  const n = unit === "words" ? words(value) : chars(value);
  if (!isStr(value)) { problems.push(`${where}: expected a string`); return; }
  if (n < lo || n > hi) problems.push(`${where}: ${n} ${unit} (expected ${lo}-${hi}) — "${String(value).slice(0, 70)}"`);
}

function exactLen(where, arr, n) {
  if (!Array.isArray(arr)) { problems.push(`${where}: expected an array`); return false; }
  if (arr.length !== n) { problems.push(`${where}: has ${arr.length} items (expected exactly ${n})`); return false; }
  return true;
}

/* Phrases that signal filler or a voice that does not match the site. */
const BANNED = [
  "passionate", "cutting-edge", "cutting edge", "world-class", "world class",
  "best-in-class", "best in class", "seamless", "seamlessly", "robust",
  "leverage", "synergy", "unlock", "empower", "revolutionis", "revolutioniz",
  "game-changing", "game changing", "state-of-the-art", "state of the art",
  "one-stop shop", "take it to the next level", "fast-paced world",
  "we're excited", "we are excited", "we believe", "lorem ipsum", "todo",
  "coming soon", "placeholder", "tbd", "xxx",
];

/* Sentence extraction for the cross-page duplication check. */
function sentences(service) {
  const out = [];
  const push = (s) => {
    if (!isStr(s)) return;
    s.split(/(?<=[.!?])\s+/).forEach((raw) => {
      const t = raw.trim();
      // Ignore short fragments and anything purely numeric.
      if (words(t) < 6) return;
      if (/^[\d\s%.,:+—-]+$/.test(t)) return;
      out.push(t);
    });
  };
  push(service.tagline);
  (service.overview || []).forEach(push);
  (service.problems || []).forEach(push);
  (service.includes || []).forEach((i) => { push(i && i.title); push(i && i.text); });
  (service.deliverables || []).forEach(push);
  (service.process || []).forEach((p) => { push(p && p.title); push(p && p.text); });
  (service.faqs || []).forEach((f) => { push(f && f.a); });
  if (service.seo) { push(service.seo.title); push(service.seo.description); }
  return out;
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/* ------------------------------------------------------------------- load */
const only = process.argv.slice(2);
const targets = only.length ? only : SERVICES.map((s) => s.id);

const loaded = {};
for (const id of targets) {
  const file = path.join(CONTENT_DIR, id + ".json");
  if (!fs.existsSync(file)) {
    problems.push(`${id}: MISSING FILE client/src/content/services/${id}.json`);
    continue;
  }
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch (e) {
    problems.push(`${id}: cannot read file (${e.message})`);
    continue;
  }
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    problems.push(`${id}: INVALID JSON — ${e.message}`);
    continue;
  }
  loaded[id] = json;
}

/* ---------------------------------------------------------------- validate */
const seenSentence = new Map();   // normalised sentence -> service id
const duplicateHits = [];

for (const id of Object.keys(loaded)) {
  const s = loaded[id];
  const P = (m) => `${id}: ${m}`;

  if (s.id !== id) problems.push(P(`id field is "${s.id}" but the file is ${id}.json`));

  /* tagline */
  if (!isStr(s.tagline) || !s.tagline.trim()) problems.push(P("tagline missing"));
  else range(P("tagline (words)"), s.tagline, 9, 16, "words");

  /* overview — exactly 2 */
  if (exactLen(P("overview"), s.overview, 2)) {
    s.overview.forEach((p, i) => range(P(`overview[${i}] (words)`), p, 45, 75, "words"));
  }

  /* problems — exactly 4 */
  if (exactLen(P("problems"), s.problems, 4)) {
    s.problems.forEach((p, i) => range(P(`problems[${i}] (words)`), p, 7, 16, "words"));
  }

  /* includes — exactly 6, each with a valid icon */
  if (exactLen(P("includes"), s.includes, 6)) {
    s.includes.forEach((it, i) => {
      if (!it || typeof it !== "object") { problems.push(P(`includes[${i}] is not an object`)); return; }
      if (!ICONS[it.icon]) problems.push(P(`includes[${i}].icon "${it.icon}" is not a valid icon key`));
      range(P(`includes[${i}].title (words)`), it.title, 2, 5, "words");
      range(P(`includes[${i}].text (words)`), it.text, 16, 34, "words");
    });
  }

  /* deliverables — exactly 5 */
  if (exactLen(P("deliverables"), s.deliverables, 5)) {
    s.deliverables.forEach((d, i) => range(P(`deliverables[${i}] (words)`), d, 6, 14, "words"));
  }

  /* stack — 5 to 8 valid technology ids */
  if (!Array.isArray(s.stack)) problems.push(P("stack: expected an array"));
  else {
    if (s.stack.length < 5 || s.stack.length > 8) problems.push(P(`stack: has ${s.stack.length} ids (expected 5-8)`));
    s.stack.forEach((t, i) => { if (!TECH_IDS.has(t)) problems.push(P(`stack[${i}] "${t}" is not a valid technology id`)); });
    if (new Set(s.stack).size !== s.stack.length) problems.push(P("stack: contains duplicate ids"));
  }

  /* outcomes — exactly 3 */
  if (exactLen(P("outcomes"), s.outcomes, 3)) {
    s.outcomes.forEach((o, i) => {
      if (!o || typeof o !== "object") { problems.push(P(`outcomes[${i}] is not an object`)); return; }
      if (!isStr(o.value) || !o.value.trim()) problems.push(P(`outcomes[${i}].value missing`));
      else if (chars(o.value) > 12) problems.push(P(`outcomes[${i}].value "${o.value}" is too long (max 12 chars)`));
      range(P(`outcomes[${i}].label (words)`), o.label, 2, 5, "words");
    });
  }

  /* process — exactly 4 */
  if (exactLen(P("process"), s.process, 4)) {
    s.process.forEach((p, i) => {
      if (!p || typeof p !== "object") { problems.push(P(`process[${i}] is not an object`)); return; }
      range(P(`process[${i}].title (words)`), p.title, 3, 6, "words");
      range(P(`process[${i}].text (words)`), p.text, 15, 30, "words");
    });
  }

  /* faqs — exactly 4 */
  if (exactLen(P("faqs"), s.faqs, 4)) {
    s.faqs.forEach((f, i) => {
      if (!f || typeof f !== "object") { problems.push(P(`faqs[${i}] is not an object`)); return; }
      if (!isStr(f.q) || !f.q.trim().endsWith("?")) problems.push(P(`faqs[${i}].q must end with "?"`));
      range(P(`faqs[${i}].a (words)`), f.a, 25, 60, "words");
    });
  }

  /* related — 3 valid ids, not itself */
  if (exactLen(P("related"), s.related, 3)) {
    s.related.forEach((r, i) => {
      if (!SERVICE_IDS.has(r)) problems.push(P(`related[${i}] "${r}" is not a known service id`));
      if (r === id) problems.push(P("related: refers to itself"));
    });
    if (new Set(s.related).size !== s.related.length) problems.push(P("related: contains duplicates"));
  }

  /* seo */
  if (!s.seo || typeof s.seo !== "object") problems.push(P("seo missing"));
  else {
    range(P("seo.title (chars)"), s.seo.title, 50, 60, "chars");
    range(P("seo.description (chars)"), s.seo.description, 140, 158, "chars");
  }

  /* banned language, scanning every string in the object */
  const flat = JSON.stringify(s).toLowerCase();
  BANNED.forEach((b) => {
    if (flat.includes(b)) problems.push(P(`contains banned phrase "${b}"`));
  });
  if (String(s.tagline || "").includes("!")) problems.push(P("tagline contains an exclamation mark"));

  /* duplication across services */
  sentences(s).forEach((sent) => {
    const key = norm(sent);
    if (key.length < 25) return;
    if (seenSentence.has(key)) {
      const other = seenSentence.get(key);
      if (other !== id) duplicateHits.push(`${id} and ${other} share: "${sent.slice(0, 72)}…"`);
    } else {
      seenSentence.set(key, id);
    }
  });
}

duplicateHits.forEach((d) => problems.push("DUPLICATE SENTENCE — " + d));

/* ---------------------------------------------------------------- report */
const total = targets.length;
const done = Object.keys(loaded).length;
const pct = total ? Math.round((done / total) * 100) : 0;

console.log(`service content : ${done}/${total} files present (${pct}%)`);
if (only.length) console.log(`  (subset run: ${targets.join(", ")})`);

for (const id of Object.keys(loaded)) {
  const s = loaded[id];
  const tech = SERVICES.find((x) => x.id === id);
  notes.push(`  ${id.padEnd(20)} ${(tech ? tech.category : "?").padEnd(26)} stack=${(s.stack || []).length} related=${(s.related || []).join(",")}`);
}
if (notes.length && done) console.log(notes.join("\n"));

if (problems.length) {
  console.log(`\n${problems.length} PROBLEM${problems.length === 1 ? "" : "S"}:\n` + problems.join("\n"));
  process.exit(1);
}
console.log("\nAll service content checks passed.");
