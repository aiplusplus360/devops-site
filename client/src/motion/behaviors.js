/* =============================================================================
   MOTION BEHAVIOURS
   -----------------------------------------------------------------------------
   The interaction / animation half of the original assets/js/main.js, ported
   into a framework-agnostic ES module. The React app owns all rendering; this
   module only wires behaviours onto DOM that already exists — the same class
   names, data-* attributes and inline CSS custom properties the stylesheet was
   written against. The DOM contract must not change: styles.css ships
   byte-for-byte and a visual regression here is a failure.

   Two entry points, split by lifetime:

     mountGlobal()  Runs once for the app: the custom cursor, back-to-top, the
                    scroll-hub rAF loop and the delegated pointer spotlight.
                    These are document/window-level and do not care which page
                    is showing, so re-running them on every navigation would
                    only restart the cursor and re-add listeners.

     mountPage()    Runs whenever the rendered page changes: parallax tagging,
                    reveal, unmask, count-up, hash scroll, scroll spy, nav and
                    the contact form. React has swapped the DOM, so these
                    genuinely must re-observe.

   Both return a cleanup function that removes every listener, observer, rAF
   and timer they registered, plus anything they injected.

   SSR: nothing in this file touches window/document/navigator/matchMedia at
   module scope, and nothing runs on import. Every DOM access lives inside the
   two mount functions, which are also guarded for a document-less environment.
   ========================================================================== */

import { SITE } from "@/data/site.js";
import { SERVICES } from "@/data/services.js";

/* ------------------------------------------------------------- HELPERS -- */
function $(sel, root) {
  return (root || document).querySelector(sel);
}
function $$(sel, root) {
  return Array.from((root || document).querySelectorAll(sel));
}
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
/* Escape untrusted-ish strings before injecting as HTML. */
function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* Rebuilds a stat string from the spec parsed out of data-count-* attributes.
   The final frame writes the configured value verbatim. */
function formatStat(spec, value) {
  let n = value.toFixed(spec.decimals);
  if (spec.grouped) n = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return spec.prefix + n + spec.suffix;
}

/* --------------------------------------------------- CROSS-MOUNT BRIDGES -- */
/* The original hung these off `window` (`__sweepReveals`, `__sweepUnmask`) and
   captured `.parallax` containers once inside the scroll hub. Neither survives
   a React navigation cleanly, so they are module state instead: the page half
   refreshes them on every mount and the global half reads them. */

/* Sweeps exposed by wireReveal / wireUnmask so wireHashScroll can settle a
   section after a deep link. Both live in mountPage, so they always resolve
   before wireHashScroll runs. */
let sweepReveals = null;
let sweepUnmask = null;

/* Containers tagged by tagParallax, read each frame by the global scroll hub.
   Refreshed on every page mount so navigation hands over a fresh list. */
let parallaxPlanes = [];

/* Lets the page half ask the global scroll hub for an immediate frame, so the
   rail / header state are correct right after a navigation without a scroll. */
let refreshScrollFrame = null;

/* ======================================================== APP LIFETIME ==== */

/** Runs once for the lifetime of the app: the cursor, back-to-top, the scroll
 *  hub rAF loop, the delegated spotlight. Document/window level listeners that
 *  do not depend on which page is showing. */
export function mountGlobal() {
  if (typeof document === "undefined") return () => {};

  const cleanups = [
    wireCursor(),
    wireToTop(),
    wireScrollHub(),
    wireSpotlight(),
  ];

  return () => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]();
  };
}

/* ---------------------------------------------------------- CUSTOM CURSOR -- */
/* A dot pinned exactly to the pointer, with a ring that eases along behind
   it. Opt out with SITE.cursor.enabled = false; skipped entirely for touch
   input and for reduced-motion users, in which case the system cursor is left
   completely alone. */
