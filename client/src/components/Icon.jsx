/* Renders one of the site's 24x24 stroke icons.
   Ported from the `icon()` helper in assets/js/main.js (L32) so the wrapper
   element and its attributes stay identical — the CSS sizes and colours these
   via the `.icon` class. */
import { ICONS } from "@/data/services.js";

/**
 * @param {object}  props
 * @param {string}  props.name       key into ICONS (see data/services.js)
 * @param {string} [props.className] defaults to "icon"; pass e.g. "icon icon--xs"
 */
export default function Icon({ name, className = "icon" }) {
  const body = ICONS[name];
  if (!body) return null;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      /* The path data is static, trusted artwork authored in data.js — it is not
         user input, and keeping it as markup avoids re-parsing hundreds of path
         strings into elements. */
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
