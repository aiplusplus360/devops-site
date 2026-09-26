/* Engagement plans — ported from `renderPlans()` in assets/js/main.js (L528).
   The articles are grid items; the `.grid.grid--3` wrapper is page markup,
   matching the `[data-plans]` host. The `spot` class is the pointer spotlight
   hook and `reveal` the scroll reveal, staggered by `--i`. */
import AppLink from "@/components/AppLink.jsx";
import { PLANS } from "@/data/services.js";
import { toRoute } from "@/lib/routes.js";

export default function Plans() {
  if (!PLANS.length) return null;

  return (
    <>
      {PLANS.map((plan, i) => (
        <article
          className={"plan card spot reveal" + (plan.highlight ? " plan--featured" : "")}
          style={{ "--i": i }}
          key={plan.name}
        >
          {plan.highlight ? (
            <span className="plan__badge">Most popular</span>
          ) : null}
          <h3 className="plan__name">{plan.name}</h3>
          <p className="plan__tagline">{plan.tagline}</p>
          <p className="plan__price">
            <strong>{plan.price}</strong>
            <span>{plan.note}</span>
          </p>
          <ul className="checklist">
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <AppLink
            className={"btn " + (plan.highlight ? "btn--primary" : "btn--ghost") + " btn--block"}
            to={toRoute("contact.html?plan=" + encodeURIComponent(plan.name))}
          >
            {plan.cta}
          </AppLink>
        </article>
      ))}
    </>
  );
}
