/* Service card — ported from `serviceCard()` in assets/js/main.js (L193).
   The card is a single grid item: the surrounding `.grid` is page markup, the
   same way `renderServices()` only ever wrote the cards into `[data-services-*]`.

   The `spot` class is the pointer spotlight hook and `reveal` the scroll
   reveal; `--i` staggers the latter, so it must survive as a custom property. */
import Icon from "@/components/Icon.jsx";
import AppLink from "@/components/AppLink.jsx";
import { servicePath } from "@/lib/routes.js";

export default function ServiceCard({ service, index }) {
  return (
    <article
      className="card service-card spot reveal"
      id={service.id}
      style={{ "--i": index }}
    >
      <div className="service-card__top">
        <span className="service-card__icon">
          <Icon name={service.icon} />
        </span>
        <span className="pill">{service.category}</span>
      </div>
      <h3>{service.name}</h3>
      <p className="service-card__summary">{service.summary}</p>
      <ul className="checklist">
        {(service.bullets || []).map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <AppLink className="link-arrow" to={servicePath(service.id)}>
        {"See the full service"}
        <Icon name="compass" className="icon icon--xs" />
      </AppLink>
    </article>
  );
}
