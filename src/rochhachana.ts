/**
 * /roch-hachana — le sédèr des simanim, rite par rite.
 *
 * L'idée de la page : montrer que l'ordre change d'une communauté à l'autre.
 * On choisit un rite, et les aliments se replacent sous les yeux. L'animation
 * n'est pas décorative — c'est elle qui rend la différence visible.
 *
 * Les sédarim viennent de miel-sedarim.ts, donc la page et la feuille
 * imprimable ne peuvent pas diverger.
 */

import { type Lang, href, altLinks, langSwitcher, htmlAttrs, colophon, retourTab, SITE } from "./i18n";
import { SEDARIM, RITES, type Rite } from "./miel-sedarim";
import { FICHES, imageDe } from "./simanim-catalogue";

const PATH = "/roch-hachana";

const S = {
  fr: {
    titre: "Le sédèr des simanim",
    sur: "Roch Hachana",
    meta: "Les simanim de la nuit de Roch Hachana, rite par rite : Choulhan Aroukh, achkénaze, Ben Ich Haï, Djerba, Tunis. Chaque ordre avec sa source.",
    chapeau: "Le Talmud en nomme cinq. Les communautés en ont fait des sédarim entiers, et aucun ne se ressemble. Voici les cinq que nous avons pu lire dans leur source, dans l'ordre exact où chacun les mange.",
    talmudTitre: "D'où cela vient",
    talmudIntro: "Abayé, dans le Talmud, à propos des signes qu'on prend au sérieux :",
    talmudHeb: "לְעוֹלָם יְהֵא רָגִיל לְמִיחְזֵי בְּרֵישׁ שַׁתָּא קָרָא וְרוּבְּיָא, כַּרָּתֵי וְסִילְקָא וְתַמְרֵי",
    talmudFr: "« Qu'on prenne toujours l'habitude de voir, à la tête de l'année, la courge et la roubia, le poireau, la blette et les dattes. »",
    talmudRef: "Talmud, Horayot 12a — lu sur Sefaria",
    compTitre: "Choisissez un rite",
    compAide: "Les aliments se replacent dans l'ordre où ce rite les mange. Ce qui n'en fait pas partie s'efface.",
    compOrdre: "Dans cet ordre",
    fichesTitre: "Chaque siman, et ce qu'il fait entendre",
    dossierTitre: "La roubia : fenugrec ou loubia ?",
    dossierP1: "C'est la question qui revient le plus souvent, et les textes ne disent pas tous la même chose. Le Choulhan Aroukh écrit « roubia, c'est-à-dire tiltan » — le fenugrec — et Rachi dit de même sur Horayot 12a. Le mahzor Koren le glose « חילבה », qui est le même mot.",
    dossierP2: "Mais les autorités qui écrivent en pays arabophone lisent autrement. Le Ben Ich Haï, à Bagdad, écrit que la roubia est « ce qu'on appelle loubia en arabe ». Rav Moché Khalfon HaCohen, à Djerba, écrit exactement pareil : « et en arabe, loubia ». Pour une famille tunisienne, la réponse est donc la loubia, et elle vient d'un décisionnaire tunisien.",
    dossierP3: "Les deux lectures sont anciennes et défendues. Ce n'est pas une erreur d'un côté ou de l'autre, c'est le mot roubia qui porte les deux.",
    sourcesTitre: "Les sources, rite par rite",
    imprimer: "Imprimer votre feuille",
    imprimerP: "Le générateur reprend ces mêmes sédarim, avec les horaires de votre ville et le prénom de chaque convive.",
    retour: "Retour au site",
    simanim: "simanim",
  },
  en: {
    titre: "The seder of the simanim",
    sur: "Rosh Hashana",
    meta: "The simanim of Rosh Hashana night, rite by rite: Shulchan Arukh, Ashkenaz, Ben Ish Hai, Djerba, Tunis. Each order with its source.",
    chapeau: "The Talmud names five. Communities built whole sedarim out of them, and no two are alike. Here are the five we were able to read in their own source, in the exact order each one eats them.",
    talmudTitre: "Where it comes from",
    talmudIntro: "Abaye, in the Talmud, on omens taken seriously:",
    talmudHeb: "לְעוֹלָם יְהֵא רָגִיל לְמִיחְזֵי בְּרֵישׁ שַׁתָּא קָרָא וְרוּבְּיָא, כַּרָּתֵי וְסִילְקָא וְתַמְרֵי",
    talmudFr: "“A person should always be accustomed to seeing, at the head of the year, squash and rubia, leeks and chard and dates.”",
    talmudRef: "Talmud, Horayot 12a — read on Sefaria",
    compTitre: "Choose a rite",
    compAide: "The foods rearrange into the order this rite eats them. What it does not include fades away.",
    compOrdre: "In this order",
    fichesTitre: "Each siman, and what its name sounds of",
    dossierTitre: "Rubia: fenugreek or black-eyed peas?",
    dossierP1: "This is the question that comes up most, and the texts do not all say the same thing. The Shulchan Arukh writes “rubia, that is tiltan” — fenugreek — and Rashi says the same on Horayot 12a. The Koren mahzor glosses it “חילבה”, the same word.",
    dossierP2: "But the authorities writing in Arabic-speaking lands read it otherwise. The Ben Ish Hai, in Baghdad, writes that rubia is “what we call lubia in Arabic”. Rabbi Moshe Khalfon HaCohen, in Djerba, writes exactly the same: “and in Arabic, lubia”. For a Tunisian family the answer is therefore lubia, and it comes from a Tunisian authority.",
    dossierP3: "Both readings are old and defensible. It is not a mistake on either side; the word rubia carries both.",
    sourcesTitre: "The sources, rite by rite",
    imprimer: "Print your own sheet",
    imprimerP: "The generator uses these same sedarim, with your city's times and each guest's name.",
    retour: "Back to the site",
    simanim: "simanim",
  },
  he: {
    titre: "סדר הסימנים",
    sur: "ראש השנה",
    meta: "סימני ליל ראש השנה, מנהג אחר מנהג: שולחן ערוך, אשכנז, בן איש חי, ג׳רבה, תוניס. כל סדר עם מקורו.",
    chapeau: "התלמוד מונה חמישה. הקהילות עשו מהם סדרים שלמים, ואין שניים דומים. לפניכם חמישה שנקראו במקורם, בסדר המדויק שכל אחד אוכל בו.",
    talmudTitre: "מניין זה",
    talmudIntro: "אביי, בתלמוד, על סימנא מילתא היא:",
    talmudHeb: "לְעוֹלָם יְהֵא רָגִיל לְמִיחְזֵי בְּרֵישׁ שַׁתָּא קָרָא וְרוּבְּיָא, כַּרָּתֵי וְסִילְקָא וְתַמְרֵי",
    talmudFr: "",
    talmudRef: "תלמוד, הוריות יב ע״א — נקרא בספריא",
    compTitre: "בחרו מנהג",
    compAide: "הסימנים מסתדרים בסדר שבו המנהג הזה אוכל אותם. מה שאינו נכלל — נעלם.",
    compOrdre: "בסדר הזה",
    fichesTitre: "כל סימן, ומה שמו מזכיר",
    dossierTitre: "הרוביא: תלתן או לוביא?",
    dossierP1: "זו השאלה החוזרת, והמקורות אינם אומרים דבר אחד. השולחן ערוך כותב ״רוביא דהיינו תלתן״, וכן רש״י בהוריות יב ע״א. מחזור קורן מגלה ״חילבה״, אותה מילה.",
    dossierP2: "אך הפוסקים שכתבו בארצות דוברות ערבית קראו אחרת. הבן איש חי בבגדאד כותב שהרוביא היא ״מה שקורין בלשון ערבי לוביא״. הרב משה כלפון הכהן בג׳רבה כותב בדיוק כך: ״ובערבי לוביא״. למשפחה תוניסאית, אם כן, התשובה היא לוביא — מפי פוסק תוניסאי.",
    dossierP3: "שתי הקריאות עתיקות ומיוסדות. אין כאן טעות מצד אחד; המילה רוביא נושאת את שתיהן.",
    sourcesTitre: "המקורות, מנהג אחר מנהג",
    imprimer: "להדפיס את הדף שלכם",
    imprimerP: "המחולל משתמש באותם סדרים, עם זמני העיר שלכם ושם כל מסובה.",
    retour: "חזרה לאתר",
    simanim: "סימנים",
  },
} as const;

