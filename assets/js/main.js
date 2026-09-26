/* =============================================================================
   SITE RUNTIME
   -----------------------------------------------------------------------------
   Renders content from config.js + data.js, then wires up interactions.
   You should not need to edit this file to change content.
   ========================================================================== */

(function () {
  "use strict";

  var SITE = window.SITE || {};
  var SERVICES = window.SERVICES || [];
  var ICONS = window.ICONS || {};

  /* ------------------------------------------------------------- HELPERS -- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
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
  function icon(name, cls) {
    var body = ICONS[name];
    if (!body) return "";
    return '<svg class="' + (cls || "icon") + '" viewBox="0 0 24 24" fill="none" ' +
           'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" ' +
           'stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  /* ------------------------------------------------- BRAND / GLOBAL FILL -- */
  function paintBrand() {
    var b = SITE.brand || {};
    var c = SITE.contact || {};

    $$("[data-brand-name]").forEach(function (n) { n.textContent = b.name || ""; });
    $$("[data-brand-monogram]").forEach(function (n) { n.textContent = b.monogram || ""; });
    $$("[data-brand-tagline]").forEach(function (n) { n.textContent = b.tagline || ""; });
    $$("[data-legal-name]").forEach(function (n) { n.textContent = b.legalName || b.name || ""; });

    $$("[data-email]").forEach(function (n) {
      n.textContent = c.email || "";
      if (n.tagName === "A") n.setAttribute("href", "mailto:" + (c.email || ""));
    });
    $$("[data-phone]").forEach(function (n) {
      n.textContent = c.phone || "";
      if (n.tagName === "A") n.setAttribute("href", "tel:" + (c.phoneHref || ""));
    });
    $$("[data-location]").forEach(function (n) {
      var loc = c.location || {};
      n.textContent = [loc.city, loc.region].filter(Boolean).join(", ");
    });
    $$("[data-hours]").forEach(function (n) { n.textContent = c.hours || ""; });

    /* Year stamp */
    $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

    /* Optional CTA links that may be empty in config */
    if (c.calendly) {
      $$("[data-calendly]").forEach(function (n) {
        n.setAttribute("href", c.calendly);
        n.removeAttribute("hidden");
      });
    }
    if (c.whatsapp) {
      $$("[data-whatsapp]").forEach(function (n) {
        n.setAttribute("href", "https://wa.me/" + c.whatsapp);
        n.removeAttribute("hidden");
      });
    }

    /* Meta description */
    var md = $('meta[name="description"]');
    if (md && !md.getAttribute("content") && b.description) {
      md.setAttribute("content", b.description);
    }
  }

  /* --------------------------------------------------------- ANNOUNCEMENT -- */
  function buildAnnouncement() {
    var host = $("[data-announcement]");
    if (!host) return;
    var a = SITE.announcement || {};
    if (!a.show || !a.text) { host.remove(); return; }
    host.innerHTML =
      '<div class="container announcement__inner">' +
        "<span>" + esc(a.text) + "</span>" +
        (a.linkHref
          ? '<a class="announcement__link" href="' + esc(a.linkHref) + '">' +
            esc(a.linkLabel) + " " + icon("compass", "icon icon--xs") + "</a>"
          : "") +
      "</div>";
  }

  /* ------------------------------------------------------------- HEADER -- */
  function buildHeader() {
    var header = $("[data-header]");
    if (!header) return;
    var b = SITE.brand || {};
    var page = document.body.getAttribute("data-page") || "";
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var navHtml = (SITE.nav || []).map(function (item) {
      var isActive = item.href.toLowerCase() === here ||
        (item.href === "services.html" && page === "services");
      return '<li><a class="nav__link' + (isActive ? " is-active" : "") +
        '" href="' + esc(item.href) + '"' + (isActive ? ' aria-current="page"' : "") +
        ">" + esc(item.label) + "</a></li>";
    }).join("");

    header.innerHTML =
      '<div class="container header__inner">' +
        '<a class="brand" href="index.html" aria-label="' + esc(b.name) + ' home">' +
          '<span class="brand__mark" aria-hidden="true"><span data-brand-monogram></span></span>' +
          '<span class="brand__text">' +
            '<span class="brand__name" data-brand-name></span>' +
            '<span class="brand__tagline" data-brand-tagline></span>' +
          "</span>" +
        "</a>" +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Toggle navigation">' +
          "<span></span><span></span><span></span>" +
        "</button>" +
        '<nav class="nav" id="primary-nav" aria-label="Primary">' +
          "<ul class=\"nav__list\">" + navHtml + "</ul>" +
          '<a class="btn btn--primary btn--sm nav__cta" href="contact.html">Get started</a>' +
        "</nav>" +
      "</div>";
  }

  /* ------------------------------------------------------------- FOOTER -- */
  function buildFooter() {
    var footer = $("[data-footer]");
    if (!footer) return;
    var b = SITE.brand || {};
    var c = SITE.contact || {};

    var socialHtml = (SITE.socials || []).map(function (s) {
      return '<a class="social" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" ' +
        'aria-label="' + esc(s.label) + '">' +
        (ICONS[s.icon] ? icon(s.icon) : esc(s.label.charAt(0))) + "</a>";
    }).join("");

    var serviceLinks = SERVICES.slice(0, 6).map(function (s) {
      return '<li><a href="services.html#' + esc(s.id) + '">' + esc(s.name) + "</a></li>";
    }).join("");

    footer.innerHTML =
      '<div class="container footer__grid">' +
        "<div class=\"footer__col footer__col--brand\">" +
          '<a class="brand brand--footer" href="index.html">' +
            '<span class="brand__mark" aria-hidden="true"><span data-brand-monogram></span></span>' +
            '<span class="brand__text"><span class="brand__name" data-brand-name></span></span>' +
          "</a>" +
          '<p class="footer__blurb">' + esc(b.description || "") + "</p>" +
          '<div class="socials">' + socialHtml + "</div>" +
        "</div>" +
        "<div class=\"footer__col\">" +
          "<h3>Services</h3><ul>" + serviceLinks + "</ul>" +
        "</div>" +
        "<div class=\"footer__col\">" +
          "<h3>Company</h3><ul>" +
            '<li><a href="about.html">How we work</a></li>' +
            '<li><a href="services.html">All services</a></li>' +
            '<li><a href="contact.html">Contact</a></li>' +
            '<li><a href="index.html#faq">FAQ</a></li>' +
          "</ul>" +
        "</div>" +
        "<div class=\"footer__col\">" +
          "<h3>Get in touch</h3>" +
          '<ul class="footer__contact">' +
            '<li><a data-email href="#"></a></li>' +
            '<li><a data-phone href="#"></a></li>' +
            '<li><span data-location></span></li>' +
          "</ul>" +
        "</div>" +
      "</div>" +
      '<div class="container footer__bottom">' +
        "<p>&copy; <span data-year></span> <span data-legal-name></span>. All rights reserved.</p>" +
        '<p class="footer__note">Built and run on the same pipelines we sell.</p>' +
      "</div>";
  }

  /* ----------------------------------------------------- SERVICES RENDER -- */
  function serviceCard(s, index) {
    return '' +
      '<article class="card service-card spot reveal" id="' + esc(s.id) + '" style="--i:' + index + '">' +
        '<div class="service-card__top">' +
          '<span class="service-card__icon">' + icon(s.icon) + "</span>" +
          '<span class="pill">' + esc(s.category) + "</span>" +
        "</div>" +
        "<h3>" + esc(s.name) + "</h3>" +
        '<p class="service-card__summary">' + esc(s.summary) + "</p>" +
        '<ul class="checklist">' +
          (s.bullets || []).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") +
        "</ul>" +
        '<a class="link-arrow" href="contact.html?service=' + encodeURIComponent(s.id) + '">' +
          "Talk to us about this" + icon("compass", "icon icon--xs") +
        "</a>" +
      "</article>";
  }

  /* Groups services by category, in CATEGORY_ORDER, each with a jump nav. */
  function renderServices() {
    var full = $("[data-services-full]");
    if (full) {
      var order = window.CATEGORY_ORDER || [];
      var groups = {};

      SERVICES.forEach(function (s) {
        var key = s.category || "Other";
        (groups[key] = groups[key] || []).push(s);
      });

      /* Any category not listed in CATEGORY_ORDER still gets rendered, at the end. */
      Object.keys(groups).forEach(function (k) {
        if (order.indexOf(k) === -1) order = order.concat([k]);
      });

      var jump = '';
      var sections = '';

      order.forEach(function (cat) {
        var list = groups[cat];
        if (!list || !list.length) return;
        var slug = "cat-" + cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

        jump += '<a class="tag" href="#' + slug + '">' + esc(cat) +
          ' <span class="dim">' + list.length + "</span></a>";

        sections +=
          '<section class="service-group" id="' + slug + '" aria-labelledby="' + slug + '-h">' +
            '<div class="service-group__head">' +
              '<h2 class="h3" id="' + slug + '-h">' + esc(cat) + "</h2>" +
              '<span class="service-group__count">' + list.length + " services</span>" +
            "</div>" +
            '<div class="grid grid--auto">' +
              /* Delay resets per group, so a card never waits more than ~440ms
                 after scrolling into view. */
              list.map(function (s, i) { return serviceCard(s, i); }).join("") +
            "</div>" +
          "</section>";
      });

      var jumpHost = $("[data-services-jump]");
      if (jumpHost) jumpHost.innerHTML = jump;

      var countHost = $("[data-services-count]");
      if (countHost) countHost.textContent = SERVICES.length;

      full.innerHTML = sections;
    }

    var featured = $("[data-services-featured]");
    if (featured) {
      var list = SERVICES.filter(function (s) { return s.featured; });
      if (!list.length) list = SERVICES;
      featured.innerHTML = list.slice(0, 9).map(serviceCard).join("");
    }
  }

  /* -------------------------------------------------- TOPIC SELECT OPTIONS -- */
  function renderTopics() {
    var sel = $("[data-topic-options]");
    if (!sel) return;
    var opts = ['<option value="">Select a topic…</option>'];
    SERVICES.forEach(function (s) {
      opts.push('<option value="' + esc(s.name) + '">' + esc(s.name) + "</option>");
    });
    opts.push('<option value="Something else">Something else / not sure yet</option>');
    sel.innerHTML = opts.join("");
  }

  /* ------------------------------------------------------- FREE OFFER --- */
  function renderOffer() {
    var host = $("[data-offer]");
    if (!host) return;

    var o = SITE.offer || {};
    if (!o.enabled) { var sec = host.closest("section"); (sec || host).remove(); return; }

    var items = (o.deliverables || []).map(function (d, i) {
      return '<div class="offer__item spot reveal" style="--i:' + i + '">' +
        '<span class="offer__item-icon">' + icon(d.icon) + "</span>" +
        "<h3>" + esc(d.title) + "</h3>" +
        "<p>" + esc(d.text) + "</p>" +
      "</div>";
    }).join("");

    host.innerHTML =
      '<div class="offer">' +
        '<div class="offer__inner">' +
          '<div class="offer__head">' +
            '<span class="offer__badge">' + icon("sparkles") + esc(o.badge) + "</span>" +
            '<h2 class="offer__title">' + esc(o.title) + "</h2>" +
            '<p class="offer__intro">' + esc(o.intro) + "</p>" +
          "</div>" +
          '<div class="offer__grid">' + items + "</div>" +
          '<div class="offer__foot">' +
            '<span class="offer__scarcity">' + esc(o.scarcity) + "</span>" +
            '<div class="offer__actions">' +
              '<a class="btn btn--primary btn--lg" href="' + esc(o.ctaHref || "contact.html") + '">' +
                esc(o.ctaLabel || "Get started") + "</a>" +
              (o.secondaryHref
                ? '<a class="btn btn--ghost btn--lg" href="' + esc(o.secondaryHref) + '">' +
                  esc(o.secondaryLabel) + "</a>"
                : "") +
            "</div>" +
          "</div>" +
          '<p class="offer__fine">' + esc(o.guarantee) + " " + esc(o.fine) + "</p>" +
        "</div>" +
      "</div>";
  }

  /* -------------------------------------------------- TECHNOLOGY LOGOS -- */
  /* Turn "#FF9900" into "255,153,0" so we can build a soft tint with rgb(). */
  function hexToRgb(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ].join(",");
  }

  function techTile(t, index, opts) {
    opts = opts || {};
    var rgb = hexToRgb(t.color);
    var style = "--i:" + index;
    if (rgb) {
      style += "; --brand:#" + String(t.color).replace("#", "") +
        "; --brand-soft: rgba(" + rgb + ", 0.10)";
    }
    /* Accept either inline SVG or a file path, so official assets can be
       dropped in later without touching the renderer. */
    var mark = t.file
      ? '<img src="' + esc(t.file) + '" alt="" width="36" height="36" loading="lazy">'
      : '<svg viewBox="0 0 24 24" role="img" aria-label="' + esc(t.name) + ' logo" ' +
        'focusable="false">' + (t.svg || "") + "</svg>";

    /* Inside a marquee the tile is permanently in view and already moving, so
       the scroll reveal would fight the track animation. Skip it there. */
    var cls = "tech-tile spot" + (opts.noReveal ? "" : " reveal");

    return '<div class="' + cls + '" style="' + style + '">' +
      '<span class="tech-tile__mark">' + mark + "</span>" +
      '<span class="tech-tile__name">' + esc(t.name) + "</span>" +
      (t.note ? '<span class="tech-tile__note">' + esc(t.note) + "</span>" : "") +
    "</div>";
  }

  /* A seamless marquee row. The content is emitted twice and the track is
     translated by exactly -50%, which loops perfectly — provided the two
     halves are identical in width. The item spacing therefore lives as a
     margin on each tile rather than a flex `gap`, so no extra gutter creeps
     in between the halves and makes the loop visibly jump. */
  function marqueeRow(list, reverse) {
    var half = list.map(function (t, i) {
      return techTile(t, i, { noReveal: true });
    }).join("");
    return '<div class="marquee' + (reverse ? " marquee--reverse" : "") + '">' +
      '<div class="marquee__track">' +
        '<div class="marquee__group">' + half + "</div>" +
        /* Second half is a visual duplicate; hide it from screen readers so
           the list isn't announced twice. */
        '<div class="marquee__group" aria-hidden="true">' + half + "</div>" +
      "</div>" +
    "</div>";
  }

  function renderTech() {
    var TECH = window.TECHNOLOGIES || [];

    /* Homepage: two counter-scrolling marquee rows, so the logo wall reads as
       something alive rather than a static grid. Hover or tab focus pauses it;
       reduced-motion collapses it to a scrollable strip (see styles.css). */
    var marquee = $("[data-tech-marquee]");
    if (marquee) {
      var picks = TECH.filter(function (t) { return t.featured; });
      if (!picks.length) picks = TECH;
      var half = Math.ceil(picks.length / 2);
      marquee.innerHTML =
        marqueeRow(picks.slice(0, half), false) +
        marqueeRow(picks.slice(half), true);
    }

    /* Legacy flat strip, still supported if a page uses it. */
    var strip = $("[data-tech-strip]");
    if (strip) {
      var list = TECH.filter(function (t) { return t.featured; });
      if (!list.length) list = TECH;
      strip.innerHTML = list.map(function (t, i) { return techTile(t, i); }).join("");
    }

    /* Services page: grouped, complete list. */
    var full = $("[data-tech-full]");
    if (!full) return;

    var order = window.TECH_GROUP_ORDER || [];
    var groups = {};
    TECH.forEach(function (t) {
      var k = t.group || "Other";
      (groups[k] = groups[k] || []).push(t);
    });
    Object.keys(groups).forEach(function (k) {
      if (order.indexOf(k) === -1) order = order.concat([k]);
    });

    var out = "";
    order.forEach(function (g) {
      var list = groups[g];
      if (!list || !list.length) return;
      out += '<div class="tech-group">' +
        '<h3 class="tech-group__head">' + esc(g) + "</h3>" +
        '<div class="tech-grid">' +
          /* Explicit wrapper: Array.map would pass the index array as `opts`. */
          list.map(function (t, i) { return techTile(t, i); }).join("") +
        "</div>" +
      "</div>";
    });
    full.innerHTML = out;

    var count = $("[data-tech-count]");
    if (count) count.textContent = TECH.length;
  }

  /* -------------------------------------------------------- PROCESS ETC. -- */
  function renderProcess() {
    var host = $("[data-process]");
    if (!host || !window.PROCESS) return;
    host.innerHTML = window.PROCESS.map(function (p, i) {
      return '<li class="step reveal" style="--i:' + i + '">' +
        '<span class="step__num">' + esc(p.step) + "</span>" +
        '<h3 class="step__title">' + esc(p.title) + "</h3>" +
        '<p class="step__text">' + esc(p.text) + "</p>" +
      "</li>";
    }).join("");
  }

  /* The stats are the one place on the site where numbers carry the argument,
     so they count up. The target is split into prefix / number / suffix once,
     here, and the final frame reproduces the original string exactly — so the
     markup never disagrees with what the config author wrote. */
  function parseStat(raw) {
    var m = String(raw).match(/^(\D*?)([\d][\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    var num = parseFloat(m[2].replace(/,/g, ""));
    if (!isFinite(num)) return null;
    var dot = m[2].indexOf(".");
    return {
      prefix: m[1],
      suffix: m[3],
      target: num,
      decimals: dot === -1 ? 0 : m[2].length - dot - 1,
      grouped: m[2].indexOf(",") !== -1,
    };
  }

  function formatStat(spec, value) {
    var n = value.toFixed(spec.decimals);
    if (spec.grouped) n = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return spec.prefix + n + spec.suffix;
  }

  function renderStats() {
    var host = $("[data-stats]");
    if (!host) return;
    var stats = SITE.stats || [];
    if (!stats.length) { var sec = host.closest("section"); (sec || host).remove(); return; }
    host.innerHTML = stats.map(function (s, i) {
      var spec = parseStat(s.value);
      /* Rendered at zero and counted up when scrolled into view. If the value
         isn't a number we can animate, print it verbatim. */
      var shown = spec ? formatStat(spec, 0) : s.value;
      var attrs = spec
        ? ' data-count-target="' + spec.target + '"' +
          ' data-count-prefix="' + esc(spec.prefix) + '"' +
          ' data-count-suffix="' + esc(spec.suffix) + '"' +
          ' data-count-decimals="' + spec.decimals + '"' +
          (spec.grouped ? ' data-count-grouped="1"' : "")
        : "";
      return '<div class="stat reveal" style="--i:' + i + '">' +
        '<span class="stat__value"' + attrs + ">" + esc(shown) + "</span>" +
        '<span class="stat__label">' + esc(s.label) + "</span>" +
      "</div>";
    }).join("");
  }

  function renderTestimonials() {
    var host = $("[data-testimonials]");
    if (!host) return;
    var list = window.TESTIMONIALS || [];
    if (!list.length) { var sec = host.closest("section"); (sec || host).remove(); return; }
    host.innerHTML = list.map(function (t, i) {
      return '<figure class="quote card reveal" style="--i:' + i + '">' +
        '<div class="quote__mark" aria-hidden="true">&ldquo;</div>' +
        "<blockquote>" + esc(t.quote) + "</blockquote>" +
        "<figcaption>" +
          '<span class="quote__avatar" aria-hidden="true">' + esc(t.name.charAt(0)) + "</span>" +
          "<span><strong>" + esc(t.name) + "</strong>" +
          "<small>" + esc(t.role) + (t.company ? " · " + esc(t.company) : "") + "</small></span>" +
        "</figcaption>" +
      "</figure>";
    }).join("");
  }

  function renderFaqs() {
    var host = $("[data-faqs]");
    if (!host || !window.FAQS) return;
    host.innerHTML = window.FAQS.map(function (f, i) {
      return '<details class="faq reveal"' + (i === 0 ? " open" : "") + ">" +
        "<summary>" + esc(f.q) + '<span class="faq__chevron" aria-hidden="true"></span></summary>' +
        '<div class="faq__body"><p>' + esc(f.a) + "</p></div>" +
      "</details>";
    }).join("");
  }

  function renderPlans() {
    var host = $("[data-plans]");
    if (!host || !window.PLANS) return;
    host.innerHTML = window.PLANS.map(function (p, i) {
      return '<article class="plan card spot reveal' + (p.highlight ? " plan--featured" : "") +
        '" style="--i:' + i + '">' +
        (p.highlight ? '<span class="plan__badge">Most popular</span>' : "") +
        '<h3 class="plan__name">' + esc(p.name) + "</h3>" +
        '<p class="plan__tagline">' + esc(p.tagline) + "</p>" +
        '<p class="plan__price"><strong>' + esc(p.price) + "</strong><span>" + esc(p.note) + "</span></p>" +
        '<ul class="checklist">' +
          p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") +
        "</ul>" +
        '<a class="btn ' + (p.highlight ? "btn--primary" : "btn--ghost") +
          ' btn--block" href="contact.html?plan=' + encodeURIComponent(p.name) + '">' +
          esc(p.cta) + "</a>" +
      "</article>";
    }).join("");
  }

  /* ------------------------------------------------------- INTERACTIONS -- */
  function wireNav() {
    var toggle = $(".nav-toggle");
    var nav = $(".nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    /* Close on nav link click (mobile) */
    $$(".nav__link, .nav__cta", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    /* Close on Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------ CUSTOM CURSOR -- */
  /* A dot pinned exactly to the pointer, with a ring that eases along behind
     it. Opt out with SITE.cursor.enabled = false; skipped entirely for touch
     input and for reduced-motion users, in which case the system cursor is left
     completely alone. */
  function wireCursor() {
    var cfg = SITE.cursor || {};
    if (cfg.enabled === false) return;

    var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    var layer = el("div", "cursor");
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML =
      '<div class="cursor__ring"><i></i></div>' +
      '<div class="cursor__dot"><i></i></div>';
    document.body.appendChild(layer);

    var dot = $(".cursor__dot", layer);
    var ring = $(".cursor__ring", layer);
    document.documentElement.classList.add("has-cursor");

    var tx = 0, ty = 0;        /* where the pointer is */
    var rx = 0, ry = 0;        /* where the ring has eased to */
    var started = false;       /* suppress it until the pointer first moves */
    var running = false;
    var raf = 0;

    /* Anything clickable, plus the large interactive surfaces. */
    var HOT = "a, button, summary, select, label, [role='button'], " +
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
        place(ring, rx = tx, ry = ty);
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

      var t = e.target;
      var field = t && t.closest ? t.closest("input, textarea") : null;
      /* A checkbox or radio is clickable, not text — don't hand those a caret. */
      if (field && field.tagName === "INPUT") {
        var type = (field.getAttribute("type") || "text").toLowerCase();
        if (type === "checkbox" || type === "radio" || type === "range" ||
            type === "file" || type === "color" || type === "submit" ||
            type === "button" || type === "reset") field = null;
      }
      var hot = t && t.closest ? t.closest(HOT) : null;

      layer.classList.toggle("is-text", !!field);
      layer.classList.toggle("is-active", !field && !!hot);
      kick();
    }

    function onDown() { layer.classList.add("is-down"); }
    function onUp() { layer.classList.remove("is-down"); }
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

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", function () { onDown(); show(); });
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("blur", hide);

    /* If reduced motion is switched on mid-session, hand the cursor back. */
    function onPrefChange(e) {
      if (e.matches) teardown();
    }
    function teardown() {
      if (raf) cancelAnimationFrame(raf);
      if (layer.parentNode) layer.parentNode.removeChild(layer);
      document.documentElement.classList.remove("has-cursor");
      if (reduce.removeEventListener) reduce.removeEventListener("change", onPrefChange);
      else if (reduce.removeListener) reduce.removeListener(onPrefChange);
    }
    if (reduce.addEventListener) reduce.addEventListener("change", onPrefChange);
    else if (reduce.addListener) reduce.addListener(onPrefChange);
  }

  /* ------------------------------------------------------- SITE CHROME -- */
  /* Reading rail + back-to-top, injected rather than hand-written into five
     HTML files so they can never drift out of sync. */
  function buildChrome() {
    if (!$(".scroll-rail")) {
      var rail = el("div", "scroll-rail");
      rail.setAttribute("aria-hidden", "true");
      document.body.appendChild(rail);
    }

    if (!$(".to-top")) {
      var btn = el("button", "to-top");
      btn.type = "button";
      btn.setAttribute("data-to-top", "");
      btn.setAttribute("aria-label", "Back to top");
      btn.innerHTML =
        '<svg class="to-top__ring" viewBox="0 0 48 48" aria-hidden="true">' +
          '<circle cx="24" cy="24" r="22"></circle>' +
        "</svg>" +
        '<svg class="to-top__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
          'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>' +
        "</svg>";
      document.body.appendChild(btn);
    }
  }

  /* ------------------------------------------------ SCROLL DRIVER (1) ---- */
  /* Every scroll-driven effect reads from this one rAF-throttled handler. One
     listener, one layout read per frame, no competing scroll callbacks. */
  function wireScrollHub() {
    var header = $("[data-header]");
    var rail = $(".scroll-rail");
    var toTop = $(".to-top");
    var ring = $(".to-top__ring");
    var planes = $$(".parallax");
    var RING_LEN = 2 * Math.PI * 22;   /* r=22, matches the SVG above */
    var AMP = 20;                      /* px of parallax travel, each way */
    var queued = false;
    var armedAt = 0;

    /* Pre-scale the photo so its drift can never expose an edge. */
    planes.forEach(function (p) {
      var img = p.querySelector("img");
      if (img) img.style.willChange = "transform";
    });

    function frame() {
      var y = window.scrollY || window.pageYOffset || 0;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var docH = document.documentElement.scrollHeight;
      var max = Math.max(1, docH - vh);
      var p = Math.min(1, Math.max(0, y / max));

      if (header) header.classList.toggle("is-stuck", y > 8);
      if (rail) rail.style.transform = "scaleX(" + p.toFixed(4) + ")";
      if (toTop) toTop.classList.toggle("is-visible", y > vh * 0.85);
      if (ring) ring.style.strokeDashoffset = (RING_LEN * (1 - p)).toFixed(2);

      /* Parallax: map each container's position in the viewport to a small
         vertical offset. Only containers actually on screen are touched. */
      for (var i = 0; i < planes.length; i++) {
        var c = planes[i];
        var r = c.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) continue;
        var img = c.querySelector("img");
        if (!img) continue;
        /* 0 when the container's bottom sits at the viewport bottom,
           1 when its top reaches the viewport top. */
        var t = (vh - r.top) / (vh + r.height);
        t = Math.min(1, Math.max(0, t));
        var offset = (t - 0.5) * 2 * AMP;
        img.style.setProperty("--py", offset.toFixed(1) + "px");
      }
    }

    /* Self-healing rAF latch. If a frame never arrives — background tab, a
       throttled compositor — the next scroll re-arms it rather than the
       handler being wedged shut for the rest of the session. */
    var queued = false;
    var armedAt = 0;
    function onScroll() {
      var now = Date.now();
      if (queued && now - armedAt < 250) return;
      queued = true;
      armedAt = now;
      requestAnimationFrame(function () {
        queued = false;
        frame();
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    frame();
    /* Second pass after fonts/images settle, so the rail is correct on load
       for a page restored to a previous scroll position. */
    setTimeout(frame, 150);
  }

  function wireToTop() {
    var btn = $("[data-to-top]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      /* keyboard focus should not be left stranded at the bottom of the page */
      var brand = $(".brand");
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  /* ----------------------------------------------------- POINTER SPOTLIGHT */
  /* One delegated listener for the whole document, throttled to a frame. The
     coordinates are handed to CSS as custom properties; the gradient itself
     lives in the stylesheet. Off for coarse pointers (touch), where there is
     no hover state to respond to. */
  function wireSpotlight() {
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    var current = null;
    var pending = null;
    var queued = false;
    var armedAt = 0;

    document.addEventListener("pointermove", function (e) {
      var target = e.target && e.target.closest
        ? e.target.closest(".spot")
        : null;

      /* Leaving a card: let it settle back rather than freezing mid-glow. */
      if (current && current !== target) current = null;
      if (!target) return;

      current = target;
      pending = { el: target, x: e.clientX, y: e.clientY };

      /* Same self-healing latch as the scroll handler, so a missed frame can
         never leave the spotlight permanently unresponsive. */
      var now = Date.now();
      if (queued && now - armedAt < 250) return;
      queued = true;
      armedAt = now;
      requestAnimationFrame(function () {
        queued = false;
        if (!pending) return;
        var b = pending.el.getBoundingClientRect();
        if (!b.width || !b.height) return;
        pending.el.style.setProperty("--mx", (((pending.x - b.left) / b.width) * 100).toFixed(2) + "%");
        pending.el.style.setProperty("--my", (((pending.y - b.top) / b.height) * 100).toFixed(2) + "%");
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------- HEADING WIPE */
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
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    /* Scoped to standalone section headings on purpose. The page-header title
       already has its own entrance animation, and the band heading sits inside
       a `.reveal` block that fades the whole group in — stacking a clip wipe on
       either would just be two effects fighting over the same element. These
       headings have nothing else animating them, so the wipe is a genuine
       addition here rather than a pile-on. */
    var heads = $$(".section-head .h2");
    if (!heads.length) return;

    heads.forEach(function (h) { h.classList.add("unmask"); });

    var pending = heads.slice();

    function reveal(h, instant) {
      var i = pending.indexOf(h);
      if (i !== -1) pending.splice(i, 1);
      if (h.classList.contains("is-visible")) return;
      h.classList.add("is-visible");
      /* Drop the clip once the wipe has played, so it can never interfere with
         a focus ring or a text selection later on. */
      setTimeout(function () { h.classList.add("is-settled"); }, instant ? 0 : 900);
    }

    function onScreen(h) {
      var b = h.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      return b.top < vh && b.bottom > 0;
    }

    /* Watch each heading through its container, which is never clipped. A
       container may hold more than one heading, so collect them in a list. */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var list = entry.target.__unmaskHeads || [];
        io.unobserve(entry.target);
        list.forEach(function (h) { reveal(h); });
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });

    heads.forEach(function (h) {
      var host = h.closest(".section-head") || h.parentElement || h;
      (host.__unmaskHeads = host.__unmaskHeads || []).push(h);
      io.observe(host);
    });

    var lastRun = 0;
    function sweep(instant) {
      if (!pending.length) {
        window.removeEventListener("scroll", onScroll, { passive: true });
        window.removeEventListener("resize", onScroll);
        return;
      }
      /* Deliberately more permissive than the observer: this is the net that
         catches whatever the observer didn't. */
      pending.slice().forEach(function (h) { if (onScreen(h)) reveal(h, instant); });
    }
    function onScroll() {
      var now = Date.now();
      if (now - lastRun < 70) return;
      lastRun = now;
      sweep(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    /* Exposed so the hash handler can settle a section after a deep link. */
    window.__sweepUnmask = sweep;
    sweep(false);
    setTimeout(function () { sweep(false); }, 150);
  }

  /* ------------------------------------------------------- CATEGORY SPY -- */
  /* Highlights the current category in the services jump bar. Only runs where
     those anchors exist. */
  function wireScrollSpy() {
    var bar = $("[data-services-jump]");
    if (!bar || !("IntersectionObserver" in window)) return;

    var links = $$("a[href^='#']", bar);
    if (!links.length) return;

    var byId = {};
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (!sec) return;
      byId[id] = a;
      sections.push(sec);
    });
    if (!sections.length) return;

    /* Track how much of each section is on screen and light up the largest —
       more stable than a simple "is it intersecting" test when sections are
       taller than the viewport. */
    var ratios = {};
    function apply() {
      var best = null;
      Object.keys(ratios).forEach(function (id) {
        if (ratios[id] > 0.08 && (!best || ratios[id] > ratios[best])) best = id;
      });
      links.forEach(function (a) {
        var on = best && a === byId[best];
        a.classList.toggle("is-current", !!on);
      });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        ratios[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      apply();
    }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

    sections.forEach(function (s) { io.observe(s); });
  }

  function wireReveal() {
    var pending = $$(".reveal");
    if (!pending.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showAll() {
      pending.forEach(function (n) { n.classList.add("is-visible"); });
      pending = [];
    }
    if (reduce || !("IntersectionObserver" in window)) { showAll(); return; }

    /* Is the element touching the viewport (with a small lead-in margin)? */
    function inView(n) {
      var b = n.getBoundingClientRect();
      var h = window.innerHeight || document.documentElement.clientHeight;
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
      var i = pending.indexOf(n);
      if (i !== -1) pending.splice(i, 1);
    }

    /* Primary path: IntersectionObserver is cheap and handles the common case. */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          io.unobserve(entry.target);
          reveal(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
    pending.forEach(function (n) { io.observe(n); });

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
    var lastRun = 0;
    function sweep(instant) {
      if (!pending.length) {
        window.removeEventListener("scroll", onScroll, { passive: true });
        window.removeEventListener("resize", onScroll);
        return;
      }
      pending.slice().forEach(function (n) { if (inView(n)) reveal(n, instant); });
    }
    function onScroll() {
      var now = Date.now();
      if (now - lastRun < 70) return;
      lastRun = now;
      sweep(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    /* Expose so the hash handler can force a sweep after jumping. */
    window.__sweepReveals = sweep;
    sweep(false);
    /* And once more after layout settles, in case heights shifted. */
    setTimeout(function () { sweep(false); }, 120);
  }

  /* Native anchor scrolling runs before our JS has built the page, so a link
     like services.html#technologies lands at the top instead of the section.
     Re-do the jump once the content actually exists. */
  function wireHashScroll() {
    function jump(smooth) {
      var id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      var target = document.getElementById(id);
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
      if (window.__sweepReveals) window.__sweepReveals(!smooth);
      if (window.__sweepUnmask) window.__sweepUnmask(!smooth);
    }

    if (location.hash) {
      jump(false);
      /* Run again after webfonts land, since metrics change and can shift the
         target back out of position. */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { jump(false); });
      }
      /* Third pass: some sections keep growing as images/SVGs settle. */
      setTimeout(function () { jump(false); }, 400);
    }

    window.addEventListener("hashchange", function () { jump(true); });
  }

  /* Counts the stat numbers up when the strip scrolls into view. The last
     frame writes the original string verbatim, so the rendered result can
     never drift from what was configured. */
  function wireCountUp() {
    var nodes = $$("[data-count-target]");
    if (!nodes.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      var s = specOf(node);
      node.textContent = formatStat(s, s.target);
    }

    /* No observer (or the reader asked for less motion): just show the numbers. */
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(settle);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var node = entry.target;
        io.unobserve(node);

        var spec = specOf(node);
        /* Short stagger so four numbers don't all move in lockstep. */
        var delay = i * 90;
        var dur = 1250;
        var done = false;

        /* Writes the configured value verbatim, exactly once. */
        function finish() {
          if (done) return;
          done = true;
          node.textContent = formatStat(spec, spec.target);
        }

        setTimeout(function () {
          var start = null;
          requestAnimationFrame(function step(now) {
            if (done) return;
            if (start === null) start = now;
            var t = Math.min(1, (now - start) / dur);
            /* easeOutExpo — fast off the mark, long settle. Reads as
               "confident" rather than mechanical. */
            var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            node.textContent = formatStat(spec, spec.target * eased);
            if (t < 1) requestAnimationFrame(step);
            else finish();
          });

          /* Belt and braces. If rAF is throttled — background tab, low-power
             mode, a paused compositor — the loop could stall and leave a stat
             reading a wrong number, which is the one outcome that would
             actually mislead someone. Force the true value regardless. */
          setTimeout(finish, dur + 250);
        }, delay);
      });
    }, { threshold: 0.35 });

    nodes.forEach(function (n) { io.observe(n); });
  }

  /* --------------------------------------------------------- CONTACT FORM -- */
  function wireForm() {
    var form = $("[data-contact-form]");
    if (!form) return;

    var status = $("[data-form-status]", form) || $("[data-form-status]");
    var submit = form.querySelector('[type="submit"]');
    var cfg = (SITE.contact && SITE.contact.form) || {};

    /* Prefill service / plan from ?service= / ?plan= query string */
    var params = new URLSearchParams(location.search);
    var svc = params.get("service") || params.get("plan");
    if (svc) {
      var match = SERVICES.filter(function (s) {
        return s.id === svc || s.name.toLowerCase() === svc.toLowerCase();
      })[0];
      var label = match ? match.name : svc;
      var topic = form.querySelector('[name="topic"]');
      if (topic) {
        var opt = Array.prototype.slice.call(topic.options).filter(function (o) {
          return o.value === label || o.textContent.trim() === label;
        })[0];
        if (opt) { topic.value = opt.value; }
        else {
          var extra = el("option", null, esc(label));
          extra.value = label;
          topic.appendChild(extra);
          topic.value = label;
        }
      }
      var msg = form.querySelector('[name="message"]');
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

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);

      if (!cfg.endpoint) {
        /* No backend configured — hand off to the visitor's mail client. */
        var body = [
          "Name: " + (data.get("name") || ""),
          "Email: " + (data.get("email") || ""),
          "Company: " + (data.get("company") || ""),
          "Topic: " + (data.get("topic") || ""),
          "",
          data.get("message") || "",
        ].join("\n");
        var href = "mailto:" + (cfg.fallbackEmail || SITE.contact.email) +
          "?subject=" + encodeURIComponent("New enquiry — " + (data.get("topic") || "DevOps")) +
          "&body=" + encodeURIComponent(body);
        window.location.href = href;
        say("Opening your email client — if nothing happens, write to " +
            (cfg.fallbackEmail || SITE.contact.email) + ".", "ok");
        return;
      }

      if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = "Sending…"; }
      say("Sending…");

      fetch(cfg.endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          say("Thanks — we've got it. We usually reply within one business day.", "ok");
        })
        .catch(function () {
          say("Something went wrong. Please email " +
              (cfg.fallbackEmail || SITE.contact.email) + " instead.", "error");
        })
        .then(function () {
          if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || "Send"; }
        });
    });
  }

  /* -------------------------------------------------------------- INIT -- */
  /* Marks the photo containers that should drift against the scroll. Done here
     rather than in markup so the effect is declared in one place. */
  function tagParallax() {
    $$(".hero__media, .band").forEach(function (n) { n.classList.add("parallax"); });
  }

  function init() {
    buildAnnouncement();
    buildHeader();
    buildFooter();
    buildChrome();
    renderServices();
    renderTopics();
    renderOffer();
    renderTech();
    renderProcess();
    renderStats();
    renderTestimonials();
    renderFaqs();
    renderPlans();
    paintBrand();          /* after builders, so injected nodes get filled too */
    tagParallax();
    wireNav();
    wireScrollHub();
    wireToTop();
    wireSpotlight();
    wireCursor();
    wireUnmask();
    wireReveal();
    wireHashScroll();
    wireScrollSpy();
    wireCountUp();
    wireForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
