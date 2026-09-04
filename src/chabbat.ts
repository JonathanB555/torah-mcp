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

const GABARIT = `🕯️ *Chabbat Ki Tétsé* · כי תצא
📅 8 Eloul 5786 · 21-22 août

🌇 Entrée · ✨ Sortie
📍 *Paris* 20h36 · 21h44
📍 *Marseille* 20h14 · 21h16
📍 *Genève* 20h16 · 21h20

📖 *Devarim 21, 10 – 25, 19*

La paracha la plus riche de la Torah en mitsvot. Et regardez lesquelles : rendre un objet perdu, relever l'âne qui plie, poser une rambarde sur son toit, payer l'ouvrier le jour même.

Pas une seule ne se passe à la synagogue. Toutes se passent sur la route, au chantier, au marché — là où personne ne regarde.

💡 *La grandeur ne se joue pas dans les grands moments — elle se construit dans les petits.*

On ne devient pas quelqu'un de bien en pensant de belles choses. On le devient en posant une rambarde pour que l'autre ne tombe pas.

Et la haftara (Isaïe 54) murmure la même chose : les montagnes peuvent chanceler — Son attachement, lui, ne bouge pas.

📚 Le limoud du jour : mamash-ia.com/daily
💬 Une question ? mamash-ia.com/question

*Chabbat chalom !* ✨`;

const CONSIGNES = `Tu rédiges le message WhatsApp de Chabbat du site mamash-ia.com, en français.

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
- PENSÉ POUR UN TÉLÉPHONE : message court (nettement plus court qu'un article),
  paragraphes de 2-3 phrases brèves maximum, une ligne vide entre chaque bloc.
  Première phrase du corps = une accroche qui donne envie de lire.
- Gras WhatsApp *…* (un seul astérisque de chaque côté) UNIQUEMENT pour : le nom
  de la paracha, les noms de villes, et la phrase-clé de la morale. Pas de ##,
  pas de liens [](), pas de _italique_.
- Émojis : SEULEMENT en tête de ligne, comme repères, et seulement ceux-ci :
  🕯️ (titre), 📅 (date), 🌇/✨ (entrée/sortie), 📍 (ville), 📖 (référence),
  💡 (la morale, sur sa propre ligne), 📚 et 💬 (les deux liens), ✨ (final).
  Jamais d'émoji au milieu d'une phrase.
- Reprends EXACTEMENT la structure du gabarit ci-dessous : en-tête (nom de la
  paracha translittéré + nom hébreu), date hébraïque et dates civiles, horaires
  des trois villes, corps (référence de la paracha puis le développement),
  les deux liens du site, « *Chabbat chalom !* ✨ » final.
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


/** Garde la mise en forme WhatsApp utile, retire le reste (Markdown, émojis hors charte). */
const EMOJIS_CHARTE = new Set(["🕯", "📅", "🌇", "✨", "📍", "📖", "💡", "📚", "💬"]);
function nettoyerWhatsApp(t: string): string {
  // Tout préambule avant la ligne-titre 🕯️ saute (« Voici le message : »…).
  const debut = t.indexOf("🕯");
  if (debut > 0) t = t.slice(debut);
  return t
    .replace(/\*\*+/g, "*")
    .replace(/^#+\s*/gm, "")
    .replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g, "$1 — $2")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\uFE0F?/gu, (m) => (EMOJIS_CHARTE.has(m.replace(/\uFE0F/g, "")) ? m : ""))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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
  fr = nettoyerWhatsApp(fr);
  if (!fr || !fr.includes("Chabbat chalom")) return { vendredi, ok: false, detail: "composition française invalide" };

  // 3. Traductions anglaise et hébraïque du même message.
  const trData = await appelClaude(
    env,
    `Tu traduis un message WhatsApp de Chabbat. Rends deux versions complètes du message fourni :
