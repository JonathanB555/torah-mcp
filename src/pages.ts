/**
 * Pages additionnelles : /daily (limoud du jour, rendu serveur) et /he
 * (accueil en hébreu, RTL).
 */

import type { Env } from "./sefaria";

const STYLE = `
  :root { --ink:#1f2430; --muted:#5b6272; --accent:#0f5c8c; --paper:#faf9f6; --card:#ffffff; --line:#e5e2da; }
  * { box-sizing:border-box; margin:0; }
  body { font:16px/1.65 -apple-system, "Segoe UI", Roboto, sans-serif; color:var(--ink); background:var(--paper); padding:3rem 1.25rem 4rem; }
  main { max-width:680px; margin:0 auto; }
  h1 { font-size:2rem; line-height:1.2; margin-bottom:.5rem; }
  h2 { font-size:1.15rem; margin:2.2rem 0 .7rem; }
  .muted { color:var(--muted); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:1.1rem 1.3rem; margin:.9rem 0; }
  .url { display:block; background:#10304a; color:#eaf3fa; border-radius:8px; padding:.8rem 1rem; font-family:ui-monospace, Menlo, monospace; font-size:.95rem; margin:.6rem 0; word-break:break-all; }
  a { color:var(--accent); }
  ul { padding-left:1.3rem; } li { margin:.3rem 0; }
  [dir="rtl"] ul { padding-left:0; padding-right:1.3rem; }
  .he { font-size:1.15em; }
  footer { margin-top:2.5rem; font-size:.88rem; color:var(--muted); }
  .item-title { font-weight:600; }
`;

// ----------------------------------------------------------------------------
// /daily — le limoud du jour
// ----------------------------------------------------------------------------

