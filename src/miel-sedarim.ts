/**
 * Les sédarim des simanim de la nuit de Roch-Hachana, un par rite.
 *
 * Règle de la maison : on ne met sur la feuille que ce qu'on a lu. Chaque
 * sédèr porte donc la référence exacte du texte d'où il sort, et la feuille
 * imprime cette référence. Les formules hébraïques sont vocalisées ; on
 * n'ajoute jamais de nikoud à un passage lu sans vocalisation — ce qui est
 * dit en plus par le rite passe alors dans le libellé, pas dans la formule.
 */

import type { Lang } from "./i18n";

export type Rite = "sa" | "bih";

/** L'invariant du yehi ratsone, pour ne pas le retaper à chaque siman. */
const YR = (queue: string): string =>
  "יְהִי רָצוֹן מִלְּפָנֶיךָ ה׳ אֱלֹקֵינוּ וֵאלֹקֵי אֲבוֹתֵינוּ, " + queue;
const YRP = (queue: string): string =>
  "Yehi ratsone milefanékha Ado-naï Élo-hénou vé-Élo-hé avoténou, " + queue;

/** Les queues de formule, partagées entre les rites qui les disent pareil. */
const Q = {
  annee:   { h: "שֶׁתְּחַדֵּשׁ עָלֵינוּ שָׁנָה טוֹבָה וּמְתוּקָה", p: "chéte'hadech alénou chana tova oumetouka" },
  tamar:   { h: "שֶׁיִּתַּמּוּ אוֹיְבֵינוּ וְשׂוֹנְאֵינוּ וְכָל מְבַקְשֵׁי רָעָתֵנוּ", p: "chéyitamou oyevénou vésonénou vékhol mevakché raaténou" },
  rimon:   { h: "שֶׁנִּהְיֶה מְלֵאִים מִצְוֹת כָּרִמּוֹן", p: "chénihyé meléïm mitsvot karimone" },
  kra:     { h: "שֶׁתִּקְרַע רֹעַ גְּזַר דִּינֵנוּ, וְיִקָּרְאוּ לְפָנֶיךָ זָכִיּוֹתֵינוּ", p: "chétikra roa guezar dinénou, véyikarou lefanékha zakhiyoténou" },
  rubia:   { h: "שֶׁיִּרְבּוּ זָכִיּוֹתֵינוּ", p: "chéyirbou zakhiyoténou" },
  rubiaAr: { h: "שֶׁיִּרְבּוּ זָכִיּוֹתֵינוּ וּתְלַבְּבֵנוּ", p: "chéyirbou zakhiyoténou outelabevénou" },
  karti:   { h: "שֶׁיִּכָּרְתוּ אוֹיְבֵינוּ וְשׂוֹנְאֵינוּ וְכָל מְבַקְשֵׁי רָעָתֵנוּ", p: "chéyikartou oyevénou vésonénou vékhol mevakché raaténou" },
  silka:   { h: "שֶׁיִּסְתַּלְּקוּ אוֹיְבֵינוּ וְשׂוֹנְאֵינוּ וְכָל מְבַקְשֵׁי רָעָתֵנוּ", p: "chéyistalkou oyevénou vésonénou vékhol mevakché raaténou" },
  roch:    { h: "שֶׁנִּהְיֶה לְרֹאשׁ וְלֹא לְזָנָב", p: "chénihyé leroch vélo lezanav" },
  daguim:  { h: "שֶׁנִּפְרֶה וְנִרְבֶּה כַּדָּגִים", p: "chénifré vénirbé kadaguim" },
} as const;

export interface Siman {
  lab: Record<Lang, string>;
  heb: string;
  phon: string;
  /** Le fruit sur lequel on dit « bore peri haets ». */
  bpe?: boolean;
  /** Traduction française du yehi ratsone, imprimée sur le premier siman. */
  trad?: boolean;
}

export interface Seder {
  /** Le nom du rite, tel qu'il apparaît dans le menu du générateur. */
  nom: Record<Lang, string>;
  /** Ce que le bandeau rouge annonce au-dessus des berakhot. */
  bandeau: Record<Lang, string>;
  /** La ligne de sources, en bas de la feuille. */
  source: Record<Lang, string>;
  /** L'avertissement sur la variété des usages. */
  note: Record<Lang, string>;
  simanim: Siman[];
}

const sim = (fr: string, en: string, he: string, q: { h: string; p: string }, extra: Partial<Siman> = {}): Siman => ({
  lab: { fr, en, he },
  heb: YR(q.h),
  phon: YRP(q.p),
  ...extra,
});

