/* =============================================================================
   Service page content
   -----------------------------------------------------------------------------
   Every service page is rendered from one template plus a JSON file in
   `content/services/<id>.json`, so the 40 pages cannot drift apart in layout,
   imagery or animation — only their words differ.

   `import.meta.glob` is resolved at build time, which means this works in both
   the browser bundle and the server-rendered bundle with no filesystem access
   at runtime.
   ========================================================================== */
import { SERVICES } from "@/data/services.js";

const files = import.meta.glob("../content/services/*.json", { eager: true });

/** id -> content object */
export const SERVICE_CONTENT = Object.fromEntries(
  Object.entries(files).map(([filePath, mod]) => {
    const id = filePath.split("/").pop().replace(/\.json$/, "");
    return [id, mod.default ?? mod];
  })
);

/** Services that were authored before their content file existed. */
export const MISSING_CONTENT = SERVICES.filter((s) => !SERVICE_CONTENT[s.id]).map((s) => s.id);

/** Content for one service, or null when it has not been written yet. */
export function getServiceContent(id) {
  return SERVICE_CONTENT[id] || null;
}

/** A service plus its authored content, by id. */
export function getService(id) {
  const base = SERVICES.find((s) => s.id === id);
  if (!base) return null;
  return { ...base, content: getServiceContent(id) };
}

/** The services linked from a given service's `related` list, in order. */
export function getRelated(id, limit = 3) {
  const content = getServiceContent(id);
  if (!content || !Array.isArray(content.related)) return [];
  return content.related
    .slice(0, limit)
    .map((rid) => SERVICES.find((s) => s.id === rid))
    .filter(Boolean);
}

/** All services in one category, in the site's canonical category order. */
export function getByCategory(category) {
  return SERVICES.filter((s) => s.category === category);
}
