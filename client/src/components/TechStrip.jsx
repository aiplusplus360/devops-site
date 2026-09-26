/* Technology tiles — ported from `hexToRgb()` (L325), `techTile()` (L336),
   `marqueeRow()` (L367) and `renderTech()` (L381) in assets/js/main.js.

   Two variants, matching the two hosts the original filled:

     "marquee"  the homepage logo wall: the featured technologies split into
                two counter-scrolling rows, each row's content emitted twice so
                the -50% track translation loops. The host is
                `.marquee-stack[data-tech-marquee]`; this component renders the
                two `.marquee` blocks that go inside it.
     "full"     the services page grouped grid. The host is
                `[data-tech-full]`; this component renders the `.tech-group`
                blocks.

   `--brand` / `--brand-soft` carry each brand colour into the hover tint, so
   they are emitted as inline custom properties exactly as the original did. */
import { TECHNOLOGIES, TECH_GROUP_ORDER } from "@/data/tech.js";

/* "#FF9900" -> "255,153,0", so a soft tint can be built with rgb(). Returns
   null for anything that isn't a readable hex, in which case the tile keeps
   only its stagger index. */
function hexToRgb(hex) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ].join(",");
}

/* One tile. `noReveal` is the marquee case: inside a moving track the scroll
   reveal would fight the animation, so it is skipped there. */
export function TechTile({ tech, index, noReveal = false }) {
  const rgb = hexToRgb(tech.color);
  const style = rgb
    ? {
        "--i": index,
        "--brand": "#" + String(tech.color).replace("#", ""),
        "--brand-soft": "rgba(" + rgb + ", 0.10)",
      }
    : { "--i": index };

  return (
    <div className={noReveal ? "tech-tile spot" : "tech-tile spot reveal"} style={style}>
      <span className="tech-tile__mark">
        {tech.file ? (
          <img src={tech.file} alt="" width="36" height="36" loading="lazy" />
        ) : (
          /* The mark wrapper is its own thing — no `.icon` class and no stroke
             attributes, unlike the `icon()` helper — so it cannot go through
             Icon.jsx. The path data is static, trusted artwork from
             data/tech.js, never user input. */
          <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label={`${tech.name} logo`}
            focusable="false"
            dangerouslySetInnerHTML={{ __html: tech.svg || "" }}
          />
        )}
      </span>
      <span className="tech-tile__name">{tech.name}</span>
      {tech.note ? <span className="tech-tile__note">{tech.note}</span> : null}
    </div>
  );
}

/* A seamless marquee row: the same markup twice, the second half hidden from
   assistive tech so the list isn't announced twice. The two halves must be
   identical in width or the loop visibly jumps, which is why the item spacing
   lives as a margin on the tile rather than a flex gap (see styles.css). */
function MarqueeRow({ list, reverse = false }) {
  const half = list.map((tech, i) => (
    <TechTile key={tech.id || i} tech={tech} index={i} noReveal />
  ));

  return (
    <div className={reverse ? "marquee marquee--reverse" : "marquee"}>
      <div className="marquee__track">
        <div className="marquee__group">{half}</div>
        <div className="marquee__group" aria-hidden="true">
          {half}
        </div>
      </div>
    </div>
  );
}

export default function TechStrip({ variant = "marquee" }) {
  if (variant === "full") {
    /* Grouped, complete list for the services page, in TECH_GROUP_ORDER.
       Anything unlisted still gets rendered, at the end; the order array is
       copied first so the imported module is never mutated. */
    const order = TECH_GROUP_ORDER.slice();
    const groups = {};
    TECHNOLOGIES.forEach((tech) => {
      const key = tech.group || "Other";
      (groups[key] = groups[key] || []).push(tech);
    });
    Object.keys(groups).forEach((key) => {
      if (!order.includes(key)) order.push(key);
    });

    return (
      <>
        {order.map((group) => {
          const list = groups[group];
          if (!list || !list.length) return null;
          return (
            <div className="tech-group" key={group}>
              <h3 className="tech-group__head">{group}</h3>
              <div className="tech-grid">
                {/* Explicit wrapper: Array.map would pass the index array as
                    the options object. */}
                {list.map((tech, i) => (
                  <TechTile key={tech.id || i} tech={tech} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  /* Homepage: the featured technologies, or all of them if none are marked,
     split down the middle into two counter-scrolling rows. */
  const featured = TECHNOLOGIES.filter((tech) => tech.featured);
  const picks = featured.length ? featured : TECHNOLOGIES;
  const half = Math.ceil(picks.length / 2);

  return (
    <>
      <MarqueeRow list={picks.slice(0, half)} />
      <MarqueeRow list={picks.slice(half)} reverse />
    </>
  );
}
