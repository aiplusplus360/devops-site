/* =============================================================================
   Vite config — React client + SSR bundle
   -----------------------------------------------------------------------------
   Two builds come out of this file:
     vite build            -> dist/client   (browser assets, hashed)
     vite build --ssr      -> dist/server   (renderToString entry, for Express)

   Two deliberate decisions worth knowing about:

   1. `publicDir` points at the existing top-level `assets/` folder. That folder
      already holds `css/styles.css` and `img/*`, and the CSS references images as
      `url("../img/…")`. Served at `/css/styles.css`, those resolve to `/img/…`
      exactly as they always have. The stylesheet is therefore shipped
      byte-for-byte as authored — it is never run through the bundler — which is
      what keeps the visual design and every CSS animation identical to the
      static site.

   2. The SSR build bundles its dependencies rather than externalising them, so
      `dist/server` is self-contained apart from Express itself.
   ========================================================================== */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const here = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.join(here, "client");

export default defineConfig(({ isSsrBuild }) => ({
  root: clientRoot,
  publicDir: path.join(here, "assets"),
  appType: "custom",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.join(clientRoot, "src"),
    },
  },

  build: isSsrBuild
    ? {
        outDir: path.join(here, "dist/server"),
        emptyOutDir: true,
        ssr: path.join(clientRoot, "src/entry-server.jsx"),
        rollupOptions: {
          /* Stated explicitly as well as via `ssr`, because the bare `--ssr`
             CLI flag resolves to the boolean `true` and overrides the string
             above; Rollup would then fall back to `index.html` and refuse to
             build an HTML input for SSR. `input` wins over that fallback. */
          input: path.join(clientRoot, "src/entry-server.jsx"),
          output: {
            format: "es",
            /* Emitted as .mjs so Node treats it as an ES module regardless of
               the surrounding package.json, which is CommonJS so that the
               existing deploy/ scripts keep working. */
            entryFileNames: "entry-server.mjs",
            chunkFileNames: "chunks/[name]-[hash].mjs",
          },
        },
      }
    : {
        outDir: path.join(here, "dist/client"),
        emptyOutDir: true,
      },

  ssr: {
    // Bundle React and friends into the server output so the deployed server
    // does not depend on how node_modules happens to be laid out.
    noExternal: true,
  },

  server: {
    port: 5173,
  },
}));
