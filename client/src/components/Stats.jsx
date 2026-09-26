/* The count-up credibility strip — ported from `parseStat()` (L454),
   `formatStat()` (L469) and `renderStats()` (L475) in assets/js/main.js.

   The strip is a grid item list only: `renderStats()` wrote into the
   `.stats` host, so the page supplies that wrapper.

   Two things matter here. First, the `data-count-*` attributes are the whole
   interface the count-up behaviour reads — all five, including the ones that
   look redundant. Second, the server renders the SETTLED value rather than
   zero, so the strip reads correctly before any JavaScript runs (it stays
   correct for reduced-motion users, who never see the animation). The
   behaviour overwrites the text on its way up to the same value. */
import { SITE } from "@/data/site.js";

/* Split "120+" / "99.95%" / "15 min" into the prefix, the number and the
   suffix, once, so the animator's final frame reproduces the configured string
   exactly. Kept verbatim from the original. */
function parseStat(raw) {
  const m = String(raw).match(/^(\D*?)([\d][\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const num = parseFloat(m[2].replace(/,/g, ""));
  if (!isFinite(num)) return null;
  const dot = m[2].indexOf(".");
  return {
    prefix: m[1],
    suffix: m[3],
    target: num,
    decimals: dot === -1 ? 0 : m[2].length - dot - 1,
    grouped: m[2].indexOf(",") !== -1,
  };
}

function formatStat(spec, value) {
  let n = value.toFixed(spec.decimals);
  if (spec.grouped) n = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return spec.prefix + n + spec.suffix;
}

export default function Stats({ items }) {
  /* Defaults to the site-wide credibility strip. The service pages pass their
     own outcomes instead, which is why this takes a prop at all. */
  const stats = items || SITE.stats || [];
  if (!stats.length) return null;

  return (
    <>
      {stats.map((stat, i) => {
        const spec = parseStat(stat.value);
        /* If the value isn't a number we can animate, print it verbatim. */
        const shown = spec ? formatStat(spec, spec.target) : stat.value;
        const countProps = spec
          ? {
              "data-count-target": String(spec.target),
              "data-count-prefix": spec.prefix,
              "data-count-suffix": spec.suffix,
              "data-count-decimals": String(spec.decimals),
              ...(spec.grouped ? { "data-count-grouped": "1" } : {}),
            }
          : {};
        return (
          <div className="stat reveal" style={{ "--i": i }} key={stat.label}>
            <span className="stat__value" {...countProps}>
              {shown}
            </span>
            <span className="stat__label">{stat.label}</span>
          </div>
        );
      })}
    </>
  );
}
