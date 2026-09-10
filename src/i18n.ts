/**
 * Internationalisation du site (pas du MCP) : français par défaut à la racine,
 * anglais sous /en/…, hébreu (RTL) sous /he/….
 *
 * Conventions :
 *  - mêmes slugs dans les trois langues (/question, /outils, /install, /daf,
 *    /daily, /privacy) ; seul le préfixe change ;
 *  - `/en` et `/he` (sans slash final) sont les accueils ;
 *  - chaque page appelle `href(lang, "/x")` pour ses liens internes,
 *    `altLinks(path)` dans <head> et `langSwitcher(lang, path)` dans la nav.
 */

export type Lang = "fr" | "en" | "he";
export const LANGS: readonly Lang[] = ["fr", "en", "he"] as const;
export const LANG_NAMES: Record<Lang, string> = { fr: "Français", en: "English", he: "עברית" };
export const LANG_SHORT: Record<Lang, string> = { fr: "FR", en: "EN", he: "עב" };
export const SITE = "https://mamash-ia.com";

export const dirOf = (lang: Lang): "rtl" | "ltr" => (lang === "he" ? "rtl" : "ltr");

/** Sépare le préfixe de langue du chemin : "/en/question" → { lang:"en", path:"/question" }. */
export function parseLang(pathname: string): { lang: Lang; path: string } {
  const m = pathname.match(/^\/(en|he)(\/.*)?$/);
  if (!m) return { lang: "fr", path: pathname };
  return { lang: m[1] as Lang, path: m[2] && m[2] !== "/" ? m[2] : "/" };
}

/** Chemin d'une page dans une langue : href("he", "/question") → "/he/question" ; href("en", "/") → "/en". */
export function href(lang: Lang, path: string): string {
  if (lang === "fr") return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Balises <link rel="alternate" hreflang> + canonical, pour Google. */
export function altLinks(lang: Lang, path: string): string {
  const links = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${href(l, path)}">`).join("\n");
  return `${links}\n<link rel="alternate" hreflang="x-default" href="${SITE}${path}">\n<link rel="canonical" href="${SITE}${href(lang, path)}">`;
}

/**
 * Sélecteur de langue en liens-crochets, la langue courante marquée.
 * Rendu : FR · EN · עברית : sans pills, sans drapeaux.
 */
export function langSwitcher(lang: Lang, path: string, cls = "lang"): string {
  const items = LANGS.map((l) =>
    l === lang
      ? `<span class="cur" aria-current="true" lang="${l}">${LANG_SHORT[l]}</span>`
      : `<a href="${href(l, path)}" hreflang="${l}" lang="${l}" title="${LANG_NAMES[l]}">${LANG_SHORT[l]}</a>`
  );
  return `<span class="${cls}" aria-label="Langue">${items.join('<span class="dot">·</span>')}</span>`;
}

/** Petit utilitaire : t(lang, { fr, en, he }). */
export function t<T>(lang: Lang, v: { fr: T; en: T; he: T }): T {
  return v[lang];
}

/** Attributs de la balise <html>. */
export const htmlAttrs = (lang: Lang) => `lang="${lang}" dir="${dirOf(lang)}"`;

/** Le colophon, signé dans la langue de la page, suivi de la dédicace.
 *  Les trois noms sont écrits partout tels que Jonathan les a donnés, sur une
 *  dédicace, on ne translittère pas de sa propre main. */
/** Les trois noms, isolés en dir="ltr" : dans la page hébraïque, une suite
 *  latine non isolée se réordonne au rendu bidirectionnel. */
const NOMS = (liaison: string) =>
  `<span dir="ltr">Myriam bat Hanina, Yaacov ben Julie${liaison} Yudi Sternfeld</span>`;

export const colophon = (lang: Lang) =>
  t(lang, {
    fr: `Un projet personnel de Jonathan Bensaid, <em>à la mémoire de ${NOMS(" et")}</em>.`,
    en: `A personal project by Jonathan Bensaid, <em>in memory of ${NOMS(" and")}</em>.`,
    he: `נעשה בידי יונתן בן־סעיד, <em>לעילוי נשמת ${NOMS(",")}</em>.`,
  });

/** La saison des feuilles de miel : de maintenant à la fin des fêtes de Tichri
 * (Simhat Torah 5787 s'achève le 4 octobre 2026 au soir). Après, les entrées
 * saisonnières (nav, badge) disparaissent d'elles-mêmes. */
export const saisonMiel = (): boolean => Date.now() < Date.parse("2026-10-05T00:00:00Z");

/** L'onglet « un bug ? une idée ? », posé en bas de chaque page.
 *  Il emporte la page d'origine dans ?de= pour que le formulaire sache de quoi
 *  l'on parle. Styles inclus : le composant doit tenir seul, quelle que soit
 *  la feuille de style de la page qui l'appelle. */
export const retourTab = (lang: Lang, depuis: string): string => {
  const mot = t(lang, { fr: "Un bug ? Une idée ?", en: "A bug? An idea?", he: "באג? רעיון?" });
  const dest = href(lang, "/retour") + "?de=" + encodeURIComponent(depuis);
  return `<style>
  /* Propriétés physiques et non logiques : le writing-mode vertical de
     l'onglet brouille la résolution de inset-inline-end, qui se retrouvait
     du mauvais côté dans les deux sens de lecture. */
  .rtab { position:fixed; right:0; left:auto; bottom:22vh; z-index:60; display:block;
    background:#082a99; color:#ffd23f; text-decoration:none;
    font:900 .68rem/1 "Rubik","Arial Black",sans-serif; letter-spacing:.1em; text-transform:uppercase;
    padding:.85rem .7rem; writing-mode:vertical-rl; box-shadow:-3px 3px 12px rgba(8,42,153,.28);
    border:0; transition:background .25s, color .25s; }
  [dir="rtl"] .rtab { writing-mode:vertical-lr; right:auto; left:0; box-shadow:3px 3px 12px rgba(8,42,153,.28); }
  .rcale { display:none; }
  .rtab:hover, .rtab:focus-visible { background:#ffd23f; color:#082a99; text-decoration:none; }
  @media (max-width:760px) {
    .rtab, [dir="rtl"] .rtab { writing-mode:horizontal-tb; right:auto; left:50%;
      transform:translateX(-50%); bottom:0; padding:.55rem 1rem .6rem; font-size:.62rem;
      box-shadow:0 -3px 12px rgba(8,42,153,.24); }
    /* Le bandeau du bas recouvrirait le dernier bouton de la page (celui de
       /miel, par exemple) : on rend sa hauteur à la page par une cale. */
    .rcale { display:block; height:3.4rem; }
  }
  @media print { .rtab, .rcale { display:none; } }
</style>
<div class="rcale" aria-hidden="true"></div>
<a class="rtab" href="${dest}">${mot}</a>`;
};

/** Marqueur de langue à passer au serveur (/api/question). */
export const langLabel = (lang: Lang) => t(lang, { fr: "français", en: "anglais", he: "hébreu" });
