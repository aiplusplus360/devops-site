/* The free-offer panel — ported from `renderOffer()` in assets/js/main.js
   (L283). Reads `SITE.offer` and renders nothing at all when the offer is
   disabled, which is the closest a component can get to the original removing
   its `<section>` from the document. */
import Icon from "@/components/Icon.jsx";
import AppLink from "@/components/AppLink.jsx";
import { SITE } from "@/data/site.js";
import { toRoute } from "@/lib/routes.js";

export default function Offer() {
  const offer = SITE.offer || {};
  if (!offer.enabled) return null;

  return (
    <div className="offer">
      <div className="offer__inner">
        <div className="offer__head">
          <span className="offer__badge">
            <Icon name="sparkles" />
            {offer.badge}
          </span>
          <h2 className="offer__title">{offer.title}</h2>
          <p className="offer__intro">{offer.intro}</p>
        </div>
        <div className="offer__grid">
          {(offer.deliverables || []).map((item, i) => (
            <div
              className="offer__item spot reveal"
              style={{ "--i": i }}
              key={item.title}
            >
              <span className="offer__item-icon">
                <Icon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <div className="offer__foot">
          <span className="offer__scarcity">{offer.scarcity}</span>
          <div className="offer__actions">
            <AppLink
              className="btn btn--primary btn--lg"
              to={toRoute(offer.ctaHref || "contact.html")}
            >
              {offer.ctaLabel || "Get started"}
            </AppLink>
            {offer.secondaryHref ? (
              <AppLink
                className="btn btn--ghost btn--lg"
                to={toRoute(offer.secondaryHref)}
              >
                {offer.secondaryLabel}
              </AppLink>
            ) : null}
          </div>
        </div>
        {/* Guarantee and fine print were concatenated with a single space, so
            the browser saw one text node — keep it one expression. `?? ""`
            mirrors what the original `esc()` did with a missing value. */}
        <p className="offer__fine">{`${offer.guarantee ?? ""} ${offer.fine ?? ""}`}</p>
      </div>
    </div>
  );
}