export function rochHachanaHtml(lang: Lang): string {
  const s = S[lang];

  // Toutes les images utilisées par au moins un rite, dédoublonnées : chaque
  // carte existe une seule fois dans le DOM et se déplace d'un rite à l'autre.
  const cles: string[] = [];
  for (const r of RITES) {
    for (const si of SEDARIM[r].simanim) {
      const c = imageDe(si);
      if (!cles.includes(c)) cles.push(c);
    }
  }
  const ficheDe = (c: string) => FICHES.find((f) => f.cle === c);

  // Pour chaque rite : la place de chaque carte, et le libellé qu'il lui donne.
  const plan: Record<string, { ordre: Record<string, number>; lab: Record<string, string> }> = {};
  for (const r of RITES) {
    const ordre: Record<string, number> = {};
    const lab: Record<string, string> = {};
    SEDARIM[r].simanim.forEach((si, i) => {
      const c = imageDe(si);
      ordre[c] = i + 1;
      lab[c] = si.lab[lang];
    });
    plan[r] = { ordre, lab };
  }

  const cartes = cles
    .map((c) => {
      const f = ficheDe(c);
      return `<figure class="sc" data-cle="${c}">
        <span class="rang"></span>
        <img src="/simanim/${c}.webp" alt="${f ? f.nom[lang] : c}" width="440" height="440" loading="lazy" decoding="async">
        <figcaption class="scl"></figcaption>
      </figure>`;
    })
    .join("\n");

  const boutons = RITES.map(
    (r, i) =>
      `<button class="rb${i === 0 ? " on" : ""}" data-rite="${r}" type="button">${SEDARIM[r].nom[lang]}<small>${SEDARIM[r].simanim.length} ${s.simanim}</small></button>`
  ).join("");

  const fiches = FICHES.map(
    (f) => `<article class="fi rv">
      <img src="/simanim/${f.cle}.webp" alt="${f.nom[lang]}" width="440" height="440" loading="lazy" decoding="async">
      <div class="fit"><h3>${f.nom[lang]}</h3><p class="mot" dir="rtl">${f.mot}</p><p>${f.jeu[lang]}</p></div>
    </article>`
  ).join("\n");

  const sources = RITES.map(
    (r) => `<div class="src rv"><h3>${SEDARIM[r].nom[lang]}</h3><p class="ref">${SEDARIM[r].source[lang]}</p><p class="nt">${SEDARIM[r].note[lang]}</p></div>`
  ).join("\n");

  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.titre} — ${s.sur} — Mamash IA</title>
