/* =============================================================================
   AppLink — one link element for the whole app
   -----------------------------------------------------------------------------
   A React Router <Link> renders exactly the same `<a href="…">` markup as a
   plain anchor, so swapping one for the other changes no markup, no class and
   no CSS. What changes is the click: <Link> intercepts it and lets the router
   swap the page in place instead of asking the server for a whole document.

   That distinction is the only thing standing between "React renders the pages"
   and "the site actually behaves like a React app", so every internal link in
   the app goes through here.

   Not every href is a route. These are handed back to the browser untouched:
     mailto: / tel:      the OS should handle them
     http(s)://          leaving the site
     //host/path         protocol-relative, also leaving the site
     #section            an anchor within the current page — the hash-scroll
                         behaviour, not the router, is responsible for it
   ========================================================================== */
import { Link } from "react-router-dom";

/* Anything with a scheme, a protocol-relative prefix or a leading `#` is not an
   app route. The scheme test is deliberately generic (`[a-z][a-z0-9+.-]*:`) so
   an unexpected scheme such as `ftp:` is treated as external rather than being
   handed to the router as if it were a path. */
function isExternal(href) {
  return !href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href);
}

/**
 * @param {object} props
 * @param {string} props.href   target, route path or absolute URL
 * @param {string} [props.to]   alias for `href`, for readability at call sites
 */
export default function AppLink({ href, to, children, ...rest }) {
  const target = to ?? href;

  if (isExternal(target)) {
    /* `to` is not a valid attribute on an anchor, so it is dropped rather than
       spread — otherwise React would warn about an unknown prop. */
    return (
      <a href={target} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={target} {...rest}>
      {children}
    </Link>
  );
}
