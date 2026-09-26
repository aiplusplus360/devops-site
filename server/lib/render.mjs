/* =============================================================================
   Document composition
   -----------------------------------------------------------------------------
   Turns a rendered React tree into a complete HTML document:

     - the <!--head-start-->…<!--head-end--> fallback block is REPLACED by the
       route's own tags, so the served page can never contain two <title>
       elements or two meta descriptions
     - <!--app-html--> is replaced by the rendered markup

   Both placeholders live in client/index.html; if either goes missing the
   functions throw rather than silently serving a page with no content, which is
   the failure mode that is hardest to notice.
   ========================================================================== */
import fs from "node:fs";

const HEAD_REGION = /<!--head-start-->[\s\S]*?<!--head-end-->/;
const APP_SLOT = /<!--app-html-->/;

/** Read a template once and keep it — the file only changes on rebuild. */
export function makeTemplateLoader(file) {
  let cached = null;
  return function getTemplate({ reload = false } = {}) {
    if (cached && !reload) return cached;
    cached = fs.readFileSync(file, "utf8");
    if (!HEAD_REGION.test(cached)) {
      throw new Error(`Template ${file} is missing the <!--head-start-->…<!--head-end--> block.`);
    }
    if (!APP_SLOT.test(cached)) {
      throw new Error(`Template ${file} is missing the <!--app-html--> placeholder.`);
    }
    return cached;
  };
}

/** Insert the rendered markup and head tags into the template. */
export function composeDocument(template, renderedHtml, tags) {
  return template.replace(HEAD_REGION, tags).replace(APP_SLOT, renderedHtml);
}

/**
 * Render one URL to a full document.
 *
 * @param {string} url  request path, query string included
 * @param {object} deps
 * @param {{ render: Function }} deps.ssr      the bundled entry-server module
 * @param {() => string}        deps.getTemplate
 * @param {(head: object) => string} deps.headTags
 * @returns {{ document: string, status: number, head: object }}
 */
export function renderRequest(url, { ssr, getTemplate, headTags }) {
  const { html, head, status } = ssr.render(url);
  const document = composeDocument(getTemplate(), html, headTags(head));
  return { document, status, head };
}
