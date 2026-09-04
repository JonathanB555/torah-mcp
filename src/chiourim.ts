/**
 * /chiourim — les cours en vidéo du rav Meir Attal (chaîne YouTube publique),
 * intégrés au site : le dernier chiour à jour tout seul (flux RSS de la chaîne,
 * cache edge 1 h), le catalogue classé par thèmes, lecture au clic seulement
 * (youtube-nocookie — aucun cookie ni lecteur chargé avant le clic).
 *
 * Le catalogue est figé au build (doublons de ré-upload retirés, classement
 * par mots-clés des titres) ; les vidéos publiées depuis apparaissent via le
 * RSS en tête de page — la page vit donc seule, sans maintenance.
 */

import type { Env } from "./sefaria";
import { type Lang, altLinks, htmlAttrs, href, langSwitcher, colophon, t } from "./i18n";

const CHANNEL_ID = "UCtqyBROvt1svSBieQqDAUBA";
const CHANNEL_URL = "https://www.youtube.com/@meirattal6523";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

type Groupe = "fetes" | "torah" | "emouna" | "moussar" | "courts";
interface Video { id: string; d: number; g: Groupe; t: string }

/** Catalogue au 04.09.2026 — 97 vidéos uniques (yt-dlp, doublons retirés). */
const CATALOGUE: Video[] = [
  { id: "wvvWlilgQeI", d: 1786, g: "fetes", t: "En route vers Rosh Hashana : Le véritable secret pour être écouté de Dieu" },
  { id: "MuspjCHLnLk", d: 1913, g: "fetes", t: "Le secret de la justice : Comment transformer la rigueur en miséricorde pour Roch Hachana ?" },
  { id: "bKsBw9Mfzeo", d: 1910, g: "fetes", t: "Briser le fer pour construire l'amour : Le secret bouleversant du 15 Av ❤️🔥" },
  { id: "CYOwkZu7EWo", d: 1858, g: "moussar", t: "La parole : notre plus grande force de construction... ou de destruction." },
  { id: "iiiSBh89hKM", d: 1846, g: "emouna", t: "Les non-Juifs ont-ils une place et vivront-ils dans le monde futur ?" },
  { id: "M8TaKDzBCoQ", d: 1619, g: "moussar", t: "Réactivité vs Patience : Le secret des grands leaders" },
  { id: "upBEmogM2rk", d: 1801, g: "moussar", t: "pourquoi la Torah préfère-t-elle les tombes (pèlerinier les Justes) aux festins de joie ? 🤯❌" },
  { id: "En-DzUg4VFc", d: 1781, g: "moussar", t: "Porsche au garage, frigo vide : Le piège du regard des autre" },
  { id: "RexbIBDB6fk", d: 1708, g: "moussar", t: "La faillite de notre société : quand les belles intentions font naufrage" },
  { id: "2YaAYsFbg18", d: 2048, g: "moussar", t: "Pourquoi notre monde est devenu une immense comédie ? (La vérité sans filtre) 🤫" },
  { id: "zeZmBwVWq6E", d: 1669, g: "emouna", t: "Pourquoi l'antisémitisme n'a rien de rationnel" },
  { id: "BPAz1bAuLLQ", d: 1851, g: "torah", t: "😈 Pourquoi les démons… et la première pince ont-ils été créés juste avant Chabbat ?" },
  { id: "hmCiAmXjZ9c", d: 1822, g: "emouna", t: "Chacun a sa part dans le monde futur" },
  { id: "tqADhR5TBMg", d: 1798, g: "torah", t: "Savez-vous que votre corps est une Torah vivante" },
  { id: "MK-u4IF0kXc", d: 2055, g: "moussar", t: "Regret vs Culpabilite : comprendre la difference" },
  { id: "Zo86F_xnkgw", d: 1897, g: "moussar", t: "🎓 COMMENT PROTÉGER NOS ENFANTS DES MAUVAISES INFLUENCES ? 🛡️" },
  { id: "W6l8Un6J7gc", d: 1826, g: "moussar", t: "Arrêtez de \"Sentir\", Commencez à \"Être\":" },
  { id: "chTg8VcdIp4", d: 1841, g: "emouna", t: "L'Intelligence ou le Cœur : Pourquoi Dieu nous a - t - il vraiment créés ?" },
  { id: "NdOavyqsC08", d: 1864, g: "moussar", t: "On te ment sur ta valeur." },
  { id: "FqB5mLIEa_I", d: 1814, g: "moussar", t: "Apprendre à demander… pour être entendu" },
  { id: "GGw1jc_yuL0", d: 1832, g: "moussar", t: "Construire son Sanctuaire" },
  { id: "__4l90aS5Qo", d: 1829, g: "fetes", t: "Des larmes de la neïla au miracle de la guérison" },
  { id: "derj7jyYWJg", d: 1842, g: "torah", t: "Le secret du Roi Salomon pour vaincre l'angoisse." },
  { id: "AT0-ETaYPDY", d: 1754, g: "fetes", t: "De l'Étroitesse à l'Infinie Lumière : Le Message du 19 Kislev" },
  { id: "SaNawjhBwWc", d: 1330, g: "torah", t: "Le Vrai Secret de la Bar Mitzvah :" },
  { id: "tUJxhwzgdck", d: 1715, g: "moussar", t: "Tu as l'impression de perdre ton temps au travail ? Écoute ça." },
  { id: "RUglPuj4uVM", d: 1699, g: "torah", t: "Avraham Avinou – Le Don de Soi" },
  { id: "T1t0of-RM4I", d: 1101, g: "moussar", t: "Pourquoi l’interdit attire-t-il autant ?" },
  { id: "BjE49y9VFpc", d: 213, g: "courts", t: "Le fléau du regard RabbiAkiva#MauvaisOeil#AyinHara#TorahTime#HistoireJuive#" },
  { id: "9exaw872DPo", d: 1330, g: "emouna", t: "“Dieu ne punit pas, Il révèle les effets de nos choix.”" },
  { id: "Ah0iaPC4uPM", d: 225, g: "courts", t: "Pessah / éducation" },
  { id: "lkTy0iHu19E", d: 1673, g: "torah", t: "Chacun a sa place dans la construction du Michkan" },
  { id: "PVYkA8U7HtQ", d: 1703, g: "moussar", t: "\"Briser les Limites : La Puissance de la Certitude et de la Joie\"" },
  { id: "qHHsQHGOJCw", d: 257, g: "courts", t: "changer de regard" },
  { id: "MhWdC9MTHGo", d: 1797, g: "emouna", t: "Croire en Dieu vs. Lui Faire Confiance : La Différence Qui Change Tout !" },
  { id: "QvPdgcD9YVU", d: 1797, g: "moussar", t: "Croire en D.ieu et avoir confiance en D.ieu : Quelle différence ?" },
  { id: "Qi4nXObN47k", d: 1740, g: "moussar", t: "L’Empathie et la Bienveillance : La Clé d’une Vie Remplie de Sens selon la Torah”" },
  { id: "B3u9jJH8lJo", d: 326, g: "courts", t: "\"Peut-on passer à côté de sa destinée ?\"partie deux." },
  { id: "oVycPpSN5mg", d: 138, g: "courts", t: "Le Secret du Nom – La Force Cachée de Votre Identité" },
  { id: "vImMw-8d2Ws", d: 197, g: "courts", t: "\"Peut-on passer à côté de sa destinée ?\"" },
  { id: "V35f1Ry0Ixk", d: 1784, g: "moussar", t: "Peut-on passer à côté de notre destinée ?" },
  { id: "GAxcuU76bdc", d: 1641, g: "moussar", t: "“L’importance d’agir à temps selon la Torah”" },
  { id: "eBxNmd1q2uQ", d: 1947, g: "moussar", t: "“Construire une famille unie dans un monde divisé”" },
  { id: "d7K6PJdecOc", d: 1749, g: "moussar", t: "La Torah face aux revendications féministes modernes." },
  { id: "O_dzehR9gCs", d: 1576, g: "emouna", t: "\"Le Tanya : une source de guérison pour l'âme ?\"" },
  { id: "h2GZ3U_uUoM", d: 1613, g: "emouna", t: "Rambam et Baal Shem : visions divergentes sur la Providence divine." },
  { id: "YKcHBBdnpVs", d: 1697, g: "torah", t: "Comment Jacob a-t-il pu se marier avec deux sœurs ?”" },
  { id: "8Vj_iV2LOPU", d: 1433, g: "emouna", t: "Tanya cours un: introduction" },
  { id: "PKrIl6g7CNo", d: 415, g: "courts", t: "Le véritable succès demande de l'effort" },
  { id: "M06I1dIpWPo", d: 1584, g: "moussar", t: "Le véritable succès demande l'effort" },
  { id: "oduIPkgUZUk", d: 1950, g: "emouna", t: "Pourquoi faire ce que Dieu nous demande est si difficile" },
  { id: "f3Qo25qxIQ4", d: 1950, g: "moussar", t: "Il n'y a rien de plus important que de faire du bien." },
  { id: "uoXUDdYo--Y", d: 1749, g: "fetes", t: "\"La Clé pour que D. exauce nos Demandes à Roch Hachana\"" },
  { id: "HbosIe5phF4", d: 1581, g: "moussar", t: "\"Le Nouveau Départ : êtes-vous vraiment prêt ?\"" },
  { id: "8NvxANeiK3w", d: 2051, g: "moussar", t: "\"Bien-être de l’Âme, Santé du Corps\"" },
  { id: "eePQUX4irEY", d: 1864, g: "moussar", t: "La place des soldats dans la Torah et la valeur des soldats morts au combat." },
  { id: "NvhnEzUHjWk", d: 1653, g: "moussar", t: "\"L'importance de respecter son corps.\"" },
  { id: "kwN3O1pgXpQ", d: 1653, g: "torah", t: "Pourquoi la Mort du Grand Prêtre Pardonne-t-elle les Tueurs Involontaires ?\"" },
  { id: "FibiJpXIJZI", d: 1616, g: "torah", t: "\"Pourquoi suspendre la mort du grand prêtre pour libérer le meurtrier ?\"P\" vaethanan" },
  { id: "rlKCt8IpScw", d: 2713, g: "torah", t: "\"Pourquoi appelle-t-on le Temple de Jérusalem 'le coup'" },
  { id: "fVVWv_5luZs", d: 1950, g: "moussar", t: "Pourquoi beaucoup de justes ne réussissent pas sur le plan matériel ?" },
  { id: "gSegz4WCv90", d: 1820, g: "moussar", t: "Comment profiter, vraiment, de nos vacances ?" },
  { id: "mbn07L-mLfc", d: 2263, g: "moussar", t: "La force de savoir reconnaitre ses tords" },
  { id: "-au4xNSGEA0", d: 1919, g: "moussar", t: "La paix, plus importante que la vérité" },
  { id: "UbehGFPIfOw", d: 1682, g: "fetes", t: "Hiloula du Rabbi - 3 tamouz" },
  { id: "-9wrwzlMaGM", d: 1667, g: "moussar", t: "Les étapes pour réussir votre Aliya" },
  { id: "IiqyvoM9SRs", d: 151, g: "courts", t: "Ma vidédis-moi avec qui tu traînes je te dirai qui tu es" },
  { id: "At04-xQcy1I", d: 1661, g: "moussar", t: "la Segoula de cette semaine" },
  { id: "azP6YQuDBQg", d: 274, g: "courts", t: "Importance de la Hiloula du Rabbi de loubavitche" },
  { id: "d712GNhF-pk", d: 1548, g: "moussar", t: "\"La Torah : Source de Paix et Sérénité\"" },
  { id: "BGbOv0UzxmI", d: 1673, g: "torah", t: "La Sentence de Mort pour une Génération Rebelle" },
  { id: "tHB4WZQqVUU", d: 1621, g: "moussar", t: "D.IEU Voit tous nos Efforts" },
  { id: "MIWGF1Wkq_M", d: 2032, g: "moussar", t: "L'Impact des Relations : Grandir ou Détruire" },
  { id: "mqHN0nBa6K4", d: 1956, g: "moussar", t: "Amour et Respect : Comprendre et Différencier ces Deux Piliers des Relations Humaines\"" },
  { id: "mC7GqEd-y6A", d: 1810, g: "emouna", t: "\"Ouvrir les Yeux sur la Rédemption\"" },
  { id: "29LEXqj-O1E", d: 1672, g: "emouna", t: "\"Lueur d'espoir : La Quête de la Rédemption\"" },
  { id: "wvuDxrUFYFk", d: 2266, g: "moussar", t: "\"Libérez-vous du poids de la culpabilité" },
  { id: "TiJUe04zGV0", d: 2266, g: "moussar", t: "Est-ce que je vis la vie qui m'était destinée ?" },
  { id: "EF4A-AQ7cYM", d: 2773, g: "moussar", t: "D', est-Il toujours dans ma vie ?" },
  { id: "uEx0XSo2-R4", d: 2212, g: "fetes", t: "Le sens de la consommation d'alcool pendant Pourim" },
  { id: "n3GFulGRXKk", d: 1797, g: "moussar", t: "La droiture: un fondement qui permet l'équilibre" },
  { id: "Kekl2xOVHBM", d: 1625, g: "moussar", t: "La tristesse nous abat alors que la joie nous rends imbattable" },
  { id: "3Gz_6g_4_tM", d: 1801, g: "moussar", t: "Le don de soi" },
  { id: "kY_Slmu0858", d: 1692, g: "moussar", t: "L'importance de l'attachement au tsadik" },
  { id: "b3CUSkHZTQQ", d: 1871, g: "moussar", t: "Les petits gestes du quotidien" },
  { id: "yNZbRx8WOTY", d: 1885, g: "moussar", t: "Education : Entre discipline et développement de l'enfant" },
  { id: "mtbGAZ_wNEc", d: 1801, g: "moussar", t: "Comment développer son bien-être ?" },
  { id: "yStk-Z6SmvY", d: 1895, g: "moussar", t: "La paix est plus importante que la vérité" },
  { id: "Gh0OFLHuDdU", d: 683, g: "fetes", t: "Hanouka, résister par la lumière" },
  { id: "mDJNIwcVTYI", d: 1770, g: "moussar", t: "ÂME & CORPS, Mieux se Comprendre 😊" },
  { id: "gozlcciryV0", d: 1138, g: "moussar", t: "Action OU Etude :Que faut il choisir ?" },
  { id: "gILKxa8qNLk", d: 721, g: "emouna", t: "(L'instinct animal) tanya chapitre 1 partie 4" },
  { id: "qxW5vd_iieM", d: 547, g: "courts", t: "tanya chapitre 1 partie 3 quell est la particularite du tsadik" },
  { id: "hn5w4WiQTiE", d: 530, g: "courts", t: "tanya chapitre 1 partie 2 \" La definition du Benoni , ce que D.... attend de nous\"" },
  { id: "tKf6RTVTvz8", d: 497, g: "courts", t: "Cours TANYA, chapitre 1 première partie." },
  { id: "vdSMDECuJJc", d: 746, g: "moussar", t: "L'importance de garder une maison pure" },
  { id: "rn65VE19i2o", d: 291, g: "courts", t: "Un Roi Parfait / Hommage aux Victimes d'Hypercacher musique juive" },
];

