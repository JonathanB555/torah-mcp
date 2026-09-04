/**
 * Page /question — poser une question en français, sans Claude installé.
 * Le mode (débutant / classique / avancé) est partagé avec /outils via
 * localStorage (clé tm_mode). Débutant par défaut.
 *
 * Trilingue : `questionHtml(lang)` rend la page en FR (racine), EN (/en/question)
 * ou HE (/he/question, RTL). Un seul gabarit HTML/CSS/JS ; les chaînes viennent
 * du dictionnaire `T`, et celles utilisées par le script sont injectées dans `S`.
 */

import { type Lang, href, altLinks, langSwitcher, htmlAttrs, colophon } from "./i18n";

const PATH = "/question";

type Mode = "debutant" | "classique" | "avance";

interface ModeText { h: string; w: string; d: string }
interface Example { q: string; label: string }

interface Strings {
  title: string;
  desc: string;
  ogDesc: string;
  navTools: string;
  navDaf: string;
  navInstall: string;
  h1: string;
  lead: string;
  step1: string;
  step1s: string;
  ariaLevel: string;
  chosen: string;
  modes: Record<Mode, ModeText>;
  step2: string;
  placeholder: string;
  go: string;
  exLab: string;
  ex: Example[];
  histLab: string;
  histNote: string;
  hclr: string;
  copy: string;
  share: string;
  disc: string;
  again: string;
  againInstall: string;
  footHome: string;
  footPrivacy: string;
  /* — chaînes du script — */
  help: Record<Mode, string>;
  steps: string[];
  niv: Record<Mode, string>;
  read: string;
  copied: string;
  copyFail: string;
  shared: string;
  shareCancel: string;
  readMore: string;
  qLabel: string;
  sig: string;
  err: string;
  errNet: string;
  errGeneric: string;
  errCause: Record<string, string>;
  locale: string;
  waitNote: string;
  btnWait: string;
  suiteLab: string;
  suitePh: string;
  suiteGo: string;
}

