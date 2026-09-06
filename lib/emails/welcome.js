const SITE_URL = "https://www.mossgames.fr";

// Edit this template to change the welcome email's copy or design.
// Inline styles only — most email clients strip <style> blocks.
export function buildWelcomeEmail({ unsubscribeUrl }) {
  const subject = "Welcome to the MossGames newsletter!";

  const html = `
<!doctype html>
<html lang="en">
  <body style="margin:0; padding:32px 16px; background:#fafafa; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background:#ffffff; border:1px solid #e4e4e7; border-radius:16px; padding:32px;">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <img src="${SITE_URL}/images/logo.png" alt="MossGames" width="120" style="display:block; max-width:120px;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="font-size:20px; color:#18181b; padding-bottom:12px;">
                Thanks for subscribing!
              </td>
            </tr>
            <tr>
              <td align="center" style="font-size:15px; line-height:1.6; color:#52525b; padding-bottom:8px;">
                You're on the list for updates on new games and devlogs from MossGames.
                We're glad to have you along for the ride.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:24px; border-top:1px solid #e4e4e7; margin-top:24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  <tr>
                    <td style="font-size:12px; color:#a1a1aa; padding-right:8px;">
                      Didn't mean to subscribe?
                    </td>
                    <td>
                      <a href="${unsubscribeUrl}" style="display:inline-block; padding:6px 14px; font-size:12px; font-weight:bold; color:#ffffff; background:#18181b; border-radius:999px; text-decoration:none;">
                        Unsubscribe
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  return { subject, html };
}
