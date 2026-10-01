# Einrichtung Schritt für Schritt

Alles wird **neu** angelegt. Das bestehende GitHub-Repository und das bestehende Vercel-Projekt werden dabei nicht geöffnet und nicht verändert.

## 1. Neues GitHub-Repository
1. github.com → oben rechts „+“ → **New repository**
2. Name: `htc-profil-test-backend`, Sichtbarkeit **Private** → **Create repository**
3. Auf der leeren Repo-Seite: **uploading an existing file** → den kompletten Inhalt des Ordners `profil-test-backend` hineinziehen (Ordner `api` und `lib` mit). → **Commit changes**

## 2. Neues Vercel-Projekt
1. vercel.com → **Add New… → Project**
2. Das neue Repository `htc-profil-test-backend` auswählen → **Import**
3. Framework Preset: **Other**. Sonst nichts ändern.
4. **Noch nicht auf Deploy klicken**, erst Schritt 3.

## 3. Environment Variables
Auf derselben Seite unter **Environment Variables** (oder später: Projekt → Settings → Environment Variables) eintragen:

- `OPENAI_API_KEY` – dein OpenAI-Key. Empfehlung: in OpenAI einen eigenen neuen Key für dieses Projekt anlegen.
- `BREVO_API_KEY` – dein Brevo-Key. Empfehlung: in Brevo unter SMTP & API einen eigenen neuen Key anlegen.
- `RESULT_SIGNING_SECRET` – neue Zufallszeichenfolge, mindestens 32 Zeichen. Erzeugen z. B. mit einem Passwortmanager (64 Zeichen, nur Buchstaben und Ziffern). Nur hier eintragen, nirgends sonst.
- `RESULT_PAGE_URL` – Adresse der Ergebnisseite. Für die Testphase die Adresse der Website-Vorschau, später die endgültige URL.
- `ALLOWED_ORIGIN` – Domain der Website ohne Pfad und ohne „/“ am Ende, z. B. `https://beispiel.de`. Mehrere durch Komma trennen.

Dann **Deploy**.

## 4. Adresse an die Website geben
1. Nach dem Deploy zeigt Vercel die Projektadresse (z. B. `https://htc-profil-test-backend.vercel.app`).
2. Diese Adresse im Tweak **profilApiUrl** der Website eintragen. Solange das Feld leer ist, läuft der Test als Demo ohne Backend.

## 5. Kurztest
- Test einmal mit deiner eigenen E-Mail durchspielen.
- Mail kommt an, Button öffnet die Ergebnisseite, Texte erscheinen.
- Im Link eine Zahl bei `values` ändern und öffnen → „Dieser Ergebnislink funktioniert leider nicht.“ (keine OpenAI-Anfrage).
- Fehler findest du in Vercel unter Projekt → **Logs**.

Wenn du Werte später änderst: Settings → Environment Variables → Wert ändern → Deployments → letztes Deployment → **Redeploy**.
