/**
 * Pages additionnelles : /daily (limoud du jour, rendu serveur) et /he
 * (accueil en hébreu, RTL).
 */

import type { Env } from "./sefaria";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&display=swap');
  :root { --ink:#082a99; --muted:rgba(8,42,153,.65); --accent:#082a99; --paper:#f7f6f1; --card:#ffffff; --line:rgba(8,42,153,.14); }
  * { box-sizing:border-box; margin:0; }
  body { font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; color:var(--ink); background:var(--paper); padding:3rem 1.25rem 4rem; }
  ::selection { background:var(--ink); color:var(--paper); }
  main { max-width:680px; margin:0 auto; }
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2rem,4.5vw,3rem); line-height:1.08; letter-spacing:-.02em; margin-bottom:.5rem; }
  h2 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.2rem; margin:2.2rem 0 .7rem; }
  .muted { color:var(--muted); }
  .card { background:transparent; border:0; border-top:1px solid var(--line); border-radius:0; padding:1rem 0; margin:0; }
  .url { display:block; background:var(--ink); color:var(--paper); border-radius:0; padding:.85rem 1.1rem; font-family:ui-monospace, Menlo, monospace; font-size:.92rem; margin:.6rem 0; word-break:break-all; }
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
<meta property="og:type" content="website">
<meta property="og:title" content="Torah MCP — la discipline des sources pour Claude">
<meta property="og:description" content="Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com/">
<meta name="twitter:card" content="summary_large_image">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
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
  <footer><p><a href="/">Accueil</a> · <a href="/he">עברית</a> · <a href="/privacy">Confidentialité</a></p><p>Un projet personnel de Jonathan Bensaid.</p></footer>
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
<meta property="og:type" content="website">
<meta property="og:title" content="Torah MCP — la discipline des sources pour Claude">
<meta property="og:description" content="Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com/">
<meta name="twitter:card" content="summary_large_image">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
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
    הטקסטים מוגשים דרך ה-API הציבורי של ספריא — הרישיונות מצוינים בכל תשובה. נעשה בידי יונתן בן־סעיד. הפרויקט עצמאי ואינו קשור לספריא. קוד מקור: <a href="https://github.com/JonathanB555/torah-mcp" dir="ltr">github.com/JonathanB555/torah-mcp</a> (MIT).</p>
    <p><a href="/">Français</a> · <a href="/daily">הלימוד היומי</a> · <a href="/privacy">פרטיות</a></p>
  </footer>
