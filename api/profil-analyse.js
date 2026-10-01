import { applyCors, readBody } from "../lib/http.js";
import { verify } from "../lib/signature.js";
import { analyse } from "../lib/analysis.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method" });

  try {
    const body = readBody(req);
    const name = typeof body.name === "string" ? body.name : "";
    const values = typeof body.values === "string" ? body.values : "";

    // 1. Signatur prüfen – vor jeder weiteren Verarbeitung, insbesondere vor OpenAI.
    if (!name || !values || !verify(name, values, body.sig)) {
      return res.status(403).json({ ok: false, error: "invalid_link" });
    }

    // 2. Werte prüfen: genau neun ganze Zahlen von 1 bis 5.
    const nums = values.split(",").map((v) => Number(v));
    if (nums.length !== 9 || nums.some((n) => !Number.isInteger(n) || n < 1 || n > 5)) {
      return res.status(400).json({ ok: false, error: "invalid_values" });
    }

    // 3. Auswertung (Regeln + OpenAI) – wird wie bisher bei jedem Aufruf neu erzeugt.
    const result = await analyse(name, nums);
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    console.error("Fehler in /api/profil-analyse:", error);
    return res.status(500).json({ ok: false, error: "server" });
  }
}