<meta name="description" content="${s.meta}">
<meta property="og:title" content="${s.titre} — ${s.sur}">
<meta property="og:description" content="${s.meta}">
<meta property="og:image" content="${SITE}/og.png?v=2">
<meta property="og:url" content="${SITE}${href(lang, PATH)}">
<meta name="twitter:card" content="summary_large_image">
${altLinks(lang, PATH)}
<link rel="icon" href="/icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,600;7..72,700&family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&family=Rubik:wght@900&display=swap" rel="stylesheet">
<style>
  :root { --ink:#082a99; --pop:#ffd23f; --paper:#f7f6f1; --muted:rgba(8,42,153,.62); --line:rgba(8,42,153,.15); --ease:cubic-bezier(.16,1,.3,1); }
  * { box-sizing:border-box; margin:0; }
  html { scroll-behavior:smooth; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Literata","Frank Ruhl Libre",Georgia,serif; padding:0 4vw 5rem; }
  ::selection { background:var(--pop); color:var(--ink); }
  a { color:var(--ink); text-underline-offset:3px; }
  img { max-width:100%; height:auto; display:block; }
  nav { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1.5rem 0; flex-wrap:wrap; }
  nav .wm { font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.92rem; text-transform:uppercase; letter-spacing:.05em; text-decoration:none; direction:ltr; display:flex; align-items:center; gap:.55rem; }
  nav .wm img { width:30px; height:30px; border-radius:50%; }
  nav .r { display:flex; align-items:center; gap:1.1rem; flex-wrap:wrap; }
  nav .r a { font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.7rem; letter-spacing:.09em; text-transform:uppercase; text-decoration:none; }
  main { max-width:1080px; margin:0 auto; }
  h1 { font-family:"Fraunces",Georgia,serif; font-weight:300; font-size:clamp(2.4rem,6vw,4.4rem); line-height:1.02; letter-spacing:-.025em; margin-top:1.5rem; }
  h1 b { font-weight:600; }
  h1 .sur { display:block; font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.2em; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); margin-bottom:.9rem; }
  [dir="rtl"] h1 { font-family:"Frank Ruhl Libre",Georgia,serif; letter-spacing:0; }
  .chapeau { margin-top:1.4rem; font-size:clamp(1.05rem,1.7vw,1.28rem); max-width:34em; color:var(--muted); }
  h2 { font-family:"Fraunces",Georgia,serif; font-weight:300; font-size:clamp(1.7rem,3.4vw,2.6rem); line-height:1.08; letter-spacing:-.02em; }
  [dir="rtl"] h2, [dir="rtl"] h3 { font-family:"Frank Ruhl Libre",Georgia,serif; letter-spacing:0; }
  section { margin-top:clamp(3.5rem,7vw,6rem); }
  .kicker { font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.68rem; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); margin-bottom:.7rem; }

  /* --- le passage du Talmud --- */
  .talmud { border-top:2px solid var(--ink); border-bottom:2px solid var(--ink); padding:2rem 0 2.2rem; }
  .talmud .heb { font-family:"Frank Ruhl Libre",serif; font-size:clamp(1.3rem,2.9vw,2.1rem); line-height:1.75; direction:rtl; text-align:center; margin:1.4rem 0; }
  .talmud .tr { font-family:"Fraunces",Georgia,serif; font-weight:300; font-size:clamp(1.1rem,2vw,1.5rem); line-height:1.35; text-align:center; max-width:26em; margin:0 auto; }
  .talmud .ref { margin-top:1.2rem; text-align:center; font-size:.85rem; color:var(--muted); }

  /* --- le comparateur --- */
  .rbs { display:flex; flex-wrap:wrap; gap:.6rem; margin:1.6rem 0 .6rem; }
  .rb { font:inherit; font-size:.95rem; text-align:start; color:var(--ink); background:#fff; border:1.5px solid var(--line); border-radius:0; padding:.6rem .95rem .65rem; cursor:pointer; transition:border-color .2s, background .2s; }
  .rb small { display:block; font-size:.72rem; color:var(--muted); margin-top:.15rem; }
  .rb:hover { border-color:var(--ink); }
  .rb.on { background:var(--pop); border-color:var(--ink); border-width:2px; padding:calc(.6rem - .5px) calc(.95rem - .5px) calc(.65rem - .5px); font-weight:600; }
  .rb.on small { color:var(--ink); opacity:.75; }
  .aide { font-size:.9rem; color:var(--muted); margin-bottom:1.6rem; }
  .grille { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:1.4rem 1.1rem; }
  .sc { position:relative; margin:0; will-change:transform; }
  .sc[hidden] { display:none; }
  .sc img { border:1.5px solid var(--line); background:#fff; }
  .sc .rang { position:absolute; top:-9px; inset-inline-start:-9px; z-index:2; width:30px; height:30px; display:grid; place-items:center;
    background:var(--ink); color:var(--pop); font-family:"Rubik",sans-serif; font-weight:900; font-size:.82rem; }
  .scl { margin-top:.5rem; font-size:.86rem; line-height:1.35; }
  .marque { display:inline-block; margin-top:.8rem; font-family:"Rubik",sans-serif; font-weight:900; font-size:.65rem; letter-spacing:.16em; text-transform:uppercase; background:var(--pop); padding:.3em .7em .36em; }

  /* --- les fiches --- */
  .fis { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr)); gap:1.6rem; margin-top:1.8rem; }
  .fi { display:grid; grid-template-columns:104px 1fr; gap:1.1rem; align-items:start; border-top:1px solid var(--line); padding-top:1.1rem; }
  .fi img { border:1.5px solid var(--line); background:#fff; }
  .fi h3 { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:1.15rem; }
  .fi .mot { font-family:"Frank Ruhl Libre",serif; font-size:1.05rem; color:var(--muted); margin:.15rem 0 .45rem; }
  .fi p { font-size:.93rem; line-height:1.55; }

  /* --- le dossier roubia --- */
  .dossier { background:var(--ink); color:var(--paper); padding:clamp(2rem,4vw,3.4rem); }
  .dossier h2 { color:var(--pop); }
  .dossier p { margin-top:1rem; max-width:40em; }
  .dossier .duo { display:grid; grid-template-columns:1fr 1fr; gap:1.4rem; max-width:420px; margin-top:1.8rem; }
  .dossier .duo figure { margin:0; }
  .dossier .duo img { border:1.5px solid rgba(255,255,255,.28); background:var(--paper); }
  .dossier .duo figcaption { margin-top:.5rem; font-family:"Rubik",sans-serif; font-weight:900; font-size:.66rem; letter-spacing:.14em; text-transform:uppercase; color:var(--pop); }

  /* --- les sources --- */
  .srcs { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr)); gap:1.5rem; margin-top:1.8rem; }
  .src { border-top:2px solid var(--ink); padding-top:.9rem; }
  .src h3 { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:1.1rem; }
  .src .ref { margin-top:.5rem; font-size:.88rem; }
  .src .nt { margin-top:.6rem; font-size:.86rem; color:var(--muted); }

  .cta { display:inline-block; background:var(--pop); color:var(--ink); font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:1.15rem; padding:.6rem 1.3rem .7rem; text-decoration:none; box-shadow:0 4px 14px rgba(8,42,153,.16); margin-top:1.2rem; }
  [dir="rtl"] .cta { font-family:"Frank Ruhl Libre",Georgia,serif; font-weight:700; }

  footer.site { margin-top:4.5rem; padding-top:1.4rem; border-top:1px solid var(--line); font-size:.86rem; color:var(--muted); }
  footer.site img { width:26px; height:26px; border-radius:50%; display:inline-block; vertical-align:-8px; margin-inline-end:.45rem; }
  .lang a { text-decoration:none; opacity:.6; } .lang .cur { font-weight:700; opacity:1; } .lang .dot { opacity:.35; margin:0 .4em; }

  .rv { opacity:0; transform:translateY(14px); transition:opacity .6s var(--ease), transform .6s var(--ease); }
  .rv.in { opacity:1; transform:none; }
  @media (prefers-reduced-motion:reduce) { .rv { opacity:1; transform:none; transition:none; } html { scroll-behavior:auto; } }
  @media (max-width:640px) { .fi { grid-template-columns:78px 1fr; gap:.85rem; } .dossier .duo { max-width:none; } }
