/* =============================================================================
   POST /api/contact
   -----------------------------------------------------------------------------
   The contact form in the browser posts `FormData` with
   `Accept: application/json` and treats any 2xx as success — that is the
   contract `wireForm()` in the ported interaction layer already implements, so
   this endpoint is written to match it exactly rather than the other way round.

   Delivery options, in order of what is configured:
   
     1. SMTP_HOST set           -> the enquiry is emailed (see server/lib/mailer.mjs)
     2. CONTACT_WEBHOOK_URL set -> the submission is forwarded there as JSON
                                   (Slack/Zapier/Make/n8n all accept this)
     3. always                  -> appended to server/data/submissions.jsonl so a
                                   submission is never lost, even with no config

   There is no database and no required configuration: with nothing set, the
   form still works and everything is captured on disk.

   A failure in (1) or (2) never fails the request. The record is already on
   disk by then, so the enquiry is safe; the outcome is just reported back.
   ========================================================================== */
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import multer from "multer";
import { sendEnquiry } from "../lib/mailer.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));

/* Where submissions are written.
 *
 * Overridable so production can keep the file outside the deployed directory.
 * That matters because a deploy replaces the application directory, and a
 * submission log living inside it would be in the way of every rsync. Putting
 * it alongside the app instead means a redeploy cannot touch it.
 */
const DATA_DIR = process.env.SUBMISSIONS_DIR || path.join(here, "..", "data");
const LOG_FILE = path.join(DATA_DIR, "submissions.jsonl");

/* Text fields only. This endpoint never accepts file uploads, so the multipart
   parser is limited to what the form actually sends and no upload directory is
   ever needed. */
const parseForm = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 32 * 1024, fields: 20 },
}).none();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ------------------------------------------------------------ rate limit -- */
/* A small in-memory limiter. Enough to stop a naive script hammering the form;
   deliberately not pretending to be more than that. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/* Stop the map growing without bound on a long-running process. */
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now - entry.start > WINDOW_MS) hits.delete(ip);
  }
}, WINDOW_MS).unref();

/* --------------------------------------------------------------- delivery -- */
async function appendToLog(record) {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.appendFile(LOG_FILE, `${JSON.stringify(record)}\n`, "utf8");
}

async function forwardToWebhook(record) {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return { forwarded: false };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: controller.signal,
    });
    return { forwarded: res.ok, status: res.status };
  } catch {
    /* A webhook outage must not fail the visitor's submission — it is already
       written to the log above. */
    return { forwarded: false };
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------------------------------------------------------- handler -- */
export function createContactRouter() {
  const router = express.Router();

  router.post("/contact", (req, res) => {
    parseForm(req, res, async (parseError) => {
      if (parseError) {
        return res.status(400).json({ ok: false, error: "Could not read the form submission." });
      }

      const body = req.body || {};

      /* Honeypot: a field hidden from people but filled in by naive bots. Reply
         with a success so the bot does not learn it was rejected. */
      if (String(body._gotcha || "").trim()) {
        return res.status(200).json({ ok: true });
      }

      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim();
      const company = String(body.company || "").trim();
      const topic = String(body.topic || "").trim();
      const message = String(body.message || "").trim();

      const missing = [];
      if (!name) missing.push("name");
      if (!email) missing.push("email");
      if (!message) missing.push("message");
      if (missing.length) {
        return res.status(400).json({
          ok: false,
          error: `Please fill in: ${missing.join(", ")}.`,
        });
      }

      if (!EMAIL_RE.test(email)) {
        return res.status(400).json({ ok: false, error: "That email address does not look right." });
      }

      if (message.length > 5000) {
        return res.status(400).json({ ok: false, error: "That message is too long." });
      }

      const ip = req.ip || req.socket?.remoteAddress || "unknown";
      if (rateLimited(ip)) {
        return res.status(429).json({
          ok: false,
          error: "Too many submissions from this address. Please email us directly.",
        });
      }

      const record = {
        receivedAt: new Date().toISOString(),
        name,
        email,
        company,
        topic,
        message,
        page: String(body.page || "").slice(0, 200),
        userAgent: String(req.get("user-agent") || "").slice(0, 300),
      };

      try {
        await appendToLog(record);
      } catch (err) {
        console.error("[contact] could not write submission log:", err.message);
        return res.status(500).json({
          ok: false,
          error: "Something went wrong on our side. Please email us instead.",
        });
      }

      const { forwarded, status } = await forwardToWebhook(record);
      const mail = await sendEnquiry(record);

      res.status(200).json({
        ok: true,
        stored: true,
        emailed: mail.sent,
        forwarded,
        ...(status ? { webhookStatus: status } : {}),
        // Surfaced rather than swallowed: if email is misconfigured we want the
        // visitor's submission to still succeed but the operator to find out.
        ...(mail.error ? { emailError: mail.error } : {}),
      });
    });
  });

  return router;
}

/** Where submissions are written, for logging at boot. */
export const submissionsFile = LOG_FILE;

/** Exposed so the boot check can warn when the directory is not writable. */
export function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  return DATA_DIR;
}
