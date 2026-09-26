/* A grid of technology tiles.
   Ported from `techTile()` in assets/js/main.js (L336), including the
   per-technology brand accent (`--brand` / `--brand-soft`) that the stylesheet
   uses for the hover glow and the mark tint.

   Two differences from the original, both additive: a technology may specify
   `file` to render an image mark instead of inline SVG, and the `reveal` class
   can be switched off for tiles that are permanently in view and already moving
   (the homepage marquee), where a scroll reveal would fight the track animation. */
import { hexToRgb } from "@/lib/color.js";

/**
 * @param {object}   props
 * @param {object[]} props.items     technology records from data/tech.js
 * @param {boolean} [props.noReveal] skip the scroll-reveal class
 * @param {string}  [props.className] extra class for the wrapping grid
 */
export function TechTile({ tech, index = 0, noReveal = false }) {
  const rgb = hexToRgb(tech.color);

  const style = { "--i": index };
  if (rgb) {
    style["--brand"] = `#${String(tech.color).replace("#", "")}`;
    style["--brand-soft"] = `rgba(${rgb}, 0.10)`;
  }

  return (
    <div className={`tech-tile spot${noReveal ? "" : " reveal"}`} style={style}>
      <span className="tech-tile__mark">
        {tech.file ? (
          <img src={tech.file} alt="" width="36" height="36" loading="lazy" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label={`${tech.name} logo`}
            focusable="false"
            /* Official mark artwork, authored in data/tech.js — static and
               trusted, not user input. Kept as direct children of the <svg>,
               as in the original, so descendant and child selectors in the
               stylesheet still match. */
            dangerouslySetInnerHTML={{ __html: tech.svg || "" }}
          />
        )}
      </span>
      <span className="tech-tile__name">{tech.name}</span>
      {tech.note ? <span className="tech-tile__note">{tech.note}</span> : null}
    </div>
  );
}

export default function TechTiles({ items, noReveal = false, className = "tech-grid" }) {
  if (!items || !items.length) return null;

  return (
    <div className={className}>
      {items.map((t, i) => (
        <TechTile key={t.id || t.name} tech={t} index={i} noReveal={noReveal} />
      ))}
    </div>
  );
}