export async function renderDaily(env: Env): Promise<string> {
  let items: any[] = [];
  let date = "";
  try {
    const resp = await fetch(`${env.SEFARIA_API_URL}/calendars`, {
      headers: { Accept: "application/json", "User-Agent": "torah-mcp/1.4 (+https://torah-mcp.com)" },
      cf: { cacheTtl: 1800, cacheEverything: true },
    } as RequestInit);
    const data: any = await resp.json();
    items = data.calendar_items || [];
    date = data.date || "";
  } catch {
    // La page reste servie même si Sefaria est indisponible.
  }

  const cards = items
    .map((i: any) => {
      const ref = i.ref ? encodeURIComponent(String(i.ref).replace(/ /g, "_")) : "";
      const lien = ref ? `https://www.sefaria.org/${ref}` : "https://www.sefaria.org";
      const he = i.displayValue?.he ? ` <span class="he" dir="rtl">· ${i.displayValue.he}</span>` : "";
      return `<div class="card"><span class="item-title">${i.title?.en ?? ""}</span> — <a href="${lien}">${i.displayValue?.en ?? i.ref ?? ""}</a>${he}</div>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Le limoud du jour — Torah MCP</title>
<meta name="description" content="Paracha, daf yomi, Rambam quotidien et tous les cycles d'étude du jour, avec liens directs vers les textes.">
<style>${STYLE}</style>
</head>
<body>
<main>
  <h1>Le limoud du jour</h1>
  <p class="muted">${date} — cycles d'étude du jour, textes servis par <a href="https://www.sefaria.org">Sefaria</a>. <a href="/">Qu'est-ce que Torah MCP ?</a></p>
  ${cards || '<div class="card">Calendriers momentanément indisponibles — réessayez dans un instant.</div>'}
  <h2>Étudier avec Claude</h2>
  <div class="card">
    <p>Ajoutez Torah MCP à claude.ai (Settings → Connectors → Add custom connector) et demandez « le daf du jour en havrouta » :</p>
    <span class="url">https://torah-mcp.com/mcp</span>
  </div>
  <footer><p><a href="/">Accueil</a> · <a href="/he">עברית</a> · <a href="/privacy">Confidentialité</a></p></footer>
</main>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// /he — accueil en hébreu
// ----------------------------------------------------------------------------

export const LANDING_HE = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Torah MCP — לימוד עם מקורות אמיתיים ב-Claude</title>
<meta name="description" content="שרת MCP חינמי: משמעת מקורות ל-Claude — קריאת הטקסטים האמיתיים דרך ספריא, קטלוג HebrewBooks, זמנים וגימטריה. בלי חשבון, בלי איסוף נתונים.">
<style>${STYLE}</style>
</head>
<body>
<main>
  <h1>Torah MCP</h1>
  <p class="muted">משמעת מקורות ל-Claude: אף ציטוט מהזיכרון. קריאת הטקסטים דרך ספריא, קטלוג HebrewBooks, שיטת לימוד מובנית, זמנים וגימטריה. חינם, בלי חשבון, בלי איסוף נתונים.</p>

  <h2>מה זה משנה</h2>
  <p>עוזרי AI עונים על שאלות בהלכה «מהזיכרון» — עם סיכון לציטוטים משובשים או בדויים. Torah MCP כופה שיטה: לפני כל תשובה בענייני תורה, Claude טוען משמעת לימוד המחייבת אותו לקרוא את הטקסט האמיתי (דרך ה-API של <a href="https://www.sefaria.org">ספריא</a>), לצטט במדויק, לציין מחלוקות, ולתת קישורי <a href="https://hebrewbooks.org">hebrewbooks.org</a> ללימוד מן הדף — בלי לבדות מקור לעולם.</p>

  <h2>התקנה — claude.ai (2 דקות)</h2>
  <div class="card">
    <ol>
      <li>פתחו <a href="https://claude.ai/settings/connectors">claude.ai → Settings → Connectors</a></li>
      <li>לחצו על <strong>Add custom connector</strong></li>
      <li>הדביקו את הכתובת:</li>
    </ol>
    <span class="url" dir="ltr">https://torah-mcp.com/mcp</span>
    <p class="muted">קראו לו «Torah» ואשרו. עובד גם באפליקציה בנייד.</p>
  </div>

  <h2>הכלים</h2>
  <ul>
    <li>שיטת הלימוד — נטענת לפני כל תשובה תורנית</li>
    <li>מצב חברותא — Claude שואל, מקשה ומבקש לימוד זכות על שתי הדעות, במקום לתת תשובות</li>
    <li>חיפוש בקטלוג HebrewBooks (~65,000 ספרים סרוקים)</li>
    <li>טקסט, מפרשים וחיפוש בספריית ספריא</li>
    <li>לוחות לימוד: פרשה, דף יומי, רמב"ם יומי — וגם <a href="/daily">דף «הלימוד היומי»</a></li>
    <li>זמני היום וזמני שבת (Hebcal), המרת תאריכים עבריים, גימטריה, ניקוד (דיקטה)</li>
  </ul>

  <h2>הצמד המושלם: עם ה-MCP הרשמי של ספריא</h2>
  <div class="card">
    <p>לספריא יש שרת MCP רשמי משלה, מצוין לגישה מעמיקה לספרייה. התקינו את שניהם — הרשמי לעומק, Torah MCP למשמעת הציטוט, לשיטה ול-HebrewBooks:</p>
    <span class="url" dir="ltr">https://mcp.sefaria.org/sse</span>
  </div>

  <footer>
    <p><a href="https://www.sefaria.org" aria-label="Powered by Sefaria"><img src="https://files.readme.io/dcee0a8-image.png" alt="Powered by Sefaria" width="139" height="72" style="display:block;margin-bottom:.7rem"></a>
    הטקסטים מוגשים דרך ה-API הציבורי של ספריא — הרישיונות מצוינים בכל תשובה. הפרויקט עצמאי ואינו קשור לספריא. קוד מקור: <a href="https://github.com/JonathanB555/torah-mcp" dir="ltr">github.com/JonathanB555/torah-mcp</a> (MIT).</p>
    <p><a href="/">Français</a> · <a href="/daily">הלימוד היומי</a> · <a href="/privacy">פרטיות</a></p>
  </footer>
</main>
</body>
</html>`;