function wireCursor() {
  const cfg = SITE.cursor || {};
  if (cfg.enabled === false) return () => {};

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduce.matches) return () => {};

  const layer = el("div", "cursor");
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML =
    '<div class="cursor__ring"><i></i></div>' +
    '<div class="cursor__dot"><i></i></div>';
  document.body.appendChild(layer);

  const dot = $(".cursor__dot", layer);
  const ring = $(".cursor__ring", layer);
  document.documentElement.classList.add("has-cursor");

  let tx = 0, ty = 0;        /* where the pointer is */
  let rx = 0, ry = 0;        /* where the ring has eased to */
  let started = false;       /* suppress it until the pointer first moves */
  let running = false;
  let raf = 0;

  /* Anything clickable, plus the large interactive surfaces. */
  const HOT = "a, button, summary, select, label, [role='button'], " +
    ".btn, .card, .tech-tile, .faq summary, .nav__link, .to-top";

  function place(node, x, y) {
    node.style.transform =
      "translate3d(" + x + "px," + y + "px,0) translate(-50%,-50%)";
  }

  function loop() {
    /* The ring eases toward the pointer; the dot is written exactly, so the
       thing you aim with never lags behind where you actually are. */
    rx += (tx - rx) * 0.18;
    ry += (ty - ry) * 0.18;
    place(ring, rx, ry);
    /* Stop once it has all but caught up, rather than burning a frame every
       16ms while the pointer sits still. */
    if (Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1) {
      raf = requestAnimationFrame(loop);
    } else {
      running = false;
      rx = tx;
      ry = ty;
      place(ring, rx, ry);
    }
  }
  function kick() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function onMove(e) {
    if (e.pointerType === "touch") return;

    /* The pointer is reported just outside the viewport as it leaves through
       an edge. Treat that as "gone" and never pin the ring to the boundary.
       This is checked on every move so visibility is derived from a value we
       can actually see, rather than depending on a leave event arriving. */
    if (e.clientX < 0 || e.clientY < 0 ||
        e.clientX > window.innerWidth || e.clientY > window.innerHeight) {
      hide();
      return;
    }

    tx = e.clientX;
    ty = e.clientY;
    place(dot, tx, ty);

    /* Any move means we are inside, so make sure we are showing. Cheap, and
       it means the cursor can never end up stranded invisible. */
    started = true;
    layer.classList.add("is-live");

    const t = e.target;
    let field = t && t.closest ? t.closest("input, textarea") : null;
    /* A checkbox or radio is clickable, not text — don't hand those a caret. */
    if (field && field.tagName === "INPUT") {
      const type = (field.getAttribute("type") || "text").toLowerCase();
      if (type === "checkbox" || type === "radio" || type === "range" ||
          type === "file" || type === "color" || type === "submit" ||
          type === "button" || type === "reset") field = null;
    }
    const hot = t && t.closest ? t.closest(HOT) : null;

    layer.classList.toggle("is-text", !!field);
    layer.classList.toggle("is-active", !field && !!hot);
    kick();
  }

  function onDown() { layer.classList.add("is-down"); }
  function onUp() { layer.classList.remove("is-down"); }
  function onDownShow() { onDown(); show(); }
  function hide() {
    /* Hide rather than leave a ring frozen where the pointer left. The next
       move brings it straight back. */
    layer.classList.remove("is-live", "is-down");
  }
  /* Only meaningful once the pointer's position is actually known — before
     the first move there is nowhere correct to draw it. */
  function show() { if (started) layer.classList.add("is-live"); }

  /* Fires only when the pointer leaves the document entirely (no element is
     entered), which is the reliable signal for a real leave. */
  function onOut(e) { if (!e.relatedTarget) hide(); }

  /* If reduced motion is switched on mid-session, hand the cursor back. */
  function onPrefChange(e) {
    if (e.matches) teardown();
  }
  function teardown() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (layer.parentNode) layer.parentNode.removeChild(layer);
    document.documentElement.classList.remove("has-cursor");
    if (reduce.removeEventListener) reduce.removeEventListener("change", onPrefChange);
    else if (reduce.removeListener) reduce.removeListener(onPrefChange);
  }

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerdown", onDownShow);
  document.addEventListener("pointerup", onUp);
  document.addEventListener("pointercancel", onUp);
  document.addEventListener("mouseout", onOut);
  window.addEventListener("blur", hide);
  if (reduce.addEventListener) reduce.addEventListener("change", onPrefChange);
  else if (reduce.addListener) reduce.addListener(onPrefChange);

  return () => {
    document.removeEventListener("pointermove", onMove, { passive: true });
    document.removeEventListener("pointerdown", onDownShow);
    document.removeEventListener("pointerup", onUp);
    document.removeEventListener("pointercancel", onUp);
    document.removeEventListener("mouseout", onOut);
    window.removeEventListener("blur", hide);
    /* teardown also drops the preference listener, the rAF, the injected
       layer and the has-cursor class; it is a no-op if already torn down. */
    teardown();
  };
}