const GROUPES: readonly Groupe[] = ["fetes", "torah", "emouna", "moussar", "courts"];

const T = {
  fr: {
    title: "Chiourim — Mamash IA",
    desc: "Les chiourim en vidéo du rav Meir Attal : moussar, émouna, fêtes — en français. Le dernier cours et le catalogue par thèmes.",
    h1: "Les <strong>chiourim</strong> du rav Attal.",
    lead: "Les cours du rav Meir Attal, en français — du moussar enraciné dans les textes, une trentaine de minutes chacun. Rien ne se charge depuis YouTube avant que vous cliquiez ; la vidéo se lance alors sans cookies.",
    dernier: "Le dernier chiour",
    nouveaux: "Les plus récents",
    groupes: { fetes: "Les fêtes et le calendrier", torah: "Figures et textes", emouna: "Émouna et pensée juive", moussar: "Moussar et vie intérieure", courts: "Formats courts" } as Record<Groupe, string>,
    lire: "lire",
    min: "min",
    chaine: "Toute la chaîne sur YouTube",
    note: "Les vidéos sont hébergées par YouTube (lecture via youtube-nocookie.com, sans cookies avant le clic) — voir la",
    notePrivacy: "page confidentialité",
    nav: { question: "Une question", daf: "Le daf", outils: "Outils", install: "Installer le MCP" },
    foot: { accueil: "Accueil", daily: "Limoud du jour", privacy: "Confidentialité" },
  },
  en: {
    title: "Video shiurim — Mamash IA",
    desc: "Rav Meir Attal's video shiurim: mussar, emunah, festivals — in French. The latest class and the catalogue by theme.",
    h1: "Rav Attal's <strong>shiurim</strong>.",
    lead: "Rav Meir Attal's classes, in French — mussar rooted in the texts, about thirty minutes each. Nothing loads from YouTube until you click; the video then plays without cookies.",
    dernier: "The latest shiur",
    nouveaux: "Most recent",
    groupes: { fetes: "Festivals and the calendar", torah: "Figures and texts", emouna: "Emunah and Jewish thought", moussar: "Mussar and inner life", courts: "Short clips" } as Record<Groupe, string>,
    lire: "play",
    min: "min",
    chaine: "The full channel on YouTube",
    note: "Videos are hosted by YouTube (played via youtube-nocookie.com, no cookies before you click) — see the",
    notePrivacy: "privacy page",
    nav: { question: "Ask a question", daf: "The daf", outils: "Tools", install: "Install the MCP" },
    foot: { accueil: "Home", daily: "Today's learning", privacy: "Privacy" },
  },
  he: {
    title: "שיעורים בווידאו — Mamash IA",
    desc: "השיעורים של הרב מאיר אטל: מוסר, אמונה, חגים — בצרפתית. השיעור האחרון והקטלוג לפי נושאים.",
    h1: "השיעורים של <strong>הרב אטל</strong>.",
    lead: "שיעוריו של הרב מאיר אטל, בצרפתית — מוסר מושרש בטקסטים, כחצי שעה כל אחד. שום דבר לא נטען מיוטיוב לפני הלחיצה; הווידאו מתנגן אז ללא עוגיות.",
    dernier: "השיעור האחרון",
    nouveaux: "החדשים ביותר",
    groupes: { fetes: "חגים ולוח השנה", torah: "דמויות וטקסטים", emouna: "אמונה ומחשבה יהודית", moussar: "מוסר ועבודת המידות", courts: "קטעים קצרים" } as Record<Groupe, string>,
    lire: "נגן",
    min: "דק'",
    chaine: "הערוץ המלא ביוטיוב",
    note: "הסרטונים מתארחים ביוטיוב (ניגון דרך youtube-nocookie.com, ללא עוגיות לפני הלחיצה) — ראו את",
    notePrivacy: "עמוד הפרטיות",
    nav: { question: "שאלה", daf: "הדף", outils: "כלים", install: "התקנת ה-MCP" },
    foot: { accueil: "עמוד הבית", daily: "הלימוד היומי", privacy: "פרטיות" },
  },
} as const;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const mins = (d: number) => (d ? Math.round(d / 60) : 0);

