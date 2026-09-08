/**
 * /miel — le générateur de feuilles de miel de Roch Hachana.
 * Tout se passe dans le navigateur : aucun envoi de données, aucun appel IA.
 * La feuille (gabarit « périodique vintage ») se personnalise (prénom, ville)
 * et s'imprime via l'impression du navigateur (le même moteur qui a produit
 * les PDF de référence). Horaires : /api/miel-horaires (proxy Hebcal, worker).
 */

import { Lang, href, altLinks, htmlAttrs, langSwitcher, colophon, t } from "./i18n";

/** Villes proposées — geonameids vérifiés un à un sur l'API Hebcal (08.09.2026). */
export const VILLES_MIEL: Record<string, { g: number; nom: string }> = {
  paris: { g: 2988507, nom: "Paris" },
  marseille: { g: 2995469, nom: "Marseille" },
  lyon: { g: 2996944, nom: "Lyon" },
  nice: { g: 2990440, nom: "Nice" },
  toulouse: { g: 2972315, nom: "Toulouse" },
  strasbourg: { g: 2973783, nom: "Strasbourg" },
  bordeaux: { g: 3031582, nom: "Bordeaux" },
  bruxelles: { g: 2800866, nom: "Bruxelles" },
  geneve: { g: 2660646, nom: "Genève" },
  londres: { g: 2643743, nom: "Londres" },
  jerusalem: { g: 281184, nom: "Jérusalem" },
  telaviv: { g: 293397, nom: "Tel-Aviv" },
  netanya: { g: 294071, nom: "Netanya" },
  newyork: { g: 5128581, nom: "New York" },
  montreal: { g: 6077243, nom: "Montréal" },
  losangeles: { g: 5368361, nom: "Los Angeles" },
  miami: { g: 4164138, nom: "Miami" },
  casablanca: { g: 2553604, nom: "Casablanca" },
};

/** Prénoms courants → hébreu (proposition modifiable par l'utilisateur). */
const NOMS_HEBREU: Record<string, string> = {
  jonathan: "יונתן", joy: "ג׳וי", elly: "אלי", jill: "ג׳יל", dana: "דנה", noa: "נועה",
  brigitte: "בריז׳יט", "jean pierre": "ז׳אן פייר", "jean-pierre": "ז׳אן פייר", vanessa: "ונסה",
  michael: "מיכאל", michel: "מישל", samuel: "שמואל", isaac: "יצחק", nissim: "נסים",
  lauren: "לורן", yona: "יונה", meir: "מאיר", jessy: "ג׳סי",
  david: "דוד", sarah: "שרה", rachel: "רחל", esther: "אסתר", lea: "לאה", "léa": "לאה",
  myriam: "מרים", miriam: "מרים", moshe: "משה", "moïse": "משה", moise: "משה",
  aaron: "אהרן", benjamin: "בנימין", nathan: "נתן", raphael: "רפאל", "raphaël": "רפאל",
  gabriel: "גבריאל", daniel: "דניאל", hanna: "חנה", anna: "חנה", rebecca: "רבקה",
  judith: "יהודית", ruth: "רות", simon: "שמעון", jacob: "יעקב", joseph: "יוסף",
  abraham: "אברהם", avraham: "אברהם", ariel: "אריאל", noam: "נועם", maya: "מאיה",
  eitan: "איתן", ethan: "איתן", ilan: "אילן", yael: "יעל", "yaël": "יעל",
  deborah: "דבורה", "déborah": "דבורה", eve: "חוה", eva: "חוה", sacha: "סשה",
  salomon: "שלמה", solal: "סולל", elie: "אליהו", "élie": "אליהו", emma: "אמה",
};

interface StringsMiel {
  title: string; desc: string;
  h1: string; chapeau: string;
  labPrenom: string; phPrenom: string; labHeb: string; phHeb: string;
  labVille: string; autreVille: string; btnImprimer: string;
  notePrint: string; notePrivee: string;
  datesTitre: string; regleAvec: string; regleSans: string;
  lignes: { f: string; i: string; d: string }[];
  nomLab: string; berakhotTitre: string; introB1: string; introB2: string;
  simLabels: string[]; trad: string; src: string; offert: string;
  nav: { question: string; chabbat: string; install: string };
}

