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
 * Rendu : FR · EN · עברית — sans pills, sans drapeaux.
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

/** Le colophon, signé dans la langue de la page. */
export const colophon = (lang: Lang) =>
  t(lang, { fr: "Un projet personnel de Jonathan Bensaid.", en: "A personal project by Jonathan Bensaid.", he: "נעשה בידי יונתן בן־סעיד." });

/** Marqueur de langue à passer au serveur (/api/question). */
export const langLabel = (lang: Lang) => t(lang, { fr: "français", en: "anglais", he: "hébreu" });
