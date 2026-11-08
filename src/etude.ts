/**
 * /etude, les dossiers de la paracha : une vidéo, puis trois niveaux de
 * lecture, et la possibilité de proposer une amélioration.
 *
 * La forme vient du rav Meir Attal, vocal du 4 novembre 2026 : « tu as cette
 * vidéo et avec cette vidéo [...] tu as le Gueoula Times qui va avec, ça c'est
 * au même niveau [...] niveau 2, c'est le cours, c'est toutes les sources, les
 * versets avec [...] niveau 3, tout en hébreu, pour les gens qui savent
 * vraiment étudier. [...] Il faut laisser la possibilité aux gens de mettre des
 * commentaires s'il y a des choses à améliorer, pour qu'on trouve vraiment le
 * juste milieu. »
 *
 * Les niveaux gardent sa numérotation, et chacun porte en plus ce qu'il est.
 * Les deux Sicha sont le même travail dans deux langues, et non deux
 * profondeurs : annoncer « niveau 3 » tout court laisserait croire à un
 * francophone qu'il lui manque quelque chose alors qu'il a tout lu.
 *
 * Un niveau dont le document n'est pas prêt reste visible et désactivé : on
 * ne publie rien qui ne soit vérifié, et le lecteur voit ce qui vient.
 */

import { type Lang, altLinks, htmlAttrs, href, langSwitcher, colophon, t, saisonMiel, retourTab, suivre } from "./i18n";

interface Niveau {
  fichier?: string;          // sous /etude/, absent tant que le document n'est pas prêt
  pages?: number;
  ko?: number;               // le poids du fichier, en kilooctets
}

interface Dossier {
  slug: string;
  paracha: { fr: string; en: string; he: string };
  hebreu: string;            // le nom en hébreu, pour le titre
  chabbat: string;           // date civile du Chabbat concerné
  video?: string;            // identifiant YouTube du cours
  court?: string;            // identifiant YouTube du format court
  fil: { fr: string; en: string; he: string };   // le fil du dossier, deux phrases
  gueoula?: Niveau;
  sichaFr?: Niveau;
  sichaHe?: Niveau;
}

/** Les dossiers publiés, du plus récent au plus ancien. */
const DOSSIERS: Dossier[] = [
  {
    slug: "haye-sara",
    paracha: { fr: "'Hayé Sarah", en: "'Hayé Sarah", he: "חיי שרה" },
    hebreu: "חיי שרה",
    chabbat: "2026-11-07",
    video: "j9eTEZFPLbU",
    court: "T-tEWoHIlnU",
    fil: {
      fr: "Avraham refuse qu'on lui donne la grotte de Makhpéla et paie le prix fort, devant toute la ville. Rachi s'arrête sur un mot, « le champ s'éleva », et le Rabbi en tire ce que devient toute chose qu'un Juif acquiert.",
      en: "Avraham refuses to be given the cave of Makhpela and pays full price, before the whole city. Rashi stops on one word, “the field rose”, and the Rebbe draws from it what becomes of everything a Jew acquires.",
      he: "אברהם מסרב לקבל את מערת המכפלה במתנה ומשלם בכסף מלא, לעיני כל העיר. רש״י נעצר על מילה אחת, ״ויקם שדה עפרון״, והרבי לומד ממנה מה עולה בגורל כל דבר שיהודי קונה.",
    },
    gueoula: { fichier: "haye-sara-gueoula-times.pdf", pages: 5, ko: 55 },
    sichaFr: { fichier: "haye-sara-sicha-fr.pdf", pages: 14, ko: 776 },
    sichaHe: {},   // la version hébraïque porte encore des sources à vérifier
  },
];

