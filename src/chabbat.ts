/**
 * Le WhatsApp de Chabbat — généré chaque vendredi matin (cron), publié sur
 * /chabbat en trois langues avec [ Copier ] et [ Partager sur WhatsApp ].
 *
 * Génération : les données réelles (paracha, haftara, daf yomi, zmanim
 * Paris/Marseille/Genève, date hébraïque) sont rassemblées côté serveur, puis
 * Claude compose le message français — avec le tool sefaria_text pour LIRE la
 * haftara avant d'en parler — sur le gabarit validé par Jonathan (un fil, une
 * morale, pas de catalogue). Un second appel traduit en anglais et en hébreu.
 * Stockage D1 (table chabbat), une ligne par vendredi.
 */

import type { Env } from "./sefaria";
import { sefariaHandlers, sefariaTools } from "./sefaria";
import { limoudHandlers } from "./limoud";
import { type Lang, altLinks, htmlAttrs, href, langSwitcher, colophon, t } from "./i18n";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-5";
const VILLES = ["paris", "marseille", "geneve"] as const;

const GABARIT = `🕯️ *Chabbat Ki Tétsé* — כי תצא
*8 Eloul 5786* · 21-22 août

Entrée · sortie :
*Paris* 20 h 36 · 21 h 44
*Marseille* 20 h 14 · 21 h 16
*Genève* 20 h 16 · 21 h 20

📖 *Devarim 21, 10 – 25, 19*

Ki Tétsé est la paracha la plus riche de la Torah en mitsvot — et regardez lesquelles : rendre un objet perdu, relever l'âne qui plie sous sa charge, poser une rambarde sur son toit, renvoyer la mère avant de prendre les œufs, payer l'ouvrier le jour même, garder des poids justes dans son sac.

Pas une seule ne se passe à la synagogue. Toutes se passent sur la route, sur le chantier, au marché — là où personne ne regarde.

C'est le message de ce Chabbat : *la grandeur ne se joue pas dans les grands moments, elle se construit dans les petits.* On ne devient pas quelqu'un de bien en pensant de belles choses ; on le devient en posant une rambarde pour que l'autre ne tombe pas.

Le daf yomi de ce jour tombe à propos : *Houlin 113*, la sougya de la viande et du lait — la Torah jusque dans la cuisine. Et la haftara (Isaïe 54) répond en écho : les montagnes peuvent chanceler, l'attachement de D.ieu, lui, ne bouge pas. À nous les détails, à Lui la constance.

📚 Tous les cycles du jour, avec les textes : torah-mcp.com/daily
❓ Une question sur la paracha ? torah-mcp.com/question

*Chabbat chalom !*`;

const CONSIGNES = `Tu rédiges le message WhatsApp de Chabbat du site torah-mcp.com, en français.

Règles absolues :
- Ne cite QUE ce que tu as lu : avant d'écrire, lis la haftara avec le tool
  sefaria_text (et, si utile, le début de la paracha). Aucun verset, aucun
  midrach, aucune citation de mémoire. Le contenu général de la paracha
  (ses thèmes connus) peut être évoqué sans citation textuelle.
- Translittération française séfarade : ch (pas sh), t (pas th), h, ts, k —
  Chabbat, paracha, mitsvot, Houlin, Tétsé.
- Un seul fil et une vraie morale : choisis UNE idée de la paracha, développe-la,
  et fais servir la haftara (et le daf yomi seulement si le lien est réel et
  naturel — sinon ne le mentionne pas) à cette même idée. Pas de catalogue.
- Format WhatsApp : *gras* avec astérisques, émojis sobres (🕯️📖🌊📚❓ au plus),
  aucune mise en forme Markdown (pas de ##, pas de liens []()).
- Reprends EXACTEMENT la structure du gabarit ci-dessous : en-tête (nom de la
  paracha translittéré + nom hébreu), date hébraïque et dates civiles, horaires
  des trois villes, corps (référence de la paracha puis le développement),
  les deux liens du site, « *Chabbat chalom !* » final.
- Longueur totale : proche du gabarit (ni plus courte de moitié, ni double).
- Réponds par le message seul, sans préambule ni commentaire.`;

