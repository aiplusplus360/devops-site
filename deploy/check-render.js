/* Verifies the grouping algorithms in main.js against the real data.
   Mirrors renderServices() and renderTech(). Safe to delete.               */
global.window = global;
const path = require("path");
const fs = require("fs");
const ROOT = path.join(__dirname, "..");
require(path.join(ROOT, "assets/js/data.js"));
require(path.join(ROOT, "assets/js/tech.js"));

const problems = [];

/* ------------------------------------------------------------- services --- */
const SERVICES = window.SERVICES;
let order = window.CATEGORY_ORDER || [];
const groups = {};
SERVICES.forEach((s) => {
  const k = s.category || "Other";
  (groups[k] = groups[k] || []).push(s);
});
Object.keys(groups).forEach((k) => { if (order.indexOf(k) === -1) order = order.concat([k]); });

const slugOf = (c) => "cat-" + c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const svcSections = [];
const renderedIds = [];
order.forEach((cat) => {
  const list = groups[cat];
  if (!list || !list.length) return;
  svcSections.push({ cat, slug: slugOf(cat), count: list.length });
  list.forEach((s) => renderedIds.push(s.id));
});

console.log("service sections:");
svcSections.forEach((s) => console.log(`  #${s.slug.padEnd(28)} ${String(s.count).padStart(2)}  renderServices -> ${s.count}`));
if (renderedIds.length !== SERVICES.length) problems.push(`rendered ${renderedIds.length}/${SERVICES.length} services`);
if (new Set(renderedIds).size !== renderedIds.length) problems.push("a service rendered twice");
const svcSlugs = svcSections.map((s) => s.slug);
if (new Set(svcSlugs).size !== svcSlugs.length) problems.push("duplicate service slugs");
svcSlugs.forEach((s) => { if (!/^cat-[a-z0-9-]+$/.test(s)) problems.push(`bad slug: ${s}`); });

/* --------------------------------------------------------------- tech ---- */
const TECH = window.TECHNOLOGIES;
let tOrder = window.TECH_GROUP_ORDER || [];
const tGroups = {};
TECH.forEach((t) => {
  const k = t.group || "Other";
  (tGroups[k] = tGroups[k] || []).push(t);
});
Object.keys(tGroups).forEach((k) => { if (tOrder.indexOf(k) === -1) tOrder = tOrder.concat([k]); });

const techSections = [];
const renderedTech = [];
tOrder.forEach((g) => {
  const list = tGroups[g];
  if (!list || !list.length) return;
  techSections.push({ g, count: list.length });
  list.forEach((t) => renderedTech.push(t.id));
});

console.log("\ntech sections:");
techSections.forEach((s) => console.log(`  ${s.g.padEnd(30)} ${String(s.count).padStart(2)} tiles`));
if (renderedTech.length !== TECH.length) problems.push(`rendered ${renderedTech.length}/${TECH.length} tech tiles`);
if (new Set(renderedTech).size !== renderedTech.length) problems.push("a tech tile rendered twice");

const strip = TECH.filter((t) => t.featured);
console.log(`\nhomepage strip  : ${strip.length} tiles`);
if (strip.length < 8) problems.push(`homepage strip is thin (${strip.length} tiles)`);

/* --- hex -> rgb conversion used for the hover tint ------------------------ */
function hexToRgb(hex) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)].join(",");
}
TECH.forEach((t) => {
  if (!hexToRgb(t.color)) problems.push(`tech ${t.id}: "${t.color}" would produce no tint`);
});

/* --- resources referenced must exist on disk ----------------------------- */
TECH.filter((t) => t.file).forEach((t) => {
  if (!fs.existsSync(path.join(ROOT, t.file))) problems.push(`tech ${t.id}: file not found ${t.file}`);
});

/* --- contrast sanity for the light theme --------------------------------- */
/* Text colours must be dark enough on #FFF. Rough WCAG relative luminance. */
function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.replace("#", "").substr(i - 1, 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
const cssText = fs.readFileSync(path.join(ROOT, "assets/css/styles.css"), "utf8");
const tokenBlock = cssText.slice(0, cssText.indexOf("/* ---------------------------------------------------------------- RESET"));
const tokens = {};
/* Capture both literal hexes and var() aliases so --text: var(--navy-900)
   resolves all the way down. */
(tokenBlock.match(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6}|var\(--[a-z0-9-]+\))/g) || []).forEach((m) => {
  const [, name, value] = m.match(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6}|var\(--[a-z0-9-]+\))/);
  tokens[name] = value;
});
function resolve(name, depth) {
  const v = tokens[name];
  if (!v) return null;
  if (v.startsWith("#")) return v;
  if ((depth || 0) > 5) return null;
  const inner = v.match(/var\((--[a-z0-9-]+)\)/);
  return inner ? resolve(inner[1], (depth || 0) + 1) : null;
}

console.log("\ncontrast on white (needs >= 4.5 for body text):");
[["--text", 4.5], ["--text-muted", 4.5], ["--text-dim", 3.0],
 ["--accent", 4.5], ["--steel-600", 4.5], ["--steel-700", 4.5]]
  .forEach(([name, min]) => {
    const hex = resolve(name);
    if (!hex) { problems.push(`${name} does not resolve to a hex colour`); return; }
    const r = ratio(hex, "#FFFFFF");
    const ok = r >= min;
    console.log(`  ${name.padEnd(14)} ${hex}  ${r.toFixed(2)}:1  ${ok ? "ok" : "FAILS (needs " + min + ")"}`);
    if (!ok) problems.push(`${name} (${hex}) contrast ${r.toFixed(2)}:1 < ${min}:1`);
  });

console.log(problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : "\nAll checks passed.");
process.exit(problems.length ? 1 : 0);
