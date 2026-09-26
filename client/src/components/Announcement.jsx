/* Thin bar above the header.
   Ported from `buildAnnouncement()` in assets/js/main.js (L89). */
import { SITE } from "@/data/site.js";
import { toRoute } from "@/lib/routes.js";
import AppLink from "./AppLink.jsx";
import Icon from "./Icon.jsx";

export default function Announcement() {
  const a = SITE.announcement || {};
  if (!a.show || !a.text) return null;

  return (
    <div className="announcement" data-announcement="">
      <div className="container announcement__inner">
        <span>{a.text}</span>
        {a.linkHref ? (
          <AppLink className="announcement__link" to={toRoute(a.linkHref)}>
            {a.linkLabel} <Icon name="compass" className="icon icon--xs" />
          </AppLink>
        ) : null}
      </div>
    </div>
  );
}
