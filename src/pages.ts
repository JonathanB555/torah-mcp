/**
 * Pages additionnelles : /daily (limoud du jour, rendu serveur, trilingue),
 * /he (ancien accueil en hébreu, RTL) et /outils (trilingue).
 */

import type { Env } from "./sefaria";
import { type Lang, href, altLinks, langSwitcher, htmlAttrs, colophon } from "./i18n";

const GA_SNIPPET = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>`;

/** CSS commun aux pages trilingues : sélecteur de langue et titres en hébreu. */
const I18N_STYLE = `
  .lang { font-size:.82rem; letter-spacing:.08em; } .lang a { text-decoration:none; opacity:.6; } .lang a:hover { opacity:1; text-decoration:underline; } .lang .cur { font-weight:700; } .lang .dot { opacity:.35; margin:0 .45em; }
  [dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3, [dir="rtl"] .step .t, [dir="rtl"] .modes .h, [dir="rtl"] form button { font-family:"Frank Ruhl Libre", Georgia, serif; letter-spacing:0; }
`;

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
  .kez { border-top:2px solid var(--ink); border-bottom:1px solid var(--line); padding:1.6rem 0 1.4rem; margin:2rem 0 .5rem; }
  .kez .figs { display:grid; grid-template-columns:repeat(3,1fr); gap:1.4rem; }
  .kez .fig b { display:block; font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2rem,4.5vw,3rem); line-height:1; letter-spacing:-.02em; direction:ltr; }
  .kez .fig b small { font-family:"Frank Ruhl Libre", Georgia, serif; font-size:.5em; font-weight:700; letter-spacing:0; margin:0 .3em; vertical-align:.3em; }
  .kez .fig span { display:block; margin-top:.5rem; font-size:.92rem; line-height:1.55; opacity:.85; }
  .kez .vs { display:grid; grid-template-columns:1fr 1fr; gap:1.6rem; margin-top:1.6rem; padding-top:1.4rem; border-top:1px solid var(--line); }
  .kez .vs h3 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.05rem; margin-bottom:.3rem; }
  .kez .vs .non h3 { text-decoration:line-through; text-decoration-color:rgba(8,42,153,.4); }
  .kez .vs .non p { opacity:.7; } .kez .vs p { font-size:.95rem; }
  @media (max-width:640px) { .kez .figs, .kez .vs { grid-template-columns:1fr; } }
`;


// ----------------------------------------------------------------------------
// /daily — le limoud du jour
// ----------------------------------------------------------------------------

const DAILY_T = {
  fr: {
    title: "Le limoud du jour — Torah MCP",
    desc: "Paracha, daf yomi, Rambam quotidien et tous les cycles d'étude du jour, avec liens directs vers les textes.",
    ogTitle: "Torah MCP — la discipline des sources pour Claude",
    ogDesc: "Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.",
    h1: "Le limoud du jour",
    chapeau: (date: string, home: string) =>
      `${date} — cycles d'étude du jour, textes servis par <a href="https://www.sefaria.org">Sefaria</a>. <a href="${home}">Qu'est-ce que Torah MCP ?</a>`,
    unavailable: "Calendriers momentanément indisponibles — réessayez dans un instant.",
    h2: "Étudier avec Claude",
    howto: "Ajoutez Torah MCP à claude.ai (Settings → Connectors → Add custom connector) et demandez « le daf du jour en havrouta » :",
    home: "Accueil",
    privacy: "Confidentialité",
  },
  en: {
    title: "Today's learning — Torah MCP",
    desc: "Parashah, daf yomi, daily Rambam and every study cycle of the day, with direct links to the texts.",
    ogTitle: "Torah MCP — the discipline of sources for Claude",
    ogDesc: "Claude quotes the Torah from the texts, never from memory. Method, chavruta, parashah guide, interactive daf, zmanim, gematria. Free.",
    h1: "Today's learning",
    chapeau: (date: string, home: string) =>
      `${date} — today's study cycles, texts served by <a href="https://www.sefaria.org">Sefaria</a>. <a href="${home}">What is Torah MCP?</a>`,
    unavailable: "Calendars temporarily unavailable — try again in a moment.",
    h2: "Study with Claude",
    howto: "Add Torah MCP to claude.ai (Settings → Connectors → Add custom connector) and ask for “today's daf, in chavruta”:",
    home: "Home",
    privacy: "Privacy",
  },
  he: {
    title: "הלימוד היומי — Torah MCP",
    desc: "פרשה, דף יומי, רמב\"ם יומי וכל מחזורי הלימוד של היום, עם קישורים ישירים לטקסטים.",
    ogTitle: "Torah MCP — משמעת המקורות ל-Claude",
    ogDesc: "Claude מצטט את התורה מתוך הטקסטים, לעולם לא מהזיכרון. שיטה, חברותא, מדריך פרשה, דף אינטראקטיבי, זמנים, גימטריה. חינם.",
    h1: "הלימוד היומי",
    chapeau: (date: string, home: string) =>
      `${date} — מחזורי הלימוד של היום, הטקסטים מוגשים דרך <a href="https://www.sefaria.org">ספריא</a>. <a href="${home}">מה זה Torah MCP?</a>`,
    unavailable: "הלוחות אינם זמינים כרגע — נסו שוב בעוד רגע.",
    h2: "ללמוד עם Claude",
    howto: "הוסיפו את Torah MCP ל-claude.ai (Settings → Connectors → Add custom connector) ובקשו «את הדף היומי בחברותא»:",
    home: "דף הבית",
    privacy: "פרטיות",
  },
} as const;

/** Date ISO du calendrier Sefaria, affichée telle quelle en FR, localisée en EN/HE. */
function fmtDailyDate(iso: string, lang: Lang): string {
  if (lang === "fr" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  try {
    return new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === "he" ? "he-IL" : "en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    });
  } catch {
    return iso;
  }
}

function dailyCard(i: any, lang: Lang): string {
  const ref = i.ref ? encodeURIComponent(String(i.ref).replace(/ /g, "_")) : "";
  const lien = ref ? `https://www.sefaria.org/${ref}` : "https://www.sefaria.org";
  const titleEn = i.title?.en ?? "";
  const valEn = i.displayValue?.en ?? i.ref ?? "";
  if (lang === "he") {
    const title = i.title?.he || titleEn;
    const val = i.displayValue?.he || valEn;
    const en = i.displayValue?.he && valEn ? ` <span class="en" dir="ltr">· ${valEn}</span>` : "";
    return `<div class="card"><span class="item-title">${title}</span> — <a href="${lien}">${val}</a>${en}</div>`;
  }
  const he = i.displayValue?.he ? ` <span class="he" dir="rtl">· ${i.displayValue.he}</span>` : "";
  return `<div class="card"><span class="item-title">${titleEn}</span> — <a href="${lien}">${valEn}</a>${he}</div>`;
}

export async function renderDaily(env: Env, lang: Lang = "fr"): Promise<string> {
  const s = DAILY_T[lang];
  const path = "/daily";
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

  const cards = items.map((i: any) => dailyCard(i, lang)).join("\n");

  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${s.desc}">
${altLinks(lang, path)}
<style>${STYLE}${I18N_STYLE}
  .en { font-size:.9em; opacity:.8; }
</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${s.ogTitle}">
<meta property="og:description" content="${s.ogDesc}">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com${href(lang, path)}">
<meta name="twitter:card" content="summary_large_image">
${GA_SNIPPET}
</head>
<body>
<main>
  <h1>${s.h1}</h1>
  <p class="muted">${s.chapeau(fmtDailyDate(date, lang), href(lang, "/"))}</p>
  ${cards || `<div class="card">${s.unavailable}</div>`}
  <h2>${s.h2}</h2>
  <div class="card">
    <p>${s.howto}</p>
    <span class="url" dir="ltr">https://torah-mcp.com/mcp</span>
  </div>
  <footer><p><a href="${href(lang, "/")}">${s.home}</a> · ${langSwitcher(lang, path)} · <a href="${href(lang, "/privacy")}">${s.privacy}</a></p><p>${colophon(lang)}</p></footer>
</main>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// /outils — les fonctions du MCP utilisables directement sur le site
// ----------------------------------------------------------------------------

type OutilsBooks = { group: string; books: [string, string][] }[];

/** Groupes de livres du constructeur de référence : [titre Sefaria, libellé affiché]. */
const OUTILS_BOOKS: Record<Lang, OutilsBooks> = {
  fr: [
    { group: "Torah", books: [["Genesis", "Genèse"], ["Exodus", "Exode"], ["Leviticus", "Lévitique"], ["Numbers", "Nombres"], ["Deuteronomy", "Deutéronome"]] },
    { group: "Prophètes", books: [["Joshua", "Josué"], ["Judges", "Juges"], ["I Samuel", "Samuel I"], ["II Samuel", "Samuel II"], ["I Kings", "Rois I"], ["II Kings", "Rois II"], ["Isaiah", "Isaïe"], ["Jeremiah", "Jérémie"], ["Ezekiel", "Ézéchiel"], ["Jonah", "Jonas"]] },
    { group: "Écrits", books: [["Psalms", "Psaumes"], ["Proverbs", "Proverbes"], ["Job", "Job"], ["Song of Songs", "Cantique des cantiques"], ["Ruth", "Ruth"], ["Lamentations", "Lamentations"], ["Ecclesiastes", "Ecclésiaste"], ["Esther", "Esther"], ["Daniel", "Daniel"]] },
    { group: "Michna", books: [["Pirkei Avot", "Pirké Avot (Maximes des Pères)"]] },
    { group: "Talmud (page)", books: [["Berakhot", "Berakhot"], ["Shabbat", "Chabbat"], ["Pesachim", "Pessahim"], ["Yoma", "Yoma"], ["Sukkah", "Soucca"], ["Megillah", "Meguila"], ["Ketubot", "Ketoubot"], ["Kiddushin", "Kiddouchin"], ["Gittin", "Guittin"], ["Bava Kamma", "Bava Kamma"], ["Bava Metzia", "Bava Metsia"], ["Bava Batra", "Bava Batra"], ["Sanhedrin", "Sanhédrin"], ["Makkot", "Makkot"], ["Avodah Zarah", "Avoda Zara"], ["Chullin", "Houlin"]] },
  ],
  en: [
    { group: "Torah", books: [["Genesis", "Genesis"], ["Exodus", "Exodus"], ["Leviticus", "Leviticus"], ["Numbers", "Numbers"], ["Deuteronomy", "Deuteronomy"]] },
    { group: "Prophets", books: [["Joshua", "Joshua"], ["Judges", "Judges"], ["I Samuel", "I Samuel"], ["II Samuel", "II Samuel"], ["I Kings", "I Kings"], ["II Kings", "II Kings"], ["Isaiah", "Isaiah"], ["Jeremiah", "Jeremiah"], ["Ezekiel", "Ezekiel"], ["Jonah", "Jonah"]] },
    { group: "Writings", books: [["Psalms", "Psalms"], ["Proverbs", "Proverbs"], ["Job", "Job"], ["Song of Songs", "Song of Songs"], ["Ruth", "Ruth"], ["Lamentations", "Lamentations"], ["Ecclesiastes", "Ecclesiastes"], ["Esther", "Esther"], ["Daniel", "Daniel"]] },
    { group: "Mishnah", books: [["Pirkei Avot", "Pirkei Avot (Ethics of the Fathers)"]] },
    { group: "Talmud (page)", books: [["Berakhot", "Berakhot"], ["Shabbat", "Shabbat"], ["Pesachim", "Pesachim"], ["Yoma", "Yoma"], ["Sukkah", "Sukkah"], ["Megillah", "Megillah"], ["Ketubot", "Ketubot"], ["Kiddushin", "Kiddushin"], ["Gittin", "Gittin"], ["Bava Kamma", "Bava Kamma"], ["Bava Metzia", "Bava Metzia"], ["Bava Batra", "Bava Batra"], ["Sanhedrin", "Sanhedrin"], ["Makkot", "Makkot"], ["Avodah Zarah", "Avodah Zarah"], ["Chullin", "Chullin"]] },
  ],
  he: [
    { group: "תורה", books: [["Genesis", "בראשית"], ["Exodus", "שמות"], ["Leviticus", "ויקרא"], ["Numbers", "במדבר"], ["Deuteronomy", "דברים"]] },
    { group: "נביאים", books: [["Joshua", "יהושע"], ["Judges", "שופטים"], ["I Samuel", "שמואל א"], ["II Samuel", "שמואל ב"], ["I Kings", "מלכים א"], ["II Kings", "מלכים ב"], ["Isaiah", "ישעיהו"], ["Jeremiah", "ירמיהו"], ["Ezekiel", "יחזקאל"], ["Jonah", "יונה"]] },
    { group: "כתובים", books: [["Psalms", "תהלים"], ["Proverbs", "משלי"], ["Job", "איוב"], ["Song of Songs", "שיר השירים"], ["Ruth", "רות"], ["Lamentations", "איכה"], ["Ecclesiastes", "קהלת"], ["Esther", "אסתר"], ["Daniel", "דניאל"]] },
    { group: "משנה", books: [["Pirkei Avot", "פרקי אבות"]] },
    { group: "תלמוד (דף)", books: [["Berakhot", "ברכות"], ["Shabbat", "שבת"], ["Pesachim", "פסחים"], ["Yoma", "יומא"], ["Sukkah", "סוכה"], ["Megillah", "מגילה"], ["Ketubot", "כתובות"], ["Kiddushin", "קידושין"], ["Gittin", "גיטין"], ["Bava Kamma", "בבא קמא"], ["Bava Metzia", "בבא מציעא"], ["Bava Batra", "בבא בתרא"], ["Sanhedrin", "סנהדרין"], ["Makkot", "מכות"], ["Avodah Zarah", "עבודה זרה"], ["Chullin", "חולין"]] },
  ],
};

/** Villes du sélecteur zmanim : [valeur envoyée à l'API, libellé]. */
const OUTILS_CITIES: Record<Lang, [string, string][]> = {
  fr: [["paris", "Paris"], ["marseille", "Marseille"], ["lyon", "Lyon"], ["nice", "Nice"], ["strasbourg", "Strasbourg"], ["geneve", "Genève"], ["bruxelles", "Bruxelles"], ["jerusalem", "Jérusalem"], ["tel-aviv", "Tel-Aviv"], ["new-york", "New York"], ["londres", "Londres"], ["montreal", "Montréal"], ["casablanca", "Casablanca"]],
  en: [["paris", "Paris"], ["marseille", "Marseille"], ["lyon", "Lyon"], ["nice", "Nice"], ["strasbourg", "Strasbourg"], ["geneve", "Geneva"], ["bruxelles", "Brussels"], ["jerusalem", "Jerusalem"], ["tel-aviv", "Tel Aviv"], ["new-york", "New York"], ["londres", "London"], ["montreal", "Montreal"], ["casablanca", "Casablanca"]],
  he: [["jerusalem", "ירושלים"], ["tel-aviv", "תל אביב"], ["paris", "פריז"], ["marseille", "מרסיי"], ["lyon", "ליון"], ["nice", "ניס"], ["strasbourg", "שטרסבורג"], ["geneve", "ז'נבה"], ["bruxelles", "בריסל"], ["new-york", "ניו יורק"], ["londres", "לונדון"], ["montreal", "מונטריאול"], ["casablanca", "קזבלנקה"]],
};

/** Chaînes injectées dans le JS de la page (objet `S`). */
const OUTILS_JS = {
  fr: {
    noms: { alotHaShachar: "Alot hachahar", sunrise: "Netz (lever)", sofZmanShma: "Sof zman Chema", sofZmanTfilla: "Sof zman tefila", chatzot: "Hatsot", minchaGedola: "Minha guedola", minchaKetana: "Minha ketana", plagHaMincha: "Plag haminha", sunset: "Chkia (coucher)", tzeit7083deg: "Tset hakokhavim" },
    expl: { alotHaShachar: "l'aube — la journée halakhique commence", sunrise: "lever du soleil — début idéal de la prière du matin", sofZmanShma: "heure limite pour réciter le Chema du matin", sofZmanTfilla: "heure limite pour la prière du matin (Amida)", chatzot: "midi solaire", minchaGedola: "à partir de là, on peut prier Minha (l'après-midi)", minchaKetana: "moment préférable pour Minha", plagHaMincha: "dernière partie de l'après-midi — certains commencent Chabbat à partir de là", sunset: "coucher du soleil — fin de la journée", tzeit7083deg: "sortie des étoiles — la nuit, fin de Chabbat" },
    legend: "<p style='margin-top:.6rem;font-size:.85rem;color:#6d675c'><strong>Hechrechi</strong> : la valeur classique (<bdi>א</bdi>=1 … <bdi>י</bdi>=10, <bdi>כ</bdi>=20 … <bdi>ק</bdi>=100 … <bdi>ת</bdi>=400) — c'est celle qu'on cite d'ordinaire. <strong>Gadol</strong> : les lettres finales (<bdi>ך ם ן ף ץ</bdi>) valent 500 à 900. <strong>Katan</strong> : on réduit chaque lettre à un chiffre (<bdi>י</bdi>=1, <bdi>כ</bdi>=2…). <strong>Siduri</strong> : le rang de la lettre dans l'alphabet (<bdi>א</bdi>=1 … <bdi>ת</bdi>=22). <strong>Atbash</strong> : chaque lettre est remplacée par sa symétrique (<bdi>א↔ת</bdi>, <bdi>ב↔ש</bdi>…) puis comptée.</p>",
    th: ["Mot", "Hechrechi", "Gadol", "Katan", "Siduri", "Atbash"],
    total: "Total",
    credit: "",
    copy: "Copier pour WhatsApp",
    copied: "Copié !",
    help: { debutant: "Chaque outil est expliqué, avec un clavier hébreu à l'écran et les livres en français.", classique: "Les outils, sans explications — pour qui connaît déjà." },
    space: "espace",
    page: "page",
    chapter: "chapitre",
    error: "Erreur — réessayez.",
  },
  en: {
    noms: { alotHaShachar: "Alot hashachar", sunrise: "Netz (sunrise)", sofZmanShma: "Sof zman Shema", sofZmanTfilla: "Sof zman tefillah", chatzot: "Chatzot", minchaGedola: "Mincha gedolah", minchaKetana: "Mincha ketanah", plagHaMincha: "Plag hamincha", sunset: "Shkiah (sunset)", tzeit7083deg: "Tzeit hakochavim" },
    expl: { alotHaShachar: "dawn — the halakhic day begins", sunrise: "sunrise — the ideal start of the morning prayer", sofZmanShma: "latest time to recite the morning Shema", sofZmanTfilla: "latest time for the morning prayer (Amidah)", chatzot: "solar noon", minchaGedola: "from this point on, one may pray Mincha (the afternoon prayer)", minchaKetana: "the preferable time for Mincha", plagHaMincha: "the last part of the afternoon — some begin Shabbat from this point", sunset: "sunset — the day ends", tzeit7083deg: "the stars come out — nightfall, the end of Shabbat" },
    legend: "<p style='margin-top:.6rem;font-size:.85rem;color:#6d675c'><strong>Hechrechi</strong>: the standard value (<bdi>א</bdi>=1 … <bdi>י</bdi>=10, <bdi>כ</bdi>=20 … <bdi>ק</bdi>=100 … <bdi>ת</bdi>=400) — the one usually quoted. <strong>Gadol</strong>: the final letters (<bdi>ך ם ן ף ץ</bdi>) count 500 to 900. <strong>Katan</strong>: each letter is reduced to a single digit (<bdi>י</bdi>=1, <bdi>כ</bdi>=2…). <strong>Siduri</strong>: the letter's rank in the alphabet (<bdi>א</bdi>=1 … <bdi>ת</bdi>=22). <strong>Atbash</strong>: each letter is swapped for its mirror image (<bdi>א↔ת</bdi>, <bdi>ב↔ש</bdi>…) and then counted.</p>",
    th: ["Word", "Hechrechi", "Gadol", "Katan", "Siduri", "Atbash"],
    total: "Total",
    credit: "Vocalization: Dicta's nakdan (dicta.org.il).",
    copy: "Copy for WhatsApp",
    copied: "Copied!",
    help: { debutant: "Every tool is explained, with an on-screen Hebrew keyboard and the books listed in English.", classique: "The tools, without explanations — for those who already know their way around." },
    space: "space",
    page: "page",
    chapter: "chapter",
    error: "Error — please try again.",
  },
  he: {
    noms: { alotHaShachar: "עלות השחר", sunrise: "נץ החמה (זריחה)", sofZmanShma: "סוף זמן קריאת שמע", sofZmanTfilla: "סוף זמן תפילה", chatzot: "חצות", minchaGedola: "מנחה גדולה", minchaKetana: "מנחה קטנה", plagHaMincha: "פלג המנחה", sunset: "שקיעה", tzeit7083deg: "צאת הכוכבים" },
    expl: { alotHaShachar: "עלות השחר — תחילת היום ההלכתי", sunrise: "זריחת החמה — הזמן המובחר לתחילת תפילת שחרית", sofZmanShma: "הזמן האחרון לקריאת שמע של שחרית", sofZmanTfilla: "הזמן האחרון לתפילת שחרית (עמידה)", chatzot: "חצות היום", minchaGedola: "מכאן ואילך אפשר להתפלל מנחה", minchaKetana: "הזמן המועדף לתפילת מנחה", plagHaMincha: "החלק האחרון של אחר הצהריים — יש המקבלים שבת מכאן", sunset: "שקיעת החמה — סוף היום", tzeit7083deg: "צאת הכוכבים — לילה, צאת השבת" },
    legend: "<p style='margin-top:.6rem;font-size:.85rem;color:#6d675c'><strong>הכרחי</strong> — הערך הרגיל (<bdi>א</bdi>=1 … <bdi>י</bdi>=10, <bdi>כ</bdi>=20 … <bdi>ק</bdi>=100 … <bdi>ת</bdi>=400), זה שמצטטים בדרך כלל. <strong>גדול</strong> — האותיות הסופיות (<bdi>ך ם ן ף ץ</bdi>) שוות 500 עד 900. <strong>קטן</strong> — כל אות מצטמצמת לספרה אחת (<bdi>י</bdi>=1, <bdi>כ</bdi>=2…). <strong>סידורי</strong> — מקום האות באלף־בית (<bdi>א</bdi>=1 … <bdi>ת</bdi>=22). <strong>אתב\"ש</strong> — כל אות מוחלפת באות המקבילה לה מן הסוף (<bdi>א↔ת</bdi>, <bdi>ב↔ש</bdi>…) ואז נספרת.</p>",
    th: ["מילה", "הכרחי", "גדול", "קטן", "סידורי", "אתב\"ש"],
    total: "סה\"כ",
    credit: "ניקוד: הנקדן של דיקטה (dicta.org.il).",
    copy: "העתקה לוואטסאפ",
    copied: "הועתק!",
    help: { debutant: "כל כלי מוסבר, עם מקלדת עברית על המסך ושמות הספרים בעברית.", classique: "הכלים בלבד, בלי הסברים — למי שכבר מכיר." },
    space: "רווח",
    page: "דף",
    chapter: "פרק",
    error: "שגיאה — נסו שוב.",
  },
} as const;

/** Chaînes du gabarit HTML. */
const OUTILS_T = {
  fr: {
    title: "Outils — Torah MCP",
    desc: "Zmanim, dates hébraïques, guematria, nikoud et fiches sources — utilisables directement, sans installation.",
    ogTitle: "Torah MCP — la discipline des sources pour Claude",
    ogDesc: "Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.",
    chosen: "→ choisi",
    navHome: "← torah-mcp.com",
    navDaf: "Ouvrir le daf du jour",
    navDaily: "Le limoud du jour",
    h1: "Les outils, sans installation",
    lead: "Les mêmes fonctions que le connecteur Claude, utilisables ici même. Aucune donnée conservée.",
    step1: "Choisissez votre niveau",
    step1s: "on commence par là",
    level: "Niveau",
    begH: "Débutant", begW: "Je débute, ou je ne lis pas l'hébreu", begD: "Chaque outil expliqué, clavier hébreu à l'écran, livres en français.",
    claH: "Classique", claW: "J'ai les bases", claD: "Les outils nus, sans explications.",
    step2: "Choisissez un outil",
    ask: (q: string) => `Une question plutôt qu'un outil ? <a href="${q}">Posez-la en français</a> — la réponse est lue dans les textes.`,
    zH: "Zmanim et Chabbat",
    zD: "Les horaires du jour ou de Chabbat pour votre ville (données Hebcal).",
    zB: "Les <em>zmanim</em> sont les heures qui rythment la journée juive (lever, dernière heure du Chema, coucher…). En mode débutant, chaque horaire est expliqué. « Horaires de Chabbat » donne l'allumage des bougies et la sortie.",
    zDay: "Zmanim du jour", zShab: "Horaires de Chabbat", zBtn: "Afficher",
    dH: "Date hébraïque",
    dD: "Convertit une date civile — avec les événements du jour (fêtes, paracha, Rosh Hodesh).",
    dB: "Le calendrier hébraïque compte les années depuis la Création (2026 correspond à 5786–5787) et ses mois suivent la lune. Attention : le jour hébraïque commence la veille au soir.",
    dBtn: "Convertir",
    gH: "Guematria",
    gD: "Cinq méthodes, mot à mot : hechrechi, gadol, katan, siduri, atbash.",
    gB: "Chaque lettre hébraïque vaut un nombre (<bdi>א</bdi>&nbsp;=&nbsp;1 … <bdi>ת</bdi>&nbsp;=&nbsp;400) : la guematria d'un mot est la somme de ses lettres. Pas de clavier hébreu ? Cliquez les lettres ci-dessous, ou choisissez un mot courant.",
    gBtn: "Calculer",
    nH: "Nikoud",
    nD: "Vocalisation d'un texte hébreu par le nakdan de Dicta.",
    nB: "Le <em>nikoud</em>, ce sont les points-voyelles sous et sur les lettres : un texte hébreu s'écrit d'ordinaire sans, et cet outil les remet — précieux pour apprendre à lire. Saisissez avec le clavier ci-dessous si besoin.",
    nBtn: "Vocaliser",
    fH: "Fiche source",
    fD: "Une carte hébreu + traduction + lien, prête à coller dans WhatsApp. Le texte est lu via Sefaria — en français quand la version existe (Bible du Rabbinat).",
    fB: "Choisissez le livre en français, puis le chapitre et le verset (ou la page pour le Talmud) : la référence se compose toute seule.",
    chapter: "chapitre", verse: "verset", amudA: "a (recto)", amudB: "b (verso)",
    fBtn: "Composer",
    cH: "Le mot de Chabbat",
    cD: "Le petit mot de la semaine, prêt à envoyer : paracha, verset en français, horaires d'allumage de votre ville. Voir aussi <a href=\"/chabbat\">le WhatsApp de Chabbat de la semaine</a>.",
    cB: "Chaque vendredi, envoyez à vos proches un mot qui donne le nom de la paracha (la section de la Torah lue cette semaine), son premier verset traduit, et l'heure des bougies. Composez, puis « Envoyer sur WhatsApp » ouvre directement l'application.",
    cNoTimes: "Sans horaires", cBtn: "Composer le mot", cWa: "Envoyer sur WhatsApp",
    back: "← Retour à l'accueil",
    home: "Accueil",
    privacy: "Confidentialité",
  },
  en: {
    title: "Tools — Torah MCP",
    desc: "Zmanim, Hebrew dates, gematria, nikkud and source cards — usable directly, no installation needed.",
    ogTitle: "Torah MCP — the discipline of sources for Claude",
    ogDesc: "Claude quotes the Torah from the texts, never from memory. Method, chavruta, parashah guide, interactive daf, zmanim, gematria. Free.",
    chosen: "→ chosen",
    navHome: "← torah-mcp.com",
    navDaf: "Open today's daf",
    navDaily: "Today's learning",
    h1: "The tools, no installation needed",
    lead: "The same functions as the Claude connector, usable right here. No data is kept.",
    step1: "Choose your level",
    step1s: "we start here",
    level: "Level",
    begH: "Beginner", begW: "I'm starting out, or I don't read Hebrew", begD: "Every tool explained, on-screen Hebrew keyboard, books listed in English.",
    claH: "Classic", claW: "I know the basics", claD: "The bare tools, no explanations.",
    step2: "Choose a tool",
    ask: (q: string) => `A question rather than a tool? <a href="${q}">Ask it in English</a> — the answer is read from the texts.`,
    zH: "Zmanim and Shabbat",
    zD: "Today's or Shabbat's times for your city (Hebcal data).",
    zB: "The <em>zmanim</em> are the hours that structure the Jewish day (sunrise, the latest time for the Shema, sunset…). In beginner mode, each time is explained. “Shabbat times” gives candle-lighting and the end of Shabbat.",
    zDay: "Today's zmanim", zShab: "Shabbat times", zBtn: "Show",
    dH: "Hebrew date",
    dD: "Converts a civil date — with the day's events (holidays, parashah, Rosh Chodesh).",
    dB: "The Hebrew calendar counts the years from Creation (2026 corresponds to 5786–5787) and its months follow the moon. Note: the Hebrew day begins the evening before.",
    dBtn: "Convert",
    gH: "Gematria",
    gD: "Five methods, word by word: hechrechi, gadol, katan, siduri, atbash.",
    gB: "Every Hebrew letter has a numerical value (<bdi>א</bdi>&nbsp;=&nbsp;1 … <bdi>ת</bdi>&nbsp;=&nbsp;400): the gematria of a word is the sum of its letters. No Hebrew keyboard? Click the letters below, or pick a common word.",
    gBtn: "Compute",
    nH: "Nikkud",
    nD: "Vocalization of a Hebrew text by Dicta's nakdan.",
    nB: "<em>Nikkud</em> is the system of vowel points beneath and above the letters: Hebrew is usually written without them, and this tool puts them back — precious for learning to read. Use the keyboard below if you need to.",
    nBtn: "Vocalize",
    fH: "Source card",
    fD: "A card with Hebrew + translation + link, ready to paste into WhatsApp. The text is read via Sefaria — with a translation when one exists.",
    fB: "Choose the book, then the chapter and verse (or the page for the Talmud): the reference builds itself.",
    chapter: "chapter", verse: "verse", amudA: "a (first side)", amudB: "b (second side)",
    fBtn: "Compose",
    cH: "The Shabbat note",
    cD: "This week's short note, ready to send: parashah, opening verse (French), candle-lighting times for your city. See also <a href=\"/en/chabbat\">the weekly Shabbat WhatsApp</a>.",
    cB: "Every Friday, send your friends a note with the week's Torah portion, its opening verse and candle-lighting time. Compose, then \"Send on WhatsApp\" opens the app directly.",
    cNoTimes: "No times", cBtn: "Compose the note", cWa: "Send on WhatsApp",
    back: "← Back to the home page",
    home: "Home",
    privacy: "Privacy",
  },
  he: {
    title: "כלים — Torah MCP",
    desc: "זמנים, תאריכים עבריים, גימטריה, ניקוד ודפי מקור — לשימוש ישיר, בלי התקנה.",
    ogTitle: "Torah MCP — משמעת המקורות ל-Claude",
    ogDesc: "Claude מצטט את התורה מתוך הטקסטים, לעולם לא מהזיכרון. שיטה, חברותא, מדריך פרשה, דף אינטראקטיבי, זמנים, גימטריה. חינם.",
    chosen: "← נבחר",
    navHome: "→ torah-mcp.com",
    navDaf: "פתיחת הדף היומי",
    navDaily: "הלימוד היומי",
    h1: "הכלים, בלי התקנה",
    lead: "אותן פונקציות של מחבר Claude, לשימוש כאן ממש. שום נתון אינו נשמר.",
    step1: "בחרו את הרמה שלכם",
    step1s: "מתחילים כאן",
    level: "רמה",
    begH: "מתחילים", begW: "אני בתחילת הדרך", begD: "כל כלי מוסבר, מקלדת עברית על המסך, שמות הספרים בעברית.",
    claH: "קלאסי", claW: "יש לי את היסודות", claD: "הכלים בלבד, בלי הסברים.",
    step2: "בחרו כלי",
    ask: (q: string) => `שאלה במקום כלי? <a href="${q}">שאלו בעברית</a> — התשובה נקראת מתוך הטקסטים.`,
    zH: "זמנים ושבת",
    zD: "זמני היום או זמני השבת לעיר שלכם (נתוני Hebcal).",
    zB: "ה<em>זמנים</em> הם השעות שמסדרות את היום היהודי (זריחה, סוף זמן קריאת שמע, שקיעה…). במצב מתחילים כל זמן מוסבר. «זמני שבת» נותן את הדלקת הנרות ואת צאת השבת.",
    zDay: "זמני היום", zShab: "זמני שבת", zBtn: "הצגה",
    dH: "תאריך עברי",
    dD: "ממיר תאריך לועזי — עם אירועי היום (חגים, פרשה, ראש חודש).",
    dB: "הלוח העברי מונה את השנים מבריאת העולם (2026 מקבילה לשנים תשפ\"ו–תשפ\"ז) וחודשיו הולכים אחר הירח. שימו לב: היום העברי מתחיל בערב שלפניו.",
    dBtn: "המרה",
    gH: "גימטריה",
    gD: "חמש שיטות, מילה במילה: הכרחי, גדול, קטן, סידורי, אתב\"ש.",
    gB: "לכל אות עברית ערך מספרי (<bdi>א</bdi>&nbsp;=&nbsp;1 … <bdi>ת</bdi>&nbsp;=&nbsp;400): הגימטריה של מילה היא סכום אותיותיה. אין מקלדת עברית? לחצו על האותיות למטה, או בחרו מילה נפוצה.",
    gBtn: "חישוב",
    nH: "ניקוד",
    nD: "ניקוד של טקסט עברי באמצעות הנקדן של דיקטה.",
    nB: "ה<em>ניקוד</em> הוא סימני התנועות שמתחת לאותיות ומעליהן: טקסט עברי נכתב בדרך כלל בלעדיהם, והכלי הזה מחזיר אותם — יקר ערך למי שלומד לקרוא. אפשר להקליד במקלדת שלמטה אם צריך.",
    nBtn: "ניקוד",
    fH: "דף מקור",
    fD: "כרטיס עם עברית + תרגום + קישור, מוכן להדבקה בוואטסאפ. הטקסט נקרא דרך ספריא — עם תרגום כשקיים.",
    fB: "בחרו את הספר, ואז את הפרק והפסוק (או את הדף בתלמוד): מראה המקום נבנה מעצמו.",
    chapter: "פרק", verse: "פסוק", amudA: "א (עמוד א)", amudB: "ב (עמוד ב)",
    fBtn: "חיבור",
    cH: "מילה לשבת",
    cD: "מסר קצר לשליחה: פרשת השבוע, הפסוק הפותח, וזמני הדלקת נרות לעירכם (בצרפתית). ראו גם <a href=\"/he/chabbat\">את הוואטסאפ השבועי לשבת</a>.",
    cB: "בכל יום שישי שלחו לחברים מסר עם שם הפרשה, הפסוק הפותח וזמן ההדלקה. חברו, ואז «שליחה בוואטסאפ» פותחת את היישום.",
    cNoTimes: "בלי זמנים", cBtn: "חיבור המילה", cWa: "שליחה בוואטסאפ",
    back: "→ חזרה לדף הבית",
    home: "דף הבית",
    privacy: "פרטיות",
  },
} as const;

export function outilsHtml(lang: Lang): string {
  const s = OUTILS_T[lang];
  const path = "/outils";
  const cities = OUTILS_CITIES[lang].map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
  const books = OUTILS_BOOKS[lang]
    .map((g) => `<optgroup label="${g.group}">${g.books.map(([v, l]) => `<option value="${v}"${g.group.startsWith("Talmud") || g.group.startsWith("תלמוד") ? ' data-daf="1"' : ""}>${l}</option>`).join("")}</optgroup>`)
    .join("\n        ");
  const S = JSON.stringify(OUTILS_JS[lang]);

  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${s.desc}">
${altLinks(lang, path)}
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
  .out td, .out th { border-bottom:1px solid var(--line); padding:.3rem .5rem; text-align:start; }
  a { color:var(--accent); }
  .back { display:inline-block; margin-top:1.6rem; color:var(--muted); text-decoration:none; font-size:.9rem; }
  nav.top { padding:1rem 0 0; font-size:.9rem; }
  .step { display:flex; align-items:baseline; gap:1rem; margin:2.2rem 0 .9rem; }
  .step .n { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.5rem; }
  .step .t { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.2rem; }
  .step .rule { flex:1; height:1px; background:var(--line); }
  .step .s { font-size:.76rem; letter-spacing:.18em; text-transform:uppercase; opacity:.55; }
  .modes { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:0 0 .4rem; }
  .modes label { display:block; cursor:pointer; border:1.5px solid var(--line); padding:.9rem 1rem 1rem; position:relative; transition:border-color .3s, background .3s; }
  .modes label:hover { border-color:var(--gold); }
  .modes label:has(input:checked) { border-color:var(--ink); background:#dbe3ff; }
  .modes label:has(input:checked)::after { content:"${s.chosen}"; position:absolute; top:.55rem; inset-inline-end:.8rem; font-size:.68rem; letter-spacing:.14em; text-transform:uppercase; opacity:.7; }
  .modes .h { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.2rem; display:block; }
  .modes .w { display:block; font-size:.76rem; letter-spacing:.12em; text-transform:uppercase; opacity:.55; margin:.1rem 0 .4rem; }
  .modes .d { display:block; font-size:.88rem; line-height:1.5; opacity:.85; }
  .modes input { position:absolute; opacity:0; pointer-events:none; }
  .modehelp { display:none; }
  @media (max-width:640px) { .modes { grid-template-columns:1fr; } .step .s { display:none; } }
  .beg { display:none; } body.mode-debutant .beg { display:block; }
  .beg.inl { display:none; } body.mode-debutant .beg.inl { display:inline; }
  p.beg { font-size:.92rem; color:var(--muted); margin:.2rem 0 .8rem; }
  ${I18N_STYLE}
  [dir="rtl"] .step .s, [dir="rtl"] .modes .w, [dir="rtl"] .modes label:has(input:checked)::after { letter-spacing:0; }
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
  .ask { margin:0 0 .4rem; font-size:.95rem; color:var(--muted); }
</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${s.ogTitle}">
<meta property="og:description" content="${s.ogDesc}">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com${href(lang, path)}">
<meta name="twitter:card" content="summary_large_image">
${GA_SNIPPET}
</head>
<body>
<main>
  <nav class="top"><a href="${href(lang, "/")}" style="text-decoration:none;color:var(--muted)">${s.navHome}</a> · <a href="${href(lang, "/daf")}" style="color:var(--accent)">${s.navDaf}</a> · <a href="${href(lang, "/daily")}" style="color:var(--accent)">${s.navDaily}</a> · ${langSwitcher(lang, path)}</nav>
  <h1>${s.h1}</h1>
  <p class="muted">${s.lead}</p>
  <div class="step"><span class="n">1</span><span class="t">${s.step1}</span><span class="rule"></span><span class="s">${s.step1s}</span></div>
  <div class="modes" role="radiogroup" aria-label="${s.level}">
    <label><input type="radio" name="tmode" value="debutant" checked><span class="h">${s.begH}</span><span class="w">${s.begW}</span><span class="d">${s.begD}</span></label>
    <label><input type="radio" name="tmode" value="classique"><span class="h">${s.claH}</span><span class="w">${s.claW}</span><span class="d">${s.claD}</span></label>
  </div>
  <p class="modehelp" id="mh"></p>
  <div class="step"><span class="n">2</span><span class="t">${s.step2}</span><span class="rule"></span></div>
  <p class="ask">${s.ask(href(lang, "/question"))}</p>

  <div class="tool">
    <h2>${s.zH}</h2>
    <p class="d">${s.zD}</p>
    <p class="beg">${s.zB}</p>
    <form data-api="zmanim">
      <select name="ville">
        ${cities}
      </select>
      <select name="chabbat"><option value="false">${s.zDay}</option><option value="true">${s.zShab}</option></select>
      <button>${s.zBtn}</button>
    </form>
    <div class="out" data-render="zmanim"></div>
  </div>

  <div class="tool">
    <h2>${s.cH}</h2>
    <p class="d">${s.cD}</p>
    <p class="beg">${s.cB}</p>
    <form data-api="chabbat">
      <select name="ville">
        ${cities}
        <option value="">${s.cNoTimes}</option>
      </select>
      <button>${s.cBtn}</button>
    </form>
    <div class="out" data-render="chabbat"></div>
  </div>

  <div class="tool">
    <h2>${s.dH}</h2>
    <p class="d">${s.dD}</p>
    <p class="beg">${s.dB}</p>
    <form data-api="date">
      <input type="date" name="date">
      <button>${s.dBtn}</button>
    </form>
    <div class="out" data-render="date"></div>
  </div>

  <div class="tool">
    <h2>${s.gH}</h2>
    <p class="d">${s.gD}</p>
    <p class="beg">${s.gB}</p>
    <div class="beg">
      <div class="words" data-target="g-texte"><a href="#">חי</a><a href="#">שלום</a><a href="#">אמת</a><a href="#">תורה</a><a href="#">אהבה</a><a href="#">חיים</a><a href="#">ברכה</a><a href="#">שבת</a><a href="#">ישראל</a></div>
      <div class="kbd" data-target="g-texte"></div>
    </div>
    <form data-api="gematria">
      <input type="text" name="texte" id="g-texte" dir="rtl" placeholder="חי" style="font-family:Georgia,serif;font-size:1.1rem">
      <button>${s.gBtn}</button>
    </form>
    <div class="out" data-render="gematria"></div>
  </div>

  <div class="tool">
    <h2>${s.nH}</h2>
    <p class="d">${s.nD}</p>
    <p class="beg">${s.nB}</p>
    <div class="beg"><div class="kbd" data-target="n-texte"></div></div>
    <form data-api="nikoud" data-post="1">
      <textarea name="texte" id="n-texte" placeholder="ואהבת לרעך כמוך"></textarea>
      <button>${s.nBtn}</button>
    </form>
    <div class="out he" data-render="nikoud"></div>
  </div>

  <div class="tool">
    <h2>${s.fH}</h2>
    <p class="d">${s.fD}</p>
    <p class="beg">${s.fB}</p>
    <div class="beg refb">
      <select id="rb-livre">
        ${books}
      </select>
      <input type="number" id="rb-ch" min="1" placeholder="${s.chapter}" value="1">
      <input type="number" id="rb-v" min="1" placeholder="${s.verse}" value="1">
      <select id="rb-amud" style="display:none"><option value="a">${s.amudA}</option><option value="b">${s.amudB}</option></select>
    </div>
    <form data-api="fiche">
      <input type="text" name="ref" id="f-ref" dir="ltr" placeholder="Pirkei Avot 1:14, Berakhot 2a…">
      <button>${s.fBtn}</button>
    </form>
    <div class="out" data-render="fiche"></div>
  </div>

  <a class="back" href="${href(lang, "/")}">${s.back}</a>
  <footer><p><a href="${href(lang, "/")}">${s.home}</a> · ${langSwitcher(lang, path)} · <a href="${href(lang, "/privacy")}">${s.privacy}</a></p><p>${colophon(lang)}</p></footer>
</main>
<script>
(function () {
  var S = ${S};
  function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  var renderers = {
    zmanim: function (d) {
      if (d.evenements) {
        return "<table>" + d.evenements.map(function (e) {
          return "<tr><td>" + esc(e.titre) + (e.hebreu ? " · <span dir=rtl>" + esc(e.hebreu) + "</span>" : "") + "</td><td dir=ltr>" + esc((e.date||"").replace("T"," ").slice(0,17)) + "</td></tr>";
        }).join("") + "</table><p style='margin-top:.5rem;color:#6d675c;font-size:.8rem'>" + esc(d.lieu||"") + "</p>";
      }
      var t = d.zmanim || {};
      var noms = S.noms, expl = S.expl;
      var beg = document.body.classList.contains("mode-debutant");
      return "<table class='" + (beg ? "expl" : "") + "'>" + Object.keys(noms).filter(function(k){return t[k];}).map(function (k) {
        return "<tr><td>" + noms[k] + "</td><td dir=ltr>" + esc(String(t[k]).slice(11,16)) + "</td>" + (beg ? "<td>" + expl[k] + "</td>" : "") + "</tr>";
      }).join("") + "</table><p style='margin-top:.5rem;color:#6d675c;font-size:.8rem'>" + esc(d.lieu||"") + " — " + esc(d.date||"") + "</p>";
    },
    date: function (d) {
      var ev = (d.events||[]).map(esc).join(" · ");
      return "<strong dir=rtl style='font-family:Georgia,serif;font-size:1.2rem'>" + esc(d.hebrew||"") + "</strong><br><span dir=ltr>" + esc(String(d.hd)) + " " + esc(d.hm||"") + " " + esc(String(d.hy)) + "</span>" + (ev ? "<br><span style='color:#6d675c'>" + ev + "</span>" : "");
    },
    gematria: function (d) {
      var rows = (d.mots||[]).map(function (m) {
        return "<tr><td dir=rtl style='font-family:Georgia,serif'>" + esc(m.mot) + "</td><td>" + m.hechrechi + "</td><td>" + m.gadol + "</td><td>" + m.katan + "</td><td>" + m.siduri + "</td><td>" + m.atbash + "</td></tr>";
      }).join("");
      var t = d.totaux || {};
      var beg = document.body.classList.contains("mode-debutant");
      var legend = beg ? S.legend : "";
      return "<table><tr>" + S.th.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr>" + rows +
        "<tr><th>" + S.total + "</th><th>" + t.hechrechi + "</th><th>" + t.gadol + "</th><th>" + t.katan + "</th><th>" + t.siduri + "</th><th>" + t.atbash + "</th></tr></table>" + legend;
    },
    nikoud: function (d) {
      return esc(d.vocalise || "") + "<p style='margin-top:.5rem;color:#6d675c;font-size:.72rem;direction:ltr'>" + esc(S.credit || d.credit || "") + "</p>";
    },
    chabbat: function (d) {
      var id = "c" + Date.now();
      return "<div id='" + id + "' style='white-space:pre-wrap'>" + esc(d.mot||"") + "</div>" +
        "<div style='margin-top:.6rem'>" +
        "<a href='" + esc(d.partage_whatsapp||"#") + "' target='_blank' rel='noopener' style=\"font-family:'Fraunces',Georgia,serif;font-weight:600;text-decoration:none\">[ " + S.cWa + " ]</a>&nbsp;&nbsp;" +
        "<button class='copy' onclick=\"navigator.clipboard.writeText(document.getElementById('" + id + "').innerText).then(()=>{this.textContent='" + S.copied + "'})\">" + S.copy + "</button>" +
        "</div>";
    },
    fiche: function (d) {
      var id = "f" + Date.now();
      return "<div id='" + id + "' style='white-space:pre-wrap'>" + esc(d.fiche||"") + "</div><button class='copy' style='margin-top:.6rem' onclick=\\"navigator.clipboard.writeText(document.getElementById('" + id + "').innerText).then(()=>{this.textContent='" + S.copied + "'})\\">" + S.copy + "</button>";
    },
  };
  // Mode débutant / classique (partagé avec /question via localStorage)
  var HELP = S.help;
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
    var sp = document.createElement("button"); sp.type = "button"; sp.className = "sp"; sp.textContent = S.space; sp.onclick = function () { ins(" "); }; k.appendChild(sp);
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
    rbC.placeholder = daf ? S.page : S.chapter;
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
      }).catch(function () { out.textContent = S.error; });
    });
  });
})();
</script>
</body>
</html>`;
}

/** Compatibilité : la version française sous l'ancien nom. */
export const OUTILS_HTML = outilsHtml("fr");
