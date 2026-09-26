/* Site footer.
   Ported from `buildFooter()` in assets/js/main.js (L140).

   One deliberate change: the service links now point at each service's own page
   (/services/<id>) instead of an anchor on the services listing, since every
   service has a dedicated page. */
import { SITE } from "@/data/site.js";
import { SERVICES, ICONS } from "@/data/services.js";
import { servicePath } from "@/lib/routes.js";
import AppLink from "./AppLink.jsx";
import Icon from "./Icon.jsx";

export default function Footer() {
  const b = SITE.brand || {};
  const c = SITE.contact || {};
  const loc = c.location || {};
  const location = [loc.city, loc.region].filter(Boolean).join(", ");
  const year = new Date().getFullYear();

  const companyLinks = [
    { label: "How we work", href: "/about" },
    { label: "All services", href: "/services" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <footer className="footer" data-footer="">
      <div className="container footer__grid">
        <div className="footer__col footer__col--brand">
          <AppLink className="brand brand--footer" to="/">
            {b.logo ? (
              <img
                className="brand__logo"
                src={b.logo}
                alt=""
                width="192"
                height="120"
                decoding="async"
              />
            ) : (
              <span className="brand__mark" aria-hidden="true">
                <span>{b.monogram}</span>
              </span>
            )}
            <span className="brand__text">
              <span className="brand__name">{b.name}</span>
            </span>
          </AppLink>
          <p className="footer__blurb">{b.description}</p>
          <div className="socials">
            {(SITE.socials || []).map((s) => (
              <a
                key={s.label}
                className="social"
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                {/* Falls back to the first letter if an icon key is missing,
                    matching the original behaviour. */}
                {ICONS[s.icon] ? <Icon name={s.icon} /> : s.label.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h3>Services</h3>
          <ul>
            {SERVICES.slice(0, 6).map((s) => (
              <li key={s.id}>
                <AppLink href={servicePath(s.id)}>{s.name}</AppLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3>Company</h3>
          <ul>
            {companyLinks.map((l) => (
              <li key={l.href}>
                <AppLink href={l.href}>{l.label}</AppLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3>Get in touch</h3>
          <ul className="footer__contact">
            <li>
              <a href={`mailto:${c.email || ""}`}>{c.email}</a>
            </li>
            <li>
              <a href={`tel:${c.phoneHref || ""}`}>{c.phone}</a>
            </li>
            <li>
              <span>{location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          &copy; <span>{year}</span> <span>{b.legalName || b.name}</span>. All
          rights reserved.
        </p>
        <p className="footer__note">Built and run on the same pipelines we sell.</p>
      </div>
    </footer>
  );
}
