/* Site header: brand, mobile nav toggle, primary nav.
   Ported from `buildHeader()` in assets/js/main.js (L105).

   The links go through AppLink, so navigation between pages is handled by the
   router in the browser rather than by asking the server for a new document.
   The rendered markup is identical either way — AppLink emits the same
   `<a href="…">` — so the stylesheet and the interaction layer see no change.
   The mobile toggle and Escape-to-close are handled by the interaction layer
   (wireNav), which owns `.nav-toggle` and `.nav`. */
import { useLocation } from "react-router-dom";
import { SITE } from "@/data/site.js";
import { toRoute, isCurrent } from "@/lib/routes.js";
import AppLink from "@/components/AppLink.jsx";

export default function Header() {
  const { pathname } = useLocation();
  const b = SITE.brand || {};

  return (
    <header className="header" data-header="">
      <div className="container header__inner">
        <AppLink className="brand" to="/" aria-label={`${b.name} home`}>
          {/* The full logo when one is configured, otherwise the monogram tile.
              These width/height values are the DISPLAY size, not the source
              file's - they must match `height` in .brand__logo. They are the
              fallback used before the stylesheet applies, so setting the source
              dimensions here would render the logo at full size in the header
              until the CSS arrives. Keeping them correct also reserves the right
              space up front, so nothing shifts as the image loads. */}
          {b.logo ? (
            <img
              className="brand__logo"
              src={b.logo}
              alt=""
              width="56"
              height="35"
              decoding="async"
            />
          ) : (
            <span className="brand__mark" aria-hidden="true">
              <span>{b.monogram}</span>
            </span>
          )}
          <span className="brand__text">
            <span className="brand__name">{b.name}</span>
            <span className="brand__tagline">{b.tagline}</span>
          </span>
        </AppLink>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="primary-nav"
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="nav" id="primary-nav" aria-label="Primary">
          <ul className="nav__list">
            {(SITE.nav || []).map((item) => {
              const active = isCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <AppLink
                    className={active ? "nav__link is-active" : "nav__link"}
                    to={toRoute(item.href)}
                    {...(active ? { "aria-current": "page" } : {})}
                  >
                    {item.label}
                  </AppLink>
                </li>
              );
            })}
          </ul>
          <AppLink className="btn btn--primary btn--sm nav__cta" to="/contact">
            Get started
          </AppLink>
        </nav>
      </div>
    </header>
  );
}