const T = {
  fr: {
    title: "L'étude de la paracha · Mamash IA",
    desc: "La paracha en vidéo, puis trois niveaux de lecture : le récit, l'étude sourcée en français, l'étude en hébreu.",
    h1: "L'<strong>étude</strong> de la paracha.",
    lead: "Une vidéo pour entrer, puis trois niveaux de lecture. Chacun s'arrête où il veut, et personne ne manque rien en s'arrêtant au deuxième.",
    chabbatDu: "Chabbat du",
    voirVideo: "Le cours en vidéo",
    voirCourt: "Le format court",
    niveaux: "Les trois niveaux",
    n1: "Niveau 1", n1sous: "Le récit",
    n2: "Niveau 2", n2sous: "L'étude, sources en regard",
    n3: "Niveau 3", n3sous: "L'étude en hébreu",
    n1quoi: "Le Gueoula Times. Le même propos que la vidéo, à lire. Aucun hébreu, quelques minutes, pour un Chabbat après-midi.",
    n2quoi: "La sicha du Rabbi en entier : les questions, les réponses, tous les versets, les Rachi nécessaires, et chaque source en hébreu suivie de sa traduction.",
    n3quoi: "La même étude, en hébreu, pour qui étudie dans la langue. Même plan, mêmes sources, mêmes surlignages.",
    telecharger: "Ouvrir le PDF",
    aVenir: "Bientôt",
    aVenirPourquoi: "Le document est en relecture. Rien n'est publié ici avant que ses sources aient été ouvertes et vérifiées.",
    pagesMot: "pages",
    ko: "Ko",
    ameliorer: "Une remarque sur ce dossier ?",
    ameliorerQuoi: "Une source à corriger, un passage obscur, une traduction qui sonne faux : dites-le, c'est ainsi qu'on trouve le juste milieu.",
    ameliorerLien: "Proposer une amélioration",
    aucun: "Le premier dossier paraîtra avec la paracha de la semaine.",
    nav: { question: "Une question", chiourim: "Chiourim", daf: "Le daf", install: "Installer le MCP" },
    retour: "Tous les dossiers",
  },
  en: {
    title: "Studying the parashah · Mamash IA",
    desc: "The parashah on video, then three levels of reading: the story, the sourced study in French, the study in Hebrew.",
    h1: "<strong>Studying</strong> the parashah.",
    lead: "A video to come in, then three levels of reading. Each person stops where they wish, and nobody misses anything by stopping at the second.",
    chabbatDu: "Shabbat of",
    voirVideo: "The class on video",
    voirCourt: "The short clip",
    niveaux: "The three levels",
    n1: "Level 1", n1sous: "The story",
    n2: "Level 2", n2sous: "The study, sources alongside",
    n3: "Level 3", n3sous: "The study in Hebrew",
    n1quoi: "The Gueoula Times. The same thread as the video, to be read. No Hebrew, a few minutes, for a Shabbat afternoon.",
    n2quoi: "The Rebbe's sicha in full: the questions, the answers, every verse, the needed Rashis, and each source in Hebrew followed by its translation.",
    n3quoi: "The same study, in Hebrew, for those who study in the language. Same plan, same sources, same highlights.",
    telecharger: "Open the PDF",
    aVenir: "Coming",
    aVenirPourquoi: "The document is being checked. Nothing is published here before its sources have been opened and verified.",
    pagesMot: "pages",
    ko: "KB",
    ameliorer: "A remark on this dossier?",
    ameliorerQuoi: "A source to correct, an unclear passage, a translation that rings false: say so, that is how the right balance is found.",
    ameliorerLien: "Suggest an improvement",
    aucun: "The first dossier will appear with the week's parashah.",
    nav: { question: "Ask a question", chiourim: "Shiurim", daf: "The daf", install: "Install the MCP" },
    retour: "All the dossiers",
  },
  he: {
    title: "לימוד הפרשה · Mamash IA",
    desc: "הפרשה בווידאו, ואחר כך שלוש רמות של קריאה: הסיפור, העיון המקורות בצרפתית, והעיון בעברית.",
    h1: "<strong>לימוד</strong> הפרשה.",
    lead: "סרטון כדי להיכנס, ואחר כך שלוש רמות של קריאה. כל אחד עוצר היכן שירצה, ומי שעוצר בשנייה לא מפסיד דבר.",
    chabbatDu: "שבת",
    voirVideo: "השיעור בווידאו",
    voirCourt: "הקטע הקצר",
    niveaux: "שלוש הרמות",
    n1: "רמה 1", n1sous: "הסיפור",
    n2: "רמה 2", n2sous: "העיון, עם המקורות",
    n3: "רמה 3", n3sous: "העיון בעברית",
    n1quoi: "הגאולה טיימס. אותו קו כמו הסרטון, לקריאה. בלי עברית, כמה דקות, לשבת אחר הצהריים.",
    n2quoi: "השיחה של הרבי במלואה: השאלות, התשובות, כל הפסוקים, רש״י הנצרך, וכל מקור בעברית ואחריו תרגומו.",
    n3quoi: "אותו עיון, בעברית, למי שלומד בשפה. אותו מהלך, אותם מקורות, אותם סימונים.",
    telecharger: "לפתיחת ה-PDF",
    aVenir: "בקרוב",
    aVenirPourquoi: "המסמך בהגהה. שום דבר לא מתפרסם כאן לפני שהמקורות שלו נפתחו ואומתו.",
    pagesMot: "עמודים",
    ko: "KB",
    ameliorer: "הערה על התיק הזה?",
    ameliorerQuoi: "מקור שצריך תיקון, קטע לא ברור, תרגום שצורם: אמרו זאת, כך מוצאים את שביל הזהב.",
    ameliorerLien: "להצעת שיפור",
    aucun: "התיק הראשון יופיע עם פרשת השבוע.",
    nav: { question: "שאלה", chiourim: "שיעורים", daf: "הדף", install: "התקנת ה-MCP" },
    retour: "כל התיקים",
  },
} as const;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** La date du Chabbat, écrite dans la langue de la page. */
function dateChabbat(iso: string, lang: Lang): string {
  const loc = t(lang, { fr: "fr-FR", en: "en-GB", he: "he-IL" });
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" });
}