/* ---------------------------------------------------------- BACK TO TOP -- */
function wireToTop() {
  const btn = $("[data-to-top]");
  if (!btn) return () => {};

  function onClick() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    /* keyboard focus should not be left stranded at the bottom of the page */
    const brand = $(".brand");
    if (brand) brand.focus({ preventScroll: true });
  }

  btn.addEventListener("click", onClick);
  return () => btn.removeEventListener("click", onClick);
}

/* ------------------------------------------------ SCROLL DRIVER (1) ---- */
/* Every scroll-driven effect reads from this one rAF-throttled handler. One
   listener, one layout read per frame, no competing scroll callbacks. */
function wireScrollHub() {
  const header = $("[data-header]");
  const rail = $(".scroll-rail");
  const toTop = $(".to-top");
  const ring = $(".to-top__ring");
  const RING_LEN = 2 * Math.PI * 22;   /* r=22, matches the SVG above */
  const AMP = 20;                      /* px of parallax travel, each way */
  let queued = false;
  let armedAt = 0;
  let frameRaf = 0;
  let settleTimer = 0;

  /* The `.parallax` containers are tagged by the page half (tagParallax), which
     also sets the images' willChange hint. The list is module state so a React
     navigation can hand over a fresh set without restarting this loop. */

  function frame() {
    const y = window.scrollY || window.pageYOffset || 0;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const docH = document.documentElement.scrollHeight;
    const max = Math.max(1, docH - vh);
    const p = Math.min(1, Math.max(0, y / max));

    if (header) header.classList.toggle("is-stuck", y > 8);
    if (rail) rail.style.transform = "scaleX(" + p.toFixed(4) + ")";
    if (toTop) toTop.classList.toggle("is-visible", y > vh * 0.85);
    if (ring) ring.style.strokeDashoffset = (RING_LEN * (1 - p)).toFixed(2);

    /* Parallax: map each container's position in the viewport to a small
       vertical offset. Only containers actually on screen are touched. */
    const planes = parallaxPlanes;
    for (let i = 0; i < planes.length; i++) {
      const c = planes[i];
      const r = c.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) continue;
      const img = c.querySelector("img");
      if (!img) continue;
      /* 0 when the container's bottom sits at the viewport bottom,
         1 when its top reaches the viewport top. */
      let t = (vh - r.top) / (vh + r.height);
      t = Math.min(1, Math.max(0, t));
      const offset = (t - 0.5) * 2 * AMP;
      img.style.setProperty("--py", offset.toFixed(1) + "px");
    }
  }

  /* Self-healing rAF latch. If a frame never arrives — background tab, a
     throttled compositor — the next scroll re-arms it rather than the
     handler being wedged shut for the rest of the session. `force` is used by
     the page half after navigation, where no scroll event has fired. */
  function schedule(force) {
    const now = Date.now();
    if (!force && queued && now - armedAt < 250) return;
    queued = true;
    armedAt = now;
    frameRaf = requestAnimationFrame(() => {
      queued = false;
      frameRaf = 0;
      frame();
    });
  }
  function onScroll() { schedule(false); }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();
  /* Second pass after fonts/images settle, so the rail is correct on load
     for a page restored to a previous scroll position. */
  settleTimer = setTimeout(frame, 150);
  const scheduleRefresh = () => schedule(true);
  refreshScrollFrame = scheduleRefresh;

  return () => {
    window.removeEventListener("scroll", onScroll, { passive: true });
    window.removeEventListener("resize", onScroll);
    if (frameRaf) cancelAnimationFrame(frameRaf);
    frameRaf = 0;
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = 0;
    if (refreshScrollFrame === scheduleRefresh) refreshScrollFrame = null;
  };
}

/* ----------------------------------------------------- POINTER SPOTLIGHT */
/* One delegated listener for the whole document, throttled to a frame. The
   coordinates are handed to CSS as custom properties; the gradient itself
   lives in the stylesheet. Off for coarse pointers (touch), where there is
   no hover state to respond to. */