const T: Record<Lang, Strings> = {
  fr: {
    title: "Poser une question — Mamash IA",
    desc: "Posez votre question sur la Torah, la halakha, le Talmud, en français. La réponse est lue dans les textes réels (Sefaria) et citée exactement — sans rien installer.",
    ogDesc: "Une question sur la Torah, en français. La réponse est lue dans les textes réels et citée exactement.",
    navTools: "Outils",
    navDaf: "Le daf",
    navInstall: "Installer le MCP",
    h1: "Posez votre <strong>question</strong>.",
    lead: "En français, comme elle vous vient. La réponse est lue dans les textes réels — Bible, Talmud, commentateurs, via Sefaria — et citée exactement, avec ses sources. Rien à installer.",
    step1: "Choisissez votre niveau",
    step1s: "on commence par là",
    ariaLevel: "Niveau",
    chosen: "→ choisi",
    modes: {
      debutant: { h: "Débutant", w: "Je débute, ou je ne lis pas l'hébreu", d: "Tout en français, chaque terme expliqué, le contexte avant la réponse." },
      classique: { h: "Classique", w: "J'ai les bases", d: "La source puis sa traduction ; les termes usuels sont supposés connus." },
      avance: { h: "Avancé", w: "Beit midrash", d: "Langue originale, terminologie sans glose, mahloket et lomdus." },
    },
    step2: "Posez votre question",
    placeholder: "Par exemple : pourquoi allume-t-on deux bougies le vendredi soir ?",
    go: "Demander",
    exLab: "Pour essayer",
    ex: [
      { q: "C'est quoi exactement la halakha, et d'où ça vient ?", label: "C'est quoi exactement la halakha ?" },
      { q: "Que dit la Torah sur le fait de rendre un objet perdu ?", label: "Que dit la Torah sur l'objet perdu ?" },
      { q: "Pourquoi la paracha de cette semaine s'appelle-t-elle comme ça, et de quoi parle-t-elle ?", label: "De quoi parle la paracha de cette semaine ?" },
      { q: "Quelle est la différence entre la Michna et la Guemara ?", label: "Michna, Guemara : quelle différence ?" },
      { q: "Que dit Rachi sur le premier verset de la Genèse ?", label: "Que dit Rachi sur Genèse 1:1 ?" },
    ],
    histLab: "Vos questions",
    histNote: "— gardées sur cet appareil seulement",
    hclr: "Effacer l'historique",
    copy: "Copier la réponse",
    share: "Partager",
    disc: "Réponse rédigée par Claude à partir des textes lus sur Sefaria, selon la méthode Mamash IA — vérifiez toujours les sources citées. Pour une décision de halakha pratique, consultez un rabbin.",
    again: "Poser une autre question",
    againInstall: "Installer Torah MCP dans Claude pour aller plus loin",
    footHome: "Accueil",
    footPrivacy: "Confidentialité",
    help: {
      debutant: "Tout en français, chaque terme expliqué, le contexte d'abord — pour qui débute ou ne lit pas l'hébreu.",
      classique: "Bilingue : la source puis sa traduction, termes usuels supposés connus.",
      avance: "Beit midrash : source en langue originale, terminologie sans glose, mahloket et lomdus.",
    },
    steps: ["Lecture des sources…", "Ouverture des textes sur Sefaria…", "Lecture des commentateurs…", "Rédaction de la réponse…"],
    niv: { debutant: "débutant", classique: "classique", avance: "avancé" },
    read: "Textes lus :",
    copied: "Copié — réponse, sources et lien.",
    copyFail: "Copie impossible ici — sélectionnez le texte à la main.",
    shared: "Partagé.",
    shareCancel: "Partage annulé.",
    readMore: "Lire la suite : ",
    qLabel: "Question : ",
    sig: "— Mamash IA, ",
    err: "Erreur — réessayez.",
    errNet: "Erreur réseau — réessayez.",
    errGeneric: "Le service de réponse est momentanément indisponible — réessayez.",
    errCause: {
      credit_epuise: "Le service de questions est en pause : le quota du serveur est épuisé. Les outils, le daf et l'installation dans Claude restent disponibles — réessayez plus tard.",
      cle_refusee: "Le service de questions est mal configuré côté serveur (clé API refusée). Les autres fonctions du site restent disponibles.",
      saturation: "Le service de réponse est saturé pour l'instant — réessayez dans une minute.",
      rate_limit: "Trop de questions pour l'instant — réessayez dans une minute, ou installez Torah MCP dans Claude pour continuer sans limite.",
      api_5xx: "Le service de réponse est momentanément indisponible — réessayez.",
    },
    locale: "fr-FR",
    waitNote: "La réponse demande en général 30 à 90 secondes : Claude lit réellement les textes — Bible, Talmud, commentateurs — avant de répondre. C'est le principe de la maison ; la page reste ouverte, la réponse arrive.",
    btnWait: "Lecture en cours…",
    suiteLab: "Continuer sur cette réponse",
    suitePh: "Une question de suite — elle s'appuiera sur la réponse ci-dessus.",
    suiteGo: "Demander la suite",
  },
  en: {
    title: "Ask a question — Mamash IA",
    desc: "Ask your question about the Torah, halakha or the Talmud, in English. The answer is read from the actual texts (Sefaria) and quoted exactly — nothing to install.",
    ogDesc: "A question about the Torah, in English. The answer is read from the actual texts and quoted exactly.",
    navTools: "Tools",
    navDaf: "The daf",
    navInstall: "Install the MCP",
    h1: "Ask your <strong>question</strong>.",
    lead: "In English, just as it comes to you. The answer is read from the actual texts — Bible, Talmud, commentators, via Sefaria — and quoted exactly, with its sources. Nothing to install.",
    step1: "Choose your level",
    step1s: "we start here",
    ariaLevel: "Level",
    chosen: "→ chosen",
    modes: {
      debutant: { h: "Beginner", w: "I'm starting out, or I don't read Hebrew", d: "Everything in English, every term explained, the context before the answer." },
      classique: { h: "Classic", w: "I know the basics", d: "The source, then its translation; common terms are taken as known." },
      avance: { h: "Advanced", w: "Beit midrash", d: "Original language, terminology without gloss, machloket and lomdus." },
    },
    step2: "Ask your question",
    placeholder: "For example: why do we light two candles on Friday night?",
    go: "Ask",
    exLab: "To try",
    ex: [
      { q: "What exactly is halakha, and where does it come from?", label: "What exactly is halakha?" },
      { q: "What does the Torah say about returning a lost object?", label: "What does the Torah say about lost objects?" },
      { q: "Why is this week's parashah called what it is, and what is it about?", label: "What is this week's parashah about?" },
      { q: "What is the difference between the Mishnah and the Gemara?", label: "Mishnah, Gemara: what's the difference?" },
      { q: "What does Rashi say on the first verse of Genesis?", label: "What does Rashi say on Genesis 1:1?" },
    ],
    histLab: "Your questions",
    histNote: "— kept on this device only",
    hclr: "Clear history",
    copy: "Copy the answer",
    share: "Share",
    disc: "Answer written by Claude from the texts read on Sefaria, following the Mamash IA method — always check the sources cited. For a practical halakhic ruling, consult a rabbi.",
    again: "Ask another question",
    againInstall: "Install Torah MCP in Claude to go further",
    footHome: "Home",
    footPrivacy: "Privacy",
    help: {
      debutant: "Everything in English, every term explained, the context first — for those starting out or who don't read Hebrew.",
      classique: "Bilingual: the source, then its translation; common terms taken as known.",
      avance: "Beit midrash: source in the original language, terminology without gloss, machloket and lomdus.",
    },
    steps: ["Reading the sources…", "Opening the texts on Sefaria…", "Reading the commentators…", "Writing the answer…"],
    niv: { debutant: "beginner", classique: "classic", avance: "advanced" },
    read: "Texts read:",
    copied: "Copied — answer, sources and link.",
    copyFail: "Copying isn't available here — select the text by hand.",
    shared: "Shared.",
    shareCancel: "Sharing cancelled.",
    readMore: "Read more: ",
    qLabel: "Question: ",
    sig: "— Mamash IA, ",
    err: "Error — please try again.",
    errNet: "Network error — please try again.",
    errGeneric: "The answering service is temporarily unavailable — please try again.",
    errCause: {
      credit_epuise: "The question service is paused: the server's quota is exhausted. The tools, the daf and the Claude installation remain available — try again later.",
      cle_refusee: "The question service is misconfigured on the server (API key refused). The rest of the site remains available.",
      saturation: "The answering service is overloaded right now — try again in a minute.",
      rate_limit: "Too many questions for now — try again in a minute, or install Torah MCP in Claude to continue without limits.",
      api_5xx: "The answering service is temporarily unavailable — please try again.",
    },
    locale: "en-GB",
    waitNote: "The answer usually takes 30 to 90 seconds: Claude actually reads the texts — Bible, Talmud, commentators — before answering. That is the whole point; keep the page open, the answer is coming.",
    btnWait: "Reading…",
    suiteLab: "Follow up on this answer",
    suitePh: "A follow-up question — it will build on the answer above.",
    suiteGo: "Ask the follow-up",
  },
  he: {
    title: "שאלה — Mamash IA",
    desc: "שאלו על התורה, ההלכה או התלמוד, בעברית. התשובה נקראת מתוך הטקסטים האמיתיים (ספריא) ומצוטטת במדויק — בלי להתקין דבר.",
    ogDesc: "שאלה על התורה, בעברית. התשובה נקראת מתוך הטקסטים האמיתיים ומצוטטת במדויק.",
    navTools: "כלים",
    navDaf: "הדף",
    navInstall: "התקנת ה-MCP",
    h1: "שאלו את <strong>השאלה</strong> שלכם.",
    lead: "בעברית, כפי שהיא עולה בדעתכם. התשובה נקראת מתוך הטקסטים האמיתיים — תנ\"ך, תלמוד, מפרשים, דרך ספריא — ומצוטטת במדויק, עם המקורות. אין מה להתקין.",
    step1: "בחרו את הרמה שלכם",
    step1s: "מתחילים כאן",
    ariaLevel: "רמה",
    chosen: "← נבחר",
    modes: {
      debutant: { h: "מתחילים", w: "אני בתחילת הדרך, או לא קורא ארמית", d: "הכול בעברית פשוטה, כל מונח מוסבר, ההקשר לפני התשובה." },
      classique: { h: "קלאסי", w: "יש לי את היסודות", d: "המקור ואחריו ביאורו; המונחים המקובלים נחשבים ידועים." },
      avance: { h: "מתקדם", w: "בית מדרש", d: "לשון המקור, מינוח ללא ביאור, מחלוקת ולמדנות." },
    },
    step2: "שאלו את שאלתכם",
    placeholder: "למשל: למה מדליקים שני נרות בערב שבת?",
    go: "לשאול",
    exLab: "לנסות",
    ex: [
      { q: "מה זה בעצם הלכה, ומאין היא באה?", label: "מה זה בעצם הלכה?" },
      { q: "מה אומרת התורה על השבת אבדה?", label: "מה אומרת התורה על השבת אבדה?" },
      { q: "למה פרשת השבוע נקראת כך, ועל מה היא מדברת?", label: "על מה פרשת השבוע?" },
      { q: "מה ההבדל בין משנה לגמרא?", label: "משנה וגמרא — מה ההבדל?" },
      { q: "מה אומר רש\"י על בראשית א׳ א׳?", label: "מה אומר רש\"י על בראשית א׳ א׳?" },
    ],
    histLab: "השאלות שלכם",
    histNote: "— נשמרות במכשיר הזה בלבד",
    hclr: "מחיקת ההיסטוריה",
    copy: "העתקת התשובה",
    share: "שיתוף",
    disc: "התשובה נכתבה על ידי Claude מתוך הטקסטים שנקראו בספריא, לפי שיטת Mamash IA — בדקו תמיד את המקורות המצוטטים. להכרעה הלכתית למעשה, שאלו רב.",
    again: "לשאול שאלה נוספת",
    againInstall: "התקינו את Torah MCP ב-Claude כדי להעמיק",
    footHome: "דף הבית",
    footPrivacy: "פרטיות",
    help: {
      debutant: "הכול בעברית פשוטה, כל מונח מוסבר, ההקשר קודם — למי שבתחילת הדרך או אינו קורא ארמית.",
      classique: "המקור ואחריו ביאורו; המונחים המקובלים נחשבים ידועים.",
      avance: "בית מדרש: המקור בלשונו, מינוח ללא ביאור, מחלוקת ולמדנות.",
    },
    steps: ["קוראים את המקורות…", "פותחים את הטקסטים בספריא…", "קוראים את המפרשים…", "כותבים את התשובה…"],
    niv: { debutant: "מתחילים", classique: "קלאסי", avance: "מתקדם" },
    read: "טקסטים שנקראו:",
    copied: "הועתק — תשובה, מקורות וקישור.",
    copyFail: "אי אפשר להעתיק כאן — סמנו את הטקסט ידנית.",
    shared: "שותף.",
    shareCancel: "השיתוף בוטל.",
    readMore: "להמשך קריאה: ",
    qLabel: "שאלה: ",
    sig: "— Mamash IA, ",
    err: "שגיאה — נסו שוב.",
    errNet: "שגיאת רשת — נסו שוב.",
    errGeneric: "שירות המענה אינו זמין כרגע — נסו שוב.",
    errCause: {
      credit_epuise: "שירות השאלות מושהה: מכסת השרת נוצלה במלואה. הכלים, הדף וההתקנה ב-Claude זמינים כרגיל — נסו שוב מאוחר יותר.",
      cle_refusee: "שירות השאלות אינו מוגדר כראוי בצד השרת (מפתח ה-API נדחה). שאר האתר זמין כרגיל.",
      saturation: "שירות המענה עמוס כרגע — נסו שוב בעוד דקה.",
      rate_limit: "יותר מדי שאלות כרגע — נסו שוב בעוד דקה, או התקינו את Torah MCP ב-Claude כדי להמשיך ללא הגבלה.",
      api_5xx: "שירות המענה אינו זמין כרגע — נסו שוב.",
    },
    locale: "he-IL",
    waitNote: "התשובה אורכת בדרך כלל 30 עד 90 שניות: קלוד קורא באמת את הטקסטים — תנ\"ך, תלמוד, מפרשים — לפני שהוא עונה. זה כל העניין; השאירו את העמוד פתוח, התשובה בדרך.",
    btnWait: "קוראים…",
    suiteLab: "להמשיך על התשובה הזו",
    suitePh: "שאלת המשך — היא תתבסס על התשובה שלמעלה.",
    suiteGo: "לשאול את ההמשך",
  },
};