interface RssEntry { id: string; t: string; date: string }

async function fluxRecent(): Promise<RssEntry[]> {
  try {
    const resp = await fetch(RSS_URL, {
      headers: { "User-Agent": "torah-mcp/1.10 (+https://mamash-ia.com)" },
      cf: { cacheTtl: 3600, cacheEverything: true },
    } as RequestInit);
    if (!resp.ok) return [];
    const xml = await resp.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    return entries
      .map((m) => ({
        id: m[1].match(/<yt:videoId>([^<]*)<\/yt:videoId>/)?.[1] || "",
        t: (m[1].match(/<media:title>([^<]*)<\/media:title>/)?.[1] || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        date: m[1].match(/<published>([^<]*)<\/published>/)?.[1]?.slice(0, 10) || "",
      }))
      .filter((e) => e.id && !/^\d{1,2} \w+ \d{4}$/.test(e.t));
  } catch {
    return [];
  }
}

function carte(v: { id: string; t: string; d?: number }, s: (typeof T)[Lang], grande = false): string {
  const duree = v.d ? `<span class="vd">${mins(v.d)} ${s.min}</span>` : "";
  return `<figure class="v${grande ? " big" : ""}" data-id="${esc(v.id)}">
    <span class="th"><img loading="lazy" src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt=""><span class="pl">[ ${s.lire} ]</span></span>
    <figcaption><span class="vt">${esc(v.t)}</span>${duree}</figcaption>
  </figure>`;
}

export async function chiourimPage(env: Env, lang: Lang): Promise<string> {
  const s = T[lang];
  const rss = await fluxRecent();
  const dernier = rss[0];
  const recents = rss.slice(1, 5);
  const dejaMontres = new Set(rss.slice(0, 5).map((e) => e.id));
  const catalogueParId = new Map(CATALOGUE.map((v) => [v.id, v]));
  const dureeDe = (id: string) => catalogueParId.get(id)?.d;

  const sections = GROUPES.map((g) => {
    const vids = CATALOGUE.filter((v) => v.g === g && !dejaMontres.has(v.id));
    if (!vids.length) return "";
    return `<section class="grp"><div class="ghead"><span class="glab">${s.groupes[g]}</span><span class="grule"></span><span class="gn">${vids.length}</span></div>
    <div class="grid">${vids.map((v) => carte(v, s)).join("\n")}</div></section>`;
  }).join("\n");

  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${esc(s.desc)}">
${altLinks(lang, "/chiourim")}
<link rel="icon" href="/icon.png" type="image/png">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(s.title)}">
<meta property="og:description" content="${esc(s.desc)}">
<meta property="og:image" content="https://mamash-ia.com/og.png?v=2">
<meta property="og:url" content="https://mamash-ia.com${href(lang, "/chiourim")}">
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
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&family=Rubik:wght@900&display=swap');
  :root { --paper:#f7f6f1; --ink:#082a99; --pop:#ffd23f; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --muted:rgba(8,42,153,.65); --ease:cubic-bezier(0.16,1,0.3,1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  ::selection { background:var(--pop); color:var(--ink); }
  main { max-width:1100px; margin:0 auto; }
  main { position:relative; }
  a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.1rem 0; font-size:.92rem; }
  nav .wm { font-family:"Rubik", "Arial Black", sans-serif; font-weight:900; font-size:.92rem; text-transform:uppercase; letter-spacing:.05em; text-decoration:none; direction:ltr; }
  nav .wm b { font-weight:inherit; border-bottom:3px solid var(--pop); padding-bottom:1px; }
  nav .wm img { width:34px; height:34px; border-radius:50%; vertical-align:-11px; margin-inline-end:.55rem; }
  nav .r a { font-family:"Rubik", "Arial Black", sans-serif; font-weight:900; font-size:.7rem; letter-spacing:.09em; text-transform:uppercase; text-decoration:none; margin-inline-start:1.1rem; } nav .r a:hover { text-decoration:underline; }
  [dir="rtl"] nav .r a { font-size:.8rem; letter-spacing:.02em; }
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
  p.muted { color:var(--muted); max-width:44rem; }
  .ghead { display:flex; align-items:baseline; gap:1.2rem; margin:3rem 0 1.2rem; }
  .glab { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; }
  [dir="rtl"] .glab { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  .grule { flex:1; height:1px; background:var(--ink-15); }
  .gn { font-size:.78rem; letter-spacing:.18em; opacity:.55; font-variant-numeric:tabular-nums; }
  .grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:1.6rem 1.4rem; }
  .v { cursor:pointer; }
  .v .th { position:relative; display:block; aspect-ratio:16/9; overflow:hidden; border:1.5px solid var(--ink-15); background:var(--ink-15); transition:border-color .3s var(--ease); }
  .v:hover .th { border-color:var(--ink); }
  .v .th img { width:100%; height:100%; object-fit:cover; display:block; }
  .v .pl { position:absolute; inset-inline-start:.7rem; bottom:.55rem; font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1rem; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,.55); }
  [dir="rtl"] .v .pl { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  .v:hover .pl::before { content:"→ "; }
  [dir="rtl"] .v:hover .pl::before { content:"← "; }
  .v .th iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
  .v figcaption { padding:.55rem .1rem 0; display:flex; gap:.8rem; align-items:baseline; }
  .v .vt { font-size:.95rem; line-height:1.45; flex:1; min-width:0; overflow-wrap:anywhere; }
  .v .vd { font-size:.78rem; letter-spacing:.1em; opacity:.55; white-space:nowrap; font-variant-numeric:tabular-nums; }
  .v.big { max-width:760px; }
  .v.big .vt { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.2rem; }
  [dir="rtl"] .v.big .vt { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  .chaine { margin-top:3rem; font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.05rem; }
  [dir="rtl"] .chaine { font-family:"Frank Ruhl Libre", Georgia, serif; font-weight:700; }
  .chaine a { text-decoration:none; } .chaine a::before { content:"[ "; color:var(--ink-40); } .chaine a::after { content:" ]"; color:var(--ink-40); } .chaine a:hover::before { content:"[ → "; }
  [dir="rtl"] .chaine a:hover::before { content:"[ ← "; }
  .srcnote { margin-top:1.2rem; font-size:.82rem; color:var(--muted); max-width:44rem; }
  footer { margin-top:4rem; font-size:.88rem; color:var(--muted); border-top:1px solid var(--ink-15); padding-top:1.4rem; }
  @media (max-width:900px) { .grid { grid-template-columns:repeat(2, minmax(0,1fr)); } }
  @media (max-width:600px) { .grid { grid-template-columns:minmax(0,1fr); } h1 { margin-top:2rem; } }
</style>
</head>
<body>
<main>
  <nav>
    <a class="wm" href="${href(lang, "/")}"><img src="/icon.png" alt="" width="34" height="34"><b>Mamash</b>&nbsp;IA</a>
    <span class="r"><a href="${href(lang, "/question")}">${s.nav.question}</a><a href="${href(lang, "/daf")}">${s.nav.daf}</a><a href="${href(lang, "/outils")}">${s.nav.outils}</a><a href="${href(lang, "/install")}"><strong>${s.nav.install}</strong></a>${langSwitcher(lang, "/chiourim")}</span>
  </nav>
  <img class="sceau" src="/icon.png" alt="">
  <h1>${s.h1}</h1>
  <p class="muted">${s.lead}</p>

  ${dernier ? `<div class="ghead"><span class="glab">${s.dernier}</span><span class="grule"></span><span class="gn">${esc(dernier.date)}</span></div>
  ${carte({ id: dernier.id, t: dernier.t, d: dureeDe(dernier.id) }, s, true)}` : ""}

  ${recents.length ? `<section class="grp"><div class="ghead"><span class="glab">${s.nouveaux}</span><span class="grule"></span></div>
  <div class="grid">${recents.map((e) => carte({ id: e.id, t: e.t, d: dureeDe(e.id) }, s)).join("\n")}</div></section>` : ""}

  ${sections}

  <p class="chaine"><a href="${CHANNEL_URL}" target="_blank" rel="noopener">${s.chaine}</a></p>
  <p class="srcnote">${s.note} <a href="${href(lang, "/privacy")}">${s.notePrivacy}</a>.</p>

  <footer><p><a href="${href(lang, "/")}">${s.foot.accueil}</a> · <a href="${href(lang, "/daily")}">${s.foot.daily}</a> · <a href="${href(lang, "/privacy")}">${s.foot.privacy}</a> · ${langSwitcher(lang, "/chiourim")}</p><p><img class="fsceau" src="/icon.png" alt="">${colophon(lang)}</p></footer>
</main>
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
