# Happy Tummy Club – Meal Prep Profil Test (Backend)

Separates Backend für den neuen Website-Test. Ersetzt **nichts** am bestehenden Tally-/Vercel-System.

## Endpunkte

**POST /api/profil-test**
Body: `{ vorname, nachname, email, consent: true, answers: { q1 … q11 } }` (Antworttexte im Wortlaut)
→ prüft Eingaben, berechnet die neun Werte (1/3/5), erzeugt den signierten Ergebnislink, verschickt die Mail über Brevo.
Antwort: `{ ok: true, resultUrl, mailSent }`. Scheitert die Mail, ist `mailSent: false`; der Fehler wird nur im Vercel-Log protokolliert.

**POST /api/profil-analyse**
Body: `{ name, values, sig }` (aus dem Ergebnislink)
→ prüft zuerst die Signatur. Ungültig → 403, **keine** OpenAI-Anfrage. Gültig → Regeln + OpenAI (gpt-4.1).
Antwort: `{ ok: true, essensalltag, funktioniert, fordert, requirements, notFits }`

Keine Datenbank, keine Speicherung von Ergebnissen.

## Dateien

- `api/profil-test.js`, `api/profil-analyse.js` – Endpunkte
- `lib/scoring.js` – Fragen, Antworten, 1/3/5 (aus process-results.js)
- `lib/analysis.js` – Regeln, Prompt, OpenAI (aus result-analysis.js, unverändert)
- `lib/mail.js` – Brevo-Versand mit neuem Mailtext
- `lib/signature.js` – HMAC-SHA256-Signatur
- `lib/http.js` – CORS, Hilfsfunktionen

## Environment Variables

| Name | Zweck |
|---|---|
| `OPENAI_API_KEY` | Auswertungstexte |
| `BREVO_API_KEY` | Ergebnis-Mail |
| `RESULT_SIGNING_SECRET` | Signatur der Ergebnislinks (mind. 32 Zeichen, zufällig) |
| `RESULT_PAGE_URL` | Adresse der Ergebnisseite auf der Website |
| `ALLOWED_ORIGIN` | Domain(s) der Website, die die Endpunkte aufrufen dürfen, durch Komma getrennt, ohne Schrägstrich am Ende |

Keine Werte in den Code schreiben. Alle Werte nur in Vercel eintragen.
