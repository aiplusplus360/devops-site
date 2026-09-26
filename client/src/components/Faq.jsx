/* FAQ accordions — ported from `renderFaqs()` in assets/js/main.js (L517).
   The `<details>` / `<summary>` pair is exactly what the stylesheet animates:
   `interpolate-size: allow-keywords` plus `::details-content` inside
   `@supports`, and the `[open]` selectors drive the chevron. The first row is
   open on load, as in the original.

   `open` is only ever set from props — no state — so React never re-asserts it
   while a reader is opening and closing rows. */
import { FAQS } from "@/data/services.js";
export default function Faq({ items, openFirst = true }) {
  /* Defaults to the site-wide FAQ. The service pages pass their own questions. */
  const list = items || FAQS;
  if (!list.length) return null;

  return (
    <>
      {list.map((item, i) => (
        <details className="faq reveal" open={openFirst && i === 0} key={item.q}>
          <summary>
            {item.q}
            <span className="faq__chevron" aria-hidden="true" />
          </summary>
          <div className="faq__body">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </>
  );
}
