/**
 * Pages statiques du site : accueil (GET /), /install, /privacy — en trois
 * langues (fr à la racine, /en/…, /he/… en RTL). Le français reste la référence ;
 * le gabarit HTML/CSS/JS est unique, seules les chaînes changent.
 */

import { type Lang, SITE, href, altLinks, langSwitcher, htmlAttrs, colophon } from "./i18n";

// ----------------------------------------------------------------------------
// Fragments communs
// ----------------------------------------------------------------------------

const GA = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>`;

const LANG_CSS = `.lang { font-size:.82rem; letter-spacing:.08em; } .lang a { text-decoration:none; opacity:.6; } .lang a:hover { opacity:1; text-decoration:underline; } .lang .cur { font-weight:700; } .lang .dot { opacity:.35; margin:0 .45em; }`;

const OG_IMAGE = `<meta property="og:image" content="https://mamash-ia.com/og.png">
<meta name="twitter:card" content="summary_large_image">`;

const ogTitle = { fr: "Mamash IA — la discipline des sources pour Claude", en: "Mamash IA — source discipline for Claude", he: "Mamash IA — משמעת מקורות ל-Claude" };
const ogDesc = {
  fr: "Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.",
  en: "Claude quotes the Torah from the texts, never again from memory. Method, chavruta, parashah guide, interactive daf, zmanim, gematria. Free.",
  he: "Claude מצטט את התורה מתוך הטקסטים, לעולם לא מהזיכרון. שיטה, חברותא, מדריך לפרשה, דף אינטראקטיבי, זמנים, גימטריה. חינם.",
};

// ----------------------------------------------------------------------------
// /privacy
// ----------------------------------------------------------------------------

type PrivacyStrings = { title: string; h1: string; contact: string; body: string };

/** Le corps FR mêle déjà FR et EN ; l'EN ne garde que l'anglais ; l'HE traduit tout. `{Q}` = lien /question. */
const PRIVACY_T: Record<Lang, PrivacyStrings> = {
  fr: {
    title: "Mamash IA — Confidentialité / Privacy",
    h1: "Confidentialité — Mamash IA",
    contact: "Contact :",
    body: `<p>Le service MCP ne collecte, ne stocke et ne partage aucune donnée personnelle.
  Il ne demande aucun compte, ne dépose aucun cookie, et ne conserve aucun
  historique des questions posées. Les requêtes transitent vers l'API publique
  de <a href="https://www.sefaria.org">Sefaria</a> pour récupérer les textes
  demandés, et l'infrastructure Cloudflare produit des journaux techniques
  opérationnels de courte durée (adresse IP, horodatage) utilisés uniquement
  pour la sécurité et la limitation de débit.</p>
  <h2>« Poser une question » sur le site</h2>
  <p>La page <a href="{Q}">/question</a> envoie votre question, telle que vous l'avez écrite, à l'API d'Anthropic (Claude) pour rédiger la réponse à partir des textes lus sur Sefaria. La réponse n'est pas conservée. Nous gardons en revanche un <strong>journal statistique privé</strong> de chaque question : son texte, le niveau choisi, la date, la durée du traitement, le nombre de sources lues, le volume de tokens et le pays d'origine (agrégat Cloudflare) — <strong>jamais l'adresse IP ni aucun identifiant</strong>, donc sans possibilité de relier une question à une personne. Ce journal sert uniquement à comprendre l'usage du service et à en suivre le coût ; il n'est ni publié ni partagé. L'adresse IP sert uniquement au limiteur de débit, en mémoire, sans journal. Le traitement par Anthropic relève de sa <a href="https://www.anthropic.com/legal/privacy">politique de confidentialité</a> (données d'API non utilisées pour l'entraînement). N'y écrivez pas d'informations personnelles.</p>

  <h2>Privacy — English</h2>
  <p>This server collects, stores and shares no personal data. No account, no
  cookies, no history of queries. Requests are forwarded to the public
  <a href="https://www.sefaria.org">Sefaria</a> API to fetch the requested
  texts; Cloudflare's infrastructure produces short-lived operational logs
  (IP address, timestamp) used solely for security and rate limiting.</p>
  <h2>Mesure d'audience du site web</h2>
  <p>Les pages de ce site (mamash-ia.com) utilisent Google Analytics 4 pour
  mesurer la fréquentation de façon agrégée (pages vues, provenance). Cela
  concerne uniquement la consultation du site dans un navigateur.
  <strong>Le connecteur MCP lui-même n'envoie rien à Google Analytics</strong> :
  aucune donnée d'usage dans Claude ou tout autre assistant n'est mesurée, et
  le visualiseur de daf intégré à Claude ne charge aucun traceur.
  Voir les <a href="https://policies.google.com/privacy">règles de
  confidentialité de Google</a>.</p>
  <h2>Les chiourim en vidéo</h2>
  <p>La page <a href="/chiourim">/chiourim</a> présente des vidéos hébergées par YouTube. Aucune ressource YouTube n'est chargée avant l'affichage de la page (les vignettes proviennent des serveurs de YouTube) et le lecteur ne se lance qu'au clic, via youtube-nocookie.com — le mode « confidentialité avancée » de YouTube, sans cookies avant la lecture. La consultation des vidéos relève des <a href="https://policies.google.com/privacy">règles de confidentialité de Google</a>.</p>
  <h2>"Ask a question" on the website — English</h2>
  <p>The <a href="{Q}">/question</a> page sends your question, as written, to Anthropic's API (Claude) to draft an answer from texts read on Sefaria. The answer is not stored. We do keep a <strong>private statistical log</strong> of each question: its text, the chosen level, date, processing time, number of sources read, token volume and country of origin (Cloudflare aggregate) — <strong>never the IP address nor any identifier</strong>, so a question cannot be linked to a person. This log is used only to understand usage and track cost; it is neither published nor shared. The IP address is only used by the in-memory rate limiter, without logs. Anthropic's processing is governed by its <a href="https://www.anthropic.com/legal/privacy">privacy policy</a> (API data is not used for training). Do not include personal information.</p>

  <h2>Website analytics — English</h2>
  <p>The website pages (mamash-ia.com) use Google Analytics 4 for aggregate
  traffic measurement (page views, referrers) — browser visits only.
  <strong>The MCP connector itself sends nothing to Google Analytics</strong>:
  no usage inside Claude or any assistant is measured, and the in-Claude daf
  viewer loads no tracker.</p>`,
  },
  en: {
    title: "Mamash IA — Privacy",
    h1: "Privacy — Mamash IA",
    contact: "Contact:",
    body: `<p>This server collects, stores and shares no personal data. No account, no
  cookies, no history of queries. Requests are forwarded to the public
  <a href="https://www.sefaria.org">Sefaria</a> API to fetch the requested
  texts; Cloudflare's infrastructure produces short-lived operational logs
  (IP address, timestamp) used solely for security and rate limiting.</p>
  <h2>“Ask a question” on the website</h2>
  <p>The <a href="{Q}">/question</a> page sends your question, as written, to Anthropic's API (Claude) to draft an answer from texts read on Sefaria. The answer is not stored. We do keep a <strong>private statistical log</strong> of each question: its text, the chosen level, date, processing time, number of sources read, token volume and country of origin (Cloudflare aggregate) — <strong>never the IP address nor any identifier</strong>, so a question cannot be linked to a person. This log is used only to understand usage and track cost; it is neither published nor shared. The IP address is only used by the in-memory rate limiter, without logs. Anthropic's processing is governed by its <a href="https://www.anthropic.com/legal/privacy">privacy policy</a> (API data is not used for training). Do not include personal information.</p>
  <h2>Video shiurim</h2>
  <p>The <a href="/en/chiourim">/chiourim</a> page presents videos hosted by YouTube. Thumbnails are served from YouTube's servers, and the player only loads when you click, via youtube-nocookie.com — YouTube's enhanced-privacy mode, with no cookies before playback. Watching the videos is governed by <a href="https://policies.google.com/privacy">Google's privacy policy</a>.</p>
  <h2>Website analytics</h2>
  <p>The website pages (mamash-ia.com) use Google Analytics 4 for aggregate
  traffic measurement (page views, referrers) — browser visits only.
  <strong>The MCP connector itself sends nothing to Google Analytics</strong>:
  no usage inside Claude or any assistant is measured, and the in-Claude daf
  viewer loads no tracker. See <a href="https://policies.google.com/privacy">Google's privacy policy</a>.</p>`,
  },
  he: {
    title: "Mamash IA — פרטיות",
    h1: "פרטיות — Mamash IA",
    contact: "יצירת קשר:",
    body: `<p>שירות ה-MCP אינו אוסף, אינו שומר ואינו משתף שום מידע אישי. הוא אינו דורש חשבון, אינו מציב עוגיות, ואינו שומר היסטוריה של השאלות שנשאלו. הבקשות עוברות ל-API הציבורי של <a href="https://www.sefaria.org">ספריא</a> כדי לאחזר את הטקסטים המבוקשים, ותשתית Cloudflare מפיקה יומנים טכניים תפעוליים קצרי מועד (כתובת IP, חותמת זמן) המשמשים אך ורק לאבטחה ולהגבלת קצב.</p>
  <h2>«שאלה» באתר</h2>
  <p>העמוד <a href="{Q}" dir="ltr">/question</a> שולח את שאלתכם, כפי שכתבתם אותה, ל-API של Anthropic (Claude) כדי לנסח את התשובה מתוך הטקסטים שנקראו בספריא. התשובה אינה נשמרת. לעומת זאת, אנו שומרים <strong>יומן סטטיסטי פרטי</strong> של כל שאלה: הטקסט שלה, הרמה שנבחרה, התאריך, משך העיבוד, מספר המקורות שנקראו, נפח הטוקנים וארץ המוצא (נתון מצרפי של Cloudflare) — <strong>לעולם לא כתובת ה-IP ולא שום מזהה</strong>, כך שאי אפשר לקשר שאלה לאדם. היומן משמש אך ורק להבנת השימוש בשירות ולמעקב אחר עלותו; הוא אינו מתפרסם ואינו משותף. כתובת ה-IP משמשת רק את מגביל הקצב, בזיכרון, בלי יומן. העיבוד בידי Anthropic כפוף ל<a href="https://www.anthropic.com/legal/privacy">מדיניות הפרטיות</a> שלה (נתוני API אינם משמשים לאימון). אל תכתבו שם מידע אישי.</p>
  <h2>שיעורים בווידאו</h2>
  <p>העמוד <a href="/he/chiourim" dir="ltr">/chiourim</a> מציג סרטונים המתארחים ביוטיוב. התמונות הממוזערות מוגשות משרתי יוטיוב, והנגן נטען רק בלחיצה, דרך youtube-nocookie.com — מצב הפרטיות המורחבת של יוטיוב, ללא עוגיות לפני הניגון. צפייה בסרטונים כפופה ל<a href="https://policies.google.com/privacy">מדיניות הפרטיות של Google</a>.</p>
  <h2>מדידת קהל באתר</h2>
  <p>עמודי האתר (mamash-ia.com) משתמשים ב-Google Analytics 4 למדידת התנועה באופן מצרפי (צפיות בעמודים, מקור ההגעה). הדבר נוגע רק לגלישה באתר בדפדפן. <strong>מחבר ה-MCP עצמו אינו שולח דבר ל-Google Analytics</strong>: שום נתון שימוש ב-Claude או בכל עוזר אחר אינו נמדד, ומציג הדף המשולב ב-Claude אינו טוען שום כלי מעקב. ראו את <a href="https://policies.google.com/privacy">מדיניות הפרטיות של Google</a>.</p>`,
  },
};

