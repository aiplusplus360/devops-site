/* Minimal static file server for local preview only.
   Run:  node serve.js      ->  http://localhost:5173
   Not used in production; delete it whenever you like. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const BASE_PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
const MAX_PORT_TRIES = 10;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);

  // Keep requests inside the project folder.
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || stat.isDirectory()) {
      const fallback = path.join(ROOT, "404.html");
      fs.readFile(fallback, (e2, buf) => {
        res.writeHead(404, { "Content-Type": TYPES[".html"] });
        res.end(e2 ? "Not found" : buf);
      });
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

/* If the port is taken (usually because a previous run is still open), try the
   next few ports instead of crashing with an EADDRINUSE stack trace. */
let attempt = 0;

server.on("error", (err) => {
  if (err.code === "EADDRINUSE" && attempt < MAX_PORT_TRIES) {
    attempt += 1;
    const next = BASE_PORT + attempt;
    console.log(`Port ${BASE_PORT + attempt - 1} is in use, trying ${next}...`);
    setTimeout(() => server.listen(next), 60);
    return;
  }
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nAll ports ${BASE_PORT}-${BASE_PORT + MAX_PORT_TRIES} are in use.\n` +
        "Another preview server is probably already running. Just open the URL\n" +
        "printed by that one, or stop it and try again.\n"
    );
  } else if (err.code === "EACCES") {
    console.error(`\nPermission denied on port ${BASE_PORT}. Try a higher one:\n  $env:PORT=8080; node serve.js\n`);
  } else {
    console.error("\n" + err.message + "\n");
  }
  process.exit(1);
});

server.on("listening", () => {
  console.log(`Preview running at http://localhost:${server.address().port}`);
  console.log("Press Ctrl+C to stop.");
});

server.listen(BASE_PORT);