function wireSpotlight() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!fine.matches) return () => {};

  let current = null;
  let pending = null;
  let queued = false;
  let armedAt = 0;
  let raf = 0;

  function onMove(e) {
    const target = e.target && e.target.closest
      ? e.target.closest(".spot")
      : null;

    /* Leaving a card: let it settle back rather than freezing mid-glow. */
    if (current && current !== target) current = null;
    if (!target) return;

    current = target;
    pending = { el: target, x: e.clientX, y: e.clientY };

    /* Same self-healing latch as the scroll handler, so a missed frame can
       never leave the spotlight permanently unresponsive. */
    const now = Date.now();
    if (queued && now - armedAt < 250) return;
    queued = true;
    armedAt = now;
    raf = requestAnimationFrame(() => {
      queued = false;
      raf = 0;
      if (!pending) return;
      const b = pending.el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      pending.el.style.setProperty("--mx", (((pending.x - b.left) / b.width) * 100).toFixed(2) + "%");
      pending.el.style.setProperty("--my", (((pending.y - b.top) / b.height) * 100).toFixed(2) + "%");
    });
  }

  document.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    document.removeEventListener("pointermove", onMove, { passive: true });
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
}

/* ============================================================ PER PAGE ==== */

/** Runs whenever the rendered page changes: parallax tagging, reveal, unmask,
 *  count-up, hash scroll, scroll spy, nav and the contact form. These depend on
 *  the current page's DOM. */
export function mountPage() {
  if (typeof document === "undefined") return () => {};

  const cleanups = [
    tagParallax(),
    wireNav(),
    wireUnmask(),
    wireReveal(),
    wireScrollSpy(),
    wireHashScroll(),
    wireCountUp(),
    wireForm(),
  ];

  return () => {
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]();
  };
}

/* -------------------------------------------------------- PARALLAX TAG -- */
/* Marks the photo containers that should drift against the scroll. Done here
   rather than in markup so the effect is declared in one place. The global
   scroll hub reads the resulting list on its next frame. */
function tagParallax() {
  const nodes = $$(".hero__media, .band");
  nodes.forEach((n) => {
    n.classList.add("parallax");
    /* Pre-scale the photo so its drift can never expose an edge. */
    const img = n.querySelector("img");
    if (img) img.style.willChange = "transform";
  });
  parallaxPlanes = nodes;
  /* Nudge the global hub so the rail/header settle after a navigation without
     waiting for a scroll event. */
  if (refreshScrollFrame) refreshScrollFrame();

  return () => { parallaxPlanes = []; };
}