/** Échappe une valeur d'attribut HTML (guillemets doubles). */
const attr = (s: string): string => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Sérialise l'objet de chaînes du script, sans risque de fermeture de balise. */
const jsObject = (v: unknown): string => JSON.stringify(v).replace(/</g, "\\u003c").replace(/\u2028|\u2029/g, "");

const SVG: Record<Mode, string> = {
  debutant: `<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M27 33a13 13 0 0 1 26 0v12a13 13 0 0 1-26 0Z"/><path d="M32 22.8c2-8.5 14-8.5 16 0M32 22.8h16"/><path d="M27 35c-4 0-4 7 0 7M53 35c4 0 4 7 0 7"/><path d="M33 36h4M43 36h4"/><path d="M40 38.5v4.5"/><path d="M34.5 46q5.5 4 11 0"/></svg>`,
  classique: `<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M27 40v-8a13 13 0 0 1 26 0v8"/><path d="M32 21.8c2-8.5 14-8.5 16 0M32 21.8h16"/><path d="M27 35c-4 0-4 7 0 7M53 35c4 0 4 7 0 7"/><path d="M33 36h4M43 36h4"/><path d="M40 38.5v4.5"/><path d="M27 40c-.5 9.5 5 16.5 13 16.5s13.5-7 13-16.5v-1c-1 5-5 12-13 12s-12-7-13-12Z" fill="currentColor" stroke-linejoin="round"/><path d="M33 45.5c2.5-2.5 5-2.5 7-.8c2-1.7 4.5-1.7 7 .8c-2 1.8-4.5 2.5-7 1.6c-2.5.9-5 .2-7-1.6Z" fill="currentColor"/><path d="M36.5 50q3.5 2 7 0"/></svg>`,
  avance: `<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M30 14h20l2 14h-24Z"/><path d="M21 28h38"/><path d="M27 28v32a13 13 0 0 0 26 0V28"/><path d="M26.5 36c-4 1-3 6-1 8c-3 2-3 6-1 9M53.5 36c4 1 3 6 1 8c3 2 3 6 1 9"/><path d="M33 36h4M43 36h4"/><path d="M40 38.5v4.5"/><path d="M35.5 46.5q4.5 3.5 9 0"/><path d="M27 49.5v10.5a13 13 0 0 0 26 0V49.5c-3 2.2-8 3.2-13 3.2s-10-1-13-3.2Z" fill="currentColor" stroke-linejoin="round"/></svg>`,
};