async function appelClaude(env: Env, system: string, messages: any[], tools?: any[], maxTokens = 2500): Promise<any> {
  const resp = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY!, "anthropic-version": ANTHROPIC_VERSION },
    body: JSON.stringify({ model: env.ANTHROPIC_MODEL || DEFAULT_MODEL, max_tokens: maxTokens, system, ...(tools?.length ? { tools } : {}), messages }),
  });
  if (!resp.ok) throw new Error(`API Anthropic ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  return resp.json();
}

/** Vendredi de la semaine courante (UTC), au format YYYY-MM-DD. */
export function vendrediCourant(now = new Date()): string {
  const d = new Date(now);
  const delta = (5 - d.getUTCDay() + 7) % 7; // 5 = vendredi ; dimanche→5, vendredi→0, samedi→6 (vendredi écoulé la veille)
  d.setUTCDate(d.getUTCDate() + (d.getUTCDay() === 6 ? -1 : delta));
  return d.toISOString().slice(0, 10);
}

export async function genererChabbat(env: Env): Promise<{ vendredi: string; ok: boolean; detail?: string }> {
  const vendredi = vendrediCourant();
  if (!env.STATS_DB) return { vendredi, ok: false, detail: "STATS_DB absent" };
  if (!env.ANTHROPIC_API_KEY) return { vendredi, ok: false, detail: "ANTHROPIC_API_KEY absent" };

  // 1. Les données réelles, par les mêmes handlers que les tools MCP.
  const [calendrier, date, ...zmanim] = await Promise.all([
    sefariaHandlers.sefaria_calendar({}, env),
    limoudHandlers.date_hebraique({}, env),
    ...VILLES.map((v) => limoudHandlers.zmanim({ ville: v, chabbat: true }, env)),
  ]);
  const donnees = JSON.stringify({ calendrier, date_hebraique: date, zmanim: Object.fromEntries(VILLES.map((v, i) => [v, zmanim[i]])) });

  // 2. Composition française, avec lecture réelle (sefaria_text, 4 tours max).
  const toolDefs = sefariaTools
    .filter((t) => t.name === "sefaria_text")
    .map((t) => ({ name: t.name, description: t.description || t.name, input_schema: t.inputSchema }));
  const system = `${CONSIGNES}\n\n# Gabarit (semaine précédente — structure et ton à reproduire, contenu à renouveler)\n\n${GABARIT}`;
  const messages: any[] = [{ role: "user", content: `Données du jour (calendriers Sefaria, date hébraïque, zmanim de Chabbat) :\n${donnees}\n\nLis la haftara, puis rédige le message de cette semaine.` }];
  let fr = "";
  for (let tour = 0; tour < 5; tour++) {
    const data = await appelClaude(env, system, messages, toolDefs);
    const content: any[] = data.content || [];
    const uses = content.filter((b) => b.type === "tool_use");
    if (data.stop_reason !== "tool_use" || uses.length === 0 || tour === 4) {
      fr = content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      break;
    }
    messages.push({ role: "assistant", content });
    const results = await Promise.all(
      uses.map(async (u: any) => {
        let out: string;
        try {
          const r = await sefariaHandlers.sefaria_text(u.input || {}, env);
          out = typeof r === "string" ? r : JSON.stringify(r);
        } catch (e: any) {
          out = `Erreur : ${e?.message || e}`;
        }
        return { type: "tool_result", tool_use_id: u.id, content: out.slice(0, 7000) };
      })
    );
    messages.push({ role: "user", content: results });
  }
  if (!fr || !fr.includes("Chabbat chalom")) return { vendredi, ok: false, detail: "composition française invalide" };

  // 3. Traductions anglaise et hébraïque du même message.
  const trData = await appelClaude(
    env,
    `Tu traduis un message WhatsApp de Chabbat. Rends deux versions complètes du message fourni :
- entre <EN> et </EN> : anglais naturel, translittération anglaise usuelle (Shabbat, parashah, Rashi…), liens torah-mcp.com/en/daily et torah-mcp.com/en/question, « *Shabbat shalom!* » final ;
- entre <HE> et </HE> : hébreu israélien soigné (pas de calque), les versets cités le sont dans leur texte original, liens torah-mcp.com/he/daily et torah-mcp.com/he/question, « *שבת שלום!* » final.
Conserve la structure, les *gras* WhatsApp et les émojis. Réponds par les deux blocs seuls.`,
    [{ role: "user", content: fr }],
    undefined,
    3500
  );
  const trText = (trData.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
  const en = trText.match(/<EN>([\s\S]*?)<\/EN>/)?.[1]?.trim() || "";
  const he = trText.match(/<HE>([\s\S]*?)<\/HE>/)?.[1]?.trim() || "";
  if (!en || !he) return { vendredi, ok: false, detail: "traductions invalides" };

  await env.STATS_DB.prepare(`INSERT OR REPLACE INTO chabbat (vendredi, fr, en, he, ts) VALUES (?1, ?2, ?3, ?4, ?5)`)
    .bind(vendredi, fr, en, he, new Date().toISOString())
    .run();
  return { vendredi, ok: true };
}

// ---------------------------------------------------------------------------
// La page /chabbat
// ---------------------------------------------------------------------------

const T = {
  fr: {
    title: "Le WhatsApp de Chabbat — Torah MCP",
    desc: "Le message de Chabbat de la semaine — paracha, horaires, un fil et une morale — prêt à copier dans WhatsApp.",
    h1: 'Le <strong>WhatsApp</strong> de Chabbat.',
    chapeau: "Chaque vendredi matin, le site compose le message de la semaine : la paracha, les horaires de Paris, Marseille et Genève, un fil, une morale — la haftara réellement lue avant d'être citée. Copiez, envoyez.",
    copier: "Copier le message",
    partager: "Partager sur WhatsApp",
    copie: "Copié.",
    copieErr: "Copie impossible ici — sélectionnez le texte à la main.",
    vide: "Le premier message sera composé vendredi matin — revenez alors, ou recevez-le en installant Torah MCP dans Claude.",
    genere: "Composé le",
    nav: { question: "Une question", daf: "Le daf", outils: "Outils", install: "Installer le MCP" },
    foot: { accueil: "Accueil", daily: "Limoud du jour", privacy: "Confidentialité" },
  },
  en: {
    title: "The Shabbat WhatsApp — Torah MCP",
    desc: "This week's Shabbat message — parashah, candle-lighting times, one thread and one lesson — ready to paste into WhatsApp.",
    h1: 'The Shabbat <strong>WhatsApp</strong>.',
    chapeau: "Every Friday morning the site composes the week's message: the parashah, times for Paris, Marseille and Geneva, one thread, one lesson — the haftarah actually read before being quoted. Copy it, send it.",
    copier: "Copy the message",
    partager: "Share on WhatsApp",
    copie: "Copied.",
    copieErr: "Copying failed here — select the text by hand.",
    vide: "The first message will be composed on Friday morning — come back then, or get it by installing Torah MCP in Claude.",
    genere: "Composed on",
    nav: { question: "Ask a question", daf: "The daf", outils: "Tools", install: "Install the MCP" },
    foot: { accueil: "Home", daily: "Today's learning", privacy: "Privacy" },
  },
  he: {
    title: "הוואטסאפ של שבת — Torah MCP",
    desc: "מסר השבת של השבוע — פרשה, זמני הדלקת נרות, חוט אחד ומוסר אחד — מוכן להדבקה בוואטסאפ.",
    h1: 'הוואטסאפ של <strong>שבת</strong>.',
    chapeau: "בכל יום שישי בבוקר האתר מחבר את מסר השבוע: הפרשה, זמני פריז, מרסיי וז'נבה, חוט אחד, מוסר אחד — ההפטרה נקראת באמת לפני שהיא מצוטטת. העתיקו ושלחו.",
    copier: "העתקת המסר",
    partager: "שיתוף בוואטסאפ",
    copie: "הועתק.",
    copieErr: "ההעתקה נכשלה — סמנו את הטקסט ידנית.",
    vide: "המסר הראשון יחובר ביום שישי בבוקר — חזרו אז, או קבלו אותו בהתקנת Torah MCP ב-Claude.",
    genere: "חובר בתאריך",
    nav: { question: "שאלה", daf: "הדף", outils: "כלים", install: "התקנת ה-MCP" },
    foot: { accueil: "עמוד הבית", daily: "הלימוד היומי", privacy: "פרטיות" },
  },
} as const;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function chabbatPage(env: Env, lang: Lang): Promise<string> {
  const s = T[lang];
  let row: any = null;
  try {
    row = env.STATS_DB
      ? await env.STATS_DB.prepare(`SELECT vendredi, fr, en, he, ts FROM chabbat ORDER BY vendredi DESC LIMIT 1`).first()
      : null;
  } catch {}
  const texte: string = row ? row[lang] || row.fr : "";
  const dateGen = row
    ? new Date(row.ts).toLocaleDateString(t(lang, { fr: "fr-FR", en: "en-GB", he: "he-IL" }), { day: "numeric", month: "long", year: "numeric" })
    : "";
  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${s.desc}">
${altLinks(lang, "/chabbat")}
<link rel="icon" href="/icon.png" type="image/png">
<meta property="og:type" content="website">
<meta property="og:title" content="${s.title}">
<meta property="og:description" content="${s.desc}">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com${href(lang, "/chabbat")}">
<meta name="twitter:card" content="summary_large_image">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&display=swap');
  :root { --paper:#f7f6f1; --ink:#082a99; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --muted:rgba(8,42,153,.65); --ease:cubic-bezier(0.16,1,0.3,1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  ::selection { background:var(--ink); color:var(--paper); }
  main { max-width:720px; margin:0 auto; }
  a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.1rem 0; font-size:.92rem; }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; text-decoration:none; font-size:1.05rem; direction:ltr; }
  nav .wm b { font-weight:600; border-bottom:3px solid var(--ink); padding-bottom:1px; }
  nav .r a { text-decoration:none; margin-inline-start:1.1rem; } nav .r a:hover { text-decoration:underline; }
  nav .r .lang { margin-inline-start:1.4rem; }
  .lang { font-size:.82rem; letter-spacing:.08em; } .lang a { text-decoration:none; opacity:.6; } .lang a:hover { opacity:1; text-decoration:underline; } .lang .cur { font-weight:700; } .lang .dot { opacity:.35; margin:0 .45em; }
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.2rem,5vw,3.4rem); line-height:1.05; letter-spacing:-.02em; margin:3rem 0 .8rem; }
  h1 strong { font-weight:600; }
  [dir="rtl"] h1 { font-family:"Frank Ruhl Libre", Georgia, serif; letter-spacing:0; }
  p.muted { color:var(--muted); max-width:40rem; }
  .msg { margin-top:2.4rem; border:1.5px solid var(--ink-15); padding:1.6rem 1.8rem; white-space:pre-wrap; font-size:1.02rem; line-height:1.65; }
  .meta { margin-top:.7rem; font-size:.82rem; color:var(--muted); }
  .acts { margin-top:1.6rem; display:flex; gap:1.6rem; flex-wrap:wrap; align-items:baseline; font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.05rem; }
  [dir="rtl"] .acts { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  .acts a { text-decoration:none; } .acts a::before { content:"[ "; color:var(--ink-40); } .acts a::after { content:" ]"; color:var(--ink-40); } .acts a:hover::before { content:"[ → "; }
  [dir="rtl"] .acts a:hover::before { content:"[ ← "; }
  .acts .fb { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:400; font-size:.85rem; font-style:italic; color:var(--muted); min-height:1em; }
  footer { margin-top:4rem; font-size:.88rem; color:var(--muted); border-top:1px solid var(--ink-15); padding-top:1.4rem; }
</style>
</head>
<body>
<main>
  <nav>
    <a class="wm" href="${href(lang, "/")}"><b>Torah</b>&nbsp;MCP</a>
    <span class="r"><a href="${href(lang, "/question")}">${s.nav.question}</a><a href="${href(lang, "/daf")}">${s.nav.daf}</a><a href="${href(lang, "/install")}"><strong>${s.nav.install}</strong></a>${langSwitcher(lang, "/chabbat")}</span>
  </nav>
  <h1>${s.h1}</h1>
  <p class="muted">${s.chapeau}</p>
  ${texte ? `<div class="msg" id="msg">${esc(texte)}</div>
  <p class="meta">${s.genere} ${esc(dateGen)}.</p>
  <div class="acts"><a href="#" id="copy">${s.copier}</a><a href="https://wa.me/?text=" id="share" target="_blank" rel="noopener">${s.partager}</a><span class="fb" id="fb"></span></div>` : `<div class="msg">${s.vide}</div>`}
  <footer><p><a href="${href(lang, "/")}">${s.foot.accueil}</a> · <a href="${href(lang, "/daily")}">${s.foot.daily}</a> · <a href="${href(lang, "/privacy")}">${s.foot.privacy}</a> · ${langSwitcher(lang, "/chabbat")}</p><p>${colophon(lang)}</p></footer>
</main>
<script>
(function () {
  var msg = document.getElementById("msg"); if (!msg) return;
  var texte = msg.textContent;
  var fb = document.getElementById("fb");
  function feedback(m) { fb.textContent = m; setTimeout(function () { if (fb.textContent === m) fb.textContent = ""; }, 2500); }
  document.getElementById("share").href = "https://wa.me/?text=" + encodeURIComponent(texte);
  document.getElementById("copy").addEventListener("click", function (e) {
    e.preventDefault();
    (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(texte) : Promise.reject())
      .then(function () { feedback("${s.copie}"); }, function () { feedback("${s.copieErr}"); });
  });
})();
</script>
</body>
</html>`;
}
