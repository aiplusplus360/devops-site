/* =============================================================================
   Port the legacy site data to ES modules
   -----------------------------------------------------------------------------
   The static site keeps its content in `assets/js/{config,data,tech}.js`, which
   assign onto `window.*` so they work when a page is opened straight off disk.
   ES modules cannot do that, so this converts them mechanically:

       window.SITE = {      ->   export const SITE = {
       window.SERVICES = [  ->   export const SERVICES = [

   A mechanical transform rather than a retyped copy, so the two can never
   silently disagree on a service name, a technology id or a statistic.

   Run:  node deploy/port-data-modules.js
   ========================================================================== */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "client/src/data");

const JOBS = [
  { src: "assets/js/config.js", dest: "site.js" },
  { src: "assets/js/data.js", dest: "services.js" },
  { src: "assets/js/tech.js", dest: "tech.js" },
];

fs.mkdirSync(OUT, { recursive: true });

let totalExports = 0;

for (const job of JOBS) {
  const from = path.join(ROOT, job.src);
  const to = path.join(OUT, job.dest);

  if (!fs.existsSync(from)) {
    console.error(`  MISSING source: ${job.src}`);
    process.exitCode = 1;
    continue;
  }

  const original = fs.readFileSync(from, "utf8");

  // Only rewrite lines whose entire statement is a top-level window assignment.
  const names = [];
  const converted = original.replace(
    /^(\s*)window\.([A-Z_][A-Z0-9_]*)\s*=/gm,
    (match, indent, name) => {
      names.push(name);
      return `${indent}export const ${name} =`;
    }
  );

  if (!names.length) {
    console.error(`  no window.* assignments found in ${job.src}`);
    process.exitCode = 1;
    continue;
  }

  // Anything left referring to window would break under a module loader.
  const leftovers = converted
    .split(/\r?\n/)
    .map((line, i) => ({ line, n: i + 1 }))
    .filter((x) => /\bwindow\./.test(x.line));

  if (leftovers.length) {
    console.error(`  ${job.src} still references window at line(s): ` +
      leftovers.map((x) => x.n).join(", "));
    process.exitCode = 1;
    continue;
  }

  const banner =
    `/* GENERATED FILE — do not edit directly.\n` +
    `   Source: ${job.src}\n` +
    `   Regenerate: node deploy/port-data-modules.js\n` +
    `   Edit the source file, then re-run, so the static site and the React app\n` +
    `   cannot drift apart. */\n\n`;

  fs.writeFileSync(to, banner + converted);
  totalExports += names.length;
  console.log(`  ${job.src.padEnd(24)} -> client/src/data/${job.dest.padEnd(14)} exports: ${names.join(", ")}`);
}

console.log(`\n${totalExports} exports written to client/src/data/`);