/* ---------------------------------------------------------------- NAV -- */
function wireNav() {
  const toggle = $(".nav-toggle");
  const nav = $(".nav");
  if (!toggle || !nav) return () => {};

  function close() {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
  }
  function onToggle() {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-active", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  /* Close on nav link click (mobile) */
  function onLink() { close(); }
  /* Close on Escape */
  function onKey(e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  }

  toggle.addEventListener("click", onToggle);
  const links = $$(".nav__link, .nav__cta", nav);
  links.forEach((a) => a.addEventListener("click", onLink));
  document.addEventListener("keydown", onKey);

  return () => {
    toggle.removeEventListener("click", onToggle);
    links.forEach((a) => a.removeEventListener("click", onLink));
    document.removeEventListener("keydown", onKey);
  };
}

/* ---------------------------------------------------------- HEADING WIPE -- */
/* Adds the clip-path wipe to section headings.
   Two details make this reliable, and both matter:
     1. `.unmask` clips its own visible area to nothing while hidden, and
        IntersectionObserver measures a target's *clipped* area. Observing
        the heading directly therefore reports a permanent zero intersection
        and the wipe never fires. So we observe the nearest unclipped
        container and toggle the class on the heading instead.
     2. A geometry-based scroll fallback covers anything the observer misses
        — late-injected content, deep links, a heading pinned at the very
        bottom of a short page. It removes itself once nothing is pending,
        so it costs nothing after load. */
function wireUnmask() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return () => {};

  /* Scoped to standalone section headings on purpose. The page-header title
     already has its own entrance animation, and the band heading sits inside
     a `.reveal` block that fades the whole group in — stacking a clip wipe on
     either would just be two effects fighting over the same element. These
     headings have nothing else animating them, so the wipe is a genuine
     addition here rather than a pile-on. */
  const heads = $$(".section-head .h2");
  if (!heads.length) return () => {};

  heads.forEach((h) => { h.classList.add("unmask"); });

  const pending = heads.slice();
  const hosts = [];
  const settleTimers = new Set();
  let sweepTimer = 0;
  let lastRun = 0;

  function reveal(h, instant) {
    const i = pending.indexOf(h);
    if (i !== -1) pending.splice(i, 1);
    if (h.classList.contains("is-visible")) return;
    h.classList.add("is-visible");
    /* Drop the clip once the wipe has played, so it can never interfere with
       a focus ring or a text selection later on. */
    const t = setTimeout(() => {
      h.classList.add("is-settled");
      settleTimers.delete(t);
    }, instant ? 0 : 900);
    settleTimers.add(t);
  }

  function onScreen(h) {
    const b = h.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return b.top < vh && b.bottom > 0;
  }

  /* Watch each heading through its container, which is never clipped. A
     container may hold more than one heading, so collect them in a list. */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const list = entry.target.__unmaskHeads || [];
      io.unobserve(entry.target);
      list.forEach((h) => { reveal(h); });
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });

  heads.forEach((h) => {
    const host = h.closest(".section-head") || h.parentElement || h;
    (host.__unmaskHeads = host.__unmaskHeads || []).push(h);
    hosts.push(host);
    io.observe(host);
  });

  function sweep(instant) {
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll, { passive: true });
      window.removeEventListener("resize", onScroll);
      return;
    }
    /* Deliberately more permissive than the observer: this is the net that
       catches whatever the observer didn't. */
    pending.slice().forEach((h) => { if (onScreen(h)) reveal(h, instant); });
  }
  function onScroll() {
    const now = Date.now();
    if (now - lastRun < 70) return;
    lastRun = now;
    sweep(false);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* Exposed so the hash handler can settle a section after a deep link. */
  sweepUnmask = sweep;
  sweep(false);
  sweepTimer = setTimeout(() => { sweep(false); }, 150);

  return () => {
    io.disconnect();
    window.removeEventListener("scroll", onScroll, { passive: true });
    window.removeEventListener("resize", onScroll);
    if (sweepTimer) clearTimeout(sweepTimer);
    sweepTimer = 0;
    settleTimers.forEach((t) => clearTimeout(t));
    settleTimers.clear();
    /* Detach the per-container heading lists so a remount cannot push the same
       heading onto a host twice. */
    hosts.forEach((host) => { delete host.__unmaskHeads; });
    if (sweepUnmask === sweep) sweepUnmask = null;
  };
}

/* ------------------------------------------------------------ REVEAL -- */
function wireReveal() {
  let pending = $$(".reveal");
  if (!pending.length) return () => {};

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showAll() {
    pending.forEach((n) => { n.classList.add("is-visible"); });
    pending = [];
  }
  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
    return () => {};
  }

  /* Is the element touching the viewport (with a small lead-in margin)? */
  function inView(n) {
    const b = n.getBoundingClientRect();
    const h = window.innerHeight || document.documentElement.clientHeight;
    return b.top < h + 90 && b.bottom > -90;
  }

  function reveal(n, instant) {
    if (instant) n.classList.add("is-instant");
    n.classList.add("is-visible");
    /* Guarded on purpose. The observer and the scroll sweep can both fire for
       the same element in the same frame; on the second call indexOf returns
       -1, and `splice(-1, 1)` would silently remove the *last* pending entry
       instead — orphaning an unrelated element that then stays invisible
       until the observer happens to catch it. */
    const i = pending.indexOf(n);
    if (i !== -1) pending.splice(i, 1);
  }

  /* Primary path: IntersectionObserver is cheap and handles the common case. */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        io.unobserve(entry.target);
        reveal(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  pending.forEach((n) => { io.observe(n); });

  /* Safety net. The observer above deliberately waits until an element is
     properly inside the viewport before revealing it, which means an element
     parked in the bottom sliver of the screen would sit invisible until the
     reader scrolled again. This sweep closes that gap, and also covers
     content injected after load and anchor jumps.
     It is time-throttled rather than rAF-latched on purpose: a latch can
     wedge shut if a frame never arrives (background tab, throttled
     compositor) and would then stay dead for the rest of the session. The
     work is trivial and the list shrinks to empty, after which the listeners
     remove themselves. */
  let lastRun = 0;
  function sweep(instant) {
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll, { passive: true });
      window.removeEventListener("resize", onScroll);
      return;
    }
    pending.slice().forEach((n) => { if (inView(n)) reveal(n, instant); });
  }
  function onScroll() {
    const now = Date.now();
    if (now - lastRun < 70) return;
    lastRun = now;
    sweep(false);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* Exposed so the hash handler can force a sweep after jumping. */
  sweepReveals = sweep;
  sweep(false);
  /* And once more after layout settles, in case heights shifted. */
  const sweepTimer = setTimeout(() => { sweep(false); }, 120);

  return () => {
    io.disconnect();
    window.removeEventListener("scroll", onScroll, { passive: true });
    window.removeEventListener("resize", onScroll);
    if (sweepTimer) clearTimeout(sweepTimer);
    if (sweepReveals === sweep) sweepReveals = null;
  };
}

