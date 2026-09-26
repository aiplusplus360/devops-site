/* =============================================================================
   SMTP delivery for contact-form enquiries.
   -----------------------------------------------------------------------------
   Configured entirely from the environment, so no credentials live in the repo
   and none end up in the systemd unit either (which is installed from the repo
   on every deploy). In production the values come from
   /etc/devops-theaimax.env, which is root-only and never committed.

   Reads:
     SMTP_HOST       e.g. smtp.gmail.com, smtp.postmarkapp.com, mail.example.com
     SMTP_PORT       e.g. 587 (STARTTLS) or 465 (implicit TLS)
     SMTP_SECURE     "true" for implicit TLS on connect; leave unset for 587,
                     where the connection is upgraded with STARTTLS instead
     SMTP_USER       username, if the server needs one
     SMTP_PASS       password or API key
     CONTACT_FROM    the From: address; defaults to SMTP_USER
     CONTACT_TO      where enquiries are delivered; defaults to SITE.contact.email

   Design notes:
     - The transport is created lazily, on the first enquiry. Booting the server
       therefore never depends on the mail server being reachable, and a wrong
       setting cannot stop the site from starting.
     - A send failure NEVER fails the request. The submission has already been
       written to disk by the caller, so the enquiry is not lost; the failure is
       logged and reported back in the API response.
     - Disabled by default. With no SMTP_HOST the module is inert, and the site
       behaves exactly as it did before email was configured.
   ========================================================================== */
import nodemailer from "nodemailer";

const HOST = process.env.SMTP_HOST || "";
const PORT = Number(process.env.SMTP_PORT || 587);
const SECURE = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
const USER = process.env.SMTP_USER || "";
const PASS = process.env.SMTP_PASS || "";
const FROM = process.env.CONTACT_FROM || USER;
const TO = process.env.CONTACT_TO || "";

/** True when enough is configured to attempt a send. */
export const mailerConfigured = Boolean(HOST && TO);

/** Human-readable summary for the boot log. Never includes the password. */
export function mailerSummary() {
  if (!HOST) return "not configured (writing to file only)";
  if (!TO) return `host ${HOST}:${PORT} but CONTACT_TO is unset — email disabled`;
  return `${HOST}:${PORT} (${SECURE ? "implicit TLS" : "STARTTLS"}) -> ${TO}`;
}

let transport = null;

function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: SECURE,
      auth: USER ? { user: USER, pass: PASS } : undefined,
      // A mail server that is slow to answer must not hold a visitor's request
      // open behind it.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
    });
  }
  return transport;
}

/* Plain-text rather than HTML on purpose: an HTML enquiry is exactly the shape
   a spam filter is suspicious of, and this is going to a human inbox. */
function formatEnquiry(record) {
  return [
    "New enquiry from the website",
    "",
    `Name:     ${record.name}`,
    `Email:    ${record.email}`,
    `Company:  ${record.company || "—"}`,
    `Topic:    ${record.topic || "—"}`,
    `Page:     ${record.page || "—"}`,
    `Received: ${record.receivedAt}`,
    "",
    "Message",
    "-------",
    record.message,
    "",
    "---",
    `Reply directly to this email to answer ${record.name}.`,
  ].join("\n");
}

/**
 * Sends one enquiry. Resolves to a plain result object and never rejects: the
 * caller reports the outcome but must not fail the visitor's submission.
 */
export async function sendEnquiry(record) {
  if (!mailerConfigured) return { sent: false, skipped: true };

  try {
    const info = await getTransport().sendMail({
      from: FROM,
      to: TO,
      // So hitting reply in the inbox answers the visitor rather than us.
      replyTo: `${record.name} <${record.email}>`,
      subject: `Website enquiry — ${record.topic || "General"} — ${record.name}`,
      text: formatEnquiry(record),
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error("[mail] could not send enquiry:", err.message);
    return { sent: false, error: err.message };
  }
}

/** Verifies connectivity. Only called from deploy checks, never on the request path. */
export async function verifyMailer() {
  if (!mailerConfigured) return { ok: false, reason: "not configured" };
  try {
    await getTransport().verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}
