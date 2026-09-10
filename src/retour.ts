/**
 * Le retour des visiteurs : un bug rencontré, une amélioration souhaitée.
 *
 * Un onglet discret, présent en bas de chaque page du site, mène ici. Le
 * formulaire n'exige rien d'identifiant : le contact est facultatif, l'IP
 * n'est jamais conservée, et la page d'origine est reprise pour savoir de
 * quoi l'on parle. Les retours sont lisibles sur /stats, et poussés vers un
 * webhook (secret RETOUR_WEBHOOK_URL) dès leur arrivée quand il est posé.
 */

import type { Env } from "./sefaria";
import { type Lang, href, altLinks, langSwitcher, htmlAttrs, colophon, t } from "./i18n";

export const GENRES = ["bug", "idee"] as const;
export type Genre = (typeof GENRES)[number];

const MAX_MESSAGE = 2000;
const MAX_CONTACT = 120;
/** Garde-fou global : au-delà, on répond poliment sans écrire (anti-flot). */
const MAX_PAR_HEURE = 40;

/** Les pages du site, pour proposer un endroit plutôt qu'un champ libre. */
const PAGES_SITE = [
  "/", "/question", "/chabbat", "/miel", "/chiourim", "/daf", "/daily",
  "/outils", "/install", "/privacy", "/retour",
];

// ---------------------------------------------------------------------------
// Écriture
// ---------------------------------------------------------------------------

