import { applyCors, readBody } from "../lib/http.js";
import { validateAnswers, buildValues } from "../lib/scoring.js";
import { sign } from "../lib/signature.js";
import { sendResultMail } from "../lib/mail.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method" });

  try {
    const body = readBody(req);
    const vorname = clean(body.vorname, 40);
    const nachname = clean(body.nachname, 60);
    const email = clean(body.email, 254).toLowerCase();
    const picked = validateAnswers(body.answers);

    if (!vorname || !nachname || !EMAIL_RE.test(email) || body.consent !== true || !picked) {
      return res.status(400).json({ ok: false, error: "invalid" });
    }

    const values = buildValues(picked).join(",");
    const url = new URL(process.env.RESULT_PAGE_URL);
    url.searchParams.set("name", vorname);
    url.searchParams.set("values", values);
    url.searchParams.set("sig", sign(vorname, values));
    const resultUrl = url.toString();

    let mailSent = true;
    try {
      await sendResultMail({ vorname, nachname, email, resultUrl });
    } catch (error) {
      mailSent = false;
      console.error("Ergebnis-Mail fehlgeschlagen:", error);
    }

    return res.status(200).json({ ok: true, resultUrl, mailSent });
  } catch (error) {
    console.error("Fehler in /api/profil-test:", error);
    return res.status(500).json({ ok: false, error: "server" });
  }
}