/** Les chemins des dossiers, pour la liste blanche des retours. */
export const CHEMINS_ETUDE: string[] = ["/etude", ...DOSSIERS.map((d) => `/etude/${d.slug}`)];

/** Le nom lisible de chaque dossier, pour la liste déroulante de /retour. */
export function nomsEtude(lang: Lang): Record<string, string> {
  const mot = t(lang, { fr: "L'étude", en: "The study", he: "הלימוד" });
  const out: Record<string, string> = {
    "/etude": t(lang, { fr: "L'étude de la paracha", en: "Studying the parashah", he: "לימוד הפרשה" }),
  };
  for (const d of DOSSIERS) out[`/etude/${d.slug}`] = `${mot} : ${d.paracha[lang]}`;
  return out;
}

export function dossierExiste(slug: string): boolean {
  return DOSSIERS.some((d) => d.slug === slug);
}

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600;7..72,700&family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&family=Rubik:wght@900&display=swap');
  :root { --paper:#f7f6f1; --ink:#082a99; --pop:#ffd23f; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --muted:rgba(8,42,153,.65); --ease:cubic-bezier(0.16,1,0.3,1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Literata","Frank Ruhl Libre",Georgia,serif; padding:0 4vw 5rem; }
  ::selection { background:var(--pop); color:var(--ink); }
  main { max-width:1000px; margin:0 auto; }
  a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.1rem 0; font-size:.92rem; }
  nav .wm { font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.92rem; text-transform:uppercase; letter-spacing:.05em; text-decoration:none; direction:ltr; }
  nav .wm b { font-weight:inherit; border-bottom:3px solid var(--pop); padding-bottom:1px; }
  nav .wm img { width:34px; height:34px; border-radius:50%; vertical-align:-11px; margin-inline-end:.55rem; }
  nav .r { display:flex; gap:1.1rem; align-items:center; }
  nav .r a { font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.7rem; letter-spacing:.09em; text-transform:uppercase; text-decoration:none; }
  nav .r a:hover { text-decoration:underline; }
  [dir="rtl"] nav .r a { font-size:.8rem; letter-spacing:.02em; }
  nav .r a strong { background:var(--pop); color:var(--ink); padding:.2rem .55rem .24rem; font-weight:inherit; transition:background .3s var(--ease), color .3s var(--ease); }
  nav .r a:hover strong { background:var(--ink); color:var(--pop); }
  h1 { font-family:"Fraunces","Frank Ruhl Libre",Georgia,serif; font-weight:300; font-size:clamp(2.1rem,5.6vw,3.6rem); line-height:1.08; letter-spacing:-.02em; margin:.7rem 0 .5rem; }
  h1 strong { font-weight:600; }
  .muted { color:var(--muted); max-width:62ch; }
  .retourliste { display:inline-block; margin:1.6rem 0 0; font-size:.86rem; color:var(--muted); text-decoration:none; border-bottom:1px solid var(--ink-15); }
  .retourliste:hover { color:var(--ink); border-bottom-color:var(--pop); }

  /* ---- l'en-tête d'un dossier ---- */
  .dhead { margin:2.2rem 0 .3rem; }
  .dchab { font:900 .68rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.11em; text-transform:uppercase; color:var(--muted); }
  .dtitre { font-family:"Fraunces","Frank Ruhl Libre",Georgia,serif; font-weight:600; font-size:clamp(1.8rem,4.4vw,2.7rem); line-height:1.12; margin:.35rem 0 0; }
  .dtitre span { font-family:"Frank Ruhl Libre",serif; font-weight:400; color:var(--muted); margin-inline-start:.5rem; }
  .dfil { margin:.9rem 0 0; max-width:62ch; }

  /* ---- les vidéos ---- */
  .vids { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1.4rem; margin:2rem 0 0; }
  .v { cursor:pointer; }
  .v .lab { display:block; font:900 .62rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.11em; text-transform:uppercase; color:var(--muted); margin-bottom:.5rem; }
  .v .th { position:relative; display:block; aspect-ratio:16/9; background:var(--ink-15); overflow:hidden; }
  .v .th img, .v .th iframe { width:100%; height:100%; object-fit:cover; display:block; border:0; }
  .v .pl { position:absolute; inset-inline-start:.6rem; bottom:.6rem; background:var(--pop); color:var(--ink); font:900 .64rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.08em; text-transform:uppercase; padding:.4rem .6rem; }
  .v:hover .pl { background:var(--ink); color:var(--pop); }

  /* ---- les trois niveaux ---- */
  .nhead { display:flex; align-items:baseline; gap:.8rem; margin:3rem 0 1.1rem; }
  .nhead .glab { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:1.3rem; }
  .nhead .grule { flex:1; height:1px; background:var(--ink-15); }
  .niv { display:grid; grid-template-columns:repeat(auto-fit,minmax(252px,1fr)); gap:1.2rem; }
  .n { border:1px solid var(--ink-15); padding:1.2rem 1.2rem 1.3rem; display:flex; flex-direction:column; background:#fff; }
  .n .num { font:900 .62rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.11em; text-transform:uppercase; color:var(--ink); background:var(--pop); display:inline-block; padding:.32rem .55rem .36rem; align-self:flex-start; }
  .n h3 { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:1.18rem; line-height:1.2; margin:.75rem 0 .5rem; }
  .n p { font-size:.92rem; color:var(--muted); flex:1; margin:0 0 1rem; }
  .n .go { display:inline-block; align-self:flex-start; font:900 .66rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.09em; text-transform:uppercase; text-decoration:none; background:var(--ink); color:var(--pop); padding:.6rem .8rem .64rem; transition:background .3s var(--ease), color .3s var(--ease); }
  .n .go:hover { background:var(--pop); color:var(--ink); }
  .n .meta { display:block; margin-top:.55rem; font-size:.78rem; color:var(--muted); }
  .n.vide { background:transparent; border-style:dashed; }
  .n.vide .num { background:var(--ink-15); color:var(--muted); }
  .n.vide .attente { font:900 .66rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.09em; text-transform:uppercase; color:var(--muted); border:1px solid var(--ink-15); padding:.6rem .8rem .64rem; align-self:flex-start; }

  /* ---- la remarque ---- */
  .amel { margin:3.2rem 0 0; border-top:3px solid var(--pop); padding-top:1.4rem; }
  .amel h2 { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:1.3rem; margin:0 0 .5rem; }
  .amel p { color:var(--muted); max-width:58ch; margin:0 0 1rem; font-size:.95rem; }
  .amel a { display:inline-block; font:900 .66rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.09em; text-transform:uppercase; text-decoration:none; background:var(--ink); color:var(--pop); padding:.68rem .9rem .72rem; transition:background .3s var(--ease), color .3s var(--ease); }
  .amel a:hover { background:var(--pop); color:var(--ink); }

  /* ---- la liste des dossiers ---- */
  .liste { margin:2.2rem 0 0; }
  .liste a { display:block; text-decoration:none; border-top:1px solid var(--ink-15); padding:1.2rem 0; }
  .liste a:last-child { border-bottom:1px solid var(--ink-15); }
  .liste a:hover .lt { border-bottom:2px solid var(--pop); }
  .liste .ld { font:900 .64rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.11em; text-transform:uppercase; color:var(--muted); }
  .liste .lt { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:1.5rem; display:inline-block; margin:.35rem 0 .3rem; }
  .liste .lf { color:var(--muted); font-size:.93rem; max-width:62ch; }
  footer { margin-top:3.5rem; border-top:1px solid var(--ink-15); padding-top:1.1rem; font-size:.82rem; color:var(--muted); }
`;

function coque(lang: Lang, chemin: string, titre: string, desc: string, corps: string): string {
  const s = T[lang];
  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(desc)}">
${altLinks(lang, chemin)}
<link rel="icon" href="/icon.png" type="image/png">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="https://mamash-ia.com/og.png?v=2">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
<style>${STYLE}</style>
</head>
<body>
<main>
  <nav>
    <a class="wm" href="${href(lang, "/")}"><img src="/icon.png" alt="" width="34" height="34"><b>Mamash</b>&nbsp;IA</a>
    <span class="r">${saisonMiel() ? `<a href="${href(lang, "/miel")}">${t(lang, { fr: "La feuille de miel", en: "The honey sheet", he: "דף הדבש" })}</a>` : ""}<a href="${href(lang, "/chiourim")}">${s.nav.chiourim}</a><a href="${href(lang, "/question")}">${s.nav.question}</a><a href="${href(lang, "/daf")}">${s.nav.daf}</a><a href="${href(lang, "/install")}"><strong>${s.nav.install}</strong></a>${langSwitcher(lang, chemin)}</span>
  </nav>
  ${corps}
  <footer>${colophon(lang)}${suivre(lang)}</footer>
</main>
${retourTab(lang, chemin)}
<div class="rcale"></div>
<script>
(function () {
  document.querySelectorAll(".v").forEach(function (fig) {
    fig.addEventListener("click", function () {
      var id = fig.getAttribute("data-id");
      var th = fig.querySelector(".th");
      if (!id || !th || th.querySelector("iframe")) return;
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1";
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      th.innerHTML = "";
      th.appendChild(f);
    });
  });
})();
</script>
</body>
</html>`;
}