export async function enregistrerRetour(
  env: Env,
  e: { genre: string; message: string; page: string | null; contact: string | null; langue: string | null; pays: string | null }
): Promise<{ ok: boolean; raison?: string }> {
  const message = String(e.message || "").trim().slice(0, MAX_MESSAGE);
  if (message.length < 5) return { ok: false, raison: "court" };
  if (!env.STATS_DB) return { ok: false, raison: "base" };

  const genre: Genre = (GENRES as readonly string[]).includes(e.genre) ? (e.genre as Genre) : "idee";
  // Liste fermée : le formulaire ne propose que des pages du site, tout le
  // reste vient d'une requête forgée et n'a rien à faire en base.
  const page = e.page && PAGES_SITE.includes(e.page) ? e.page : null;
  const contact = e.contact ? String(e.contact).trim().slice(0, MAX_CONTACT) || null : null;
  const langue = ["fr", "en", "he"].includes(String(e.langue)) ? String(e.langue) : null;

  try {
    const recents = await env.STATS_DB.prepare(
      `SELECT COUNT(*) AS n FROM retours WHERE ts >= datetime('now', '-1 hour')`
    ).first<{ n: number }>();
    if ((recents?.n ?? 0) >= MAX_PAR_HEURE) return { ok: false, raison: "flot" };

    await env.STATS_DB.prepare(
      `INSERT INTO retours (ts, genre, message, page, contact, langue, pays) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
    ).bind(new Date().toISOString(), genre, message, page, contact, langue, e.pays).run();
  } catch {
    return { ok: false, raison: "base" };
  }

  await pousserWebhook(env, { genre, message, page, contact, langue, pays: e.pays });
  return { ok: true };
}

/** Notification immédiate. Silencieuse : un webhook muet ne doit jamais faire
 *  échouer un retour déjà enregistré en base. */
async function pousserWebhook(
  env: Env,
  r: { genre: Genre; message: string; page: string | null; contact: string | null; langue: string | null; pays: string | null }
): Promise<void> {
  if (!env.RETOUR_WEBHOOK_URL) return;
  const titre = r.genre === "bug" ? "🐞 Bug signalé" : "💡 Idée proposée";
  const corps = [
    `${titre} sur mamash-ia.com`,
    r.page ? `Page : ${r.page}` : null,
    r.langue ? `Langue : ${r.langue}${r.pays ? ` · ${r.pays}` : ""}` : null,
    "",
    r.message,
    r.contact ? `\nContact laissé : ${r.contact}` : "\n(Aucun contact laissé.)",
    "\nÀ lire sur https://mamash-ia.com/stats",
  ].filter((l) => l !== null).join("\n");
  try {
    await fetch(env.RETOUR_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // « text » convient à Slack, Discord et Mattermost ; les autres champs
      // permettent un traitement structuré (Make, Zapier, n8n…).
      body: JSON.stringify({ text: corps, content: corps, ...r, site: "mamash-ia.com" }),
    });
  } catch {
    // le retour est déjà en base : l'échec de notification reste silencieux
  }
}

// ---------------------------------------------------------------------------
// Lecture, pour /stats
// ---------------------------------------------------------------------------

export interface ChiffresRetours {
  total: number;
  nonLus: number;
  bugs: number;
  idees: number;
  derniers: { id: number; ts: string; genre: string; message: string; page: string | null; contact: string | null; langue: string | null; pays: string | null; lu: number }[];
}

export async function chiffresRetours(env: Env): Promise<ChiffresRetours | null> {
  if (!env.STATS_DB) return null;
  try {
    const g = await env.STATS_DB.prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN lu = 0 THEN 1 ELSE 0 END) AS nonLus,
              SUM(CASE WHEN genre = 'bug' THEN 1 ELSE 0 END) AS bugs,
              SUM(CASE WHEN genre = 'idee' THEN 1 ELSE 0 END) AS idees
       FROM retours`
    ).first<{ total: number; nonLus: number; bugs: number; idees: number }>();
    const d = await env.STATS_DB.prepare(
      `SELECT id, ts, genre, message, page, contact, langue, pays, lu FROM retours ORDER BY id DESC LIMIT 40`
    ).all();
    return {
      total: g?.total ?? 0,
      nonLus: g?.nonLus ?? 0,
      bugs: g?.bugs ?? 0,
      idees: g?.idees ?? 0,
      derniers: (d.results as any[]) ?? [],
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// La page
// ---------------------------------------------------------------------------

const PATH = "/retour";

const S = {
  fr: {
    titre: "Un bug ? Une idée ?",
    meta: "Signaler un bug ou proposer une amélioration sur Mamash IA.",
    chapeau: "Le site est jeune et je le corrige à la main. Dites-moi ce qui coince, ou ce qui manque — c'est lu, vraiment.",
    genreLabel: "De quoi s'agit-il ?",
    bug: "Quelque chose ne marche pas",
    idee: "J'aimerais quelque chose en plus",
    pageLabel: "Sur quelle page ?",
    pageAucune: "Pas de page en particulier",
    msgLabel: "Racontez",
    msgAide: "Ce que vous faisiez, ce que vous attendiez, ce qui s'est passé. Le détail aide.",
    msgBug: "Exemple : sur mon téléphone, le bouton WhatsApp de la feuille de miel partage le lien de la page et pas le document.",
    msgIdee: "Exemple : j'aimerais pouvoir choisir Lyon dans la liste des villes.",
    contactLabel: "Votre contact (facultatif)",
    contactAide: "Uniquement si vous voulez une réponse. E-mail ou téléphone, comme vous préférez.",
    envoyer: "Envoyer",
    envoi: "Envoi…",
    merci: "Reçu, merci.",
    merciSuite: "C'est arrivé de mon côté. Si vous avez laissé un contact, je reviens vers vous.",
    encore: "Envoyer un autre retour",
    erreur: "L'envoi a échoué. Réessayez dans un instant.",
    court: "Écrivez quelques mots de plus, que je comprenne.",
    vieCadre: "Ce formulaire n'enregistre ni votre adresse IP ni votre identité. Le contact n'est demandé que si vous voulez une réponse.",
    retour: "Retour au site",
  },
  en: {
    titre: "A bug? An idea?",
    meta: "Report a bug or suggest an improvement on Mamash IA.",
    chapeau: "The site is young and I fix it by hand. Tell me what breaks, or what is missing — it really does get read.",
    genreLabel: "What is it about?",
    bug: "Something does not work",
    idee: "I would like something more",
    pageLabel: "On which page?",
    pageAucune: "No particular page",
    msgLabel: "Tell me",
    msgAide: "What you were doing, what you expected, what happened. Detail helps.",
    msgBug: "Example: on my phone, the WhatsApp button on the honey sheet shares the page link, not the document.",
    msgIdee: "Example: I would like to pick Lyon from the list of cities.",
    contactLabel: "Your contact (optional)",
    contactAide: "Only if you want an answer. Email or phone, as you prefer.",
    envoyer: "Send",
    envoi: "Sending…",
    merci: "Received, thank you.",
    merciSuite: "It reached me. If you left a contact, I will get back to you.",
    encore: "Send another one",
    erreur: "Sending failed. Try again in a moment.",
    court: "Write a few more words, so I understand.",
    vieCadre: "This form stores neither your IP address nor your identity. The contact is asked only if you want an answer.",
    retour: "Back to the site",
  },
  he: {
    titre: "באג? רעיון?",
    meta: "דיווח על תקלה או הצעת שיפור ב־Mamash IA.",
    chapeau: "האתר צעיר ואני מתקן אותו ביד. ספרו לי מה נתקע או מה חסר — זה באמת נקרא.",
    genreLabel: "במה מדובר?",
    bug: "משהו לא עובד",
    idee: "הייתי רוצה עוד משהו",
    pageLabel: "באיזה עמוד?",
    pageAucune: "לא עמוד מסוים",
    msgLabel: "ספרו לי",
    msgAide: "מה עשיתם, למה ציפיתם, ומה קרה. הפרטים עוזרים.",
    msgBug: "לדוגמה: בטלפון, כפתור הוואטסאפ בדף הדבש משתף את הקישור ולא את המסמך.",
    msgIdee: "לדוגמה: הייתי רוצה לבחור בליון מרשימת הערים.",
    contactLabel: "יצירת קשר (לא חובה)",
    contactAide: "רק אם תרצו תשובה. אימייל או טלפון, כרצונכם.",
    envoyer: "שליחה",
    envoi: "שולח…",
    merci: "התקבל, תודה.",
    merciSuite: "זה הגיע אליי. אם השארתם פרטים, אחזור אליכם.",
    encore: "לשלוח עוד אחד",
    erreur: "השליחה נכשלה. נסו שוב בעוד רגע.",
    court: "כתבו עוד כמה מילים, שאבין.",
    vieCadre: "הטופס אינו שומר את כתובת ה־IP ואינו מזהה אתכם. פרטי הקשר נדרשים רק אם תרצו תשובה.",
    retour: "חזרה לאתר",
  },
} as const;

/** Nom lisible de chaque page, pour la liste déroulante. */
const NOMS_PAGES = {
  fr: { "/": "L'accueil", "/question": "Poser une question", "/chabbat": "Le WhatsApp de Chabbat", "/miel": "La feuille de miel", "/chiourim": "Les chiourim", "/daf": "Le daf", "/daily": "Le limoud du jour", "/outils": "Les outils", "/install": "L'installation", "/privacy": "La vie privée" },
  en: { "/": "Home", "/question": "Ask a question", "/chabbat": "The Shabbat WhatsApp", "/miel": "The honey sheet", "/chiourim": "The shiurim", "/daf": "The daf", "/daily": "Today's limoud", "/outils": "The tools", "/install": "Install", "/privacy": "Privacy" },
  he: { "/": "דף הבית", "/question": "לשאול שאלה", "/chabbat": "הוואטסאפ של שבת", "/miel": "דף הדבש", "/chiourim": "השיעורים", "/daf": "הדף", "/daily": "הלימוד היומי", "/outils": "הכלים", "/install": "התקנה", "/privacy": "פרטיות" },
} as const;

export function retourHtml(lang: Lang): string {
  const s = S[lang];
  const noms = NOMS_PAGES[lang] as Record<string, string>;
  const options = Object.keys(noms)
    .map((p) => `<option value="${p}">${noms[p]}</option>`)
    .join("");

  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.titre} — Mamash IA</title>
<meta name="description" content="${s.meta}">
<meta name="robots" content="noindex">
${altLinks(lang, PATH)}
<link rel="icon" href="/icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600;7..72,700&family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&family=Rubik:wght@900&display=swap" rel="stylesheet">
<style>
  :root { --ink:#082a99; --pop:#ffd23f; --paper:#f7f6f1; --muted:rgba(8,42,153,.62); --line:rgba(8,42,153,.16); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Literata", "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  ::selection { background:var(--pop); color:var(--ink); }
  a { color:var(--ink); text-underline-offset:3px; }
  nav { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1.5rem 0; flex-wrap:wrap; }
  nav .wm { font-family:"Rubik", "Arial Black", sans-serif; font-weight:900; font-size:.92rem; text-transform:uppercase; letter-spacing:.05em; text-decoration:none; direction:ltr; display:flex; align-items:center; gap:.55rem; }
  nav .wm img { width:30px; height:30px; border-radius:50%; }
  nav .r { display:flex; align-items:center; gap:1.1rem; }
  nav .r a { font-family:"Rubik", "Arial Black", sans-serif; font-weight:900; font-size:.7rem; letter-spacing:.09em; text-transform:uppercase; text-decoration:none; }
  main { max-width:660px; margin:2rem auto 0; }
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.1rem,5vw,3.2rem); line-height:1.05; letter-spacing:-.02em; }
  [dir="rtl"] h1 { font-family:"Frank Ruhl Libre", Georgia, serif; letter-spacing:0; }
  .chapeau { margin-top:1rem; color:var(--muted); max-width:34em; }
  form { margin-top:2.4rem; }
  fieldset { border:0; padding:0; margin:0 0 1.8rem; }
  legend, label.t { display:block; font-family:"Rubik", "Arial Black", sans-serif; font-weight:900; font-size:.7rem; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:.6rem; padding:0; }
  .genres { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr)); gap:.8rem; }
  .genres label { display:block; border:1.5px solid var(--line); background:#fff; padding:.9rem 1.05rem; cursor:pointer; font-weight:600; }
  .genres label:hover { border-color:var(--ink); }
  .genres input { position:absolute; opacity:0; pointer-events:none; }
  .genres input:checked + span { display:block; }
  .genres label:has(input:checked) { border-color:var(--ink); border-width:2px; background:var(--pop); }
  .genres label:has(input:focus-visible) { outline:3px solid var(--ink); outline-offset:2px; }
  select, textarea, input[type="text"] { width:100%; font:inherit; color:var(--ink); background:#fff; border:1.5px solid var(--line); border-radius:0; padding:.7rem .85rem; }
  select:focus, textarea:focus, input[type="text"]:focus { outline:0; border-color:var(--ink); border-width:2px; padding:calc(.7rem - .5px) calc(.85rem - .5px); }
  textarea { min-height:11rem; resize:vertical; line-height:1.55; }
  .aide { margin-top:.5rem; font-size:.86rem; color:var(--muted); }
  button { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.1rem; color:var(--ink); background:var(--pop); border:0; border-radius:0; padding:.62rem 1.4rem .72rem; cursor:pointer; box-shadow:0 4px 14px rgba(8,42,153,.16); }
  [dir="rtl"] button { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  button:disabled { opacity:.5; cursor:default; }
  .ligne { display:flex; align-items:center; gap:1.2rem; flex-wrap:wrap; }
  .fb { font-size:.9rem; color:var(--muted); min-height:1.4em; }
  .vie { margin-top:2.2rem; border-inline-start:3px solid var(--pop); padding:.2rem 0 .2rem 1rem; font-size:.88rem; color:var(--muted); }
  [dir="rtl"] .vie { padding:.2rem 1rem .2rem 0; }
  .pot { position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden; }
  .merci { margin-top:2.4rem; border:2px solid var(--ink); background:#fff; padding:1.6rem 1.7rem 1.8rem; }
  .merci h2 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.6rem; }
  [dir="rtl"] .merci h2 { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  .merci p { margin-top:.6rem; color:var(--muted); }
  .merci a { margin-top:1.1rem; display:inline-block; font-family:"Fraunces", Georgia, serif; font-weight:600; }
  footer { margin-top:4rem; padding-top:1.4rem; border-top:1px solid var(--line); font-size:.86rem; color:var(--muted); }
  footer img { width:26px; height:26px; border-radius:50%; vertical-align:-8px; margin-inline-end:.45rem; }
  .lang a { text-decoration:none; opacity:.6; } .lang a:hover { opacity:1; } .lang .cur { font-weight:700; opacity:1; } .lang .dot { opacity:.35; margin:0 .4em; }
</style>
</head>
<body>
<nav>
  <a class="wm" href="${href(lang, "/")}"><img src="/icon.png" alt="">Mamash IA</a>
  <span class="r"><a href="${href(lang, "/")}">${s.retour}</a></span>
</nav>
<main>
  <h1>${s.titre}</h1>
  <p class="chapeau">${s.chapeau}</p>

  <form id="f" novalidate>
    <fieldset>
      <legend>${s.genreLabel}</legend>
      <div class="genres">
        <label><input type="radio" name="genre" value="bug" checked>${s.bug}</label>
        <label><input type="radio" name="genre" value="idee">${s.idee}</label>
      </div>
    </fieldset>

    <fieldset>
      <label class="t" for="page">${s.pageLabel}</label>
      <select id="page" name="page">
        <option value="">${s.pageAucune}</option>
        ${options}
      </select>
    </fieldset>

    <fieldset>
      <label class="t" for="message">${s.msgLabel}</label>
      <textarea id="message" name="message" maxlength="${MAX_MESSAGE}" placeholder="${s.msgBug}" required></textarea>
      <p class="aide">${s.msgAide}</p>
    </fieldset>

    <fieldset>
      <label class="t" for="contact">${s.contactLabel}</label>
      <input type="text" id="contact" name="contact" maxlength="${MAX_CONTACT}" autocomplete="email">
      <p class="aide">${s.contactAide}</p>
    </fieldset>

    <div class="pot" aria-hidden="true"><label>Ne rien écrire ici<input type="text" name="site" tabindex="-1" autocomplete="off"></label></div>

    <div class="ligne">
      <button type="submit" id="go">${s.envoyer}</button>
      <span class="fb" id="fb"></span>
    </div>
  </form>

  <p class="vie">${s.vieCadre}</p>

  <div class="merci" id="merci" hidden>
    <h2>${s.merci}</h2>
    <p>${s.merciSuite}</p>
    <a href="#" id="encore">${s.encore}</a>
  </div>

  <footer>
    <p><a href="${href(lang, "/")}">mamash-ia.com</a> · <a href="${href(lang, "/privacy")}">${lang === "he" ? "פרטיות" : lang === "en" ? "Privacy" : "Vie privée"}</a> · ${langSwitcher(lang, PATH)}</p>
    <p style="margin-top:.6rem"><img src="/icon.png" alt="">${colophon(lang)}</p>
  </footer>
</main>
<script>
(function () {
  var f = document.getElementById("f"), go = document.getElementById("go");
  var fb = document.getElementById("fb"), merci = document.getElementById("merci");
  var msg = document.getElementById("message");

  // La page d'où l'on vient : reprise de ?de=, sinon on laisse au choix.
  try {
    var de = new URLSearchParams(location.search).get("de");
    if (de) {
      var sel = document.getElementById("page");
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === de) { sel.selectedIndex = i; break; }
      }
    }
  } catch (e) {}

  // L'exemple suit le genre choisi : on ne demande pas la même chose.
  f.querySelectorAll('input[name="genre"]').forEach(function (r) {
    r.addEventListener("change", function () {
      msg.setAttribute("placeholder", r.value === "bug" ? ${JSON.stringify(s.msgBug)} : ${JSON.stringify(s.msgIdee)});
    });
  });

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var texte = msg.value.trim();
    if (texte.length < 5) { fb.textContent = ${JSON.stringify(s.court)}; msg.focus(); return; }
    go.disabled = true; fb.textContent = ${JSON.stringify(s.envoi)};
    fetch("/api/retour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        genre: (f.querySelector('input[name="genre"]:checked') || {}).value || "idee",
        message: texte,
        page: document.getElementById("page").value || null,
        contact: document.getElementById("contact").value.trim() || null,
        langue: ${JSON.stringify(lang)},
        site: f.querySelector('input[name="site"]').value
      })
    })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) throw 0;
        f.hidden = true; merci.hidden = false; fb.textContent = "";
        merci.scrollIntoView({ behavior: "smooth", block: "center" });
        if (window.gtag) gtag("event", "retour_envoye");
      })
      .catch(function () { go.disabled = false; fb.textContent = ${JSON.stringify(s.erreur)}; });
  });

  document.getElementById("encore").addEventListener("click", function (e) {
    e.preventDefault();
    f.reset(); f.hidden = false; merci.hidden = true; go.disabled = false;
    msg.focus();
  });
})();
</script>
</body>
</html>`;
}
