/* Fixed-position chrome that the static site injected into <body> from
   `buildChrome()` in assets/js/main.js (L718): the reading-progress rail and the
   back-to-top button.

   Rendered by React instead of created by the interaction layer so that the
   server-rendered HTML already contains them — which means the scroll behaviours
   find them immediately, and there is no flash of a missing button. The button
   is hidden by CSS (`.to-top`, opacity 0) until the scroll hub adds
   `.is-visible`, so rendering it up front is safe. */

export function ScrollRail() {
  return <div className="scroll-rail" aria-hidden="true" />;
}

export function ToTop() {
  return (
    <button className="to-top" type="button" data-to-top="" aria-label="Back to top">
      <svg className="to-top__ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" />
      </svg>
      <svg
        className="to-top__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}

export default function Chrome() {
  return (
    <>
      <ScrollRail />
      <ToTop />
    </>
  );
}