/* Les 9 simanim : hébreu et phonétique identiques dans les trois langues. */
const SIM_HEB = [
  "יְהִי רָצוֹן מִלְּפָנֶיךָ ה׳ אֱלֹקֵינוּ וֵאלֹקֵי אֲבוֹתֵינוּ, שֶׁתְּחַדֵּשׁ עָלֵינוּ שָׁנָה טוֹבָה וּמְתוּקָה",
  "יְהִי רָצוֹן… שֶׁיִּתַּמּוּ אוֹיְבֵינוּ וְשׂוֹנְאֵינוּ וְכָל מְבַקְשֵׁי רָעָתֵנוּ",
  "יְהִי רָצוֹן… שֶׁנִּהְיֶה מְלֵאִים מִצְוֹת כָּרִמּוֹן",
  "יְהִי רָצוֹן… שֶׁתִּקְרַע רֹעַ גְּזַר דִּינֵנוּ, וְיִקָּרְאוּ לְפָנֶיךָ זָכִיּוֹתֵינוּ",
  "יְהִי רָצוֹן… שֶׁיִּרְבּוּ זָכִיּוֹתֵינוּ וּתְלַבְּבֵנוּ",
  "יְהִי רָצוֹן… שֶׁיִּכָּרְתוּ אוֹיְבֵינוּ וְשׂוֹנְאֵינוּ וְכָל מְבַקְשֵׁי רָעָתֵנוּ",
  "יְהִי רָצוֹן… שֶׁיִּסְתַּלְּקוּ אוֹיְבֵינוּ וְשׂוֹנְאֵינוּ וְכָל מְבַקְשֵׁי רָעָתֵנוּ",
  "יְהִי רָצוֹן… שֶׁנִּהְיֶה לְרֹאשׁ וְלֹא לְזָנָב",
  "יְהִי רָצוֹן… שֶׁנִּפְרֶה וְנִרְבֶּה כַּדָּגִים",
];
const SIM_PHON = [
  "Yehi ratsone milefanékha… chéte'hadech alénou chana tova oumetouka",
  "… chéyitamou oyevénou vésonénou vékhol mevakché raaténou",
  "… chénihyé meléïm mitsvot karimone",
  "… chétikra roa guezar dinénou, véyikarou lefanékha zakhiyoténou",
  "… chéyirbou zakhiyoténou outelabevénou",
  "… chéyikartou oyevénou vésonénou",
  "… chéyistalkou oyevénou vésonénou",
  "… chénihyé leroch vélo lezanav",
  "… chénifré vénirbé kadaguim",
];