/* ------------------------------------------------------- CATEGORY SPY -- */
/* Highlights the current category in the services jump bar. Only runs where
   those anchors exist. */
function wireScrollSpy() {
  const bar = $("[data-services-jump]");
  if (!bar || !("IntersectionObserver" in window)) return () => {};

  const links = $$("a[href^='#']", bar);
  if (!links.length) return () => {};

  const byId = {};
  const sections = [];
  links.forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    const sec = document.getElementById(id);
    if (!sec) return;
    byId[id] = a;
    sections.push(sec);
  });
  if (!sections.length) return () => {};

  /* Track how much of each section is on screen and light up the largest —
     more stable than a simple "is it intersecting" test when sections are
     taller than the viewport. */
  const ratios = {};
  function apply() {
    let best = null;
    Object.keys(ratios).forEach((id) => {
      if (ratios[id] > 0.08 && (!best || ratios[id] > ratios[best])) best = id;
    });
    links.forEach((a) => {
      const on = best && a === byId[best];
      a.classList.toggle("is-current", !!on);
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
    });
    apply();
  }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

  sections.forEach((s) => { io.observe(s); });

  return () => { io.disconnect(); };
}

/* ----------------------------------------------------------- HASH SCROLL -- */
/* Native anchor scrolling runs before React has rendered the page, so a link
   like services.html#technologies lands at the top instead of the section.
   Re-do the jump once the content actually exists. */
function wireHashScroll() {
  let cancelled = false;
  let settleTimer = 0;

  function jump(smooth) {
    if (cancelled) return;
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    /* "instant" deliberately overrides the CSS `scroll-behavior: smooth`.
       On a deep link you want to land on the section immediately, not watch
       a long animation scroll past the whole page. */
    target.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
      block: "start",
    });
    /* Reveal the landed-on section without the scroll stagger, so someone
       arriving from a link sees content straight away rather than watching
       it fade in. */
    if (sweepReveals) sweepReveals(!smooth);
    if (sweepUnmask) sweepUnmask(!smooth);
  }

  function onHashChange() { jump(true); }

  window.addEventListener("hashchange", onHashChange);

  if (location.hash) {
    jump(false);
    /* Run again after webfonts land, since metrics change and can shift the
       target back out of position. The cleanup flag stops it firing after
       the page it belongs to is gone. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { jump(false); });
    }
    /* Third pass: some sections keep growing as images/SVGs settle. */
    settleTimer = setTimeout(() => { jump(false); }, 400);
  }

  return () => {
    cancelled = true;
    window.removeEventListener("hashchange", onHashChange);
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = 0;
  };
}

/* ------------------------------------------------------- COUNT UP ---- */
/* Counts the stat numbers up when the strip scrolls into view. The last
   frame writes the original string verbatim, so the rendered result can
   never drift from what was configured. */