</style>
</head>
<body>
<nav>
  <a class="wm" href="${href(lang, "/")}"><img src="/icon.png" alt="">Mamash IA</a>
  <span class="r"><a href="${href(lang, "/miel")}">${s.imprimer}</a><a href="${href(lang, "/")}">${s.retour}</a><span class="lang">${langSwitcher(lang, PATH)}</span></span>
</nav>
<main>
  <h1><span class="sur">${s.sur}</span>${s.titre}.</h1>
  <p class="chapeau">${s.chapeau}</p>

  <section class="talmud">
    <p class="kicker">${s.talmudTitre}</p>
    <p>${s.talmudIntro}</p>
    <p class="heb">${s.talmudHeb}</p>
    ${s.talmudFr ? `<p class="tr">${s.talmudFr}</p>` : ""}
    <p class="ref">${s.talmudRef}</p>
  </section>

  <section>
    <p class="kicker">${s.compTitre}</p>
    <h2>${s.compOrdre}.</h2>
    <div class="rbs">${boutons}</div>
    <p class="aide">${s.compAide}</p>
    <div class="grille" id="grille">${cartes}</div>
    <span class="marque" id="marque"></span>
  </section>

  <section>
    <p class="kicker">${s.fichesTitre}</p>
    <div class="fis">${fiches}</div>
  </section>

  <section class="dossier rv">
    <h2>${s.dossierTitre}</h2>
    <p>${s.dossierP1}</p>
    <p>${s.dossierP2}</p>
    <p>${s.dossierP3}</p>
    <div class="duo">
      <figure><img src="/simanim/fenugrec.webp" alt="" width="440" height="440" loading="lazy"><figcaption>תלתן · ${lang === "he" ? "תלתן" : lang === "en" ? "fenugreek" : "fenugrec"}</figcaption></figure>
      <figure><img src="/simanim/loubia.webp" alt="" width="440" height="440" loading="lazy"><figcaption>לוביא · ${lang === "he" ? "לוביא" : lang === "en" ? "black-eyed peas" : "loubia"}</figcaption></figure>
    </div>
  </section>

  <section>
    <p class="kicker">${s.sourcesTitre}</p>
    <div class="srcs">${sources}</div>
  </section>

  <section class="rv">
    <h2>${s.imprimer}</h2>
    <p class="chapeau">${s.imprimerP}</p>
    <a class="cta" href="${href(lang, "/miel")}">${s.imprimer}</a>
  </section>

  <footer class="site">
    <p><a href="${href(lang, "/")}">mamash-ia.com</a> · <a href="${href(lang, "/privacy")}">${lang === "he" ? "פרטיות" : lang === "en" ? "Privacy" : "Vie privée"}</a> · ${langSwitcher(lang, PATH)}</p>
    <p style="margin-top:.6rem"><img src="/icon.png" alt="">${colophon(lang)}</p>
  </footer>