- entre <EN> et </EN> : anglais naturel, translittération anglaise usuelle (Shabbat, parashah, Rashi…), liens mamash-ia.com/en/daily et mamash-ia.com/en/question, « *Shabbat shalom!* ✨ » final ;
- entre <HE> et </HE> : hébreu israélien soigné (pas de calque), les versets cités le sont dans leur texte original, liens mamash-ia.com/he/daily et mamash-ia.com/he/question, « *שבת שלום!* ✨ » final.
Conserve la structure, les *gras* WhatsApp et les émojis-repères de début de ligne. Réponds par les deux blocs seuls.`,
    [{ role: "user", content: fr }],
    undefined,
    6000
  );
  const trText = (trData.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
  // Analyse tolérante : si une balise fermante manque (réponse tronquée), on
  // prend jusqu'à la balise suivante ou la fin — le message doit rester valide
  // (présence du « Chabbat chalom » final de chaque langue).
  const extraire = (tag: string): string => {
    const m = trText.match(new RegExp(`<${tag}>([\\s\\S]*?)(?:</${tag}>|<(?:EN|HE)>|$)`));
    return m?.[1]?.trim() || "";
  };
  const en = nettoyerWhatsApp(extraire("EN"));
  const he = nettoyerWhatsApp(extraire("HE"));
  if (!en.includes("Shabbat shalom") || !he.includes("שבת שלום")) {
    return { vendredi, ok: false, detail: `traductions invalides (stop: ${trData.stop_reason}, en: ${en.length}, he: ${he.length})` };
  }

  await env.STATS_DB.prepare(`INSERT OR REPLACE INTO chabbat (vendredi, fr, en, he, ts) VALUES (?1, ?2, ?3, ?4, ?5)`)
    .bind(vendredi, fr, en, he, new Date().toISOString())
    .run();
  return { vendredi, ok: true };
}


// ---------------------------------------------------------------------------
// Les GIF de Chabbat — une sélection kitsch assumée (via Tenor), servie par
// le Worker (/api/gif?i=N, cache edge 24 h) : le navigateur du visiteur ne
// contacte jamais Tenor, et le partage direct du fichier devient possible.
// Trois GIF par semaine, rotation déterministe sur la sélection.
// ---------------------------------------------------------------------------

const GIFS: readonly string[] = [
  "https://media1.tenor.com/m/zhtvR8BnewIAAAAC/candle-glass.gif",
  "https://media1.tenor.com/m/A453qfWBo98AAAAC/good-shabbos-shabbat-shalom.gif",
  "https://media1.tenor.com/m/6z1Txw1PbcwAAAAC/love.gif",
  "https://media1.tenor.com/m/LbkRG11g_GcAAAAC/love-you.gif",
  "https://media1.tenor.com/m/JJ27lMtXCGUAAAAC/para-ti.gif",
  "https://media1.tenor.com/m/gYnFoDaQEJ8AAAAC/rose-butterfly.gif",
  "https://media1.tenor.com/m/SkApr6JhiNAAAAAC/shabat-shalom.gif",
  "https://media1.tenor.com/m/of1kTodcFIYAAAAC/shabat-shalom1.gif",
  "https://media1.tenor.com/m/lVLU2M5nQ4IAAAAC/shabbat.gif",
  "https://media1.tenor.com/m/RAM5_8G_k4QAAAAC/shabbat.gif",
  "https://media1.tenor.com/m/dvseeJAVWIIAAAAC/shabbat-hug-friends.gif",
  "https://media1.tenor.com/m/lfzQKaMWV98AAAAC/shabbat-shalom.gif",
  "https://media1.tenor.com/m/f0x8fThoK_4AAAAC/shabbat-shalom.gif",
  "https://media1.tenor.com/m/5uwXiTfDUyQAAAAC/shabbat-shalom.gif",
  "https://media1.tenor.com/m/y-sfn6iYjWkAAAAC/shabbat-shalom.gif",
  "https://media1.tenor.com/m/8lEJTQVpwO4AAAAC/shabbat-shalom.gif",
];

/** Les indices des trois GIF de la semaine (rotation complète sur 16 semaines). */
export function gifsDeLaSemaine(vendredi: string): number[] {
  const semaine = Math.floor(Date.parse(vendredi) / 86_400_000 / 7);
  return [0, 1, 2].map((k) => (semaine * 3 + k) % GIFS.length);
}

/** GET /api/gif?i=N — sert un GIF de la sélection (index borné, jamais d'URL libre). */
export async function servirGif(request: Request): Promise<Response> {
  const i = Number(new URL(request.url).searchParams.get("i"));
  if (!Number.isInteger(i) || i < 0 || i >= GIFS.length) return new Response("Introuvable", { status: 404 });
  const resp = await fetch(GIFS[i], {
    headers: { "User-Agent": "torah-mcp/1.10 (+https://mamash-ia.com)" },
    cf: { cacheTtl: 86_400, cacheEverything: true },
  } as RequestInit);
  if (!resp.ok) return new Response("GIF momentanément indisponible", { status: 502 });
  return new Response(resp.body, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
      "Content-Disposition": 'inline; filename="chabbat-chalom.gif"',
    },
  });
}

// ---------------------------------------------------------------------------
// La page /chabbat
// ---------------------------------------------------------------------------

const T = {
  fr: {
    title: "Le WhatsApp de Chabbat — Mamash IA",
    desc: "Le message de Chabbat de la semaine — paracha, horaires, un fil et une morale — prêt à copier dans WhatsApp.",
    h1: 'Le <strong>WhatsApp</strong> de Chabbat.',
    chapeau: "Chaque vendredi matin, le site compose le message de la semaine : la paracha, les horaires de Paris, Marseille et Genève, un fil, une morale — la haftara réellement lue avant d'être citée. Copiez, envoyez.",
    copier: "Copier le message",
    partager: "Partager sur WhatsApp",
    copie: "Copié.",
    copieErr: "Copie impossible ici — sélectionnez le texte à la main.",
    gifLab: "Le GIF qui va avec",
    gifNote: "Trois au choix — ils changent chaque vendredi. Le bouton envoie le message ET le GIF ensemble : sur téléphone via la feuille de partage, sur ordinateur en copiant le texte et en téléchargeant le GIF.",
    gifGo: "Envoyer message + GIF",
    gifOk: "Parti ! Si seul le GIF a été envoyé, le message est déjà copié — collez-le à la suite.",
    gifDesk: "Message copié et GIF téléchargé — collez le texte (Cmd+V), puis glissez le GIF dans la conversation.",
    gifErr: "GIF momentanément indisponible.",
    gifCredit: "GIF via Tenor.",
    colle: "Message copié — collez-le dans la conversation (Cmd+V ou Ctrl+V).",
    vide: "Le premier message sera composé vendredi matin — revenez alors, ou recevez-le en installant Torah MCP dans Claude.",
    genere: "Composé le",
    nav: { question: "Une question", daf: "Le daf", outils: "Outils", install: "Installer le MCP" },
    foot: { accueil: "Accueil", daily: "Limoud du jour", privacy: "Confidentialité" },
  },
  en: {
    title: "The Shabbat WhatsApp — Mamash IA",
    desc: "This week's Shabbat message — parashah, candle-lighting times, one thread and one lesson — ready to paste into WhatsApp.",
    h1: 'The Shabbat <strong>WhatsApp</strong>.',
    chapeau: "Every Friday morning the site composes the week's message: the parashah, times for Paris, Marseille and Geneva, one thread, one lesson — the haftarah actually read before being quoted. Copy it, send it.",
    copier: "Copy the message",
    partager: "Share on WhatsApp",
    copie: "Copied.",
    copieErr: "Copying failed here — select the text by hand.",
    gifLab: "The GIF to go with it",
    gifNote: "Three to choose from — they change every Friday. The button sends the message AND the GIF together: on a phone via the share sheet, on a computer by copying the text and downloading the GIF.",
    gifGo: "Send message + GIF",
    gifOk: "Sent! If only the GIF went through, the message is already copied — paste it right after.",
    gifDesk: "Message copied and GIF downloaded — paste the text (Cmd+V), then drag the GIF into the conversation.",
    gifErr: "GIF temporarily unavailable.",
    gifCredit: "GIFs via Tenor.",
    colle: "Message copied — paste it into the conversation (Cmd+V or Ctrl+V).",
    vide: "The first message will be composed on Friday morning — come back then, or get it by installing Torah MCP in Claude.",
    genere: "Composed on",
    nav: { question: "Ask a question", daf: "The daf", outils: "Tools", install: "Install the MCP" },
    foot: { accueil: "Home", daily: "Today's learning", privacy: "Privacy" },
  },
  he: {
    title: "הוואטסאפ של שבת — Mamash IA",
    desc: "מסר השבת של השבוע — פרשה, זמני הדלקת נרות, חוט אחד ומוסר אחד — מוכן להדבקה בוואטסאפ.",
    h1: 'הוואטסאפ של <strong>שבת</strong>.',
    chapeau: "בכל יום שישי בבוקר האתר מחבר את מסר השבוע: הפרשה, זמני פריז, מרסיי וז'נבה, חוט אחד, מוסר אחד — ההפטרה נקראת באמת לפני שהיא מצוטטת. העתיקו ושלחו.",
    copier: "העתקת המסר",
    partager: "שיתוף בוואטסאפ",
    copie: "הועתק.",
    copieErr: "ההעתקה נכשלה — סמנו את הטקסט ידנית.",
    gifLab: "הגיף שמתלווה",
    gifNote: "שלושה לבחירה — הם מתחלפים בכל יום שישי. הכפתור שולח את ההודעה ואת הגיף יחד: בטלפון דרך חלון השיתוף, במחשב בהעתקת הטקסט והורדת הגיף.",
    gifGo: "שליחת הודעה + גיף",
    gifOk: "נשלח! אם רק הגיף עבר, ההודעה כבר הועתקה — הדביקו אותה מיד אחריו.",
    gifDesk: "ההודעה הועתקה והגיף ירד — הדביקו את הטקסט (Cmd+V) וגררו את הגיף לשיחה.",
    gifErr: "הגיף אינו זמין כרגע.",
    gifCredit: "גיפים דרך Tenor.",
    colle: "ההודעה הועתקה — הדביקו אותה בשיחה (Cmd+V או Ctrl+V).",
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
  const indices = gifsDeLaSemaine(row?.vendredi || vendrediCourant());
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
<meta property="og:image" content="https://mamash-ia.com/og.png?v=2">
<meta property="og:url" content="https://mamash-ia.com${href(lang, "/chabbat")}">
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
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700;900&family=Archivo+Black&display=swap');
  :root { --paper:#f7f6f1; --ink:#082a99; --pop:#ffd23f; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --muted:rgba(8,42,153,.65); --ease:cubic-bezier(0.16,1,0.3,1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  ::selection { background:var(--pop); color:var(--ink); }
  main { max-width:720px; margin:0 auto; }
  main { position:relative; }
  a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.1rem 0; font-size:.92rem; }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; text-decoration:none; font-size:1.05rem; direction:ltr; }
  nav .wm b { font-weight:600; border-bottom:3px solid var(--pop); padding-bottom:1px; }
  nav .wm img { width:34px; height:34px; border-radius:50%; vertical-align:-11px; margin-inline-end:.55rem; }
  nav .r a { font-family:"Archivo Black", "Arial Black", sans-serif; font-weight:400; font-size:.7rem; letter-spacing:.09em; text-transform:uppercase; text-decoration:none; margin-inline-start:1.1rem; } nav .r a:hover { text-decoration:underline; }
  [dir="rtl"] nav .r a { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:900; font-size:.88rem; letter-spacing:0; text-transform:none; }
  nav .r a strong { background:var(--pop); color:var(--ink); padding:.2rem .55rem .24rem; font-weight:inherit; transition:background .3s var(--ease), color .3s var(--ease); }
  nav .r a:hover strong { background:var(--ink); color:var(--pop); }
  nav .r a:has(strong):hover { text-decoration:none; }
  nav { position:sticky; top:0; z-index:40; background:rgba(247,246,241,.85); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); border-bottom:1.5px solid var(--ink-15); margin:0 -4vw; padding-inline:4vw; }
  nav .r a:not(:has(strong)) { padding-bottom:3px; background-image:linear-gradient(var(--pop), var(--pop)); background-repeat:no-repeat; background-size:0% 2.5px; background-position:0 100%; transition:background-size .3s var(--ease); }
  [dir="rtl"] nav .r a:not(:has(strong)) { background-position:100% 100%; }
  nav .r a:hover { text-decoration:none; background-size:100% 2.5px; }
  nav .r a:has(strong):hover { background-image:none; }
  nav .r .lang { margin-inline-start:1.4rem; }
  .lang { font-size:.82rem; letter-spacing:.08em; } .lang a { text-decoration:none; opacity:.6; } .lang a:hover { opacity:1; text-decoration:underline; } .lang .cur { font-weight:700; } .lang .dot { opacity:.35; margin:0 .45em; }
  .sceau { position:absolute; top:5.2rem; inset-inline-end:0; width:110px; height:110px; border-radius:50%; transform:rotate(-7deg); border:5px solid #fff; box-shadow:0 8px 22px rgba(8,42,153,.22); z-index:2; }
  [dir="rtl"] .sceau { transform:rotate(7deg); }
  @media (max-width:720px) { .sceau { width:72px; height:72px; top:4.2rem; } }
  footer img.fsceau { width:30px; height:30px; border-radius:50%; vertical-align:-9px; margin-inline-end:.5rem; }
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
  .gifs { margin-top:2.6rem; border-top:1px dotted var(--ink-40); padding-top:1.4rem; }
  .gifs .lab { display:block; font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.15rem; margin-bottom:.2rem; }
  [dir="rtl"] .gifs .lab { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  .gifs .note { font-size:.88rem; color:var(--muted); margin-bottom:1rem; max-width:44rem; }
  .gifs .row { display:grid; grid-template-columns:repeat(3,1fr); gap:1.2rem; }
  .gifs figure { margin:0; }
  .gifs img { width:100%; aspect-ratio:1; object-fit:cover; border:1.5px solid var(--ink-15); display:block; background:var(--ink-15); }
  .gifs figure:hover img { border-color:var(--ink); }
  .gifs .snd { display:inline-block; margin-top:.5rem; font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:.98rem; text-decoration:none; cursor:pointer; }
  [dir="rtl"] .gifs .snd { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  .gifs .snd::before { content:"[ "; color:var(--ink-40); } .gifs .snd::after { content:" ]"; color:var(--ink-40); } .gifs .snd:hover::before { content:"[ → "; }
  [dir="rtl"] .gifs .snd:hover::before { content:"[ ← "; }
  .gifs .gfb { margin-top:.9rem; font-size:.9rem; font-style:italic; color:var(--muted); min-height:1.2em; max-width:44rem; }
  .gifs .credit { margin-top:.4rem; font-size:.78rem; color:var(--muted); }
  @media (max-width:640px) { .gifs .row { grid-template-columns:1fr 1fr; } }
  footer { margin-top:4rem; font-size:.88rem; color:var(--muted); border-top:1px solid var(--ink-15); padding-top:1.4rem; }
</style>
</head>
<body>
<main>
  <nav>
    <a class="wm" href="${href(lang, "/")}"><img src="/icon.png" alt="" width="34" height="34"><b>Mamash</b>&nbsp;IA</a>
    <span class="r"><a href="${href(lang, "/question")}">${s.nav.question}</a><a href="${href(lang, "/daf")}">${s.nav.daf}</a><a href="${href(lang, "/install")}"><strong>${s.nav.install}</strong></a>${langSwitcher(lang, "/chabbat")}</span>
  </nav>
  <img class="sceau" src="/icon.png" alt="">
  <h1>${s.h1}</h1>
  <p class="muted">${s.chapeau}</p>
  ${texte ? `<div class="msg" id="msg">${esc(texte).replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")}</div>
  <p class="meta">${s.genere} ${esc(dateGen)}.</p>
  <div class="acts"><a href="#" id="copy">${s.copier}</a><a href="#" id="share" role="button">${s.partager}</a><span class="fb" id="fb"></span></div>` : `<div class="msg">${s.vide}</div>`}
  <div class="gifs">
    <span class="lab">${s.gifLab}</span>
    <p class="note">${s.gifNote}</p>
    <div class="row">
      ${indices.map((i) => `<figure><img src="/api/gif?i=${i}" alt="Chabbat chalom" loading="lazy"><a class="snd" data-i="${i}" role="button" tabindex="0">${s.gifGo}</a></figure>`).join("\n      ")}
    </div>
    <p class="gfb" id="gfb"></p>
    <p class="credit">${s.gifCredit}</p>
  </div>
  <footer><p><a href="${href(lang, "/")}">${s.foot.accueil}</a> · <a href="${href(lang, "/daily")}">${s.foot.daily}</a> · <a href="${href(lang, "/privacy")}">${s.foot.privacy}</a> · ${langSwitcher(lang, "/chabbat")}</p><p><img class="fsceau" src="/icon.png" alt="">${colophon(lang)}</p></footer>
</main>
<script>
(function () {
  var texte = ${JSON.stringify(texte)};
  var fb = document.getElementById("fb");
  function feedback(m) { if (!fb) return; fb.textContent = m; setTimeout(function () { if (fb.textContent === m) fb.textContent = ""; }, 6000); }
  function copier(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return Promise.reject();
  }
  var gfb = document.getElementById("gfb");
  function gifFeedback(m) { gfb.textContent = m; setTimeout(function () { if (gfb.textContent === m) gfb.textContent = ""; }, 9000); }

  // Message + GIF ensemble. Le texte ne transite jamais par une URL
  // (WhatsApp desktop macOS y corrompt les émojis) : partage natif avec
  // fichier + texte quand l'appareil sait le faire, sinon copie + fichier.
  document.querySelectorAll(".gifs .snd").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var i = btn.getAttribute("data-i");
      var pCopie = texte ? copier(texte).catch(function () {}) : Promise.resolve();
      fetch("/api/gif?i=" + i)
        .then(function (r) { if (!r.ok) throw 0; return r.blob(); })
        .then(function (b) {
          var file = new File([b], "chabbat-chalom.gif", { type: "image/gif" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            var charge = texte ? { files: [file], text: texte } : { files: [file] };
            if (texte && !navigator.canShare(charge)) charge = { files: [file] };
            return navigator.share(charge).then(function () { if (texte) gifFeedback("${s.gifOk}"); }, function (er) { if (er && er.name === "AbortError") return; throw er; });
          }
          var url = URL.createObjectURL(b);
          var a = document.createElement("a");
          a.href = url; a.download = "chabbat-chalom.gif";
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          return pCopie.then(function () { gifFeedback(texte ? "${s.gifDesk}" : "${s.gifOk}"); });
        })
        .catch(function () { gifFeedback("${s.gifErr}"); });
    });
  });

  var msg = document.getElementById("msg"); if (!msg) return;
  document.getElementById("share").addEventListener("click", function (e) {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({ text: texte }).catch(function (er) { if (er && er.name !== "AbortError") feedback("${s.copieErr}"); });
      return;
    }
    copier(texte).then(function () {
      feedback("${s.colle}");
      window.open("https://web.whatsapp.com/", "_blank", "noopener");
    }, function () { feedback("${s.copieErr}"); });
  });
  document.getElementById("copy").addEventListener("click", function (e) {
    e.preventDefault();
    copier(texte).then(function () { feedback("${s.copie}"); }, function () { feedback("${s.copieErr}"); });
  });
})();
</script>
</body>
</html>`;
}