function video(id: string, label: string): string {
  return `<figure class="v" data-id="${esc(id)}">
    <span class="lab">${esc(label)}</span>
    <span class="th"><img loading="lazy" src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" alt=""><span class="pl">▶</span></span>
  </figure>`;
}

function carteNiveau(
  s: (typeof T)[Lang], num: string, sous: string, quoi: string, n: Niveau | undefined,
): string {
  const pret = !!n?.fichier;
  if (!pret) {
    return `<article class="n vide">
      <span class="num">${esc(num)}</span>
      <h3>${esc(sous)}</h3>
      <p>${esc(quoi)} ${esc(s.aVenirPourquoi)}</p>
      <span class="attente">${esc(s.aVenir)}</span>
    </article>`;
  }
  const meta = [n!.pages ? `${n!.pages} ${s.pagesMot}` : "", n!.ko ? `${n!.ko} ${s.ko}` : ""].filter(Boolean).join(" · ");
  return `<article class="n">
    <span class="num">${esc(num)}</span>
    <h3>${esc(sous)}</h3>
    <p>${esc(quoi)}</p>
    <a class="go" href="/etude/${esc(n!.fichier!)}" target="_blank" rel="noopener">${esc(s.telecharger)}</a>
    ${meta ? `<span class="meta">${esc(meta)}</span>` : ""}
  </article>`;
}