export const SEDARIM: Record<Rite, Seder> = {
  // ---------------------------------------------------------------------
  // Le Choulhan Aroukh — l'ordre le plus répandu, celui de la feuille depuis
  // le début. Reste le choix par défaut : personne ne doit voir sa feuille
  // changer sous ses yeux à la veille des fêtes.
  // ---------------------------------------------------------------------
  sa: {
    nom: { fr: "Choulhan Aroukh — l'usage le plus répandu", en: "Shulchan Arukh — the most widespread", he: "שולחן ערוך — המנהג הרווח" },
    bandeau: {
      fr: "LES BERAKHOT DU SOIR DE ROCH-HACHANA — LE SÉDÈR DES SIMANIM DU CHOULHAN AROUKH",
      en: "THE ROSH HASHANA EVENING BLESSINGS — THE SIMANIM SEDER OF THE SHULCHAN ARUKH",
      he: "ברכות ליל ראש השנה — סדר הסימנים שבשולחן ערוך",
    },
    source: {
      fr: "Sources lues sur Sefaria : Talmud, Horayot 12a (Abayé) · Choulhan Aroukh, Orah Hayim 583, 1",
      en: "Sources read on Sefaria: Talmud, Horayot 12a (Abaye) · Shulchan Arukh, Orach Chayim 583:1",
      he: "מקורות שנקראו בספריא: הוריות יב ע״א (אביי) · שולחן ערוך אורח חיים תקפג, א",
    },
    note: {
      fr: "L'ordre des simanim varie selon les communautés — les familles tunisiennes ont le leur. Suivez l'usage de votre famille.",
      en: "The order of the simanim varies between communities — Tunisian families have their own. Follow your family's custom.",
      he: "סדר הסימנים משתנה מקהילה לקהילה — למשפחות מתוניסיה יש סדר משלהן. לכו אחר מנהג משפחתכם.",
    },
    simanim: [
      sim("La pomme trempée dans le miel", "The apple dipped in honey", "התפוח בדבש", Q.annee, { bpe: true, trad: true }),
      sim("La datte — tamar", "The date — tamar", "התמר", Q.tamar),
      sim("La grenade — rimone", "The pomegranate — rimon", "הרימון", Q.rimon),
      sim("La courge — kra", "The gourd — kra", "הקרא (דלעת)", Q.kra),
      sim("Le fenugrec — roubia (ou la loubia)", "Fenugreek — rubia (or black-eyed peas)", "הרוביא (תלתן)", Q.rubia),
      sim("Le poireau — karti", "The leek — karti", "הכרתי", Q.karti),
      sim("La blette — silka", "The chard — silka", "הסלקא", Q.silka),
      sim("La tête (poisson ou agneau)", "The head (fish or lamb)", "הראש (דג או כבש)", Q.roch),
      sim("Le poisson", "The fish", "הדגים", Q.daguim),
    ],
  },

  // ---------------------------------------------------------------------
  // Le Ben Ich Haï — Bagdad, mais c'est le sédèr des communautés
  // arabophones, et son ordre n'a rien à voir avec le précédent : on
  // commence par la datte, la pomme vient à l'avant-dernier rang et cuite
  // au sucre, et il écrit noir sur blanc qu'on ne dit pas « comme le miel ».
  // ---------------------------------------------------------------------
  bih: {
    nom: { fr: "Ben Ich Haï — usage séfarade arabophone", en: "Ben Ish Hai — Arabic-speaking Sephardi", he: "בן איש חי — מנהג הספרדים דוברי הערבית" },
    bandeau: {
      fr: "LES BERAKHOT DU SOIR DE ROCH-HACHANA — LE SÉDÈR DES SIMANIM DU BEN ICH HAÏ",
      en: "THE ROSH HASHANA EVENING BLESSINGS — THE SIMANIM SEDER OF THE BEN ISH HAI",
      he: "ברכות ליל ראש השנה — סדר הסימנים של הבן איש חי",
    },
    source: {
      fr: "Sources lues sur Sefaria : Talmud, Horayot 12a (Abayé) · Ben Ich Haï, Halakhot 1re année, Nitsavim 4",
      en: "Sources read on Sefaria: Talmud, Horayot 12a (Abaye) · Ben Ish Hai, Halachot 1st Year, Nitzavim 4",
      he: "מקורות שנקראו בספריא: הוריות יב ע״א (אביי) · בן איש חי, הלכות שנה א, נצבים ד",
    },
    note: {
      fr: "Le Ben Ich Haï écrit que la roubia est ce qu'on appelle loubia en arabe, et qu'on dit sur la pomme « une année bonne et douce » sans ajouter « comme le miel ».",
      en: "The Ben Ish Hai writes that rubia is what is called lubia in Arabic, and that over the apple one says “a good and sweet year” without adding “like honey”.",
      he: "הבן איש חי כותב שהרוביא היא מה שקוראים בערבית לוביא, ושעל התפוח אומרים ״שנה טובה ומתוקה״ בלי ״כדבש״.",
    },
    simanim: [
      sim("La datte — tamar (on en mange une, puis on dit la formule sur la seconde)", "The date — tamar (eat one, then say the formula over the second)", "התמר (אוכלים אחת, ואומרים על השנייה)", Q.tamar, { bpe: true, trad: true }),
      sim("La loubia — roubia « ce qu'on appelle loubia en arabe »", "Black-eyed peas — rubia, “what we call lubia in Arabic”", "הרוביא — ״מה שקורין בלשון ערבי לוביא״", Q.rubiaAr),
      sim("Le poireau — karti", "The leek — karti", "הכרתי", Q.karti),
      sim("La blette — silka", "The chard — silka", "הסלקא", Q.silka),
      sim("La courge — kra", "The gourd — kra", "הקרא (דלעת)", Q.kra),
      sim("La grenade douce — rimone", "The sweet pomegranate — rimon", "הרימון המתוק", Q.rimon),
      sim("La pomme cuite au sucre (sans dire « comme le miel »)", "The apple cooked in sugar (without saying “like honey”)", "התפוח המבושל בסוכר (בלי ״כדבש״)", Q.annee),
      sim("La tête d'agneau — on ajoute le souvenir de la ligature d'Its'hak", "The lamb's head — one adds the remembrance of the binding of Isaac", "ראש כבש — ומוסיפים זכר עקדת יצחק", Q.roch),
    ],
  },
};

export const RITE_DEFAUT: Rite = "sa";
export const RITES: Rite[] = ["sa", "bih"];