function wireCountUp() {
  const nodes = $$("[data-count-target]");
  if (!nodes.length) return () => {};

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const timers = new Set();
  const rafs = new Set();

  function specOf(node) {
    return {
      target: parseFloat(node.getAttribute("data-count-target")) || 0,
      prefix: node.getAttribute("data-count-prefix") || "",
      suffix: node.getAttribute("data-count-suffix") || "",
      decimals: parseInt(node.getAttribute("data-count-decimals"), 10) || 0,
      grouped: node.getAttribute("data-count-grouped") === "1",
    };
  }

  function settle(node) {
    const s = specOf(node);
    node.textContent = formatStat(s, s.target);
  }

  /* No observer (or the reader asked for less motion): just show the numbers. */
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach(settle);
    return () => {};
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      io.unobserve(node);

      const spec = specOf(node);
      /* Short stagger so four numbers don't all move in lockstep. */
      const delay = i * 90;
      const dur = 1250;
      let done = false;

      /* Writes the configured value verbatim, exactly once. */
      function finish() {
        if (done) return;
        done = true;
        node.textContent = formatStat(spec, spec.target);
      }

      const delayTimer = setTimeout(() => {
        timers.delete(delayTimer);
        let start = null;
        function step(now) {
          if (done) return;
          if (start === null) start = now;
          const t = Math.min(1, (now - start) / dur);
          /* easeOutExpo — fast off the mark, long settle. Reads as
             "confident" rather than mechanical. */
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          node.textContent = formatStat(spec, spec.target * eased);
          if (t < 1) rafs.add(requestAnimationFrame(step));
          else finish();
        }
        rafs.add(requestAnimationFrame(step));

        /* Belt and braces. If rAF is throttled — background tab, low-power
           mode, a paused compositor — the loop could stall and leave a stat
           reading a wrong number, which is the one outcome that would
           actually mislead someone. Force the true value regardless. */
        const guardTimer = setTimeout(() => {
          timers.delete(guardTimer);
          finish();
        }, dur + 250);
        timers.add(guardTimer);
      }, delay);
      timers.add(delayTimer);
    });
  }, { threshold: 0.35 });

  nodes.forEach((n) => { io.observe(n); });

  return () => {
    io.disconnect();
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
    rafs.forEach((r) => cancelAnimationFrame(r));
    rafs.clear();
  };
}

/* --------------------------------------------------------- CONTACT FORM -- */
function wireForm() {
  const form = $("[data-contact-form]");
  if (!form) return () => {};

  const status = $("[data-form-status]", form) || $("[data-form-status]");
  const submit = form.querySelector('[type="submit"]');
  const cfg = (SITE.contact && SITE.contact.form) || {};
  let injectedOption = null;

  /* Prefill service / plan from ?service= / ?plan= query string */
  const params = new URLSearchParams(location.search);
  const svc = params.get("service") || params.get("plan");
  if (svc) {
    const match = SERVICES.filter(
      (s) => s.id === svc || s.name.toLowerCase() === svc.toLowerCase()
    )[0];
    const label = match ? match.name : svc;
    const topic = form.querySelector('[name="topic"]');
    if (topic) {
      const opt = Array.from(topic.options).filter(
        (o) => o.value === label || o.textContent.trim() === label
      )[0];
      if (opt) {
        topic.value = opt.value;
      } else {
        const extra = el("option", null, esc(label));
        extra.value = label;
        topic.appendChild(extra);
        topic.value = label;
        injectedOption = extra;
      }
    }
    const msg = form.querySelector('[name="message"]');
    if (msg && !msg.value) {
      msg.value = "Hi — I'd like to talk about " + label + ".\n\nContext: ";
      msg.focus();
    }
  }

  function say(text, kind) {
    if (!status) return;
    status.textContent = text;
    status.className = "form-status" + (kind ? " form-status--" + kind : "");
    status.hidden = false;
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);

    if (!cfg.endpoint) {
      /* No backend configured — hand off to the visitor's mail client. */
      const body = [
        "Name: " + (data.get("name") || ""),
        "Email: " + (data.get("email") || ""),
        "Company: " + (data.get("company") || ""),
        "Topic: " + (data.get("topic") || ""),
        "",
        data.get("message") || "",
      ].join("\n");
      const href = "mailto:" + (cfg.fallbackEmail || SITE.contact.email) +
        "?subject=" + encodeURIComponent("New enquiry — " + (data.get("topic") || "DevOps")) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
      say("Opening your email client — if nothing happens, write to " +
          (cfg.fallbackEmail || SITE.contact.email) + ".", "ok");
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.dataset.label = submit.textContent;
      submit.textContent = "Sending…";
    }
    say("Sending…");

    fetch(cfg.endpoint, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        say("Thanks — we've got it. We usually reply within one business day.", "ok");
      })
      .catch(() => {
        say("Something went wrong. Please email " +
            (cfg.fallbackEmail || SITE.contact.email) + " instead.", "error");
      })
      .then(() => {
        if (submit) {
          submit.disabled = false;
          submit.textContent = submit.dataset.label || "Send";
        }
      });
  }

  form.addEventListener("submit", onSubmit);

  return () => {
    form.removeEventListener("submit", onSubmit);
    /* Drop the option we appended for an unmatched ?service= value, so a
       remount cannot accumulate copies. */
    if (injectedOption && injectedOption.parentNode) {
      injectedOption.parentNode.removeChild(injectedOption);
    }
  };
}
