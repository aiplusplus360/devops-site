/* Hero terminal panel — ported from the `.terminal` block in index.html
   (L108-L123), which `renderTech()`/`renderServices()` never touched.

   The typewriter is entirely CSS-driven, so the inline properties are the
   contract: `.ttype` animates its width to `--chars`, every `.tline` fades in
   after `calc(var(--n) * 210ms)` and the caret blinks on its own
   `animation-delay`. Nothing here is interactive.

   Whitespace inside `<pre>` is load-bearing, so the lines are joined with
   literal newline text nodes rather than relying on JSX indentation. */

/* Shown when no `title` prop is supplied. */
const DEFAULT_TITLE = "release-pipeline.yml \u2014 run #412";

/* Fixed in the markup; the `.terminal__body` accessible name is part of it. */
const ARIA_LABEL =
  "An example release pipeline running from commit to production";

/* One entry per `.tline`. A string is rendered as plain text; a node as-is.
   The padding between columns is held in string literals so the exact number
   of spaces (12, 13, 13, 13, 11) cannot be reflowed by a formatter — the
   columns only line up because this is a `<pre>` in a monospace face.

   Glyphs are written as escapes to keep the source ASCII:
   \u25B8 = ▸, \u2192 = →, \u2713 = ✓, \u00B7 = ·. */
const DEFAULT_LINES = [
  <>
    <span className="c-dim">$</span>
    {" "}
    <span className="c-cmd ttype" style={{ "--chars": "20ch" }}>
      git push origin main
    </span>
    <span className="tcaret" style={{ animationDelay: "1.2s" }} />
  </>,
  " ",
  <>
    <span className="c-key">{"\u25B8 build"}</span>
    {"            compiled in 14.2s"}
  </>,
  <>
    <span className="c-key">{"\u25B8 test"}</span>
    {"             "}
    <span className="c-ok">328 passed</span>
    {", 0 failed"}
  </>,
  <>
    <span className="c-key">{"\u25B8 scan"}</span>
    {"             "}
    <span className="c-ok">0 critical CVEs</span>
  </>,
  <>
    <span className="c-key">{"\u25B8 plan"}</span>
    {"             "}
    <span className="c-ok">3 to add</span>
    {", 0 to destroy"}
  </>,
  <>
    <span className="c-key">{"\u25B8 deploy"}</span>
    {"           rollout canary 10% \u2192 100%"}
  </>,
  " ",
  <>
    <span className="c-ok">{"\u2713 released v2.8.0 in 4m 12s"}</span>
  </>,
  <>
    <span className="c-dim">{"  rollback available \u00B7 "}</span>
    <span className="c-warn">1 click</span>
  </>,
];

export default function Terminal({
  title = DEFAULT_TITLE,
  lines = DEFAULT_LINES,
}) {
  return (
    <div className="terminal">
      <div className="terminal__bar">
        <span className="terminal__dot terminal__dot--a"></span>
        <span className="terminal__dot terminal__dot--b"></span>
        <span className="terminal__dot terminal__dot--c"></span>
        <span className="terminal__title">{title}</span>
      </div>
      <pre className="terminal__body" aria-label={ARIA_LABEL}>
        {lines.flatMap((line, i) => {
          const node = (
            <span key={i} className="tline" style={{ "--n": i }}>
              {line}
            </span>
          );
          /* The newline lives between the lines, exactly as in the markup, so
             the line boxes stay separate text nodes of the `<pre>`. */
          return i === 0 ? node : ["\n", node];
        })}
      </pre>
    </div>
  );
}