const MODES: readonly Mode[] = ["debutant", "classique", "avance"];

function modeLabel(mode: Mode, m: ModeText, checked: boolean): string {
  return `<label><input type="radio" name="mode" value="${mode}"${checked ? " checked" : ""}>${SVG[mode]}<span class="h">${m.h}</span><span class="w">${m.w}</span><span class="d">${m.d}</span></label>`;
}

export function questionHtml(lang: Lang): string {
  const s = T[lang];
  const S = {
    lang,
    prefix: href(lang, PATH),
    help: s.help,
    steps: s.steps,
    niv: s.niv,
    read: s.read,
    copied: s.copied,
    copyFail: s.copyFail,
    shared: s.shared,
    shareCancel: s.shareCancel,
    readMore: s.readMore,
    qLabel: s.qLabel,
    sig: s.sig,
    err: s.err,
    errNet: s.errNet,
    errGeneric: s.errGeneric,
    errCause: s.errCause,
    locale: s.locale,
    btnWait: s.btnWait,
    go: s.go,
    suiteGo: s.suiteGo,
  };
  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${attr(s.desc)}">
<link rel="icon" href="/icon.png" type="image/png">
<meta property="og:type" content="website">
<meta property="og:title" content="${attr(s.title)}">
<meta property="og:description" content="${attr(s.ogDesc)}">
<meta property="og:image" content="https://mamash-ia.com/og.png">
<meta property="og:url" content="https://mamash-ia.com${href(lang, PATH)}">
<meta name="twitter:card" content="summary_large_image">
${altLinks(lang, PATH)}
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
  :root { --paper:#f7f6f1; --ink:#082a99; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --muted:rgba(8,42,153,.65); --hl:#dbe3ff; --ease:cubic-bezier(0.16,1,0.3,1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  ::selection { background:var(--ink); color:var(--paper); }
  main { max-width:820px; margin:0 auto; }
  a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.1rem 0; font-size:.92rem; }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; text-decoration:none; font-size:1.05rem; }
  nav .wm b { font-weight:600; border-bottom:3px solid var(--ink); padding-bottom:1px; }
  nav .r a { text-decoration:none; margin-inline-start:1.1rem; } nav .r a:hover { text-decoration:underline; }
  nav .r .lang { margin-inline-start:1.1rem; } nav .r .lang a { margin:0; }
  .lang { font-size:.82rem; letter-spacing:.08em; } .lang a { text-decoration:none; opacity:.6; } .lang a:hover { opacity:1; text-decoration:underline; } .lang .cur { font-weight:700; } .lang .dot { opacity:.35; margin:0 .45em; }
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.2rem,5vw,3.6rem); line-height:1.05; letter-spacing:-.02em; margin:3rem 0 .8rem; }
  h1 strong { font-weight:600; }
  p.muted { color:var(--muted); max-width:40rem; }
  /* Étape 1 — le niveau, en évidence */
  .step { display:flex; align-items:baseline; gap:1rem; margin:2.6rem 0 1rem; }
  .step .n { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.6rem; }
  .step .t { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; }
  .step .rule { flex:1; height:1px; background:var(--ink-15); }
  .step .s { font-size:.78rem; letter-spacing:.18em; text-transform:uppercase; opacity:.55; }
  .modes { display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin:0 0 .6rem; }
  .modes label { display:grid; grid-template-columns:5rem 1fr; column-gap:.8rem; align-content:start; cursor:pointer; border:1.5px solid var(--ink-15); padding:1rem 1.1rem 1.1rem; transition:border-color .3s var(--ease), background .3s var(--ease); position:relative; }
  .modes label:hover { border-color:var(--ink-40); }
  .modes label:has(input:checked) { border-color:var(--ink); background:var(--hl); }
  .modes label:has(input:checked)::after { content:"${s.chosen}"; position:absolute; top:.6rem; inset-inline-end:.9rem; font-size:.7rem; letter-spacing:.14em; text-transform:uppercase; opacity:.7; }
  .modes .h { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; display:block; }
  .modes .w { display:block; font-size:.78rem; letter-spacing:.12em; text-transform:uppercase; opacity:.55; margin:.1rem 0 .5rem; }
  .modes .d { display:block; font-size:.9rem; line-height:1.5; opacity:.85; }
  .modes input { position:absolute; opacity:0; pointer-events:none; }
  .modes svg { grid-row:1 / span 3; width:5rem; height:5rem; margin-top:-.2rem; fill:none; stroke:currentColor; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; transition:transform .5s var(--ease); }
  .modes label:hover svg { transform:rotate(-4deg) translateY(-2px); }
  .modes .h, .modes .w, .modes .d { grid-column:2; }
  .modehelp { display:none; }
  @media (max-width:720px) { .modes { grid-template-columns:1fr; } }
  textarea { width:100%; min-height:110px; padding:.6rem .1rem; border:0; border-bottom:1.5px solid var(--ink-15); border-radius:0; background:transparent; color:var(--ink); font:inherit; font-size:1.15rem; resize:vertical; }
  textarea:focus { outline:none; border-bottom-color:var(--ink); }
  textarea::placeholder { color:var(--ink-40); }
  .row { display:flex; gap:1.6rem; align-items:baseline; flex-wrap:wrap; margin-top:1rem; }
  button { padding:.4rem 0; border:0; background:transparent; color:var(--ink); font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.1rem; cursor:pointer; }
  button::before { content:"[ "; color:var(--ink-40); } button::after { content:" ]"; color:var(--ink-40); }
  button:hover::before { content:"[ → "; }
  button:disabled { opacity:.45; cursor:default; }
  .count { font-size:.82rem; color:var(--muted); }
  .ex { margin-top:2rem; font-size:.95rem; }
  .ex span { display:block; font-size:.78rem; letter-spacing:.16em; text-transform:uppercase; opacity:.55; margin-bottom:.4rem; }
  .ex a { display:inline-block; margin:0 0 .4rem; margin-inline-end:1.2rem; font-style:italic; text-decoration:none; border-bottom:1px dotted var(--ink-40); }
  .ex a:hover { border-bottom-style:solid; }
  .hist { margin-top:2.4rem; font-size:.95rem; }
  .hist .lab { display:block; font-size:.78rem; letter-spacing:.16em; text-transform:uppercase; opacity:.55; margin-bottom:.5rem; }
  .hist .lab em { text-transform:none; letter-spacing:0; font-style:italic; }
  .hist ol { list-style:none; padding:0; margin:0; }
  .hist li { display:flex; gap:.9rem; align-items:baseline; padding:.35rem 0; border-bottom:1px dotted var(--ink-15); }
  .hist li a { text-decoration:none; flex:1; } .hist li a:hover { text-decoration:underline; }
  .hist li .m { font-size:.72rem; letter-spacing:.12em; text-transform:uppercase; opacity:.5; white-space:nowrap; }
  .hist .clr { display:inline-block; margin-top:.6rem; font-size:.82rem; color:var(--muted); }
  #wait { display:none; margin-top:2.6rem; border:1.5px solid var(--ink); padding:1.4rem 1.6rem 1.2rem; }
  #wait .wt { display:flex; align-items:baseline; gap:.8rem; font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; }
  [dir="rtl"] #wait .wt { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  #wait .dot { display:inline-block; width:.5em; height:.5em; background:var(--ink); border-radius:50%; animation:pulse 1.2s ease-in-out infinite; flex:none; align-self:center; }
  #wait .sec { margin-inline-start:auto; font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:400; font-size:.85rem; color:var(--muted); font-variant-numeric:tabular-nums; direction:ltr; }
  #wait .wbar { height:3px; background:var(--ink-15); margin:.9rem 0 .8rem; overflow:hidden; }
  #wait .wbar i { display:block; height:100%; width:0; background:var(--ink); }
  #wait.on .wbar i { animation:wgrow 80s cubic-bezier(.25,.6,.45,1) forwards; }
  @keyframes wgrow { from { width:0 } to { width:94% } }
  #wait .wnote { font-size:.9rem; color:var(--muted); max-width:44rem; margin:0; }
  .suite { margin-top:2rem; border-top:1px dotted var(--ink-40); padding-top:1.2rem; }
  .suite .lab { display:block; font-size:.78rem; letter-spacing:.16em; text-transform:uppercase; opacity:.55; margin-bottom:.2rem; }
  .suite textarea { min-height:70px; }
  @keyframes pulse { 0%,100% { opacity:.25 } 50% { opacity:1 } }
  #out { display:none; margin-top:2.6rem; border-top:2px solid var(--ink); padding-top:1.4rem; }
  #out h2 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; margin:1.6rem 0 .5rem; }
  #out h3 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.05rem; margin:1.2rem 0 .3rem; }
  #out p { margin:.6rem 0; } #out ul, #out ol { padding-inline-start:1.3rem; margin:.5rem 0; } #out li { margin:.25rem 0; }
  #out blockquote { border-inline-start:2px solid var(--ink); padding-inline-start:1rem; margin:.8rem 0; opacity:.9; }
  #out .he { direction:rtl; font-size:1.15em; }
  #out code { border-bottom:1px dotted var(--ink-40); font-family:ui-monospace, Menlo, monospace; font-size:.9em; }
  .srcs { margin-top:1.6rem; font-size:.9rem; }
  .srcs a { margin-inline-end:1rem; }
  .disc { margin-top:2rem; font-size:.82rem; color:var(--muted); max-width:44rem; }
  .err { color:#7a1f1f; margin-top:1.4rem; }
  .again { margin-top:1.4rem; }
  .acts { margin-top:1.6rem; display:flex; gap:1.6rem; flex-wrap:wrap; align-items:baseline; font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.05rem; }
  .acts a { text-decoration:none; } .acts a::before { content:"[ "; color:var(--ink-40); } .acts a::after { content:" ]"; color:var(--ink-40); } .acts a:hover::before { content:"[ → "; }
  .acts .fb { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:400; font-size:.85rem; font-style:italic; color:var(--muted); min-height:1em; }
  footer { margin-top:4rem; font-size:.88rem; color:var(--muted); border-top:1px solid var(--ink-15); padding-top:1.4rem; }
  /* Hébreu (RTL) : titres en Frank Ruhl Libre, flèches vers la gauche */
  [dir="rtl"] h1, [dir="rtl"] .step .t, [dir="rtl"] .modes .h, [dir="rtl"] button, [dir="rtl"] .acts, [dir="rtl"] #out h2, [dir="rtl"] #out h3 { font-family:"Frank Ruhl Libre", Georgia, serif; }
  [dir="rtl"] h1 { letter-spacing:0; }
  [dir="rtl"] button:hover::before, [dir="rtl"] .acts a:hover::before { content:"[ ← "; }
  [dir="rtl"] .modes label:hover svg { transform:rotate(4deg) translateY(-2px); }
  [dir="rtl"] .srcs a, [dir="rtl"] #out code { unicode-bidi:isolate; }
  @media (max-width:720px) { h1 { margin-top:2rem; } .step { flex-wrap:wrap; } .step .s { display:none; } }
</style>
</head>
<body>
<main>
  <nav>
    <a class="wm" href="${href(lang, "/")}" dir="ltr"><b>Mamash</b>&nbsp;IA</a>
    <span class="r"><a href="${href(lang, "/outils")}">${s.navTools}</a><a href="${href(lang, "/daf")}">${s.navDaf}</a><a href="${href(lang, "/install")}"><strong>${s.navInstall}</strong></a>${langSwitcher(lang, PATH)}</span>
  </nav>

  <h1>${s.h1}</h1>
  <p class="muted">${s.lead}</p>

  <form id="f" autocomplete="off">
    <div class="step"><span class="n">1</span><span class="t">${s.step1}</span><span class="rule"></span><span class="s">${s.step1s}</span></div>
    <div class="modes" role="radiogroup" aria-label="${attr(s.ariaLevel)}">
      ${MODES.map((m) => modeLabel(m, s.modes[m], m === "debutant")).join("\n      ")}
    </div>
    <div class="modehelp" id="mh"></div>
    <div class="step"><span class="n">2</span><span class="t">${s.step2}</span><span class="rule"></span></div>
    <textarea id="q" maxlength="600" placeholder="${attr(s.placeholder)}" required></textarea>
    <input type="text" name="site" tabindex="-1" autocomplete="off" style="position:absolute;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none" aria-hidden="true">
    <div class="row">
      <button type="submit" id="go">${s.go}</button>
      <span class="count" id="cnt" dir="ltr">0 / 600</span>
    </div>
  </form>

  <div class="ex" id="ex">
    <span>${s.exLab}</span>
    ${s.ex.map((e) => `<a href="#" data-q="${attr(e.q)}">${e.label}</a>`).join("\n    ")}
  </div>

  <div class="hist" id="hist" hidden>
    <span class="lab">${s.histLab} <em>${s.histNote}</em></span>
    <ol id="hl"></ol>
    <a href="#" class="clr" id="hclr">${s.hclr}</a>
  </div>

  <div id="wait" role="status"><div class="wt"><span class="dot"></span><span id="wtxt">${s.steps[0]}</span><span class="sec" id="wsec"></span></div><div class="wbar"><i></i></div><p class="wnote">${s.waitNote}</p></div>
  <div class="err" id="err"></div>

  <section id="out" aria-live="polite">
    <div id="ans"></div>
    <div class="srcs" id="srcs"></div>
    <div class="acts"><a href="#" id="copy">${s.copy}</a><a href="#" id="share">${s.share}</a><span class="fb" id="fb"></span></div>
    <div class="suite">
      <span class="lab">${s.suiteLab}</span>
      <textarea id="sq" maxlength="600" placeholder="${attr(s.suitePh)}"></textarea>
      <div class="row"><button type="button" id="sgo">${s.suiteGo}</button><span class="count" id="scnt">0 / 600</span></div>
    </div>
    <p class="disc">${s.disc}</p>
    <p class="again"><a href="#" id="again">${s.again}</a> · <a href="${href(lang, "/install")}">${s.againInstall}</a></p>
  </section>

  <footer><p><a href="${href(lang, "/")}">${s.footHome}</a> · <a href="${href(lang, "/outils")}">${s.navTools}</a> · <a href="${href(lang, "/privacy")}">${s.footPrivacy}</a> · ${langSwitcher(lang, PATH)}</p><p>${colophon(lang)}</p></footer>
</main>
<script>
(function () {
  var S = ${jsObject(S)};
  var HELP = S.help;
  var f = document.getElementById("f"), q = document.getElementById("q"), go = document.getElementById("go");
  var wait = document.getElementById("wait"), wtxt = document.getElementById("wtxt"), err = document.getElementById("err");
  var out = document.getElementById("out"), ans = document.getElementById("ans"), srcs = document.getElementById("srcs");
  var mh = document.getElementById("mh"), cnt = document.getElementById("cnt");
  var radios = f.querySelectorAll('input[name=mode]');
  var saved = null; try { saved = localStorage.getItem("tm_mode"); } catch (e) {}
  radios.forEach(function (r) {
    if (saved && r.value === saved) r.checked = true;
    r.addEventListener("change", function () { mh.textContent = HELP[r.value]; try { localStorage.setItem("tm_mode", r.value); } catch (e) {} });
  });
  mh.textContent = HELP[mode()];
  function mode() { var c = f.querySelector('input[name=mode]:checked'); return c ? c.value : "debutant"; }
  q.addEventListener("input", function () { cnt.textContent = q.value.length + " / 600"; });
  document.querySelectorAll("#ex a").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); q.value = a.getAttribute("data-q"); cnt.textContent = q.value.length + " / 600"; q.focus(); });
  });
  document.getElementById("again").addEventListener("click", function (e) { e.preventDefault(); out.style.display = "none"; q.value = ""; cnt.textContent = "0 / 600"; q.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); });

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function inline(s) {
    s = esc(s);
    s = s.replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^\\*])\\*([^\\*]+?)\\*/g, "$1<em>$2</em>");
    s = s.replace(/\\x60([^\\x60]+?)\\x60/g, "<code>$1</code>");
    s = s.replace(/\\[([^\\]]+?)\\]\\((https?:[^\\s)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/(^|[\\s(])(https?:\\/\\/[^\\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    return s;
  }
  function md(src) {
    var lines = src.split(/\\r?\\n/), html = "", list = null, para = [];
    function flushP() { if (para.length) { var t = para.join(" "); var he = /^[\\u0590-\\u05FF\\s\\u05BE\\u05C0-\\u05C7"'\\-,.:;()]+$/.test(t.replace(/<[^>]+>/g, "")); html += '<p' + (he ? ' class="he"' : '') + '>' + inline(t) + '</p>'; para = []; } }
    function flushL() { if (list) { html += "</" + list + ">"; list = null; } }
    lines.forEach(function (l) {
      var m;
      if ((m = l.match(/^\\s*(#{1,3})\\s+(.*)$/))) { flushP(); flushL(); var lv = m[1].length === 1 ? 2 : m[1].length; html += "<h" + lv + ">" + inline(m[2]) + "</h" + lv + ">"; return; }
      if ((m = l.match(/^\\s*[-*•]\\s+(.*)$/))) { flushP(); if (list !== "ul") { flushL(); list = "ul"; html += "<ul>"; } html += "<li>" + inline(m[1]) + "</li>"; return; }
      if ((m = l.match(/^\\s*\\d+[.)]\\s+(.*)$/))) { flushP(); if (list !== "ol") { flushL(); list = "ol"; html += "<ol>"; } html += "<li>" + inline(m[1]) + "</li>"; return; }
      if ((m = l.match(/^\\s*>\\s?(.*)$/))) { flushP(); flushL(); html += "<blockquote>" + inline(m[1]) + "</blockquote>"; return; }
      if (!l.trim()) { flushP(); flushL(); return; }
      flushL(); para.push(l.trim());
    });
    flushP(); flushL();
    return html;
  }

  /* ---- Affichage d'une réponse (fraîche ou rouverte depuis l'historique) ---- */
  var cur = null; // { q, mode, reponse, sources, t, lang }
  function show(entry) {
    cur = entry;
    ans.innerHTML = md(entry.reponse || "");
    srcs.innerHTML = (entry.sources && entry.sources.length) ? "<strong>" + esc(S.read) + "</strong> " + entry.sources.map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.ref) + '</a>'; }).join("") : "";
    fb.textContent = "";
    out.style.display = "block";
    out.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---- Copier / partager ---- */
  var fb = document.getElementById("fb");
  function plain(src) {
    return String(src)
      .replace(/^\\s*#{1,3}\\s+/gm, "").replace(/^\\s*>\\s?/gm, "  ")
      .replace(/\\*\\*(.+?)\\*\\*/g, "$1").replace(/(^|[^\\*])\\*([^\\*]+?)\\*/g, "$1$2").replace(/\\x60/g, "")
      .replace(/\\[([^\\]]+?)\\]\\((https?:[^\\s)]+)\\)/g, "$1 ($2)").trim();
  }
  function lien(entry) { return location.origin + S.prefix + "?q=" + encodeURIComponent(entry.q) + "&mode=" + encodeURIComponent(entry.mode); }
  function texte(entry) {
    var t = S.qLabel + entry.q + "\\n\\n" + plain(entry.reponse);
    if (entry.sources && entry.sources.length) t += "\\n\\n" + S.read + " " + entry.sources.map(function (s) { return s.ref + " — " + s.url; }).join(" · ");
    return t + "\\n\\n" + S.sig + lien(entry);
  }
  function feedback(msg) { fb.textContent = msg; setTimeout(function () { if (fb.textContent === msg) fb.textContent = ""; }, 2500); }
  function copier(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) { var ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); } document.body.removeChild(ta); });
  }
  document.getElementById("copy").addEventListener("click", function (e) {
    e.preventDefault(); if (!cur) return;
    copier(texte(cur)).then(function () { feedback(S.copied); }, function () { feedback(S.copyFail); });
  });
  document.getElementById("share").addEventListener("click", function (e) {
    e.preventDefault(); if (!cur) return;
    var t = texte(cur);
    if (navigator.share) {
      navigator.share({ title: "Mamash IA — " + cur.q, text: t }).then(function () { feedback(S.shared); }, function (er) { if (!er || er.name !== "AbortError") feedback(S.shareCancel); });
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(t.length > 3500 ? t.slice(0, 3400) + "…\\n\\n" + S.readMore + lien(cur) : t), "_blank", "noopener");
    }
  });

  /* ---- Historique local (cet appareil seulement) ---- */
  var HKEY = "tm_hist", HMAX = 30;
  var hist = document.getElementById("hist"), hl = document.getElementById("hl");
  function lireHist() { try { var v = JSON.parse(localStorage.getItem(HKEY) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function ecrireHist(h) { try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch (e) {} }
  var NIV = S.niv;
  function dateCourte(t) { var d = new Date(t); return d.toLocaleDateString(S.locale, { day: "numeric", month: "short" }); }
  function rendreHist() {
    var h = lireHist();
    if (!h.length) { hist.hidden = true; return; }
    hl.innerHTML = h.map(function (en, i) { return '<li><a href="#" data-i="' + i + '">' + esc(en.q) + '</a><span class="m">' + esc(NIV[en.mode] || en.mode) + " · " + esc(dateCourte(en.t)) + "</span></li>"; }).join("");
    hist.hidden = false;
  }
  hl.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-i]"); if (!a) return; e.preventDefault();
    var en = lireHist()[Number(a.getAttribute("data-i"))]; if (!en) return;
    q.value = en.q; cnt.textContent = en.q.length + " / 600"; err.textContent = "";
    show(en);
  });
  document.getElementById("hclr").addEventListener("click", function (e) { e.preventDefault(); ecrireHist([]); rendreHist(); });
  function ajouterHist(entry) {
    var h = lireHist().filter(function (en) { return !(en.q === entry.q && en.mode === entry.mode); });
    h.unshift(entry); ecrireHist(h.slice(0, HMAX)); rendreHist();
  }
  rendreHist();

  /* ---- Préremplissage depuis un lien partagé (/question?q=…&mode=…) ---- */
  try {
    var sp = new URLSearchParams(location.search);
    if (sp.get("q")) { q.value = sp.get("q").slice(0, 600); cnt.textContent = q.value.length + " / 600"; }
    if (sp.get("mode") && HELP[sp.get("mode")]) { radios.forEach(function (r) { r.checked = r.value === sp.get("mode"); }); mh.textContent = HELP[sp.get("mode")]; }
  } catch (e) {}

  /* ---- Message d'erreur : le serveur parle français ; ailleurs on traduit d'après la cause ---- */
  function messageErreur(d) {
    if (S.lang === "fr") return d.error || S.err;
    var c = String(d.cause || ""); if (/^api_5\\d\\d$/.test(c)) c = "api_5xx";
    return S.errCause[c] || S.errGeneric;
  }

  var steps = S.steps;
  var sq = document.getElementById("sq"), sgo = document.getElementById("sgo"), scnt = document.getElementById("scnt");
  var wsec = document.getElementById("wsec");

  function demander(question, m, precedent) {
    err.textContent = ""; out.style.display = "none";
    wait.style.display = "block"; wait.classList.remove("on");
    void wait.offsetWidth; wait.classList.add("on");
    go.disabled = true; sgo.disabled = true;
    go.textContent = S.btnWait;
    var i = 0; wtxt.textContent = steps[0];
    var t0 = Date.now(); wsec.textContent = "0 s";
    var tick = setInterval(function () {
      var sec = Math.round((Date.now() - t0) / 1000);
      wsec.textContent = sec + " s";
      var j = Math.min(Math.floor(sec / 8), steps.length - 1);
      if (j !== i) { i = j; wtxt.textContent = steps[i]; }
    }, 1000);
    wait.scrollIntoView({ behavior: "smooth", block: "center" });
    function fin() { clearInterval(tick); wait.style.display = "none"; go.disabled = false; sgo.disabled = false; go.textContent = S.go; }
    var corps = { question: question, mode: m, lang: S.lang };
    if (precedent) corps.precedent = precedent;
    fetch("/api/question", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corps) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        fin();
        if (!x.ok || x.d.error) { err.textContent = messageErreur(x.d || {}); return; }
        var entry = { q: question, mode: m, reponse: x.d.reponse || "", sources: x.d.sources || [], t: Date.now(), lang: S.lang };
        ajouterHist(entry);
        show(entry);
        sq.value = ""; scnt.textContent = "0 / 600";
      })
      .catch(function () { fin(); err.textContent = S.errNet; });
  }

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var question = q.value.trim(); if (!question) return;
    demander(question, mode(), null);
  });

  /* ---- La question de suite : s'appuie sur la réponse affichée ---- */
  sq.addEventListener("input", function () { scnt.textContent = sq.value.length + " / 600"; });
  sq.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sgo.click(); } });
  sgo.addEventListener("click", function () {
    var question = sq.value.trim(); if (!question || !cur) return;
    demander(question, mode(), { question: cur.q, reponse: cur.reponse });
  });
})();
</script>
</body>
</html>`;
}

/** Compatibilité : la page française, sous l'ancien nom. */
export const QUESTION_HTML = questionHtml("fr");