const T: Record<Lang, StringsMiel> = {
  fr: {
    title: "La feuille de miel — Mamash IA",
    desc: "Générez votre feuille de miel de Roch Hachana 5787 : prénom, ville, toutes les berakhot en hébreu et en phonétique — à imprimer gratuitement.",
    h1: "La feuille de <strong>miel</strong>.",
    chapeau: "Chaque convive mérite la sienne. Un prénom, une ville — et la feuille se compose : les dates de Tichri 5787, les horaires de chez vous, toutes les berakhot des simanim en hébreu et en phonétique. Imprimez, posez près du miel.",
    labPrenom: "Le prénom", phPrenom: "Esther, David, Jonathan…",
    labHeb: "En hébreu (modifiable)", phHeb: "אסתר",
    labVille: "La ville — pour les horaires", autreVille: "Autre ville (sans horaires)",
    btnImprimer: "Imprimer / enregistrer en PDF",
    notePrint: "Dans la fenêtre d'impression, activez « Imprimer les arrière-plans » et choisissez A4 sans marges.",
    notePrivee: "Tout se passe dans votre navigateur : rien n'est envoyé, rien n'est conservé.",
    datesTitre: "Dates des Fêtes de Tichri de l'année",
    regleAvec: "LES FÊTES COMMENCENT TOUJOURS LA VEILLE AU SOIR — HORAIRES DE ",
    regleSans: "LES FÊTES COMMENCENT TOUJOURS LA VEILLE AU SOIR",
    lignes: [
      { f: "VEILLE DE ROCH-HACHANA", i: "— Nouvel An, 1<sup>er</sup> Sédèr<span class=\"avech\"> · allumage <b data-k=\"veille\"></b></span>", d: "vendredi soir 11 sept. 2026" },
      { f: "ROCH-HACHANA", i: "— Chabbat (pas de chofar), 2<sup>e</sup> Sédèr<span class=\"avech\"> · allumage après <b data-k=\"soir2\"></b></span>", d: "1<sup>er</sup> jour : samedi 12 sept." },
      { f: "ROCH-HACHANA", i: "— Chofar et Tachlikh<span class=\"avech\"> · fin de fête <b data-k=\"sortieRH\"></b></span>", d: "2<sup>e</sup> jour : dimanche 13 sept." },
      { f: "JEÛNE DE GUEDALIA", i: "<i>(reporté)</i>", d: "lundi 14 sept." },
      { f: "KOL-NIDRÉ", i: "— veille de Yom Kippour<span class=\"avech\"> · allumage <b data-k=\"kolnidre\"></b></span>", d: "dimanche soir 20 sept." },
      { f: "YOM KIPPOUR", i: "— Grand Pardon, Yzkor<span class=\"avech\"> · fin du jeûne <b data-k=\"sortieYK\"></b></span>", d: "lundi 21 sept." },
      { f: "SOUCCOT", i: "<span class=\"avech\">— allumage <b data-k=\"souccot\"></b> la veille</span> · « préparez votre soucca »", d: "samedi 26 et dimanche 27 sept." },
      { f: "HOCHANA RABBA", i: "", d: "vendredi 2 octobre" },
      { f: "CHEMINI ATSÉRET", i: "— Yzkor", d: "samedi 3 octobre" },
      { f: "SIMHAT TORAH", i: "<span class=\"avech\">— fin des fêtes <b data-k=\"finFetes\"></b></span>", d: "dimanche 4 octobre" },
    ],
    nomLab: "Cet exemplaire est celui de",
    berakhotTitre: "LES BERAKHOT DU SOIR DE ROCH-HACHANA — LE SÉDÈR DES SIMANIM",
    introB1: "On trempe le pain du Motsi dans le miel. Sur le premier fruit, on bénit",
    introB2: ", puis, pour chaque siman :",
    simLabels: ["La pomme trempée dans le miel", "La datte — tamar", "La grenade — rimone", "La courge — kra",
      "Le fenugrec — roubia", "Le poireau — karti", "La blette — silka", "La tête (poisson ou agneau)", "Le poisson"],
    trad: "« Que ce soit Ta volonté de renouveler pour nous une année bonne et douce. »",
    src: "Sources lues sur Sefaria : Talmud, Horayot 12a (Abayé) · Kitsour Choulhan Aroukh 129, 9 · Michna Beroura 583, 21",
    offert: "offert par",
    nav: { question: "Une question", chabbat: "Chabbat", install: "Installer le MCP" },
  },
  en: {
    title: "The honey sheet — Mamash IA",
    desc: "Generate your Rosh Hashana 5787 honey sheet: a name, a city, every simanim blessing in Hebrew and transliteration — free to print.",
    h1: "The <strong>honey</strong> sheet.",
    chapeau: "Every guest deserves their own. A name, a city — and the sheet composes itself: the Tishrei 5787 dates, your local times, every simanim blessing in Hebrew and transliteration. Print it, set it by the honey.",
    labPrenom: "First name", phPrenom: "Esther, David, Jonathan…",
    labHeb: "In Hebrew (editable)", phHeb: "אסתר",
    labVille: "City — for the times", autreVille: "Other city (no times)",
    btnImprimer: "Print / save as PDF",
    notePrint: "In the print dialog, enable “Background graphics” and choose A4 with no margins.",
    notePrivee: "Everything happens in your browser: nothing is sent, nothing is stored.",
    datesTitre: "Dates of the Tishrei Holidays",
    regleAvec: "HOLIDAYS ALWAYS BEGIN THE PRIOR EVENING — TIMES FOR ",
    regleSans: "HOLIDAYS ALWAYS BEGIN THE PRIOR EVENING",
    lignes: [
      { f: "EREV ROSH HASHANA", i: "— New Year, 1<sup>st</sup> Seder<span class=\"avech\"> · candle-lighting <b data-k=\"veille\"></b></span>", d: "Friday evening, Sept. 11, 2026" },
      { f: "ROSH HASHANA", i: "— Shabbat (no shofar), 2<sup>nd</sup> Seder<span class=\"avech\"> · candles after <b data-k=\"soir2\"></b></span>", d: "1<sup>st</sup> day: Saturday, Sept. 12" },
      { f: "ROSH HASHANA", i: "— Shofar and Tashlich<span class=\"avech\"> · ends <b data-k=\"sortieRH\"></b></span>", d: "2<sup>nd</sup> day: Sunday, Sept. 13" },
      { f: "FAST OF GEDALIA", i: "<i>(postponed)</i>", d: "Monday, Sept. 14" },
      { f: "KOL NIDREI", i: "— Yom Kippur eve<span class=\"avech\"> · candle-lighting <b data-k=\"kolnidre\"></b></span>", d: "Sunday evening, Sept. 20" },
      { f: "YOM KIPPUR", i: "— Yizkor<span class=\"avech\"> · fast ends <b data-k=\"sortieYK\"></b></span>", d: "Monday, Sept. 21" },
      { f: "SUKKOT", i: "<span class=\"avech\">— candles <b data-k=\"souccot\"></b> the eve before</span> · “prepare your sukka”", d: "Saturday 26 & Sunday 27 Sept." },
      { f: "HOSHANA RABBA", i: "", d: "Friday, October 2" },
      { f: "SHEMINI ATZERET", i: "— Yizkor", d: "Saturday, October 3" },
      { f: "SIMCHAT TORAH", i: "<span class=\"avech\">— holidays end <b data-k=\"finFetes\"></b></span>", d: "Sunday, October 4" },
    ],
    nomLab: "This copy belongs to",
    berakhotTitre: "THE ROSH HASHANA EVENING BLESSINGS — THE SIMANIM SEDER",
    introB1: "Dip the Motzi bread in honey. Over the first fruit, say",
    introB2: ", then, for each siman:",
    simLabels: ["The apple dipped in honey", "The date — tamar", "The pomegranate — rimon", "The gourd — kra",
      "The fenugreek — rubia", "The leek — karti", "The chard — silka", "The head (fish or lamb)", "The fish"],
    trad: "“May it be Your will to renew for us a good and sweet year.”",
    src: "Sources read on Sefaria: Talmud, Horayot 12a (Abaye) · Kitzur Shulchan Arukh 129:9 · Mishna Berura 583:21",
    offert: "offered by",
    nav: { question: "Ask a question", chabbat: "Shabbat", install: "Install the MCP" },
  },
  he: {
    title: "דף הדבש — Mamash IA",
    desc: "צרו את דף הדבש שלכם לראש השנה תשפ״ז: שם, עיר, כל ברכות הסימנים — להדפסה חינם.",
    h1: "דף <strong>הדבש</strong>.",
    chapeau: "לכל אורח מגיע דף משלו. שם ועיר — והדף נערך מעצמו: תאריכי תשרי תשפ״ז, זמני העיר שלכם, וכל ברכות הסימנים. מדפיסים ומניחים ליד הדבש.",
    labPrenom: "השם הפרטי", phPrenom: "אסתר, דוד, יונתן…",
    labHeb: "בעברית (ניתן לעריכה)", phHeb: "אסתר",
    labVille: "העיר — לזמנים", autreVille: "עיר אחרת (בלי זמנים)",
    btnImprimer: "הדפסה / שמירה כ-PDF",
    notePrint: "בחלון ההדפסה הפעילו « רקעים » ובחרו A4 בלי שוליים.",
    notePrivee: "הכול קורה בדפדפן שלכם: שום דבר לא נשלח ולא נשמר.",
    datesTitre: "מועדי חודש תשרי",
    regleAvec: "החגים נכנסים תמיד בערב שלפני — זמני ",
    regleSans: "החגים נכנסים תמיד בערב שלפני",
    lignes: [
      { f: "ערב ראש השנה", i: "— סדר ראשון<span class=\"avech\"> · הדלקת נרות <b data-k=\"veille\"></b></span>", d: "יום שישי בערב, 11.9.2026" },
      { f: "ראש השנה", i: "— שבת (אין שופר), סדר שני<span class=\"avech\"> · הדלקה אחרי <b data-k=\"soir2\"></b></span>", d: "יום א׳ של החג: שבת, 12.9" },
      { f: "ראש השנה", i: "— שופר ותשליך<span class=\"avech\"> · צאת החג <b data-k=\"sortieRH\"></b></span>", d: "יום ב׳ של החג: ראשון, 13.9" },
      { f: "צום גדליה", i: "<i>(נדחה)</i>", d: "שני, 14.9" },
      { f: "כל נדרי", i: "— ערב יום כיפור<span class=\"avech\"> · הדלקת נרות <b data-k=\"kolnidre\"></b></span>", d: "ראשון בערב, 20.9" },
      { f: "יום כיפור", i: "— יזכור<span class=\"avech\"> · צאת הצום <b data-k=\"sortieYK\"></b></span>", d: "שני, 21.9" },
      { f: "סוכות", i: "<span class=\"avech\">— הדלקה <b data-k=\"souccot\"></b> בערב שלפני</span>", d: "שבת 26.9 וראשון 27.9" },
      { f: "הושענא רבה", i: "", d: "שישי, 2.10" },
      { f: "שמיני עצרת", i: "— יזכור", d: "שבת, 3.10" },
      { f: "שמחת תורה", i: "<span class=\"avech\">— צאת החגים <b data-k=\"finFetes\"></b></span>", d: "ראשון, 4.10" },
    ],
    nomLab: "הדף הזה שייך ל",
    berakhotTitre: "ברכות ליל ראש השנה — סדר הסימנים",
    introB1: "טובלים את פרוסת המוציא בדבש. על הפרי הראשון מברכים",
    introB2: ", ואחר כך, לכל סימן:",
    simLabels: ["התפוח בדבש", "התמר", "הרימון", "הקרא (דלעת)", "הרוביא", "הכרתי", "הסלקא", "הראש (דג או כבש)", "הדגים"],
    trad: "",
    src: "מקורות שנקראו בספריא: הוריות יב ע״א (אביי) · קיצור שולחן ערוך קכט, ט · משנה ברורה תקפג, כא",
    offert: "מוגש על ידי",
    nav: { question: "שאלה", chabbat: "שבת", install: "התקנת ה-MCP" },
  },
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function mielPage(lang: Lang): string {
  const s = T[lang];
  const villesOpts = Object.entries(VILLES_MIEL)
    .map(([k, v]) => `<option value="${k}"${k === "marseille" ? " selected" : ""}>${v.nom}</option>`)
    .join("");
  const lignes = s.lignes
    .map((l) => `<tr><td class="f">${l.f} <i>${l.i}</i></td><td class="pts"></td><td class="d">${l.d}</td></tr>`)
    .join("\n    ");
  const sims = s.simLabels
    .map((lab, i) => `<div class="sim"><div class="simt">☞ ${lab}${i === 0 ? ' <span class="bpe">בורא פרי העץ</span>' : ""}</div><div class="simheb">${SIM_HEB[i]}</div><div class="simph">${SIM_PHON[i]}${i === 0 && s.trad ? " — " + s.trad : ""}</div></div>`)
    .join("\n");
  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${s.desc}">
<meta property="og:title" content="${s.title}">
<meta property="og:description" content="${s.desc}">
<meta property="og:image" content="https://mamash-ia.com/og.png?v=2">
<meta property="og:type" content="website">
${altLinks(lang, "/miel")}
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
<link rel="icon" href="/icon.png">
<link rel="stylesheet" href="/fonts/fonts-miel.css">
<style>
  :root { --paper:#f7f6f1; --ink:#082a99; --pop:#ffd23f; --muted:#5a5a6e; --rouge:#b3232a; --encre:#23233d; }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:16px/1.65 "Frank Ruhl Libre", Georgia, serif; }
  /* ---- interface ---- */
  .ui { max-width:1200px; margin:0 auto; padding:1.2rem 4vw 2rem; }
  nav { display:flex; justify-content:space-between; align-items:center; padding:.4rem 0 1rem; }
  nav .wm { font-family:"Rubik", "Arial Black", sans-serif; font-weight:900; font-size:.92rem; letter-spacing:.05em; text-transform:uppercase; text-decoration:none; color:var(--ink); }
  nav .wm img { width:30px; height:30px; border-radius:50%; vertical-align:-9px; margin-inline-end:.5rem; }
  nav .r a { color:var(--ink); text-decoration:none; margin-inline-start:1rem; font-size:.9rem; }
  nav .r .lang { margin-inline-start:1.1rem; padding-inline-start:.8rem; border-inline-start:1px solid rgba(8,42,153,.25); font-size:.82rem; }
  nav .r .lang a { margin-inline-start:0; }
  .lang .dot { opacity:.4; margin:0 .35em; }
  h1 { font-family:"Playfair Display", Georgia, serif; font-weight:900; font-size:clamp(2rem,4.6vw,3.2rem); line-height:1.05; }
  [dir="rtl"] h1 { font-family:"Frank Ruhl Libre", Georgia, serif; }
  h1 strong { color:var(--rouge); }
  p.chapeau { max-width:44rem; margin-top:.7rem; color:var(--muted); }
  .entete { display:flex; align-items:center; gap:2rem; }
  .entete > div { flex:1; min-width:0; }
  .potmiel { width:clamp(120px, 16vw, 190px); height:auto; flex:none; transform:rotate(4deg);
             filter:drop-shadow(0 10px 22px rgba(8,42,153,.18)); }
  @media (max-width:640px) { .entete { gap:1rem; } .potmiel { width:96px; } }
  .atelier { display:grid; grid-template-columns:minmax(260px,340px) minmax(0,1fr); gap:2.2rem; margin-top:1.6rem; align-items:start; }
  form .champ { margin-bottom:1rem; }
  label { display:block; font-size:.78rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; margin-bottom:.3rem; }
  input, select { width:100%; font:inherit; color:var(--ink); background:#fff; border:1.5px solid rgba(8,42,153,.35); padding:.55rem .7rem; }
  input:focus, select:focus { outline:2px solid var(--pop); }
  #heb { direction:rtl; font-weight:700; }
  button { display:inline-block; width:100%; background:var(--pop); color:var(--ink); border:none; cursor:pointer;
           font:700 1.05rem "Frank Ruhl Libre", Georgia, serif; padding:.7rem 1rem .8rem; box-shadow:0 4px 14px rgba(8,42,153,.16); }
  button:hover { background:var(--ink); color:var(--pop); }
  .note { font-size:.8rem; color:var(--muted); margin-top:.7rem; line-height:1.5; }
  .cadre-apercu { border:1.5px solid rgba(8,42,153,.15); background:#e6e4dc; overflow:hidden; position:relative; }
  .apercu { transform-origin:top left; }
  /* ---- la feuille (mêmes règles que les PDF de référence) ---- */
  .page { width:210mm; height:297mm; padding:7mm; color:#1a1a2e; font-family:"PT Serif", Georgia, serif; direction:ltr; text-align:left;
          background:#eef0ec url("/fond-miel.jpg") 0 0 / 210mm 297mm no-repeat; }
  .cadre { width:100%; height:100%; border:1mm solid var(--encre); outline:.3mm solid var(--encre); outline-offset:1.2mm;
           padding:4.5mm 8mm 4mm; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .bande { width:100%; display:flex; justify-content:space-between; font-size:2.9mm; font-weight:700; letter-spacing:.3mm; }
  .bande .bh { font-family:"Frank Ruhl Libre", serif; }
  .titre { font-family:"Monoton", cursive; font-size:13mm; line-height:1.12; color:var(--encre); margin-top:3mm; letter-spacing:.5mm; }
  .ligne-annee { display:flex; align-items:center; gap:5mm; margin-top:2.4mm; }
  .sceau { width:11mm; height:11mm; border-radius:50%; }
  .annee { font-family:"Playfair Display", serif; font-weight:900; font-style:italic; font-size:5.8mm; color:var(--rouge); }
  .main { font-size:7mm; }
  .rouge1 { font-family:"Playfair Display", serif; font-weight:900; font-size:5.8mm; color:var(--rouge); margin-top:2.6mm; }
  .rouge2 { font-family:"Playfair Display", serif; font-weight:900; font-size:7.4mm; color:var(--rouge); letter-spacing:1.6mm; }
  .regle { width:100%; border-top:.5mm solid var(--rouge); border-bottom:.5mm solid var(--rouge); color:var(--rouge);
           font-weight:700; font-size:3.3mm; letter-spacing:.35mm; padding:1.1mm 0; margin-top:2.2mm; }
  .regle.r2 { margin-top:2.4mm; }
  .dates { width:100%; border-collapse:collapse; margin-top:1.8mm; }
  .dates td { font-size:3mm; padding:.4mm 0; vertical-align:baseline; text-align:left; }
  .dates .f { font-weight:700; white-space:nowrap; }
  .dates .f i { font-weight:400; font-style:italic; font-size:2.9mm; }
  .dates .pts { width:100%; border-bottom:.35mm dotted var(--encre); transform:translateY(-1mm); }
  .dates .d { font-weight:700; white-space:nowrap; text-align:right; padding-left:1.5mm; }
  .sansh .avech { display:none; }
  .nomrow { width:100%; display:flex; align-items:center; justify-content:center; gap:4mm; margin-top:2.2mm;
            border-top:.8mm double var(--rouge); border-bottom:.8mm double var(--rouge); padding:1.6mm 0; }
  .nomlab { color:var(--rouge); font-weight:700; font-size:3.4mm; letter-spacing:.3mm; font-variant:small-caps; }
  .lenom { font-family:"Playfair Display", serif; font-weight:900; font-size:6.8mm; letter-spacing:.8mm; text-transform:uppercase; min-height:9mm; }
  .lenom.creux { border-bottom:.4mm dotted var(--encre); min-width:70mm; }
  .nomheb { font-family:"Frank Ruhl Libre", serif; font-weight:700; font-size:5.4mm; direction:rtl; }
  .intro { font-size:3.1mm; margin-top:1.4mm; line-height:1.45; max-width:180mm; }
  .hebin { font-family:"Frank Ruhl Libre", serif; font-weight:700; font-size:4.1mm; direction:rtl; unicode-bidi:isolate; }
  .ph { font-style:italic; }
  .sims { width:100%; display:grid; grid-template-columns:1fr 1fr; gap:1mm 5mm; margin-top:1.4mm; text-align:left; }
  .simt { font-weight:700; font-size:3mm; color:var(--rouge); }
  .simt .bpe { color:#1a1a2e; font-weight:400; font-style:italic; font-family:"Frank Ruhl Libre", serif; }
  .simheb { font-family:"Frank Ruhl Libre", serif; font-weight:700; font-size:3.8mm; direction:rtl; text-align:right; line-height:1.45; }
  .simph { font-size:2.7mm; font-style:italic; line-height:1.3; opacity:.9; }
  .pied { width:100%; margin-top:auto; display:flex; justify-content:space-between; align-items:baseline;
          border-top:.3mm solid var(--encre); padding-top:1.4mm; font-size:2.6mm; }
  .pied .pm { font-size:2.9mm; font-weight:700; }
  footer.site { max-width:1200px; margin:0 auto; padding:2rem 4vw; font-size:.85rem; color:var(--muted); }
  @media (max-width:900px) { .atelier { grid-template-columns:1fr; } }
  /* ---- impression : seule la feuille sort ---- */
  @media print {
    @page { size: A4; margin: 0; }
    body { background:none; }
    nav, h1, p.chapeau, form, footer.site { display:none !important; }
    .ui { padding:0; max-width:none; margin:0; }
    .atelier { display:block; margin:0; gap:0; }
    .cadre-apercu { border:none; background:none; overflow:visible; height:auto !important; }
    .apercu { transform:none !important; }
  }
</style>
</head>
<body>
<div class="ui">
  <nav>
    <a class="wm" href="${href(lang, "/")}" dir="ltr"><img src="/icon.png" alt="">Mamash IA</a>
    <span class="r"><a href="${href(lang, "/question")}">${s.nav.question}</a><a href="${href(lang, "/chabbat")}">${s.nav.chabbat}</a>${langSwitcher(lang, "/miel")}</span>
  </nav>
  <div class="entete">
    <div>
      <h1>${s.h1}</h1>
      <p class="chapeau">${s.chapeau}</p>
    </div>
    <img class="potmiel" src="/miel-pot.png" alt="" width="512" height="512">
  </div>
  <div class="atelier">
    <form onsubmit="return false">
      <div class="champ"><label for="prenom">${s.labPrenom}</label><input id="prenom" placeholder="${s.phPrenom}" maxlength="24" autocomplete="off"></div>
      <div class="champ"><label for="heb">${s.labHeb}</label><input id="heb" placeholder="${s.phHeb}" maxlength="24" autocomplete="off"></div>
      <div class="champ"><label for="ville">${s.labVille}</label><select id="ville">${villesOpts}<option value="autre">${s.autreVille}</option></select></div>
      <button id="imprimer" type="button">${s.btnImprimer}</button>
      <p class="note">${s.notePrint}</p>
      <p class="note">${s.notePrivee}</p>
    </form>
    <div class="cadre-apercu" id="capercu"><div class="apercu" id="apercu">
      <div class="page"><div class="cadre">
        <div class="bande"><span>PÉRIODIQUE FAMILIAL — N° 1</span><span class="bh">בס״ד · שנת התשפ״ז</span><span>© mamash-ia.com</span></div>
        <div class="titre">LA FEUILLE<br>DE «&nbsp;MIEL&nbsp;»</div>
        <div class="ligne-annee"><img class="sceau" src="/icon.png" alt=""><span class="annee">Année 2026 – 2027</span><span class="main">☞</span></div>
        <div class="rouge1">${s.datesTitre}</div>
        <div class="rouge2">5787 · 2026</div>
        <div class="regle" id="regleh">${s.regleSans}</div>
        <table class="dates" id="tdates">${lignes}</table>
        <div class="nomrow"><span class="nomlab">${s.nomLab}</span><span class="lenom creux" id="fnom">&nbsp;</span><span class="nomheb" id="fheb"></span></div>
        <div class="regle r2">${s.berakhotTitre}</div>
        <div class="intro">${s.introB1}
          <span class="hebin">בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הָעֵץ</span>
          <span class="ph">(Baroukh ata Ado-naï Élo-hénou mélekh haolam, boré peri haets)</span>${s.introB2}</div>
        <div class="sims">${sims}</div>
        <div class="pied"><span>${s.src}</span><span class="pm">${s.offert} mamash-ia.com</span></div>
      </div></div>
    </div></div>
  </div>
</div>
<footer class="site"><p><a href="${href(lang, "/")}">mamash-ia.com</a> · ${colophon(lang)}</p></footer>
<script>
(function () {
  var NOMS = ${JSON.stringify(NOMS_HEBREU).replace(/</g, "\\u003c")};
  var prenom = document.getElementById("prenom");
  var heb = document.getElementById("heb");
  var ville = document.getElementById("ville");
  var fnom = document.getElementById("fnom");
  var fheb = document.getElementById("fheb");
  var regleh = document.getElementById("regleh");
  var tdates = document.getElementById("tdates");
  var REGLE_AVEC = ${JSON.stringify(t(lang, { fr: T.fr.regleAvec, en: T.en.regleAvec, he: T.he.regleAvec }))};
  var REGLE_SANS = ${JSON.stringify(t(lang, { fr: T.fr.regleSans, en: T.en.regleSans, he: T.he.regleSans }))};
  var hebManuel = false;

  function majNom() {
    var v = prenom.value.trim();
    fnom.textContent = v ? v.toUpperCase() : "\\u00a0";
    fnom.classList.toggle("creux", !v);
    if (!hebManuel) {
      var connu = NOMS[v.toLowerCase()];
      heb.value = connu || "";
    }
    fheb.textContent = heb.value.trim();
  }
  prenom.addEventListener("input", majNom);
  heb.addEventListener("input", function () { hebManuel = heb.value.trim().length > 0; fheb.textContent = heb.value.trim(); });

  function majVille() {
    var k = ville.value;
    if (k === "autre") {
      tdates.classList.add("sansh");
      regleh.textContent = REGLE_SANS;
      return;
    }
    var nomV = ville.options[ville.selectedIndex].textContent;
    fetch("/api/miel-horaires?v=" + encodeURIComponent(k))
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (h) {
        tdates.classList.remove("sansh");
        regleh.textContent = REGLE_AVEC + nomV.toUpperCase();
        document.querySelectorAll("#tdates [data-k]").forEach(function (b) {
          var val = h[b.getAttribute("data-k")];
          b.textContent = val ? val.replace(":", " h ") : "";
          if (!val) b.closest(".avech").style.display = "none";
        });
      })
      .catch(function () { tdates.classList.add("sansh"); regleh.textContent = REGLE_SANS; });
  }
  ville.addEventListener("change", majVille);

  // Aperçu à l'échelle du conteneur
  var capercu = document.getElementById("capercu");
  var apercu = document.getElementById("apercu");
  function zoom() {
    var largeurMm = 210 * 3.7795; // mm -> px CSS
    var z = Math.min(1, capercu.clientWidth / largeurMm);
    apercu.style.transform = "scale(" + z + ")";
    capercu.style.height = (297 * 3.7795 * z) + "px";
  }
  window.addEventListener("resize", zoom);
  zoom();
  majVille();

  document.getElementById("imprimer").addEventListener("click", function () { window.print(); });
})();
</script>
</body>
</html>`;
}