export function privacyHtml(lang: Lang): string {
  const s = PRIVACY_T[lang];
  const path = "/privacy";
  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
${altLinks(lang, path)}
<style>
  body { font:16px/1.65 -apple-system, "Segoe UI", Roboto, sans-serif; color:#1f2430; background:#faf9f6; padding:3rem 1.25rem; }
  main { max-width:680px; margin:0 auto; }
  h1 { font-size:1.6rem; margin-bottom:1rem; } h2 { font-size:1.1rem; margin:1.6rem 0 .5rem; }
  a { color:#0038b8; }
  footer { margin-top:2.5rem; font-size:.9rem; opacity:.75; display:flex; gap:1.4rem; flex-wrap:wrap; align-items:baseline; }
  ${LANG_CSS}
</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${ogTitle[lang]}">
<meta property="og:description" content="${ogDesc[lang]}">
${OG_IMAGE}
<meta property="og:url" content="${SITE}${href(lang, path)}">
${GA}
</head>
<body>
<main>
  <h1>${s.h1}</h1>
  ${s.body.replace(/\{Q\}/g, href(lang, "/question"))}
  <p>${s.contact} <a href="https://github.com/JonathanB555/torah-mcp/issues" dir="ltr">github.com/JonathanB555/torah-mcp/issues</a></p>
  <footer><a href="${href(lang, "/")}">Mamash IA</a>${langSwitcher(lang, path)}</footer>
</main>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// / — le daf
// ----------------------------------------------------------------------------

type Toc = { to: string; t: string; d: string };
type Glose = { h: string; p: string; try?: string; link?: string };
type Mode = { h: string; who: string; p: string; try: string };

type LandingStrings = {
  title: string; desc: string;
  grpSite: string; navQuestion: string; navDaf: string; navOutils: string; navDaily: string; navChiourim: string; grpClaude: string; navInstall: string;
  h1: string; deck: string; act1: string; act2: string; hint: string;
  kezAria: string; kezId: string;
  fig1n: string; fig1u: string; fig1t: string; fig2n: string; fig2u: string; fig2t: string; fig3n: string; fig3u: string; fig3t: string;
  vsNonH: string; vsNonP: string; vsYesH: string; vsYesP: string;
  lblA: string; ariaInner: string; ariaOuter: string;
  gMethode: Glose; gHavrouta: Glose; gParacha: Glose; gMemoire: Glose; gQuotidien: Glose; gModes: Glose; gSources: Glose;
  guf1: string; guf2: string; guf3: string; guf4: string;
  lblB: string; mDeb: Mode; mCla: Mode; mAv: Mode; modesNote1: string; modesNoteLink: string; modesNote2: string;
  bandH2: string; bandP: string; bandAct1: string; bandAct2: string;
  lblC: string; toc: Toc[];
  inviteH2: string; inviteAct1: string; inviteAct2: string; inviteNote: string;
  fDaf: string; fOutils: string; fInstall: string; fDaily: string; fPrivacy: string; credits1: string; credits2: string;
};

const LANDING_T: Record<Lang, LandingStrings> = {
  fr: {
    title: "Mamash IA — la discipline des sources pour Claude",
    desc: "Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode d'étude, havrouta, guide de paracha, page de Vilna interactive, Sefaria, HebrewBooks, zmanim, guematria. Gratuit, sans compte.",
    grpSite: "Sur le site", navQuestion: "Une question", navDaf: "Le daf", navOutils: "Outils", navDaily: "Limoud du jour", navChiourim: "Chiourim", grpClaude: "Dans Claude", navInstall: "Installer le MCP",
    h1: `Claude cite la Torah <span class="no">de&nbsp;mémoire</span> <strong>depuis les textes</strong>.`,
    deck: "Un serveur MCP gratuit qui impose une discipline des sources à Claude : chaque réponse de halakha ou de limoud est lue dans le texte réel, citée exactement, reliée à ses commentateurs. En français, à votre niveau — du débutant qui ne lit pas l'hébreu au talmid hakham. Et chaque outil existe aussi en version web, ici même, sans Claude.",
    act1: "Installer dans Claude — 2 min", act2: "Poser une question — sans Claude",
    hint: "Gratuit · sans compte · sans collecte — défilez",
    kezAria: "En deux mots", kezId: "en-deux-mots",
    fig1n: "6 600", fig1u: "titres", fig1t: "La bibliothèque Sefaria, lue en direct au moment de la question : Tanakh, Michna, Talmud, Midrach, Rambam, Choulhan Aroukh, responsa, hassidout — et leurs commentateurs.",
    fig2n: "65 000", fig2u: "seforim", fig2t: "Le catalogue HebrewBooks, pour étudier sur la page scannée quand le texte n'existe pas ailleurs.",
    fig3n: "0", fig3u: "référence inventée", fig3t: "La règle est simple : ce qui n'a pas été lu n'est pas cité — et chaque citation vient avec le lien pour la vérifier.",
    vsNonH: "Une IA ordinaire <em>— répond de mémoire</em>",
    vsNonP: "Elle a croisé ces textes une fois, à l'entraînement, et les reconstitue : références approximatives, citations recomposées, parfois inventées de toutes pièces — avec la même assurance dans les deux cas, et sans jamais dire ce qu'elle n'a pas ouvert.",
    vsYesH: "Mamash IA <em>— ouvre le livre</em>",
    vsYesP: "La question déclenche une lecture : le texte est ouvert dans l'édition Sefaria, cité tel qu'il est écrit, avec sa référence exacte, relié à ses commentateurs et aux textes qui en dépendent. Une précision vérifiable, à un clic — et, quand une source manque, la réponse le dit.",
    lblA: "Le manifeste, commenté en marge", ariaInner: "Commentaires — colonne intérieure", ariaOuter: "Commentaires — colonne extérieure",
    gMethode: { h: "La méthode", p: "Chargée avant toute réponse religieuse : lire, citer depuis la lecture, signaler les mahloket, ne jamais fabriquer une référence.", try: "« Que dit la Guemara sur l'objet perdu ? Cite la sougya. »" },
    gHavrouta: { h: "La havrouta", p: "Claude questionne au lieu de répondre : une kouchia à la fois, Rachi à défendre contre Tossafot, récapitulatif des chidouchim.", try: "« Étudions Berakhot 2a en havrouta. »" },
    gParacha: { h: "Le guide de paracha", p: "Fil par aliya, trois questions du texte tranchées par deux commentateurs qui divergent, l'écho de la haftara, questions pour la table.", try: "« Prépare-moi la paracha. »" },
    gMemoire: { h: "Pourquoi c'est grave", p: "Une citation approximative est une citation fausse. La discipline du texte n'est pas un luxe : c'est la condition du limoud." },
    gQuotidien: { h: "Le quotidien", p: "Zmanim et horaires de Chabbat, dates hébraïques, guematria exacte, nikoud (Dicta), fiche source prête pour WhatsApp.", link: "Utilisables en ligne, sans installation" },
    gModes: { h: "Trois modes", p: "Débutant, classique, avancé — le registre change, la discipline des sources jamais. Claude devine votre niveau à votre question, et vous changez de mode d'un mot.", try: "« Je n'y connais rien, explique-moi simplement. »", link: "Poser une question sur le site, sans Claude" },
    gSources: { h: "Les sources", p: "Textes, commentateurs et recherche Sefaria — licences affichées — et le catalogue HebrewBooks (~65 000 seforim).", link: "S'accorde avec le MCP officiel de Sefaria" },
    guf1: `Les assistants répondent aux questions de Torah <mark data-ref="memoire">de mémoire</mark> — avec l'assurance de celui qui n'a pas ouvert le livre. Mamash IA renverse le geste : avant toute réponse, votre assistant charge <mark data-ref="methode">une méthode d'étude</mark> qui l'oblige à lire le texte, à le citer tel qu'il est écrit, et à dire où l'étudier.`,
    guf2: `Parce qu'on n'apprend pas seul, il sait aussi devenir <mark data-ref="havrouta">partenaire de havrouta</mark> — celui qui pose les questions plutôt que d'y répondre — et préparer <mark data-ref="paracha">la paracha de la semaine</mark> comme un chantier : aliya par aliya, machloket comprises.`,
    guf3: `Et parce que l'étude vit dans une journée juive, il porte <mark data-ref="quotidien">les outils du quotidien</mark> — zmanim, dates, guematria, nikoud, fiches à partager — et <mark data-ref="sources">toute la bibliothèque</mark> : Sefaria pour lire et relier, HebrewBooks pour étudier sur la page scannée.`,
    guf4: `Et parce que la Torah n'appartient pas aux seuls savants, il parle <mark data-ref="modes">à chacun selon son niveau</mark> : tout en français et chaque mot expliqué pour qui débute, la source en langue originale et le lomdus pour qui la maîtrise.`,
    lblB: "Trois modes — à chacun selon son niveau",
    mDeb: { h: "Débutant", who: "Pas de culture religieuse, ou pas d'hébreu.", p: "Tout en français. Aucun mot hébreu sans sa traduction, le contexte avant la réponse, une idée à la fois — et jamais de question jugée naïve.", try: "« C'est quoi, la halakha ? »" },
    mCla: { h: "Classique", who: "Culture de base, hébreu avec traduction.", p: "Bilingue : la source, puis sa traduction — française pour la Bible. Termes usuels supposés connus, références standard, mahloket signalées. Le mode par défaut.", try: "« Que dit Rachi sur ce verset ? »" },
    mAv: { h: "Avancé", who: "Le beit midrash.", p: "Source en langue originale, terminologie sans glose, richonim et poskim, girsaot quand elles pèsent, nafka mina, lomdus. Densité maximale, rien de lissé.", try: "« Chitat ha-Rambam contre Tossafot ici ? »" },
    modesNote1: "Un même moteur, une même rigueur : les textes sont toujours réellement lus et cités exactement. Seul le registre s'adapte — et vous en changez d'un mot. Pas de Claude ? ",
    modesNoteLink: "Posez votre question ici même", modesNote2: ", en français : la réponse est lue dans les textes, avec ses sources.",
    bandH2: "« Montre-moi le daf du jour. »",
    bandP: "Et une page de Vilna s'ouvre dans la conversation : la Guemara au centre, Rachi et Tossafot dépliables, la traduction au clic sur chaque segment. Sans référence, c'est le daf yomi qui s'ouvre.",
    bandAct1: "Ouvrir le daf en ligne", bandAct2: "Le limoud du jour",
    lblC: "Mafteah — l'index des seize outils",
    toc: [
      { to: "/install", t: "La méthode d'étude", d: "chargée avant toute réponse religieuse" },
      { to: "/question", t: "Une question, en français", d: "sur le site, sans Claude — réponse lue dans les textes" },
      { to: "#modes", t: "Trois modes d'étude", d: "débutant · classique · avancé" },
      { to: "/install", t: "Havrouta", d: "le partenaire qui questionne" },
      { to: "/install", t: "Guide de paracha", d: "aliyot, mahloket, table de Chabbat" },
      { to: "/daf", t: "Le daf — page de Vilna", d: "MCP App interactive, aussi en ligne" },
      { to: "/install", t: "Textes, commentateurs, recherche", d: "la bibliothèque Sefaria, vérifiable" },
      { to: "/install", t: "Catalogue HebrewBooks", d: "~65 000 seforim par titre et auteur" },
      { to: "/outils", t: "Zmanim et Chabbat", d: "Paris, Marseille, Genève, Jérusalem…" },
      { to: "/outils", t: "Dates hébraïques", d: "conversion, fêtes, Rosh Hodesh" },
      { to: "/outils", t: "Guematria", d: "cinq méthodes, calcul exact" },
      { to: "/outils", t: "Nikoud", d: "vocalisation par le nakdan de Dicta" },
      { to: "/chabbat", t: "Le mot de Chabbat", d: "le WhatsApp de la semaine — personnalisable dans les outils" },
      { to: "/outils", t: "Fiche source", d: "hébreu, traduction, lien — pour WhatsApp" },
      { to: "/daily", t: "Le limoud du jour", d: "paracha, daf yomi, Rambam quotidien" },
      { to: "/chiourim", t: "Les chiourim du rav Attal", d: "les cours en vidéo, classés par thèmes" },
    ],
    inviteH2: "Une URL à coller dans claude.ai, et l'étude <strong>change de nature</strong>.",
    inviteAct1: "Installer maintenant", inviteAct2: "Code source — MIT",
    inviteNote: "Gratuit, sans compte, sans collecte de données. S'accorde avec le MCP officiel de Sefaria — installez les deux : l'officiel pour la profondeur de la bibliothèque, Torah MCP pour la discipline de citation, la havrouta et HebrewBooks.",
    fDaf: "Le daf en ligne", fOutils: "Outils", fInstall: "Installation", fDaily: "Limoud du jour", fPrivacy: "Confidentialité",
    credits1: "Textes servis par l'API publique de Sefaria — licences indiquées dans chaque réponse. Vocalisation par le nakdan de Dicta, calendriers Hebcal.",
    credits2: "Indépendant de Sefaria et de hebrewbooks.org.",
  },
  en: {
    title: "Mamash IA — source discipline for Claude",
    desc: "Claude quotes the Torah from the texts, never again from memory. Study method, chavruta, parashah guide, interactive Vilna page, Sefaria, HebrewBooks, zmanim, gematria. Free, no account.",
    grpSite: "On the site", navQuestion: "Ask a question", navDaf: "The daf", navOutils: "Tools", navDaily: "Today's learning", navChiourim: "Shiurim", grpClaude: "In Claude", navInstall: "Install the MCP",
    h1: `Claude quotes the Torah <span class="no">from&nbsp;memory</span> <strong>from the texts</strong>.`,
    deck: "A free MCP server that imposes source discipline on Claude: every answer on halakha or limud is read in the actual text, quoted exactly, linked to its commentators. In English, at your level — from the beginner who reads no Hebrew to the talmid chakham. And every tool also exists as a web version, right here, without Claude.",
    act1: "Install in Claude — 2 min", act2: "Ask a question — without Claude",
    hint: "Free · no account · no data collection — scroll",
    kezAria: "In brief", kezId: "in-brief",
    fig1n: "6,600", fig1u: "titles", fig1t: "The Sefaria library, read live at the moment of the question: Tanakh, Mishnah, Talmud, Midrash, Rambam, Shulchan Arukh, responsa, chasidut — and their commentators.",
    fig2n: "65,000", fig2u: "seforim", fig2t: "The HebrewBooks catalogue, to study from the scanned page when the text exists nowhere else.",
    fig3n: "0", fig3u: "invented references", fig3t: "The rule is simple: what has not been read is not quoted — and every quotation comes with the link to check it.",
    vsNonH: "An ordinary AI <em>— answers from memory</em>",
    vsNonP: "It crossed these texts once, during training, and reconstructs them: approximate references, recomposed quotations, sometimes invented outright — with the same confidence in both cases, and without ever saying what it did not open.",
    vsYesH: "Mamash IA <em>— opens the book</em>",
    vsYesP: "The question triggers a reading: the text is opened in the Sefaria edition, quoted as it is written, with its exact reference, linked to its commentators and to the texts that depend on it. Verifiable precision, one click away — and, when a source is missing, the answer says so.",
    lblA: "The manifesto, annotated in the margin", ariaInner: "Commentaries — inner column", ariaOuter: "Commentaries — outer column",
    gMethode: { h: "The method", p: "Loaded before any religious answer: read, quote from the reading, flag the machloket, never fabricate a reference.", try: "“What does the Gemara say about lost objects? Quote the sugya.”" },
    gHavrouta: { h: "The chavruta", p: "Claude questions instead of answering: one kushya at a time, Rashi to defend against Tosafot, a recap of the chiddushim.", try: "“Let's study Berakhot 2a in chavruta.”" },
    gParacha: { h: "The parashah guide", p: "A thread aliyah by aliyah, three questions from the text settled by two commentators who disagree, the echo of the haftarah, questions for the table.", try: "“Prepare the parashah for me.”" },
    gMemoire: { h: "Why it matters", p: "An approximate quotation is a false quotation. The discipline of the text is not a luxury: it is the condition of limud." },
    gQuotidien: { h: "Everyday", p: "Zmanim and Shabbat times, Hebrew dates, exact gematria, nikkud (Dicta), a source sheet ready for WhatsApp.", link: "Usable online, no installation" },
    gModes: { h: "Three modes", p: "Beginner, classic, advanced — the register changes, the source discipline never does. Claude guesses your level from your question, and you switch modes with a word.", try: "“I know nothing about this, explain it simply.”", link: "Ask a question on the site, without Claude" },
    gSources: { h: "The sources", p: "Texts, commentators and Sefaria search — licences displayed — and the HebrewBooks catalogue (~65,000 seforim).", link: "Works alongside Sefaria's official MCP" },
    guf1: `Assistants answer Torah questions <mark data-ref="memoire">from memory</mark> — with the confidence of one who has not opened the book. Mamash IA reverses the gesture: before any answer, your assistant loads <mark data-ref="methode">a study method</mark> that obliges it to read the text, to quote it as it is written, and to say where to study it.`,
    guf2: `Because one does not learn alone, it also knows how to become <mark data-ref="havrouta">a chavruta partner</mark> — the one who asks the questions rather than answering them — and to prepare <mark data-ref="paracha">the week's parashah</mark> like a worksite: aliyah by aliyah, machloket included.`,
    guf3: `And because study lives inside a Jewish day, it carries <mark data-ref="quotidien">the everyday tools</mark> — zmanim, dates, gematria, nikkud, source sheets to share — and <mark data-ref="sources">the whole library</mark>: Sefaria to read and connect, HebrewBooks to study from the scanned page.`,
    guf4: `And because the Torah does not belong to scholars alone, it speaks <mark data-ref="modes">to each at their level</mark>: everything in plain English and every word explained for the beginner, the source in the original language and the lomdus for the one who has mastered it.`,
    lblB: "Three modes — to each at their level",
    mDeb: { h: "Beginner", who: "No religious background, or no Hebrew.", p: "Everything in English. No Hebrew word without its translation, context before the answer, one idea at a time — and no question ever judged naive.", try: "“What is halakha, exactly?”" },
    mCla: { h: "Classic", who: "Basic background, Hebrew with translation.", p: "Bilingual: the source, then its translation — English for the Bible. Common terms assumed known, standard references, machloket flagged. The default mode.", try: "“What does Rashi say on this verse?”" },
    mAv: { h: "Advanced", who: "The beit midrash.", p: "Source in the original language, terminology without gloss, rishonim and poskim, girsaot when they weigh, nafka mina, lomdus. Maximum density, nothing smoothed over.", try: "“Shitat ha-Rambam against Tosafot here?”" },
    modesNote1: "One engine, one rigour: the texts are always actually read and quoted exactly. Only the register adapts — and you change it with a word. No Claude? ",
    modesNoteLink: "Ask your question right here", modesNote2: ", in English: the answer is read in the texts, with its sources.",
    bandH2: "“Show me today's daf.”",
    bandP: "And a Vilna page opens in the conversation: the Gemara in the centre, Rashi and Tosafot unfoldable, the translation one click away on each segment. Without a reference, it is the daf yomi that opens.",
    bandAct1: "Open the daf online", bandAct2: "Today's learning",
    lblC: "Mafteach — the index of the sixteen tools",
    toc: [
      { to: "/install", t: "The study method", d: "loaded before any religious answer" },
      { to: "/question", t: "A question, in English", d: "on the site, without Claude — answer read in the texts" },
      { to: "#modes", t: "Three study modes", d: "beginner · classic · advanced" },
      { to: "/install", t: "Chavruta", d: "the partner who questions" },
      { to: "/install", t: "Parashah guide", d: "aliyot, machloket, Shabbat table" },
      { to: "/daf", t: "The daf — Vilna page", d: "interactive MCP App, also online" },
      { to: "/install", t: "Texts, commentators, search", d: "the Sefaria library, verifiable" },
      { to: "/install", t: "HebrewBooks catalogue", d: "~65,000 seforim by title and author" },
      { to: "/outils", t: "Zmanim and Shabbat", d: "London, New York, Paris, Jerusalem…" },
      { to: "/outils", t: "Hebrew dates", d: "conversion, festivals, Rosh Chodesh" },
      { to: "/outils", t: "Gematria", d: "five methods, exact calculation" },
      { to: "/outils", t: "Nikkud", d: "vocalisation by Dicta's nakdan" },
      { to: "/chabbat", t: "The Shabbat note", d: "the weekly WhatsApp — personalizable in the tools" },
      { to: "/outils", t: "Source sheet", d: "Hebrew, translation, link — for WhatsApp" },
      { to: "/daily", t: "Today's learning", d: "parashah, daf yomi, daily Rambam" },
      { to: "/chiourim", t: "Rav Attal's shiurim", d: "video classes (in French), by theme" },
    ],
    inviteH2: "One URL to paste into claude.ai, and study <strong>changes in nature</strong>.",
    inviteAct1: "Install now", inviteAct2: "Source code — MIT",
    inviteNote: "Free, no account, no data collection. Works alongside Sefaria's official MCP — install both: the official one for the depth of the library, Torah MCP for citation discipline, chavruta and HebrewBooks.",
    fDaf: "The daf online", fOutils: "Tools", fInstall: "Installation", fDaily: "Today's learning", fPrivacy: "Privacy",
    credits1: "Texts served by Sefaria's public API — licences indicated in each answer. Vocalisation by Dicta's nakdan, calendars by Hebcal.",
    credits2: "Independent of Sefaria and of hebrewbooks.org.",
  },
  he: {
    title: "Mamash IA — משמעת מקורות ל-Claude",
    desc: "Claude מצטט את התורה מתוך הטקסטים, לעולם לא מהזיכרון. שיטת לימוד, חברותא, מדריך לפרשה, דף וילנא אינטראקטיבי, ספריא, HebrewBooks, זמנים, גימטריה. חינם, בלי חשבון.",
    grpSite: "באתר", navQuestion: "שאלה", navDaf: "הדף", navOutils: "כלים", navDaily: "הלימוד היומי", navChiourim: "שיעורים", grpClaude: "ב-Claude", navInstall: "התקנת ה-MCP",
    h1: `Claude מצטט את התורה <span class="no">מהזיכרון</span> <strong>מתוך הטקסטים</strong>.`,
    deck: "שרת MCP חינמי שכופה על Claude משמעת מקורות: כל תשובה בהלכה או בלימוד נקראת מתוך הטקסט האמיתי, מצוטטת במדויק, מקושרת למפרשיה. בעברית, ברמה שלכם — מהמתחיל שאין לו רקע ועד תלמיד חכם. וכל כלי קיים גם בגרסת אינטרנט, כאן ממש, בלי Claude.",
    act1: "התקנה ב-Claude — 2 דקות", act2: "לשאול שאלה — בלי Claude",
    hint: "חינם · בלי חשבון · בלי איסוף נתונים — גללו",
    kezAria: "בשתי מילים", kezId: "bishtei-milim",
    fig1n: "6,600", fig1u: "כותרים", fig1t: "ספריית ספריא, נקראת בזמן אמת ברגע השאלה: תנ\"ך, משנה, תלמוד, מדרש, רמב\"ם, שולחן ערוך, שו\"ת, חסידות — ומפרשיהם.",
    fig2n: "65,000", fig2u: "ספרים", fig2t: "קטלוג HebrewBooks, ללימוד מן הדף הסרוק כשהטקסט אינו זמין במקום אחר.",
    fig3n: "0", fig3u: "מקורות בדויים", fig3t: "הכלל פשוט: מה שלא נקרא — לא מצוטט. וכל ציטוט מגיע עם קישור לבדיקה.",
    vsNonH: "AI רגיל <em>— עונה מהזיכרון</em>",
    vsNonP: "הוא נתקל בטקסטים האלה פעם אחת, באימון, ומשחזר אותם: מראי מקומות משוערים, ציטוטים מורכבים מחדש ולעתים בדויים לגמרי — באותו ביטחון בשני המקרים, ובלי לומר לעולם מה לא פתח.",
    vsYesH: "Mamash IA <em>— פותח את הספר</em>",
    vsYesP: "השאלה מפעילה קריאה: הטקסט נפתח במהדורת ספריא, מצוטט כלשונו, עם מראה מקום מדויק, מקושר למפרשיו ולטקסטים התלויים בו. דיוק שאפשר לבדוק בלחיצה — וכשמקור חסר, התשובה אומרת זאת.",
    lblA: "המניפסט, עם הערות בשוליים", ariaInner: "פירושים — הטור הפנימי", ariaOuter: "פירושים — הטור החיצוני",
    gMethode: { h: "השיטה", p: "נטענת לפני כל תשובה תורנית: לקרוא, לצטט מתוך הקריאה, לציין מחלוקות, לעולם לא לבדות מראה מקום.", try: "«מה אומרת הגמרא על אבדה? צטט את הסוגיה.»" },
    gHavrouta: { h: "החברותא", p: "Claude מקשה במקום לענות: קושיה אחת בכל פעם, רש\"י שיש להגן עליו מפני תוספות, סיכום החידושים.", try: "«נלמד ברכות ב ע\"א בחברותא.»" },
    gParacha: { h: "מדריך הפרשה", p: "חוט מנחה לפי עליות, שלוש שאלות מן הכתוב שמוכרעות בידי שני מפרשים חולקים, הד ההפטרה, שאלות לשולחן.", try: "«הכן לי את הפרשה.»" },
    gMemoire: { h: "למה זה חמור", p: "ציטוט משוער הוא ציטוט שגוי. משמעת הטקסט אינה מותרות: היא תנאי הלימוד." },
    gQuotidien: { h: "היומיום", p: "זמני היום וזמני שבת, תאריכים עבריים, גימטריה מדויקת, ניקוד (דיקטה), דף מקורות מוכן לוואטסאפ.", link: "לשימוש מקוון, בלי התקנה" },
    gModes: { h: "שלושה מצבים", p: "מתחיל, קלאסי, מתקדם — המשלב משתנה, משמעת המקורות לעולם לא. Claude מנחש את רמתכם מתוך השאלה, ואתם מחליפים מצב במילה אחת.", try: "«אני לא מבין בזה כלום, תסביר לי בפשטות.»", link: "לשאול שאלה באתר, בלי Claude" },
    gSources: { h: "המקורות", p: "טקסטים, מפרשים וחיפוש בספריא — הרישיונות מוצגים — וקטלוג HebrewBooks (כ-65,000 ספרים).", link: "משתלב עם ה-MCP הרשמי של ספריא" },
    guf1: `עוזרי AI עונים על שאלות בתורה <mark data-ref="memoire">מהזיכרון</mark> — בביטחון של מי שלא פתח את הספר. Mamash IA הופך את המהלך: לפני כל תשובה, העוזר שלכם טוען <mark data-ref="methode">שיטת לימוד</mark> שמחייבת אותו לקרוא את הטקסט, לצטט אותו כלשונו, ולומר היכן ללמוד אותו.`,
    guf2: `ומכיוון שאין לומדים לבד, הוא יודע גם להיות <mark data-ref="havrouta">חברותא</mark> — זה ששואל את השאלות במקום לענות עליהן — ולהכין את <mark data-ref="paracha">פרשת השבוע</mark> כמו אתר בנייה: עלייה אחר עלייה, כולל המחלוקות.`,
    guf3: `ומכיוון שהלימוד חי בתוך יום יהודי, הוא נושא <mark data-ref="quotidien">את כלי היומיום</mark> — זמנים, תאריכים, גימטריה, ניקוד, דפי מקורות לשיתוף — ו<mark data-ref="sources">את הספרייה כולה</mark>: ספריא לקריאה ולקישור, HebrewBooks ללימוד מן הדף הסרוק.`,
    guf4: `ומכיוון שהתורה אינה שייכת לחכמים בלבד, הוא מדבר <mark data-ref="modes">אל כל אחד לפי רמתו</mark>: הכול בעברית פשוטה וכל מונח מוסבר למי שמתחיל, המקור בלשונו והלמדנות למי ששולט בו.`,
    lblB: "שלושה מצבים — לכל אחד לפי רמתו",
    mDeb: { h: "מתחיל", who: "בלי רקע דתי, או בלי עברית של בית המדרש.", p: "הכול בעברית פשוטה. אף מונח תורני בלי הסבר, ההקשר לפני התשובה, רעיון אחד בכל פעם — ואף שאלה אינה נחשבת תמימה.", try: "«מה זה בעצם הלכה?»" },
    mCla: { h: "קלאסי", who: "רקע בסיסי, המקורות עם ביאור.", p: "דו-לשוני: המקור, ואז ביאורו בעברית בת ימינו. מונחים שגורים נחשבים ידועים, מראי מקומות סטנדרטיים, מחלוקות מצוינות. מצב ברירת המחדל.", try: "«מה אומר רש\"י על הפסוק הזה?»" },
    mAv: { h: "מתקדם", who: "בית המדרש.", p: "המקור בלשונו, מינוח בלי ביאור, ראשונים ופוסקים, גרסאות כשהן מכריעות, נפקא מינה, למדנות. צפיפות מרבית, שום דבר לא מוחלק.", try: "«שיטת הרמב\"ם מול תוספות כאן?»" },
    modesNote1: "מנוע אחד, קפדנות אחת: הטקסטים תמיד נקראים באמת ומצוטטים במדויק. רק המשלב מסתגל — ואתם מחליפים אותו במילה אחת. אין לכם Claude? ",
    modesNoteLink: "שאלו את שאלתכם כאן", modesNote2: ", בעברית: התשובה נקראת מתוך הטקסטים, עם מקורותיה.",
    bandH2: "«הראה לי את הדף היומי.»",
    bandP: "ודף וילנא נפתח בתוך השיחה: הגמרא במרכז, רש\"י ותוספות נפתחים בלחיצה, התרגום בלחיצה על כל קטע. בלי מראה מקום — נפתח הדף היומי.",
    bandAct1: "לפתוח את הדף באינטרנט", bandAct2: "הלימוד היומי",
    lblC: "מפתח — אינדקס שישה־עשר הכלים",
    toc: [
      { to: "/install", t: "שיטת הלימוד", d: "נטענת לפני כל תשובה תורנית" },
      { to: "/question", t: "שאלה, בעברית", d: "באתר, בלי Claude — תשובה שנקראת מתוך הטקסטים" },
      { to: "#modes", t: "שלושה מצבי לימוד", d: "מתחיל · קלאסי · מתקדם" },
      { to: "/install", t: "חברותא", d: "השותף שמקשה" },
      { to: "/install", t: "מדריך הפרשה", d: "עליות, מחלוקות, שולחן שבת" },
      { to: "/daf", t: "הדף — דף וילנא", d: "MCP App אינטראקטיבית, גם באינטרנט" },
      { to: "/install", t: "טקסטים, מפרשים, חיפוש", d: "ספריית ספריא, ניתנת לבדיקה" },
      { to: "/install", t: "קטלוג HebrewBooks", d: "כ-65,000 ספרים לפי כותר ומחבר" },
      { to: "/outils", t: "זמנים ושבת", d: "ירושלים, תל אביב, פריז, ניו יורק…" },
      { to: "/outils", t: "תאריכים עבריים", d: "המרה, חגים, ראש חודש" },
      { to: "/outils", t: "גימטריה", d: "חמש שיטות, חישוב מדויק" },
      { to: "/outils", t: "ניקוד", d: "ניקוד בנקדן של דיקטה" },
      { to: "/chabbat", t: "מילה לשבת", d: "הוואטסאפ השבועי — ניתן להתאמה בכלים" },
      { to: "/outils", t: "דף מקורות", d: "עברית, תרגום, קישור — לוואטסאפ" },
      { to: "/daily", t: "הלימוד היומי", d: "פרשה, דף יומי, רמב\"ם יומי" },
      { to: "/chiourim", t: "השיעורים של הרב אטל", d: "שיעורי וידאו (בצרפתית), לפי נושאים" },
    ],
    inviteH2: "כתובת אחת להדביק ב-claude.ai, והלימוד <strong>משנה את טבעו</strong>.",
    inviteAct1: "להתקין עכשיו", inviteAct2: "קוד מקור — MIT",
    inviteNote: "חינם, בלי חשבון, בלי איסוף נתונים. משתלב עם ה-MCP הרשמי של ספריא — התקינו את שניהם: הרשמי לעומק הספרייה, Torah MCP למשמעת הציטוט, לחברותא ול-HebrewBooks.",
    fDaf: "הדף באינטרנט", fOutils: "כלים", fInstall: "התקנה", fDaily: "הלימוד היומי", fPrivacy: "פרטיות",
    credits1: "הטקסטים מוגשים דרך ה-API הציבורי של ספריא — הרישיונות מצוינים בכל תשובה. ניקוד בנקדן של דיקטה, לוחות Hebcal.",
    credits2: "הפרויקט עצמאי ואינו קשור לספריא או ל-hebrewbooks.org.",
  },
};

const glose = (ref: string, g: Glose, link?: string) => `<div class="glose" data-ref="${ref}">
        <h3>${g.h}</h3>
        <p>${g.p}</p>${g.try ? `
        <span class="try">${g.try}</span>` : ""}${g.link && link ? `
        <a href="${link}">${g.link}</a>` : ""}
      </div>`;

const modeCol = (m: Mode, d: string) => `<div class="col rv ${d}">
      <h3>${m.h}</h3>
      <p class="who">${m.who}</p>
      <p>${m.p}</p>
      <span class="try">${m.try}</span>
    </div>`;

export function landingHtml(lang: Lang): string {
  const s = LANDING_T[lang];
  const path = "/";
  const h = (p: string) => (p.startsWith("#") ? p : href(lang, p));
  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${s.desc}">
${altLinks(lang, path)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Frank+Ruhl+Libre:wght@300;400;700&display=swap" rel="stylesheet">
<meta property="og:type" content="website">
<meta property="og:title" content="${ogTitle[lang]}">
<meta property="og:description" content="${ogDesc[lang]}">
${OG_IMAGE}
<meta property="og:url" content="${SITE}${href(lang, path)}">
${GA}
<style>
  :root {
    --paper:#f7f6f1; --ink:#082a99; --pop:#ffd23f; --ink-deep:#041a66; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14);
    --hl:#dbe3ff;
    --ease:cubic-bezier(0.16, 1, 0.3, 1);
  }
  * { box-sizing:border-box; margin:0; }
  html { scroll-behavior:smooth; overflow-x:clip; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; }
  ::selection { background:var(--pop); color:var(--ink); }
  a { color:var(--ink); text-decoration-thickness:1px; text-underline-offset:3px; }
  a:hover { text-decoration-thickness:2px; }
  .fr { font-family:"Fraunces", Georgia, serif; }
  ${LANG_CSS}

  /* ---- liens-crochets, pas de boutons ---- */
  .lnk { font-family:"Fraunces", Georgia, serif; font-weight:600; text-decoration:none; white-space:nowrap; }
  .lnk::before { content:"[ "; color:var(--ink-40); }
  .lnk::after { content:" ]"; color:var(--ink-40); }
  .lnk:hover::before { content:"[ → "; }
  [dir="rtl"] .lnk:hover::before { content:"[ ← "; }

  /* ---- nav : une ligne, rien d'autre ---- */
  nav { position:fixed; top:0; left:0; right:0; z-index:20; display:flex; justify-content:space-between; align-items:baseline;
        padding:1.1rem 4vw; mix-blend-mode:multiply; }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:1.05rem; text-decoration:none; letter-spacing:.01em; }
  nav .wm b { font-weight:600; border-bottom:3px solid var(--pop); padding-bottom:1px; }
  nav .wm img { width:26px; height:26px; border-radius:50%; vertical-align:-7px; margin-inline-end:.5rem; }
  nav .r { display:flex; gap:1.1rem; font-size:.92rem; align-items:baseline; }
  nav .grp { font-size:.66rem; letter-spacing:.16em; text-transform:uppercase; opacity:.5; }
  nav .sep { width:1px; height:.9rem; background:var(--ink-15); align-self:center; }
  nav .r a { text-decoration:none; }
  nav .r a strong { background:var(--pop); color:var(--ink); padding:.14rem .55rem .18rem; font-weight:700; transition:background .3s var(--ease), color .3s var(--ease); }
  nav .r a:hover strong { background:var(--ink); color:var(--pop); }
  nav .r a:has(strong):hover { text-decoration:none; }
  nav .r a:hover { text-decoration:underline; }
  @media (max-width:720px) {
    nav { padding:.9rem 4vw; }
    nav .r { gap:.8rem; font-size:.84rem; }
    nav .r .hide-m { display:none; }
  }

  /* ---- ouverture plein écran ---- */
  .cover { min-height:100svh; position:relative; display:flex; flex-direction:column; justify-content:center; padding:0 4vw; overflow:hidden; }
  .cover .he-giant { position:absolute; inset-inline-end:-2vw; top:50%; transform:translateY(-54%); font-weight:700;
    font-size:clamp(7rem, 34vw, 30rem); line-height:1; color:transparent; -webkit-text-stroke:1.5px var(--ink-15); pointer-events:none; user-select:none; direction:rtl; }
  .cover h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.6rem, 7.2vw, 6.2rem); line-height:1.02; letter-spacing:-.02em; max-width:11em; position:relative; }
  .cover h1 strong { font-weight:600; }
  .cover h1 .no { position:relative; white-space:nowrap; }
  .cover h1 .no::after { content:""; position:absolute; left:-.04em; right:-.04em; top:.56em; height:.055em; background:var(--ink);
    transform:scaleX(0); transform-origin:left center; }
  [dir="rtl"] .cover h1 .no::after { transform-origin:right center; }
  .cover h1 strong { opacity:0; }
  body.ready .cover h1 .no::after { animation:strike .55s var(--ease) 1.15s forwards; }
  body.ready .cover h1 strong { animation:affirm .7s var(--ease) 1.6s forwards; }
  @keyframes strike { to { transform:scaleX(1); } }
  @keyframes affirm { from { opacity:0; transform:translateY(.15em); } to { opacity:1; transform:none; } }

  /* chorégraphie d'entrée */
  .chor { opacity:0; transform:translateY(34px); }
  body.ready .chor { animation:rise .9s var(--ease) forwards; }
  body.ready .chor.c1 { animation-delay:.05s } body.ready .chor.c2 { animation-delay:.55s }
  body.ready .chor.c3 { animation-delay:.75s } body.ready .chor.c4 { animation-delay:1.9s }
  @keyframes rise { to { opacity:1; transform:none; } }
  .he-giant { opacity:0; }
  body.ready .he-giant { animation:emerge 1.6s var(--ease) .2s forwards; }
  @keyframes emerge { from { opacity:0; transform:translateY(-54%) scale(1.04); } to { opacity:1; transform:translateY(-54%) scale(1); } }
  nav { opacity:0; }
  body.ready nav { animation:rise .8s var(--ease) .9s forwards; transform:none; }
  @media (prefers-reduced-motion: reduce) {
    .chor, .he-giant, nav, .cover h1 strong { opacity:1 !important; animation:none !important; transform:none !important; }
    .cover h1 .no::after { transform:scaleX(1); animation:none !important; }
  }
  .cover p.deck { margin-top:2rem; max-width:34rem; font-size:1.12rem; color:var(--ink); opacity:.85; position:relative; }
  .cover .acts { margin-top:2.6rem; display:flex; gap:2.4rem; flex-wrap:wrap; font-size:1.1rem; position:relative; }
  .cover .hint { position:absolute; bottom:2rem; inset-inline-start:4vw; font-size:.8rem; letter-spacing:.18em; text-transform:uppercase; opacity:.5; }

  /* ---- reveal ---- */
  .rv { opacity:0; transform:translateY(28px); transition:opacity .9s var(--ease), transform .9s var(--ease); }
  .rv.in { opacity:1; transform:none; }
  .rv.d1 { transition-delay:.08s } .rv.d2 { transition-delay:.16s } .rv.d3 { transition-delay:.24s }
  @media (prefers-reduced-motion: reduce) { .rv { opacity:1; transform:none; transition:none; } html { scroll-behavior:auto; } }

  /* ---- section daf : le manifeste commenté ---- */
  .amud { padding:9rem 4vw 5rem; max-width:1200px; margin:0 auto; }
  /* En deux mots — chiffres + face-à-face */
  .kez { max-width:1200px; margin:0 auto; padding:5rem 4vw 2rem; }
  .kez .figs { display:grid; grid-template-columns:repeat(3,1fr); gap:2.5rem 3rem; border-top:2px solid var(--ink); border-bottom:1px solid var(--ink-15); padding:2.4rem 0 2.2rem; }
  .kez .fig b { display:inline-block; background:linear-gradient(transparent 68%, var(--pop) 68% 94%, transparent 94%); padding:0 .12em; font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.6rem, 5vw, 4.2rem); line-height:1; letter-spacing:-.03em; font-variant-numeric:tabular-nums; }
  .kez .fig b small { font-size:.42em; font-weight:600; letter-spacing:0; margin-inline-start:.25em; vertical-align:.35em; }
  .kez .fig span { display:block; margin-top:.7rem; font-size:.95rem; line-height:1.55; opacity:.85; max-width:22rem; }
  .kez .vs { display:grid; grid-template-columns:1fr 1fr; gap:3rem; margin-top:2.6rem; }
  .kez .vs h3 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.15rem; margin-bottom:.5rem; }
  .kez .vs h3 em { font-style:italic; font-weight:300; opacity:.7; }
  .kez .vs p { line-height:1.7; }
  .kez .vs .non h3 { text-decoration:line-through; text-decoration-thickness:1.5px; text-decoration-color:var(--ink-40); }
  .kez .vs .non p { opacity:.7; }
  @media (max-width:900px) { .kez { padding-top:3rem; } .kez .figs { grid-template-columns:1fr; gap:1.8rem; } .kez .vs { grid-template-columns:1fr; gap:1.8rem; } }
  .amud-head { display:flex; align-items:baseline; gap:1.4rem; margin-bottom:3.5rem; }
  .amud-head .otiot { font-size:1.6rem; font-weight:700; direction:rtl; background:var(--pop); padding:.05em .35em .1em; line-height:1.2; }
  .amud-head .rule { flex:1; height:1px; background:var(--ink-15); }
  .amud-head .lbl { font-size:.8rem; letter-spacing:.22em; text-transform:uppercase; opacity:.55; }

  .daf { display:grid; grid-template-columns: 1fr 2fr 1fr; gap:3.2rem; align-items:start; }
  .guf { font-size:clamp(1.25rem, 1.9vw, 1.6rem); line-height:1.85; font-weight:400; }
  .guf p + p { margin-top:1.4em; }
  .guf mark { background:transparent; color:inherit; border-bottom:2px solid var(--ink-40); cursor:default; transition:background .35s var(--ease); padding:0 .08em; }
  .guf mark.on, .guf mark:hover { background:var(--pop); border-bottom-color:var(--ink); }
  .margin { font-size:.86rem; line-height:1.6; display:flex; flex-direction:column; gap:2.2rem; position:sticky; top:7rem; }
  .glose { border-inline-start:2px solid var(--ink-15); padding-inline-start:1rem; transition:border-color .35s var(--ease); }
  .glose.on, .glose:hover { border-color:var(--ink); }
  .glose h3 { font-size:.78rem; letter-spacing:.16em; text-transform:uppercase; margin-bottom:.4rem; }
  .glose p { opacity:.8; }
  .glose .try { display:block; margin-top:.5rem; font-style:italic; opacity:.95; }
  .glose a { font-size:.82rem; }
  @media (max-width:900px) {
    .daf { grid-template-columns:1fr; gap:2rem; }
    .margin { position:static; flex-direction:column; gap:1.4rem; }
  }

  /* ---- le mafteah : index à points de conduite ---- */
  .mafteah { max-width:1200px; margin:0 auto; padding:4rem 4vw 6rem; }
  .toc { border-top:1px solid var(--ink-15); }
  .toc a { display:flex; align-items:baseline; gap:.8rem; padding:1.05rem 0; border-bottom:1px solid var(--ink-15); text-decoration:none;
           transition:padding-inline-start .4s var(--ease), background .4s var(--ease); }
  .toc a:hover { padding-inline-start:1rem; background:rgba(219,227,255,.5); }
  .toc .t { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:clamp(1.15rem, 2.2vw, 1.7rem); white-space:nowrap; }
  .toc .dots { flex:1; border-bottom:2px dotted var(--ink-40); transform:translateY(-.35em); min-width:2rem; }
  .toc .d { font-size:.9rem; opacity:.75; text-align:end; max-width:44%; }
  .toc .he { direction:rtl; font-weight:700; white-space:nowrap; }
  @media (max-width:720px) { .toc .d { display:none; } }

  /* ---- trois modes : trois colonnes typographiques ---- */
  .modes { max-width:1200px; margin:0 auto; padding:2rem 4vw 6rem; }
  .modes .cols { display:grid; grid-template-columns:repeat(3, 1fr); gap:3rem; }
  .modes .col { border-top:2px solid var(--ink); padding-top:1.2rem; }
  .modes .col h3 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:clamp(1.5rem, 2.4vw, 2rem); letter-spacing:-.01em; margin-bottom:.2rem; }
  .modes .who { font-size:.8rem; letter-spacing:.14em; text-transform:uppercase; opacity:.55; margin-bottom:1rem; }
  .modes .col p { line-height:1.65; }
  .modes .try { display:block; margin-top:1rem; font-style:italic; opacity:.85; }
  .modes .note { margin-top:3rem; max-width:44rem; opacity:.7; font-size:.95rem; }
  @media (max-width:900px) { .modes .cols { grid-template-columns:1fr; gap:2.2rem; } }
  @media (max-width:720px) { .modes { padding:1rem 5vw 4rem; } }

  /* ---- bande daf viewer, pleine largeur, parchemin ---- */
  .band { background:#f4ecd7; color:#22201b; padding:6rem 4vw; }
  .band .in { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1.1fr .9fr; gap:4rem; align-items:center; }
  @media (max-width:900px) { .band .in { grid-template-columns:1fr; } }
  .band h2 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2rem, 4.4vw, 3.4rem); line-height:1.06; letter-spacing:-.015em; margin-bottom:1.2rem; }
  .band p { max-width:30rem; opacity:.85; }
  .band .acts { margin-top:2rem; font-size:1.05rem; display:flex; gap:1.2rem 2.2rem; flex-wrap:wrap; }
  .band .lnk::before, .band .lnk::after { color:rgba(34,32,27,.4); }
  .band a { color:#22201b; }
  .vilna { background:#faf5e6; border:1px solid #d9d0bb; padding:1.4rem 1.6rem; direction:rtl; box-shadow:0 30px 60px rgba(34,32,27,.14); }
  .vilna .t { font-weight:700; border-bottom:2px solid #22201b; padding-bottom:.35rem; margin-bottom:.6rem; font-size:1.1rem; }
  .vilna .g { line-height:1.85; text-align:justify; font-size:1.02rem; }
  .vilna .r { margin-top:.7rem; font-size:.82rem; color:#6d675c; border-top:1px dotted #b7ad93; padding-top:.45rem; display:flex; justify-content:space-between; }

  /* ---- fin : l'invitation ---- */
  .invite { padding:9rem 4vw 7rem; max-width:1200px; margin:0 auto; }
  .invite h2 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.4rem, 6.4vw, 5.4rem); line-height:1.04; letter-spacing:-.02em; max-width:14em; }
  .invite h2 strong { font-weight:600; }
  .invite .acts { margin-top:3rem; display:flex; gap:2.6rem; flex-wrap:wrap; font-size:1.2rem; }
  .invite .note { margin-top:2.4rem; font-size:.92rem; opacity:.7; max-width:36rem; }

  footer { border-top:1px solid var(--ink-15); max-width:1200px; margin:0 auto; padding:2rem 4vw 3rem; font-size:.88rem; }
  footer .row { display:flex; flex-wrap:wrap; gap:1.6rem; margin-bottom:1.2rem; align-items:baseline; }
  footer .row a { text-decoration:none; opacity:.8; } footer .row a:hover { text-decoration:underline; opacity:1; }
  footer p { opacity:.65; max-width:52rem; }

  /* ---- hébreu : titres en Frank Ruhl Libre, sans interlettrage forcé ---- */
  [dir="rtl"] .cover h1, [dir="rtl"] .kez .vs h3, [dir="rtl"] .modes .col h3, [dir="rtl"] .band h2, [dir="rtl"] .invite h2,
  [dir="rtl"] .toc .t, [dir="rtl"] .lnk, [dir="rtl"] .kez .fig b small { font-family:"Frank Ruhl Libre", Georgia, serif; letter-spacing:0; }
  [dir="rtl"] .cover h1, [dir="rtl"] .band h2, [dir="rtl"] .invite h2 { font-weight:400; }
  [dir="rtl"] .cover h1 strong, [dir="rtl"] .invite h2 strong, [dir="rtl"] .kez .vs h3, [dir="rtl"] .modes .col h3, [dir="rtl"] .toc .t, [dir="rtl"] .lnk { font-weight:700; }
  [dir="rtl"] .cover h1 .no::after { top:.5em; }
  [dir="rtl"] nav .grp, [dir="rtl"] .cover .hint, [dir="rtl"] .amud-head .lbl, [dir="rtl"] .glose h3, [dir="rtl"] .modes .who { letter-spacing:.05em; }
  [dir="rtl"] .toc .dots { transform:translateY(-.3em); }

  @media (max-width:720px) {
    body { font-size:16px; }
    .amud { padding:5.5rem 5vw 3.5rem; }
    .amud-head { margin-bottom:2.2rem; }
    .mafteah { padding:2.5rem 5vw 4rem; }
    .band { padding:3.5rem 5vw; }
    .band .in { gap:2.4rem; }
    .invite { padding:5rem 5vw 4.5rem; }
    .invite .acts { gap:1.4rem 2rem; font-size:1.1rem; }
    .cover .acts { gap:1.2rem 2rem; font-size:1.02rem; }
    .cover p.deck { font-size:1.05rem; }
    .toc .t { white-space:normal; }
    .toc a { gap:.6rem; }
    .guf { line-height:1.8; }
  }
</style>
<noscript><style>.chor,.he-giant,nav,.cover h1 strong{opacity:1 !important;transform:none !important}.cover h1 .no::after{transform:scaleX(1)}</style></noscript>
</head>
<body>

<nav>
  <a class="wm" href="${href(lang, "/")}" dir="ltr"><img src="/icon.png" alt="" width="26" height="26"><b>Mamash</b>&nbsp;IA</a>
  <div class="r">
    <span class="grp hide-m">${s.grpSite}</span>
    <a href="${href(lang, "/question")}">${s.navQuestion}</a>
    <a href="${href(lang, "/daf")}">${s.navDaf}</a>
    <a href="${href(lang, "/outils")}" class="hide-m">${s.navOutils}</a>
    <a href="${href(lang, "/daily")}" class="hide-m">${s.navDaily}</a>
    <a href="${href(lang, "/chiourim")}" class="hide-m">${s.navChiourim}</a>
    <span class="sep hide-m"></span>
    <span class="grp hide-m">${s.grpClaude}</span>
    <a href="${href(lang, "/install")}"><strong>${s.navInstall}</strong></a>
    <span class="sep hide-m"></span>
    ${langSwitcher(lang, path)}
  </div>
</nav>

<header class="cover">
  <div class="he-giant" aria-hidden="true">מקור</div>
  <h1 class="fr chor c1">${s.h1}</h1>
  <p class="deck chor c2">${s.deck}</p>
  <div class="acts chor c3">
    <a class="lnk" href="${href(lang, "/install")}">${s.act1}</a>
    <a class="lnk" href="${href(lang, "/question")}">${s.act2}</a>
  </div>
  <span class="hint chor c4" style="opacity:0">${s.hint}</span>
</header>

<section class="kez" id="${s.kezId}" aria-label="${s.kezAria}">
  <div class="figs">
    <div class="fig rv"><b>${s.fig1n}<small>${s.fig1u}</small></b><span>${s.fig1t}</span></div>
    <div class="fig rv d1"><b>${s.fig2n}<small>${s.fig2u}</small></b><span>${s.fig2t}</span></div>
    <div class="fig rv d2"><b>${s.fig3n}<small>${s.fig3u}</small></b><span>${s.fig3t}</span></div>
  </div>
  <div class="vs">
    <div class="non rv"><h3>${s.vsNonH}</h3><p>${s.vsNonP}</p></div>
    <div class="rv d1"><h3>${s.vsYesH}</h3><p>${s.vsYesP}</p></div>
  </div>
</section>

<section class="amud" id="daf-a">
  <div class="amud-head rv"><span class="otiot">א</span><span class="rule"></span><span class="lbl">${s.lblA}</span></div>
  <div class="daf">
    <aside class="margin rv d1" aria-label="${s.ariaInner}">
      ${glose("methode", s.gMethode)}
      ${glose("havrouta", s.gHavrouta)}
      ${glose("paracha", s.gParacha)}
    </aside>
    <div class="guf rv">
      <p>${s.guf1}</p>
      <p>${s.guf2}</p>
      <p>${s.guf3}</p>
      <p>${s.guf4}</p>
    </div>
    <aside class="margin rv d2" aria-label="${s.ariaOuter}">
      ${glose("memoire", s.gMemoire)}
      ${glose("quotidien", s.gQuotidien, href(lang, "/outils"))}
      ${glose("modes", s.gModes, href(lang, "/question"))}
      ${glose("sources", s.gSources, "https://developers.sefaria.org/docs/the-sefaria-mcp")}
    </aside>
  </div>
</section>

<section class="modes" id="modes">
  <div class="amud-head rv"><span class="otiot">ב</span><span class="rule"></span><span class="lbl">${s.lblB}</span></div>
  <div class="cols">
    ${modeCol(s.mDeb, "d1")}
    ${modeCol(s.mCla, "d2")}
    ${modeCol(s.mAv, "d3")}
  </div>
  <p class="note rv">${s.modesNote1}<a href="${href(lang, "/question")}">${s.modesNoteLink}</a>${s.modesNote2}</p>
</section>

<section class="band" id="daf-viewer">
  <div class="in">
    <div class="rv">
      <h2>${s.bandH2}</h2>
      <p>${s.bandP}</p>
      <div class="acts">
        <a class="lnk" href="${href(lang, "/daf")}">${s.bandAct1}</a>
        <a class="lnk" href="${href(lang, "/daily")}">${s.bandAct2}</a>
      </div>
    </div>
    <div class="vilna rv d1" aria-hidden="true">
      <div class="t">ברכות ב׳ א</div>
      <div class="g">מֵאֵימָתַי קוֹרִין אֶת שְׁמַע בְּעַרְבִין? מִשָּׁעָה שֶׁהַכֹּהֲנִים נִכְנָסִים לֶאֱכוֹל בִּתְרוּמָתָן…</div>
      <div class="r"><span>רש״י</span><span>תוספות</span></div>
    </div>
  </div>
</section>

<section class="mafteah" id="mafteah">
  <div class="amud-head rv"><span class="otiot">ג</span><span class="rule"></span><span class="lbl">${s.lblC}</span></div>
  <div class="toc rv d1">
    ${s.toc.map((i) => `<a href="${h(i.to)}"><span class="t">${i.t}</span><span class="dots"></span><span class="d">${i.d}</span></a>`).join("\n    ")}
  </div>
</section>

<section class="invite">
  <h2 class="fr rv">${s.inviteH2}</h2>
  <div class="acts rv d1">
    <a class="lnk" href="${href(lang, "/install")}">${s.inviteAct1}</a>
    <a class="lnk" href="https://github.com/JonathanB555/torah-mcp">${s.inviteAct2}</a>
  </div>
  <p class="note rv d2">${s.inviteNote}</p>
</section>

<footer>
  <div class="row">
    <a href="${href(lang, "/daf")}">${s.fDaf}</a><a href="${href(lang, "/outils")}">${s.fOutils}</a><a href="${href(lang, "/install")}">${s.fInstall}</a><a href="${href(lang, "/daily")}">${s.fDaily}</a><a href="${href(lang, "/privacy")}">${s.fPrivacy}</a><a href="https://github.com/JonathanB555/torah-mcp">GitHub</a>${langSwitcher(lang, path)}
  </div>
  <p><a href="https://www.sefaria.org" aria-label="Powered by Sefaria"><img src="https://files.readme.io/dcee0a8-image.png" alt="Powered by Sefaria" width="104" height="54" style="display:block;margin-bottom:.7rem"></a>
  ${s.credits1} ${colophon(lang)} ${s.credits2}</p>
</footer>

<script>
(function () {
  // Chorégraphie d'entrée (après chargement des polices)
  function go(){ document.body.classList.add("ready"); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go); setTimeout(go, 900); } else { setTimeout(go, 120); }

  // Révélations au défilement
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

  // Le daf vivant : une glose éclaire sa phrase, une phrase éclaire sa glose
  function link(sel, other) {
    document.querySelectorAll(sel).forEach(function (el) {
      var ref = el.getAttribute("data-ref");
      el.addEventListener("mouseenter", function () {
        document.querySelectorAll(other + '[data-ref="' + ref + '"], ' + sel + '[data-ref="' + ref + '"]').forEach(function (m) { m.classList.add("on"); });
      });
      el.addEventListener("mouseleave", function () {
        document.querySelectorAll('[data-ref="' + ref + '"]').forEach(function (m) { m.classList.remove("on"); });
      });
    });
  }
  link(".glose", ".guf mark");
  link(".guf mark", ".glose");
})();
</script>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// /install
// ----------------------------------------------------------------------------

type InstallStrings = {
  title: string; desc: string; back: string; h1: string; muted: string;
  lblA: string; step1: string; step2: string; step3: string;
  lblC: string; pC: string; lblD: string; pD: string; lblE: string; pE: string;
  lblF: string; pF: string; srcCode: string; lblG: string; g1: string; g2: string; g3: string; home: string;
};

const INSTALL_T: Record<Lang, InstallStrings> = {
  fr: {
    title: "Installation — Mamash IA",
    desc: "Installer Torah MCP dans claude.ai, Claude Code ou tout client MCP : le guide technique complet.",
    back: "← l'accueil",
    h1: "L'installation, en deux minutes.",
    muted: "Torah MCP est un serveur MCP distant (HTTP streamable). Gratuit, sans compte, sans collecte de données.",
    lblA: "claude.ai",
    step1: `Ouvrez <a href="https://claude.ai/settings/connectors">claude.ai → Settings → Connectors</a>`,
    step2: `Cliquez sur <strong>Add custom connector</strong>`,
    step3: "Collez cette URL, nommez-le « Torah », validez — l'app mobile suit toute seule :",
    lblC: "Autres clients MCP",
    pC: `Tout client compatible (transport HTTP streamable) fonctionne avec la même URL. Le serveur expose 16 outils en lecture seule, 5 prompts (<code>hebrewbooks</code>, <code>havrouta</code>, <code>paracha</code>, <code>debutant</code>, <code>avance</code>) et une MCP App — le visualiseur de daf.`,
    lblD: "Votre niveau",
    pD: `Dites-le simplement au début de la conversation — « je débute, je ne lis pas l'hébreu » ou « mode avancé » — ou laissez Claude le déduire de votre question. Le tool <code>mode_etude</code> règle le registre (débutant / classique / avancé) sans rien changer à la discipline des sources ; vous en changez à tout moment.`,
    lblE: "Accès sur invitation — optionnel",
    pE: `Par défaut le serveur est public. Pour un accès sur invitation, l'hébergeur pose le secret <code>BEARER_TOKENS</code> (un token par invité, séparés par des virgules) ; chacun utilise alors <code>https://…/&lt;token&gt;/mcp</code>, et l'on révoque en retirant le token.`,
    lblF: "Héberger votre propre instance",
    pF: `Le code est libre (MIT), sans aucun secret requis. Optionnels : <code>HEBREWBOOKS_API_KEY</code> (recherche catalogue — clé sur demande à developers@hebrewbooks.org), <code>BEARER_TOKENS</code>.`,
    srcCode: "Code source",
    lblG: "Bon voisinage",
    g1: "Requêtes vers Sefaria : User-Agent identifiant + cache edge (24 h textes, 1 h calendriers)",
    g2: "Limite de débit : 60 requêtes/minute/IP",
    g3: "Licences des textes restituées dans chaque réponse",
    home: "Retour à l'accueil",
  },
  en: {
    title: "Install — Mamash IA",
    desc: "Install Torah MCP in claude.ai, Claude Code or any MCP client: the complete technical guide.",
    back: "← home",
    h1: "Installation, in two minutes.",
    muted: "Torah MCP is a remote MCP server (streamable HTTP). Free, no account, no data collection.",
    lblA: "claude.ai",
    step1: `Open <a href="https://claude.ai/settings/connectors">claude.ai → Settings → Connectors</a>`,
    step2: `Click <strong>Add custom connector</strong>`,
    step3: "Paste this URL, name it “Torah”, confirm — the mobile app follows on its own:",
    lblC: "Other MCP clients",
    pC: `Any compatible client (streamable HTTP transport) works with the same URL. The server exposes 16 read-only tools, 5 prompts (<code>hebrewbooks</code>, <code>havrouta</code>, <code>paracha</code>, <code>debutant</code>, <code>avance</code>) and one MCP App — the daf viewer.`,
    lblD: "Your level",
    pD: `Simply say so at the start of the conversation — “I'm a beginner, I don't read Hebrew” or “advanced mode” — or let Claude infer it from your question. The <code>mode_etude</code> tool sets the register (beginner / classic / advanced) without changing anything about the source discipline; you can switch at any time.`,
    lblE: "Access by invitation — optional",
    pE: `By default the server is public. For invitation-only access, the host sets the <code>BEARER_TOKENS</code> secret (one token per guest, comma-separated); each guest then uses <code>https://…/&lt;token&gt;/mcp</code>, and access is revoked by removing the token.`,
    lblF: "Host your own instance",
    pF: `The code is free (MIT), with no secret required. Optional: <code>HEBREWBOOKS_API_KEY</code> (catalogue search — key on request from developers@hebrewbooks.org), <code>BEARER_TOKENS</code>.`,
    srcCode: "Source code",
    lblG: "Good neighbourliness",
    g1: "Requests to Sefaria: identifying User-Agent + edge cache (24 h texts, 1 h calendars)",
    g2: "Rate limit: 60 requests/minute/IP",
    g3: "Text licences returned in each answer",
    home: "Back to home",
  },
  he: {
    title: "התקנה — Mamash IA",
    desc: "התקנת Torah MCP ב-claude.ai, ב-Claude Code או בכל לקוח MCP: המדריך הטכני המלא.",
    back: "→ לעמוד הבית",
    h1: "ההתקנה, בשתי דקות.",
    muted: "Torah MCP הוא שרת MCP מרוחק (HTTP streamable). חינם, בלי חשבון, בלי איסוף נתונים.",
    lblA: "claude.ai",
    step1: `פתחו <a href="https://claude.ai/settings/connectors" dir="ltr">claude.ai → Settings → Connectors</a>`,
    step2: `לחצו על <strong>Add custom connector</strong>`,
    step3: "הדביקו את הכתובת הזאת, קראו לה «Torah» ואשרו — האפליקציה בנייד מתעדכנת מעצמה:",
    lblC: "לקוחות MCP אחרים",
    pC: `כל לקוח תואם (תעבורת HTTP streamable) עובד עם אותה כתובת. השרת חושף 16 כלים לקריאה בלבד, 5 פרומפטים (<code>hebrewbooks</code>, <code>havrouta</code>, <code>paracha</code>, <code>debutant</code>, <code>avance</code>) ו-MCP App אחת — מציג הדף.`,
    lblD: "הרמה שלכם",
    pD: `פשוט אמרו זאת בתחילת השיחה — «אני מתחיל, אין לי רקע» או «מצב מתקדם» — או תנו ל-Claude להסיק זאת מהשאלה. הכלי <code>mode_etude</code> קובע את המשלב (מתחיל / קלאסי / מתקדם) בלי לשנות דבר במשמעת המקורות; אפשר להחליף בכל רגע.`,
    lblE: "גישה בהזמנה — אופציונלי",
    pE: `כברירת מחדל השרת ציבורי. לגישה בהזמנה בלבד, המארח מגדיר את הסוד <code>BEARER_TOKENS</code> (טוקן אחד לכל מוזמן, מופרדים בפסיקים); כל אחד משתמש אז ב-<code dir="ltr">https://…/&lt;token&gt;/mcp</code>, ומבטלים גישה בהסרת הטוקן.`,
    lblF: "לארח מופע משלכם",
    pF: `הקוד חופשי (MIT), בלי שום סוד נדרש. אופציונלי: <code>HEBREWBOOKS_API_KEY</code> (חיפוש בקטלוג — מפתח לפי בקשה מ-<span dir="ltr">developers@hebrewbooks.org</span>), <code>BEARER_TOKENS</code>.`,
    srcCode: "קוד מקור",
    lblG: "שכנות טובה",
    g1: "בקשות לספריא: User-Agent מזהה + מטמון קצה (24 שעות לטקסטים, שעה ללוחות)",
    g2: "הגבלת קצב: 60 בקשות לדקה לכל IP",
    g3: "רישיונות הטקסטים מוחזרים בכל תשובה",
    home: "חזרה לעמוד הבית",
  },
};

export function installHtml(lang: Lang): string {
  const s = INSTALL_T[lang];
  const path = "/install";
  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${s.desc}">
${altLinks(lang, path)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&display=swap" rel="stylesheet">
<meta property="og:type" content="website">
<meta property="og:title" content="${ogTitle[lang]}">
<meta property="og:description" content="${ogDesc[lang]}">
${OG_IMAGE}
<meta property="og:url" content="${SITE}${href(lang, path)}">
${GA}
<style>
  :root { --paper:#f7f6f1; --ink:#082a99; --pop:#ffd23f; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --ease:cubic-bezier(0.16,1,0.3,1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  ::selection { background:var(--pop); color:var(--ink); }
  main { max-width:820px; margin:0 auto; }
  a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.1rem 0; }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; text-decoration:none; }
  nav .wm b { font-weight:600; border-bottom:3px solid var(--pop); padding-bottom:1px; }
  nav .wm img { width:26px; height:26px; border-radius:50%; vertical-align:-7px; margin-inline-end:.5rem; }
  nav .r { display:flex; gap:1.4rem; align-items:baseline; }
  nav a.b { text-decoration:none; } nav a.b:hover { text-decoration:underline; }
  ${LANG_CSS}
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.2rem,5vw,3.6rem); line-height:1.05; letter-spacing:-.02em; margin:3.5rem 0 .8rem; }
  [dir="rtl"] h1 { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; letter-spacing:0; }
  [dir="rtl"] .lnk { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  [dir="rtl"] .lnk:hover::before { content:"[ ← "; }
  [dir="rtl"] .amud-head .lbl { letter-spacing:.05em; }
  .amud-head { display:flex; align-items:baseline; gap:1.2rem; margin:3.2rem 0 1.2rem; }
  .amud-head .ot { font-size:1.5rem; font-weight:700; direction:rtl; }
  .amud-head .rule { flex:1; height:1px; background:var(--ink-15); }
  .amud-head .lbl { font-size:.76rem; letter-spacing:.2em; text-transform:uppercase; opacity:.55; }
  p.muted { opacity:.75; max-width:38rem; }
  ol, ul { padding-inline-start:1.3rem; } li { margin:.35rem 0; }
  .url { display:block; background:var(--ink); color:var(--paper); padding:.85rem 1.1rem; font-family:ui-monospace, Menlo, monospace; font-size:.92rem; margin:1rem 0; word-break:break-all; direction:ltr; text-align:left; }
  .url::selection { background:var(--paper); color:var(--ink); }
  code { border-bottom:1px dotted var(--ink-40); font-family:ui-monospace, Menlo, monospace; font-size:.9em; direction:ltr; unicode-bidi:isolate; }
  .lnk { font-family:"Fraunces", Georgia, serif; font-weight:600; text-decoration:none; }
  .lnk::before { content:"[ "; color:var(--ink-40); } .lnk::after { content:" ]"; color:var(--ink-40); }
  .lnk:hover::before { content:"[ → "; }
</style>
</head>
<body>
<main>
  <nav><a class="wm" href="${href(lang, "/")}" dir="ltr"><img src="/icon.png" alt="" width="26" height="26"><b>Mamash</b>&nbsp;IA</a><span class="r"><a class="b" href="${href(lang, "/")}">${s.back}</a>${langSwitcher(lang, path)}</span></nav>
  <h1>${s.h1}</h1>
  <p class="muted">${s.muted}</p>

  <div class="amud-head"><span class="ot">א</span><span class="rule"></span><span class="lbl">${s.lblA}</span></div>
  <ol>
    <li>${s.step1}</li>
    <li>${s.step2}</li>
    <li>${s.step3}</li>
  </ol>
  <span class="url" dir="ltr">https://torah-mcp.com/mcp</span>

  <div class="amud-head"><span class="ot">ב</span><span class="rule"></span><span class="lbl">Claude Code</span></div>
  <span class="url" dir="ltr">claude mcp add --transport http torah https://torah-mcp.com/mcp</span>

  <div class="amud-head"><span class="ot">ג</span><span class="rule"></span><span class="lbl">${s.lblC}</span></div>
  <p>${s.pC}</p>

  <div class="amud-head"><span class="ot">ד</span><span class="rule"></span><span class="lbl">${s.lblD}</span></div>
  <p>${s.pD}</p>

  <div class="amud-head"><span class="ot">ה</span><span class="rule"></span><span class="lbl">${s.lblE}</span></div>
  <p>${s.pE}</p>

  <div class="amud-head"><span class="ot">ו</span><span class="rule"></span><span class="lbl">${s.lblF}</span></div>
  <p>${s.pF}</p>
  <p style="margin-top:1rem"><a class="lnk" href="https://deploy.workers.cloudflare.com/?url=https://github.com/JonathanB555/torah-mcp" dir="ltr">Deploy to Cloudflare</a>&nbsp;&nbsp;&nbsp;<a class="lnk" href="https://github.com/JonathanB555/torah-mcp">${s.srcCode}</a></p>

  <div class="amud-head"><span class="ot">ז</span><span class="rule"></span><span class="lbl">${s.lblG}</span></div>
  <ul>
    <li>${s.g1}</li>
    <li>${s.g2}</li>
    <li>${s.g3}</li>
  </ul>

  <p style="margin-top:3rem"><a class="lnk" href="${href(lang, "/")}">${s.home}</a></p>
  <footer style="margin-top:2.5rem;font-size:.88rem;opacity:.65"><p>${colophon(lang)}</p><p style="margin-top:.6rem">${langSwitcher(lang, path)}</p></footer>
</main>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// Compatibilité : les anciens exports (français)
// ----------------------------------------------------------------------------

export const LANDING_HTML = landingHtml("fr");
export const INSTALL_HTML = installHtml("fr");
export const PRIVACY_HTML = privacyHtml("fr");
