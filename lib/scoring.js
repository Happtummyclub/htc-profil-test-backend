// Fragen, Antworten und 1/3/5-Scoring – übernommen aus process-results.js.
// Einzige Änderung: Gedankenstrich „–“ einheitlich (freigegeben). Alte Schreibweise mit „-“ wird weiterhin erkannt.

export const QUESTIONS = {
  q1: { dim: "alltagsdynamik", options: ["Meine Wochen sind meist ähnlich und gut planbar", "Es gibt Struktur aber auch immer wieder Planänderungen", "Mein Alltag ist eher unvorhersehbar"] },
  q2: { dim: "mental_load", options: ["Kaum – ich entscheide das eher spontan", "Ein bisschen – etwas Vorbereitung muss sein", "Sehr viel – ich muss ständig planen oder für andere mitdenken"] },
  q3: { dim: "planaenderungen", options: ["Das passiert selten", "Ich passe mich an und verschiebe Mahlzeiten", "Ich greife dann eher zu einer schnell verfügbaren Lösung"] },
  q4: { dim: "einkauf", options: ["Meist nur einmal pro Woche", "Zwei- bis dreimal pro Woche ist realistisch", "Ich kann relativ flexibel nach Bedarf einkaufen"] },
  q5: { dim: "motivation", options: ["Meist genug Motivation um etwas zu kochen", "Das ist unterschiedlich", "Meist wenig Motivation – ich brauche schnelle Lösungen"] },
  q6: { dim: "zeit", options: ["Ich habe meistens ausreichend Zeit", "Es ist unterschiedlich", "Ich habe kaum Zeit dafür"] },
  q7: { dim: "ernaehrungsorientierung", options: ["Eher weniger wichtig – Hauptsache ich werde satt", "Es ist mir wichtig aber nicht mein Hauptfokus", "Ernährung ist ein wichtiger Faktor für mein Wohlbefinden"] },
  q8: { dim: "kochverhalten", options: ["Ich koche selten bis gar nicht", "Ich koche eher selten dafür größere Mengen für mehrere Tage", "Ich koche häufiger frisch"] },
  q9: { dim: "abwechslungsbedarf", options: ["Wiederholungen sind für mich völlig in Ordnung", "Ein bisschen Abwechslung ist mir wichtig", "Ich möchte möglichst keine Wiederholungen"] },
  // Q10/Q11: abgefragt, aber ohne Score (wie bisher).
  q10: { dim: null, options: ["Sehr wenig Platz – höchstens für einzelne Portionen", "Etwas Platz – ein paar vorbereitete Komponenten passen hinein", "Viel Platz – ich kann problemlos mehrere vorbereitete Mahlzeiten lagern"] },
  q11: { dim: null, options: ["Sehr wenig oder gar keinen Platz", "Etwas Platz für einige Portionen", "Viel Platz – ich kann mehrere Gerichte oder Komponenten einfrieren"] },
};

// Reihenfolge der neun Werte – identisch zu buildChartValues() in process-results.js.
const ORDER = ["alltagsdynamik", "mental_load", "motivation", "zeit", "ernaehrungsorientierung", "kochverhalten", "abwechslungsbedarf", "einkauf", "planaenderungen"];
const POINTS = [1, 3, 5];

export function normalize(text) {
  return String(text ?? "").replace(/\s+[-–]\s+/g, " – ").replace(/\s+/g, " ").trim();
}

// Gibt null zurück, wenn eine Antwort fehlt oder unbekannt ist.
export function validateAnswers(answers) {
  if (!answers || typeof answers !== "object") return null;
  const picked = {};
  for (const [id, q] of Object.entries(QUESTIONS)) {
    const idx = q.options.indexOf(normalize(answers[id]));
    if (idx === -1) return null;
    picked[id] = idx;
  }
  return picked;
}

// picked: { q1: 0..2, … }. Unbekannt → 3 (wie im Original).
export function buildValues(picked) {
  const byDim = {};
  for (const [id, q] of Object.entries(QUESTIONS)) {
    if (q.dim) byDim[q.dim] = POINTS[picked[id]] ?? 3;
  }
  return ORDER.map((d) => byDim[d] ?? 3);
}
