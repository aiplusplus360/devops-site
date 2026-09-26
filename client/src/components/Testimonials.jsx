/* Testimonial cards — ported from `renderTestimonials()` in assets/js/main.js
   (L499). The figures are grid items; the `.grid.grid--3` wrapper is page
   markup, matching the `[data-testimonials]` host. Renders nothing when the
   list is empty, which is how the original hid the whole section. */
import { TESTIMONIALS } from "@/data/services.js";

export default function Testimonials() {
  if (!TESTIMONIALS.length) return null;

  return (
    <>
      {TESTIMONIALS.map((item, i) => (
        <figure className="quote card reveal" style={{ "--i": i }} key={item.name}>
          {/* &ldquo; in the original markup. */}
          <div className="quote__mark" aria-hidden="true">{"\u201C"}</div>
          <blockquote>{item.quote}</blockquote>
          <figcaption>
            <span className="quote__avatar" aria-hidden="true">
              {item.name.charAt(0)}
            </span>
            <span>
              <strong>{item.name}</strong>
              {/* Role and company were concatenated into one text node; the
                  middle dot is \u00B7. */}
              <small>
                {`${item.role ?? ""}${item.company ? ` \u00B7 ${item.company}` : ""}`}
              </small>
            </span>
          </figcaption>
        </figure>
      ))}
    </>
  );
}
