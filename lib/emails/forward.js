// Forwards mail received on @mossgames.fr (Resend Receiving, the domain's
// MX) to the team's Gmail inbox. Triggered by the "email.received" Resend
// webhook (app/api/webhooks/resend/route.js).
//
// Sent from the @mossgames.fr address it was written to (so the inbox shows
// which one: contact@, support@...), under the original sender's name, with
// Reply-To set to the original sender so "Reply" in Gmail answers them
// directly.

export const FORWARD_TO = "mossgamesfr@gmail.com";
const DOMAIN = "mossgames.fr";

// "Jane Doe <jane@x.com>" -> { name: "Jane Doe", address: "jane@x.com" }
function parseAddress(value) {
  const match = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(value || "");
  if (match) return { name: match[1].trim(), address: match[2].trim() };
  return { name: "", address: (value || "").trim() };
}

async function downloadAttachments(resend, emailId) {
  const { data, error } = await resend.emails.receiving.attachments.list({ emailId });
  if (error) throw new Error(`attachments list failed: ${error.message}`);

  return Promise.all(
    (data?.data || []).map(async (attachment) => {
      const response = await fetch(attachment.download_url);
      if (!response.ok) throw new Error(`attachment download failed: ${response.status}`);
      return {
        filename: attachment.filename || "attachment",
        content: Buffer.from(await response.arrayBuffer()).toString("base64"),
        contentType: attachment.content_type,
        // Keeps inline images (<img src="cid:...">) working.
        contentId: attachment.content_id?.replace(/^<|>$/g, "") || undefined,
      };
    })
  );
}

export async function forwardReceivedEmail(resend, emailId) {
  // "cid" rather than inline data: URIs, which Gmail refuses to display.
  const { data: email, error } = await resend.emails.receiving.get(emailId, { html_format: "cid" });
  if (error) throw new Error(`receiving get failed: ${error.message}`);

  const sender = parseAddress(email.from);
  // Never forward our own forwards back (e.g. a misconfigured alias).
  if (sender.address.toLowerCase() === FORWARD_TO) return null;

  const recipient =
    [...(email.received_for || []), ...(email.to || [])]
      .map((value) => parseAddress(value).address.toLowerCase())
      .find((address) => address.endsWith(`@${DOMAIN}`)) || `contact@${DOMAIN}`;
  const displayName = (sender.name || sender.address).replace(/["<>]/g, "");

  const { data: sent, error: sendError } = await resend.emails.send(
    {
      from: `"${displayName}" <${recipient}>`,
      to: FORWARD_TO,
      replyTo: email.reply_to?.length ? email.reply_to : sender.address,
      subject: email.subject || "(no subject)",
      html: email.html || undefined,
      text: email.text || (email.html ? undefined : "(empty message)"),
      attachments: await downloadAttachments(resend, emailId),
    },
    // Resend retries webhooks on failure/timeouts: never deliver twice.
    { idempotencyKey: `forward-${emailId}` }
  );
  if (sendError) throw new Error(`forward send failed: ${sendError.message}`);
  return sent;
}