</main>
</body>
</html>`;


// ----------------------------------------------------------------------------
// /outils — les fonctions du MCP utilisables directement sur le site
// ----------------------------------------------------------------------------

export const OUTILS_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Outils — Torah MCP</title>
<meta name="description" content="Zmanim, dates hébraïques, guematria, nikoud et fiches sources — utilisables directement, sans installation.">
<style>
  :root { --paper:#f7f6f1; --card:#ffffff; --ink:#082a99; --muted:rgba(8,42,153,.65); --line:rgba(8,42,153,.18); --accent:#082a99; --gold:rgba(8,42,153,.55); }
  * { box-sizing:border-box; margin:0; }
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&display=swap');
  body { font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; color:var(--ink); background:var(--paper); padding:0 1.25rem 4rem; }
  ::selection { background:var(--ink); color:var(--paper); }
  main { max-width:760px; margin:0 auto; }
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.2rem,5vw,3.4rem); letter-spacing:-.02em; margin:2.6rem 0 .3rem; }
  .muted { color:var(--muted); }
  .tool { background:transparent; border:0; border-top:1px solid var(--line); border-radius:0; padding:1.6rem 0; margin:0; }
  .tool h2 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.35rem; margin-bottom:.2rem; }
  .tool p.d { color:var(--muted); font-size:.9rem; margin-bottom:.8rem; }
  form { display:flex; gap:.6rem; flex-wrap:wrap; align-items:center; }
  input, select, textarea { padding:.45rem .2rem; border:0; border-bottom:1.5px solid var(--line); border-radius:0; font-size:1rem; background:transparent; color:var(--ink); font-family:inherit; }
  input:focus, select:focus, textarea:focus { outline:none; border-bottom-color:var(--ink); }
  textarea { width:100%; min-height:70px; direction:rtl; font-family:Georgia, serif; font-size:1.1rem; }
  input[type=text] { flex:1; min-width:180px; }
  button { padding:.4rem .2rem; border:0; border-radius:0; background:transparent; color:var(--ink); font-weight:600; cursor:pointer; font-family:"Fraunces", Georgia, serif; font-size:1rem; }
  button::before { content:"[ "; color:var(--gold); } button::after { content:" ]"; color:var(--gold); }
  button:hover::before { content:"[ → "; }
  button.copy { font-size:.85rem; font-weight:400; }
  .out { margin-top:.9rem; font-size:.92rem; white-space:pre-wrap; background:transparent; border:0; border-inline-start:2px solid var(--ink); border-radius:0; padding:.4rem 1rem; display:none; }
  .out.he { direction:rtl; font-family:Georgia, serif; font-size:1.15rem; white-space:normal; }
  .out table { border-collapse:collapse; width:100%; font-size:.88rem; }
  .out td, .out th { border-bottom:1px solid var(--line); padding:.3rem .5rem; text-align:left; }
  a { color:var(--accent); }
  .back { display:inline-block; margin-top:1.6rem; color:var(--muted); text-decoration:none; font-size:.9rem; }
  nav.top { padding:1rem 0 0; font-size:.9rem; }
  .modes { display:flex; gap:1.4rem; flex-wrap:wrap; margin:1.6rem 0 .3rem; font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1rem; }
  .modes label { cursor:pointer; opacity:.5; }
  .modes label::before { content:"[ "; color:var(--gold); } .modes label::after { content:" ]"; color:var(--gold); }
  .modes label:has(input:checked) { opacity:1; } .modes label:has(input:checked)::before { content:"[ → "; }
  .modes input { position:absolute; opacity:0; pointer-events:none; }
  .modehelp { font-size:.88rem; color:var(--muted); margin-bottom:.4rem; }
  .beg { display:none; } body.mode-debutant .beg { display:block; }
  .beg.inl { display:none; } body.mode-debutant .beg.inl { display:inline; }
  p.beg { font-size:.92rem; color:var(--muted); margin:.2rem 0 .8rem; }
  .kbd { direction:rtl; display:flex; flex-wrap:wrap; gap:.3rem; margin:.7rem 0 .4rem; }
  .kbd button { font-family:Georgia, serif; font-size:1.15rem; padding:.25rem .5rem; border:1px solid var(--line); background:transparent; min-width:2.1rem; line-height:1.4; }
  .kbd button::before, .kbd button::after { content:none; }
  .kbd button:hover { border-color:var(--ink); }
  .kbd .sp { min-width:5rem; font-size:.8rem; font-family:inherit; }
  .words { direction:rtl; display:flex; flex-wrap:wrap; gap:.4rem 1rem; font-family:Georgia, serif; font-size:1.05rem; margin-bottom:.6rem; }
  .words a { text-decoration:none; border-bottom:1px dotted var(--gold); }
  .refb { display:flex; gap:.6rem; flex-wrap:wrap; align-items:center; margin:.4rem 0 .6rem; }
  .refb input[type=number] { width:5.5rem; }
  .expl td:last-child { color:var(--muted); font-size:.85rem; }
  .ask { border-top:1px solid var(--line); margin-top:1.4rem; padding-top:1rem; font-size:.95rem; }
</style>
<meta property="og:type" content="website">
<meta property="og:title" content="Torah MCP — la discipline des sources pour Claude">
<meta property="og:description" content="Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com/">
<meta name="twitter:card" content="summary_large_image">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
</head>
<body>
<main>
  <nav class="top"><a href="/" style="text-decoration:none;color:var(--muted)">← torah-mcp.com</a> · <a href="/daf" style="color:var(--accent)">Ouvrir le daf du jour</a> · <a href="/daily" style="color:var(--accent)">Le limoud du jour</a></nav>
  <h1>Les outils, sans installation</h1>
  <p class="muted">Les mêmes fonctions que le connecteur Claude, utilisables ici même. Aucune donnée conservée.</p>
  <div class="modes" role="radiogroup" aria-label="Mode">
    <label><input type="radio" name="tmode" value="debutant" checked>Débutant</label>
    <label><input type="radio" name="tmode" value="classique">Classique</label>
  </div>
  <p class="modehelp" id="mh"></p>
  <p class="ask">Une question plutôt qu'un outil ? <a href="/question">Posez-la en français</a> — la réponse est lue dans les textes.</p>

  <div class="tool">
    <h2>Zmanim et Chabbat</h2>
    <p class="d">Les horaires du jour ou de Chabbat pour votre ville (données Hebcal).</p>
    <p class="beg">Les <em>zmanim</em> sont les heures qui rythment la journée juive (lever, dernière heure du Chema, coucher…). En mode débutant, chaque horaire est expliqué. « Horaires de Chabbat » donne l'allumage des bougies et la sortie.</p>
    <form data-api="zmanim">
      <select name="ville">
        <option value="paris">Paris</option><option value="marseille">Marseille</option>
        <option value="lyon">Lyon</option><option value="nice">Nice</option>
        <option value="strasbourg">Strasbourg</option><option value="geneve">Genève</option>
        <option value="bruxelles">Bruxelles</option><option value="jerusalem">Jérusalem</option>
        <option value="tel-aviv">Tel-Aviv</option><option value="new-york">New York</option>
        <option value="londres">Londres</option><option value="montreal">Montréal</option>
        <option value="casablanca">Casablanca</option>
      </select>
      <select name="chabbat"><option value="false">Zmanim du jour</option><option value="true">Horaires de Chabbat</option></select>
      <button>Afficher</button>
    </form>
    <div class="out" data-render="zmanim"></div>
  </div>

  <div class="tool">
    <h2>Date hébraïque</h2>
    <p class="d">Convertit une date civile — avec les événements du jour (fêtes, paracha, Rosh Hodesh).</p>
    <p class="beg">Le calendrier hébraïque compte les années depuis la Création (2026 correspond à 5786–5787) et ses mois suivent la lune. Attention : le jour hébraïque commence la veille au soir.</p>
    <form data-api="date">
      <input type="date" name="date">
      <button>Convertir</button>
    </form>
    <div class="out" data-render="date"></div>
  </div>

  <div class="tool">
    <h2>Guematria</h2>
    <p class="d">Cinq méthodes, mot à mot : hechrechi, gadol, katan, siduri, atbash.</p>
    <p class="beg">Chaque lettre hébraïque vaut un nombre (<bdi>א</bdi>&nbsp;=&nbsp;1 … <bdi>ת</bdi>&nbsp;=&nbsp;400) : la guematria d'un mot est la somme de ses lettres. Pas de clavier hébreu ? Cliquez les lettres ci-dessous, ou choisissez un mot courant.</p>
    <div class="beg">
      <div class="words" data-target="g-texte"><a href="#">חי</a><a href="#">שלום</a><a href="#">אמת</a><a href="#">תורה</a><a href="#">אהבה</a><a href="#">חיים</a><a href="#">ברכה</a><a href="#">שבת</a><a href="#">ישראל</a></div>
      <div class="kbd" data-target="g-texte"></div>
    </div>
    <form data-api="gematria">
      <input type="text" name="texte" id="g-texte" dir="rtl" placeholder="חי" style="font-family:Georgia,serif;font-size:1.1rem">
      <button>Calculer</button>
    </form>
    <div class="out" data-render="gematria"></div>
  </div>

  <div class="tool">
    <h2>Nikoud</h2>
    <p class="d">Vocalisation d'un texte hébreu par le nakdan de Dicta.</p>
    <p class="beg">Le <em>nikoud</em>, ce sont les points-voyelles sous et sur les lettres : un texte hébreu s'écrit d'ordinaire sans, et cet outil les remet — précieux pour apprendre à lire. Saisissez avec le clavier ci-dessous si besoin.</p>
    <div class="beg"><div class="kbd" data-target="n-texte"></div></div>
    <form data-api="nikoud" data-post="1">
      <textarea name="texte" id="n-texte" placeholder="ואהבת לרעך כמוך"></textarea>
      <button>Vocaliser</button>
    </form>
    <div class="out he" data-render="nikoud"></div>
  </div>

  <div class="tool">
    <h2>Fiche source</h2>
    <p class="d">Une carte hébreu + traduction + lien, prête à coller dans WhatsApp. Le texte est lu via Sefaria — en français quand la version existe (Bible du Rabbinat).</p>
    <p class="beg">Choisissez le livre en français, puis le chapitre et le verset (ou la page pour le Talmud) : la référence se compose toute seule.</p>
    <div class="beg refb">
      <select id="rb-livre">
        <optgroup label="Torah"><option value="Genesis">Genèse</option><option value="Exodus">Exode</option><option value="Leviticus">Lévitique</option><option value="Numbers">Nombres</option><option value="Deuteronomy">Deutéronome</option></optgroup>
        <optgroup label="Prophètes"><option value="Joshua">Josué</option><option value="Judges">Juges</option><option value="I Samuel">Samuel I</option><option value="II Samuel">Samuel II</option><option value="I Kings">Rois I</option><option value="II Kings">Rois II</option><option value="Isaiah">Isaïe</option><option value="Jeremiah">Jérémie</option><option value="Ezekiel">Ézéchiel</option><option value="Jonah">Jonas</option></optgroup>
        <optgroup label="Écrits"><option value="Psalms">Psaumes</option><option value="Proverbs">Proverbes</option><option value="Job">Job</option><option value="Song of Songs">Cantique des cantiques</option><option value="Ruth">Ruth</option><option value="Lamentations">Lamentations</option><option value="Ecclesiastes">Ecclésiaste</option><option value="Esther">Esther</option><option value="Daniel">Daniel</option></optgroup>
        <optgroup label="Michna"><option value="Pirkei Avot">Pirké Avot (Maximes des Pères)</option></optgroup>
        <optgroup label="Talmud (page)"><option value="Berakhot" data-daf="1">Berakhot</option><option value="Shabbat" data-daf="1">Chabbat</option><option value="Pesachim" data-daf="1">Pessahim</option><option value="Yoma" data-daf="1">Yoma</option><option value="Sukkah" data-daf="1">Soucca</option><option value="Megillah" data-daf="1">Meguila</option><option value="Ketubot" data-daf="1">Ketoubot</option><option value="Kiddushin" data-daf="1">Kiddouchin</option><option value="Gittin" data-daf="1">Guittin</option><option value="Bava Kamma" data-daf="1">Bava Kamma</option><option value="Bava Metzia" data-daf="1">Bava Metsia</option><option value="Bava Batra" data-daf="1">Bava Batra</option><option value="Sanhedrin" data-daf="1">Sanhédrin</option><option value="Makkot" data-daf="1">Makkot</option><option value="Avodah Zarah" data-daf="1">Avoda Zara</option><option value="Chullin" data-daf="1">Houlin</option></optgroup>
      </select>
      <input type="number" id="rb-ch" min="1" placeholder="chapitre" value="1">
      <input type="number" id="rb-v" min="1" placeholder="verset" value="1">
      <select id="rb-amud" style="display:none"><option value="a">a (recto)</option><option value="b">b (verso)</option></select>
    </div>
    <form data-api="fiche">
      <input type="text" name="ref" id="f-ref" placeholder="Pirkei Avot 1:14, Berakhot 2a…">
      <button>Composer</button>
    </form>
    <div class="out" data-render="fiche"></div>
  </div>

  <a class="back" href="/">← Retour à l'accueil</a>
  <footer><p><a href="/">Accueil</a> · <a href="/he">עברית</a> · <a href="/privacy">Confidentialité</a></p><p>Un projet personnel de Jonathan Bensaid.</p></footer>
</main>
<script>
(function () {
  function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  var renderers = {
    zmanim: function (d) {
      if (d.evenements) {
        return "<table>" + d.evenements.map(function (e) {
          return "<tr><td>" + esc(e.titre) + (e.hebreu ? " · <span dir=rtl>" + esc(e.hebreu) + "</span>" : "") + "</td><td>" + esc((e.date||"").replace("T"," ").slice(0,17)) + "</td></tr>";
        }).join("") + "</table><p style='margin-top:.5rem;color:#6d675c;font-size:.8rem'>" + esc(d.lieu||"") + "</p>";
      }
      var t = d.zmanim || {};
      var noms = { alotHaShachar:"Alot hachahar", sunrise:"Netz (lever)", sofZmanShma:"Sof zman Chema", sofZmanTfilla:"Sof zman tefila", chatzot:"Hatsot", minchaGedola:"Minha guedola", minchaKetana:"Minha ketana", plagHaMincha:"Plag haminha", sunset:"Chkia (coucher)", tzeit7083deg:"Tset hakokhavim" };
      var expl = { alotHaShachar:"l'aube — la journée halakhique commence", sunrise:"lever du soleil — début idéal de la prière du matin", sofZmanShma:"heure limite pour réciter le Chema du matin", sofZmanTfilla:"heure limite pour la prière du matin (Amida)", chatzot:"midi solaire", minchaGedola:"à partir de là, on peut prier Minha (l'après-midi)", minchaKetana:"moment préférable pour Minha", plagHaMincha:"dernière partie de l'après-midi — certains commencent Chabbat à partir de là", sunset:"coucher du soleil — fin de la journée", tzeit7083deg:"sortie des étoiles — la nuit, fin de Chabbat" };
      var beg = document.body.classList.contains("mode-debutant");
      return "<table class='" + (beg ? "expl" : "") + "'>" + Object.keys(noms).filter(function(k){return t[k];}).map(function (k) {
        return "<tr><td>" + noms[k] + "</td><td>" + esc(String(t[k]).slice(11,16)) + "</td>" + (beg ? "<td>" + expl[k] + "</td>" : "") + "</tr>";
      }).join("") + "</table><p style='margin-top:.5rem;color:#6d675c;font-size:.8rem'>" + esc(d.lieu||"") + " — " + esc(d.date||"") + "</p>";
    },
    date: function (d) {
      var ev = (d.events||[]).map(esc).join(" · ");
      return "<strong dir=rtl style='font-family:Georgia,serif;font-size:1.2rem'>" + esc(d.hebrew||"") + "</strong><br>" + esc(String(d.hd)) + " " + esc(d.hm||"") + " " + esc(String(d.hy)) + (ev ? "<br><span style='color:#6d675c'>" + ev + "</span>" : "");
    },
    gematria: function (d) {
      var rows = (d.mots||[]).map(function (m) {
        return "<tr><td dir=rtl style='font-family:Georgia,serif'>" + esc(m.mot) + "</td><td>" + m.hechrechi + "</td><td>" + m.gadol + "</td><td>" + m.katan + "</td><td>" + m.siduri + "</td><td>" + m.atbash + "</td></tr>";
      }).join("");
      var t = d.totaux || {};
      var beg = document.body.classList.contains("mode-debutant");
      var legend = beg ? "<p style='margin-top:.6rem;font-size:.85rem;color:#6d675c'><strong>Hechrechi</strong> : la valeur classique (<bdi>א</bdi>=1 … <bdi>י</bdi>=10, <bdi>כ</bdi>=20 … <bdi>ק</bdi>=100 … <bdi>ת</bdi>=400) — c'est celle qu'on cite d'ordinaire. <strong>Gadol</strong> : les lettres finales (<bdi>ך ם ן ף ץ</bdi>) valent 500 à 900. <strong>Katan</strong> : on réduit chaque lettre à un chiffre (<bdi>י</bdi>=1, <bdi>כ</bdi>=2…). <strong>Siduri</strong> : le rang de la lettre dans l'alphabet (<bdi>א</bdi>=1 … <bdi>ת</bdi>=22). <strong>Atbash</strong> : chaque lettre est remplacée par sa symétrique (<bdi>א↔ת</bdi>, <bdi>ב↔ש</bdi>…) puis comptée.</p>" : "";
      return "<table><tr><th>Mot</th><th>Hechrechi</th><th>Gadol</th><th>Katan</th><th>Siduri</th><th>Atbash</th></tr>" + rows +
        "<tr><th>Total</th><th>" + t.hechrechi + "</th><th>" + t.gadol + "</th><th>" + t.katan + "</th><th>" + t.siduri + "</th><th>" + t.atbash + "</th></tr></table>" + legend;
    },
    nikoud: function (d) {
      return esc(d.vocalise || "") + "<p style='margin-top:.5rem;color:#6d675c;font-size:.72rem;direction:ltr'>" + esc(d.credit||"") + "</p>";
    },
    fiche: function (d) {
      var id = "f" + Date.now();
      return "<div id='" + id + "' style='white-space:pre-wrap'>" + esc(d.fiche||"") + "</div><button class='copy' style='margin-top:.6rem' onclick=\\"navigator.clipboard.writeText(document.getElementById('" + id + "').innerText).then(()=>{this.textContent='Copié !'})\\">Copier pour WhatsApp</button>";
    },
  };
  // Mode débutant / classique (partagé avec /question via localStorage)
  var HELP = { debutant: "Chaque outil est expliqué, avec un clavier hébreu à l'écran et les livres en français.", classique: "Les outils, sans explications — pour qui connaît déjà." };
  var mh = document.getElementById("mh");
  var saved = null; try { saved = localStorage.getItem("tm_mode"); } catch (e) {}
  if (saved === "avance") saved = "classique";
  document.querySelectorAll('input[name=tmode]').forEach(function (r) {
    if (saved && r.value === saved) r.checked = true;
    r.addEventListener("change", function () { applyMode(r.value); try { localStorage.setItem("tm_mode", r.value); } catch (e) {} });
  });
  function applyMode(m) { document.body.classList.toggle("mode-debutant", m === "debutant"); mh.textContent = HELP[m]; }
  applyMode(saved || "debutant");

  // Clavier hébreu à l'écran
  var LETTRES = "אבגדהוזחטיכךלמםנןסעפףצץקרשת".split("");
  document.querySelectorAll(".kbd").forEach(function (k) {
    var target = document.getElementById(k.getAttribute("data-target"));
    function ins(ch) {
      var s = target.selectionStart || target.value.length, e = target.selectionEnd || s;
      target.value = target.value.slice(0, s) + ch + target.value.slice(e);
      target.focus(); target.selectionStart = target.selectionEnd = s + ch.length;
    }
    LETTRES.forEach(function (l) { var b = document.createElement("button"); b.type = "button"; b.textContent = l; b.onclick = function () { ins(l); }; k.appendChild(b); });
    var sp = document.createElement("button"); sp.type = "button"; sp.className = "sp"; sp.textContent = "espace"; sp.onclick = function () { ins(" "); }; k.appendChild(sp);
    var bk = document.createElement("button"); bk.type = "button"; bk.className = "sp"; bk.textContent = "⌫"; bk.onclick = function () { target.value = target.value.slice(0, -1); target.focus(); }; k.appendChild(bk);
  });
  document.querySelectorAll(".words a").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); var t = document.getElementById(a.parentElement.getAttribute("data-target")); t.value = a.textContent; t.focus(); });
  });

  // Constructeur de référence (fiche source)
  var rbL = document.getElementById("rb-livre"), rbC = document.getElementById("rb-ch"), rbV = document.getElementById("rb-v"), rbA = document.getElementById("rb-amud"), fref = document.getElementById("f-ref");
  function buildRef() {
    var opt = rbL.options[rbL.selectedIndex]; var daf = opt.getAttribute("data-daf");
    rbV.style.display = daf ? "none" : ""; rbA.style.display = daf ? "" : "none";
    rbC.placeholder = daf ? "page" : "chapitre";
    fref.value = daf ? opt.value + " " + (rbC.value || 2) + rbA.value : opt.value + " " + (rbC.value || 1) + ":" + (rbV.value || 1);
  }
  [rbL, rbC, rbV, rbA].forEach(function (el) { el.addEventListener("input", buildRef); el.addEventListener("change", buildRef); });
  if (document.body.classList.contains("mode-debutant")) buildRef();
  document.querySelectorAll('input[name=tmode]').forEach(function (r) { r.addEventListener("change", function () { if (r.value === "debutant" && !fref.value) buildRef(); }); });

  document.querySelectorAll("form[data-api]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var api = form.getAttribute("data-api");
      var out = form.parentElement.querySelector(".out");
      out.style.display = "block";
      out.innerHTML = "…";
      var fd = new FormData(form);
      var run;
      if (form.getAttribute("data-post")) {
        var body = {};
        fd.forEach(function (v, k) { body[k] = v; });
        run = fetch("/api/" + api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        var qs = new URLSearchParams();
        fd.forEach(function (v, k) { if (v) qs.set(k, v); });
        run = fetch("/api/" + api + "?" + qs.toString());
      }
      run.then(function (r) { return r.json(); }).then(function (d) {
        out.innerHTML = d.error ? "<span style='color:#7a1f1f'>" + esc(d.error) + "</span>" : renderers[api](d);
      }).catch(function () { out.textContent = "Erreur — réessayez."; });
    });
  });
})();
</script>
</body>
</html>`;
