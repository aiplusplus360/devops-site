/* The shell every page renders inside: announcement bar, header, main, footer,
   and the fixed chrome. Mirrors the element order of the static pages, with the
   JavaScript-injected chrome moved into the markup so the server can render it.

   The two motion hooks are the bridge to the ported interaction layer:
   `useGlobalMotion` installs the app-lifetime behaviours once, and
   `usePageMotion` re-installs the page-scoped ones whenever the rendered page
   changes — including on a hash change, because deep links into a long page need
   the hash-scroll behaviour to run again after the new DOM exists. */
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Announcement from "@/components/Announcement.jsx";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import Chrome from "@/components/Chrome.jsx";
import { useGlobalMotion, usePageMotion } from "@/motion/useMotion.js";
import { pageNameFor } from "@/lib/routes.js";

export default function Layout({ children }) {
  const { pathname, hash } = useLocation();
  /* Tracks whether the scroll effect below has run yet. */
  const hydrated = useRef(false);

  useGlobalMotion();
  usePageMotion(`${pathname}${hash}`);

  /* Client-side routing does not move the viewport the way a document load
     does, so a reader who clicks a footer link from halfway down a long page
     would otherwise land halfway down the next one. A real navigation would
     have scrolled to the top; this restores that.

     Two cases are left alone. The first run is skipped because it is hydration,
     not navigation — the browser has already decided where the reader should
     be, and scrolling here would fight a deep link. And when the URL carries a
     hash, the hash-scroll behaviour in mountPage owns the scroll position, so
     this must not race it. mountPage's effect is declared above and therefore
     runs first, which is what keeps a `/#free-offer` style link landing on the
     right section. */
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  /* The static pages carried a data-page attribute on <body>. Nothing in the
     stylesheet depends on it, but it is cheap to keep and useful for analytics
     and debugging. Derived from the path so it cannot fall out of sync. */
  const page = pageNameFor(pathname);
  useEffect(() => {
    document.body.setAttribute("data-page", page);
  }, [page]);

  return (
    <>
      <Announcement />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Chrome />
    </>
  );
}