export function etudeIndexHtml(lang: Lang): string {
  const s = T[lang];
  const corps = `
  <h1>${s.h1}</h1>
  <p class="muted">${s.lead}</p>
  ${DOSSIERS.length ? `<div class="liste">
    ${DOSSIERS.map((d) => `<a href="${href(lang, `/etude/${d.slug}`)}">
      <span class="ld">${esc(s.chabbatDu)} ${esc(dateChabbat(d.chabbat, lang))}</span>
      <span class="lt">${esc(d.paracha[lang])}</span>
      <span class="lf">${esc(d.fil[lang])}</span>
    </a>`).join("\n")}
  </div>` : `<p class="muted">${esc(s.aucun)}</p>`}`;
  return coque(lang, "/etude", s.title, s.desc, corps);
}

export function etudePage(lang: Lang, slug: string): string | null {
  const d = DOSSIERS.find((x) => x.slug === slug);
  if (!d) return null;
  const s = T[lang];
  const chemin = `/etude/${d.slug}`;
  const titre = `${d.paracha[lang]} · ${t(lang, { fr: "L'étude", en: "The study", he: "הלימוד" })} · Mamash IA`;

  const corps = `
  <div class="dhead">
    <span class="dchab">${esc(s.chabbatDu)} ${esc(dateChabbat(d.chabbat, lang))}</span>
    <h1 class="dtitre">${esc(d.paracha[lang])}${lang === "he" ? "" : `<span>${esc(d.hebreu)}</span>`}</h1>
    <p class="dfil">${esc(d.fil[lang])}</p>
  </div>

  ${d.video || d.court ? `<div class="vids">
    ${d.video ? video(d.video, s.voirVideo) : ""}
    ${d.court ? video(d.court, s.voirCourt) : ""}
  </div>` : ""}

  <div class="nhead"><span class="glab">${esc(s.niveaux)}</span><span class="grule"></span></div>
  <div class="niv">
    ${carteNiveau(s, s.n1, s.n1sous, s.n1quoi, d.gueoula)}
    ${carteNiveau(s, s.n2, s.n2sous, s.n2quoi, d.sichaFr)}
    ${carteNiveau(s, s.n3, s.n3sous, s.n3quoi, d.sichaHe)}
  </div>

  <section class="amel">
    <h2>${esc(s.ameliorer)}</h2>
    <p>${esc(s.ameliorerQuoi)}</p>
    <a href="${href(lang, "/retour")}?de=${encodeURIComponent(chemin)}">${esc(s.ameliorerLien)}</a>
  </section>

  <a class="retourliste" href="${href(lang, "/etude")}">${esc(s.retour)}</a>`;
  return coque(lang, chemin, titre, d.fil[lang], corps);
}
