/* =============================================================================
   Per-route <head> management
   -----------------------------------------------------------------------------
   A deliberately small replacement for a helmet-style library, because the
   requirement here is narrow: each route declares its own title, description,
   canonical URL, social tags and JSON-LD, and the server must emit them in the
   very first byte of HTML so crawlers and social scrapers (which do not run
   JavaScript) see them.

   How it works: `<Seo>` writes into a plain collector object while rendering.
   On the server that object is per-request and `renderToString` is synchronous,
   so writing during render is safe. In the browser there is no collector, and
   the same component applies the tags to the live document instead — which is
   what keeps client-side navigation correct after hydration.
   ========================================================================== */
import { createContext, useContext, useEffect } from "react";
import { SITE } from "@/data/site.js";

/** The per-request collector. Null in the browser. */
export const HeadContext = createContext(null);

export function createHeadCollector() {
  return {
    title: "",
    description: "",
    canonical: "",
    image: "",
    type: "website",
    jsonLd: [],
    /* A route can ask for a specific status — used by the service pages, where
       a URL that is structurally valid (/services/:id) may still name a service
       that does not exist, and a 200 would let that page into search results. */
    status: 0,
    /* Set by the 404 route so the served HTML carries a robots tag. The status
       code already keeps crawlers out, but the tag is what stops a misconfigured
       proxy or CDN from turning the response into an indexable 200. */
    noindex: false,
  };
}

/* ---------------------------------------------------------------- browser -- */
function upsertMeta(attr, key, content) {
  if (!content) return;
  let node = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let node = document.head.querySelector(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", rel);
    document.head.appendChild(node);
  }
  node.setAttribute("href", href);
}

/* Keeps the robots tag in step with the route. Only a tag that this component
   could have written is removed on the way back out, so a deliberately
   configured `robots` tag in the template is never touched. */
function setRobots(noindex) {
  const existing = document.head.querySelector('meta[name="robots"]');
  if (noindex) {
    if (existing) existing.setAttribute("content", "noindex");
    else {
      const node = document.createElement("meta");
      node.setAttribute("name", "robots");
      node.setAttribute("content", "noindex");
      document.head.appendChild(node);
    }
  } else if (existing && existing.getAttribute("content") === "noindex") {
    existing.remove();
  }
}

/** Replaces just the tags this component owns, leaving the rest of <head> alone. */
function applyToDocument({ title, description, canonical, image, type, noindex }) {
  if (title) document.title = title;
  upsertMeta("name", "description", description);
  upsertLink("canonical", canonical);
  setRobots(noindex);

  upsertMeta("property", "og:type", type || "website");
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", canonical);
  if (image) {
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("name", "twitter:image", image);
  }
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
}

/* ------------------------------------------------------------------- head -- */
/**
 * Declare this route's head. Renders nothing.
 *
 * @param {object}   props
 * @param {string}   props.title        document title, without the site name
 * @param {string}   props.description  meta description
 * @param {string}  [props.path]        route path, e.g. "/services/cicd";
 *                                      resolved to an absolute canonical URL
 * @param {string}  [props.image]       absolute social image URL
 * @param {string}  [props.type]        og:type, defaults to "website"
 * @param {object[]}[props.jsonLd]      structured-data objects to embed
 * @param {boolean}[props.noindex]      emit robots noindex
 */
export default function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  jsonLd = [],
  noindex = false,
  status = 0,
}) {
  const base = (SITE.brand?.url || "").replace(/\/$/, "");
  const canonical = path ? `${base}${path.startsWith("/") ? path : `/${path}`}` : base;
  const socialImage = image || `${base}/img/og-image.jpg`;

  const head = useContext(HeadContext);
  if (head) {
    head.title = title || head.title;
    head.description = description || head.description;
    head.canonical = canonical;
    head.image = socialImage;
    head.type = type;
    if (status) head.status = status;
    if (noindex) head.noindex = true;
    if (jsonLd.length) head.jsonLd = head.jsonLd.concat(jsonLd);
  }

  useEffect(() => {
    applyToDocument({ title, description, canonical, image: socialImage, type, noindex });
    /* Re-runs whenever the route changes any of these. */
  }, [title, description, canonical, socialImage, type, noindex]);

  useEffect(() => {
    /* Structured data is only meaningful in the serialised HTML, which the
       server produces, so nothing to do here beyond leaving the server's tags
       in place. */
  }, [jsonLd]);

  return null;
}