</main>
${retourTab(lang, PATH)}
<script>
(function () {
  var PLAN = ${JSON.stringify(plan)};
  var grille = document.getElementById("grille");
  var marque = document.getElementById("marque");
  var boutons = Array.prototype.slice.call(document.querySelectorAll(".rb"));
  var doux = !matchMedia("(prefers-reduced-motion: reduce)").matches;

  // FLIP : on mesure avant, on réordonne, on remesure, et on ramène chaque
  // carte à sa position d'origine pour la laisser glisser jusqu'à la nouvelle.
  // C'est ce glissement qui montre que l'ordre change d'un rite à l'autre.
  function appliquer(rite, animer) {
    var p = PLAN[rite];
    if (!p) return;
    var cartes = Array.prototype.slice.call(grille.children);
    var avant = cartes.map(function (c) { return c.hidden ? null : c.getBoundingClientRect(); });

    cartes.forEach(function (c) {
      var cle = c.getAttribute("data-cle");
      var rang = p.ordre[cle];
      if (rang) {
        c.hidden = false;
        c.style.order = String(rang);
        c.querySelector(".rang").textContent = String(rang);
        c.querySelector(".scl").textContent = p.lab[cle];
      } else {
        c.hidden = true;
      }
    });
    marque.textContent = Object.keys(p.ordre).length + " ${s.simanim}";

    if (!animer || !doux) return;
    cartes.forEach(function (c, i) {
      var a = avant[i];
      if (!a || c.hidden) return;
      var b = c.getBoundingClientRect();
      var dx = a.left - b.left, dy = a.top - b.top;
      if (!dx && !dy) return;
      c.style.transition = "none";
      c.style.transform = "translate(" + dx + "px," + dy + "px)";
      requestAnimationFrame(function () {
        c.style.transition = "transform .55s cubic-bezier(.16,1,.3,1)";
        c.style.transform = "";
      });
    });
  }

  boutons.forEach(function (b) {
    b.addEventListener("click", function () {
      boutons.forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      appliquer(b.getAttribute("data-rite"), true);
    });
  });
  appliquer(boutons[0].getAttribute("data-rite"), false);

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv").forEach(function (e) { io.observe(e); });
})();
</script>
</body>
</html>`;
}
