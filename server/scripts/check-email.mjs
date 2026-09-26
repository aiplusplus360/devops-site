# Checks that email delivery is configured and actually works.
#
# Run after filling in /etc/devops-theaimax.env:
#   systemctl restart devops-theaimax
#   node server/scripts/check-email.mjs
#
# It verifies the SMTP connection and sends one real message, so a "sent" line
# here means it will genuinely arrive. Run from the app directory so that the
# environment file's variables are the ones under test - pass them through
# systemd with:
#   systemctl show devops-theaimax -p Environment --value

import { mailerConfigured, mailerSummary, verifyMailer, sendEnquiry } from "../lib/mailer.mjs";

if (!process.env.SMTP_HOST) {
  console.log("\n  SMTP_HOST is not set in this shell.");
  console.log("  Either export the SMTP_* variables, or run this on the server as:");
  console.log("    systemctl restart devops-theaimax");
  console.log("    cd /var/www/devops.theaimax.com/app && node server/scripts/check-email.mjs\n");
}

console.log("\n  Mailer   ", mailerSummary());

if (!mailerConfigured) {
  console.log("\n  Email is not configured - the contact form will still accept");
  console.log("  submissions and write them to submissions.jsonl.\n");
  process.exit(0);
}

console.log("\n  Verifying SMTP connection...");
const check = await verifyMailer();
if (!check.ok) {
  console.log(`  FAILED: ${check.reason}\n`);
  process.exit(1);
}
console.log("  Connection OK.");

console.log("\n  Sending a test enquiry...");
const result = await sendEnquiry({
  receivedAt: new Date().toISOString(),
  name: "Email delivery test",
  email: process.env.CONTACT_TO || "info@theaimax.com",
  company: "TerraTemporal",
  topic: "SMTP verification",
  message:
    "This is a test message confirming that contact-form enquiries are being " +
    "delivered. If you are reading it in the inbox, email delivery is working. " +
    "No action is needed.",
  page: "/contact",
});

if (result.sent) {
  console.log(`  Sent. messageId: ${result.messageId}`);
  console.log("\n  Check the inbox for", process.env.CONTACT_TO, "\n");
} else {
  console.log(`  FAILED: ${result.error}\n`);
  process.exit(1);
}
