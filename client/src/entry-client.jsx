/* =============================================================================
   Browser entry
   -----------------------------------------------------------------------------
   Hydrates the server-rendered markup rather than re-rendering from scratch, so
   the page is interactive without discarding the HTML the server already sent.

   StrictMode is deliberately not used here. The site's interaction layer is
   imperative — it attaches observers, requestAnimationFrame loops and
   document-level listeners on mount and tears them down on unmount. StrictMode's
   development-only double-invoke would exercise that teardown path on every
   mount, which makes development behave differently from the production build
   for no gain; the cleanup is written to be correct either way.
   ========================================================================== */
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

hydrateRoot(
  document.getElementById("root"),
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
