import { escapeHtml } from "./http.js";

// Brevo-Versand – gleiche Schnittstelle und gleicher Absender wie process-results.js. Neuer, freigegebener Mailtext.
export async function sendResultMail({ vorname, nachname, email, resultUrl }) {
  const safeName = escapeHtml(vorname);
  const safeUrl = escapeHtml(resultUrl);

  const htmlContent = `<!DOCTYPE html>
<html lang="de"><body style="margin:0;padding:0;background:#FBCBFA;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBCBFA;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;">
<tr><td style="padding:40px 36px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#501A0D;">
<p style="margin:0 0 18px;">Hi ${safeName},</p>
<p style="margin:0 0 28px;">dein persönliches Meal Prep Profil ist fertig! Darin siehst du, wie dein Essensalltag gerade läuft, was schon richtig gut klappt und was deine Meal Prep Routine leisten muss, damit sie wirklich zu dir passt.</p>
<p style="margin:0 0 28px;"><a href="${safeUrl}" style="display:inline-block;background:#F95417;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;padding:15px 28px;border-radius:999px;">Dein Meal Prep Profil</a></p>
<p style="margin:0 0 28px;">Heb dir diese Mail am besten auf, dann kannst du jederzeit wieder reinschauen.</p>
<p style="margin:0;">Happy Tummy Grüße<br>Samia</p>
</td></tr></table>
</td></tr></table>
</body></html>`;

  const textContent =
    `Hi ${vorname},\n\n` +
    `dein persönliches Meal Prep Profil ist fertig! Darin siehst du, wie dein Essensalltag gerade läuft, was schon richtig gut klappt und was deine Meal Prep Routine leisten muss, damit sie wirklich zu dir passt.\n\n` +
    `Dein Meal Prep Profil:\n${resultUrl}\n\n` +
    `Heb dir diese Mail am besten auf, dann kannst du jederzeit wieder reinschauen.\n\n` +
    `Happy Tummy Grüße\nSamia`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Happy Tummy Club", email: "mail@happytummyclub.de" },
      to: [{ email, name: `${vorname} ${nachname}`.trim() }],
      subject: "Dein persönliches Meal Prep Profil",
      htmlContent,
      textContent,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Brevo error ${response.status}: ${JSON.stringify(result)}`);
  }
  return result;
}
