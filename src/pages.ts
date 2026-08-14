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
    הטקסטים מוגשים דרך ה-API הציבורי של ספריא — הרישיונות מצוינים בכל תשובה. הפרויקט עצמאי ואינו קשור לספריא. קוד מקור: <a href="https://github.com/JonathanB555/torah-mcp" dir="ltr">github.com/JonathanB555/torah-mcp</a> (MIT).</p>
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
</style>
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

  <div class="tool">
    <h2>Zmanim et Chabbat</h2>
    <p class="d">Les horaires du jour ou de Chabbat pour votre ville (données Hebcal).</p>
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
    <form data-api="date">
      <input type="date" name="date">
      <button>Convertir</button>
    </form>
    <div class="out" data-render="date"></div>
  </div>

  <div class="tool">
    <h2>Guematria</h2>
    <p class="d">Cinq méthodes, mot à mot : hechrechi, gadol, katan, siduri, atbash.</p>
    <form data-api="gematria">
      <input type="text" name="texte" dir="rtl" placeholder="חי" style="font-family:Georgia,serif;font-size:1.1rem">
      <button>Calculer</button>
    </form>
    <div class="out" data-render="gematria"></div>
  </div>

  <div class="tool">
    <h2>Nikoud</h2>
    <p class="d">Vocalisation d'un texte hébreu par le nakdan de Dicta.</p>
    <form data-api="nikoud" data-post="1">
      <textarea name="texte" placeholder="ואהבת לרעך כמוך"></textarea>
      <button>Vocaliser</button>
    </form>
    <div class="out he" data-render="nikoud"></div>
  </div>

  <div class="tool">
    <h2>Fiche source</h2>
    <p class="d">Une carte hébreu + traduction + lien, prête à coller dans WhatsApp. Le texte est lu via Sefaria.</p>
    <form data-api="fiche">
      <input type="text" name="ref" placeholder="Pirkei Avot 1:14, Berakhot 2a…">
      <button>Composer</button>
    </form>
    <div class="out" data-render="fiche"></div>
  </div>

  <a class="back" href="/">← Retour à l'accueil</a>
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
      return "<table>" + Object.keys(noms).filter(function(k){return t[k];}).map(function (k) {
        return "<tr><td>" + noms[k] + "</td><td>" + esc(String(t[k]).slice(11,16)) + "</td></tr>";
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
      return "<table><tr><th>Mot</th><th>Hechrechi</th><th>Gadol</th><th>Katan</th><th>Siduri</th><th>Atbash</th></tr>" + rows +
        "<tr><th>Total</th><th>" + t.hechrechi + "</th><th>" + t.gadol + "</th><th>" + t.katan + "</th><th>" + t.siduri + "</th><th>" + t.atbash + "</th></tr></table>";
    },
    nikoud: function (d) {
      return esc(d.vocalise || "") + "<p style='margin-top:.5rem;color:#6d675c;font-size:.72rem;direction:ltr'>" + esc(d.credit||"") + "</p>";
    },
    fiche: function (d) {
      var id = "f" + Date.now();
      return "<div id='" + id + "' style='white-space:pre-wrap'>" + esc(d.fiche||"") + "</div><button class='copy' style='margin-top:.6rem' onclick=\\"navigator.clipboard.writeText(document.getElementById('" + id + "').innerText).then(()=>{this.textContent='Copié !'})\\">Copier pour WhatsApp</button>";
    },
  };
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
