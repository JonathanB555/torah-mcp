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

export type Rite = "sa" | "ash" | "bih" | "djerba" | "tn";

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
  // Le mahzor Koren abrège : « nos ennemis » sans la suite.
  tamarK:  { h: "שֶׁיִּתַּמּוּ שׂוֹנְאֵינוּ", p: "chéyitamou sonénou" },
  rimonK:  { h: "שֶׁנַּרְבֶּה זְכֻיּוֹת כְּרִמּוֹן", p: "chénarbé zekhouyot kerimone" },
  rubiaK:  { h: "שֶׁיִּרְבּוּ זְכֻיּוֹתֵינוּ", p: "chéyirbou zekhouyoténou" },
  kartiK:  { h: "שֶׁיִּכָּרְתוּ שׂוֹנְאֵינוּ", p: "chéyikartou sonénou" },
  silkaK:  { h: "שֶׁיִּסְתַּלְּקוּ שׂוֹנְאֵינוּ", p: "chéyistalkou sonénou" },
} as const;

export interface Siman {
  lab: Record<Lang, string>;
  /** Vide quand aucun texte vocalisé n'a pu être lu : on n'invente pas de nikoud. */
  heb: string;
  phon: string;
  /** Sens de la formule, imprimé quand l'hébreu manque. */
  sens?: Record<Lang, string>;
  /** Intertitre ouvrant une bénédiction (bore peri haets, haadama, chéhakol). */
  section?: Record<Lang, string>;
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
  /** Première phrase de l'introduction, quand le rite ne trempe pas dans le miel. */
  intro?: Record<Lang, string>;
  simanim: Siman[];
}

const sim = (fr: string, en: string, he: string, q: { h: string; p: string }, extra: Partial<Siman> = {}): Siman => ({
  lab: { fr, en, he },
  heb: YR(q.h),
  phon: YRP(q.p),
  ...extra,
});


/** Un siman tunisien : la formule est donnée en phonétique et en sens, sans
 *  hébreu — la source lue ne le donne pas vocalisé, et on n'en invente pas. */
const tnSim = (
  fr: string, en: string, he: string,
  phon: string, sensFr: string, sensEn: string, sensHe: string,
  section?: Record<Lang, string>,
): Siman => ({
  lab: { fr, en, he },
  heb: "",
  phon: YRP(phon),
  sens: { fr: sensFr, en: sensEn, he: sensHe },
  ...(section ? { section } : {}),
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


  // ---------------------------------------------------------------------
  // Le rite achkénaze, tel que le donne le mahzor Koren — les formules y
  // sont plus courtes qu'en séfarade, et le mahzor glose la roubia par
  // « חילבה », le fenugrec, comme le Choulhan Aroukh.
  // ---------------------------------------------------------------------
  ash: {
    nom: { fr: "Achkénaze — mahzor Koren", en: "Ashkenaz — Koren mahzor", he: "אשכנז — מחזור קורן" },
    bandeau: {
      fr: "LES BERAKHOT DU SOIR DE ROCH-HACHANA — LE SÉDÈR DES SIMANIM DU RITE ACHKÉNAZE",
      en: "THE ROSH HASHANA EVENING BLESSINGS — THE SIMANIM SEDER OF THE ASHKENAZI RITE",
      he: "ברכות ליל ראש השנה — סדר הסימנים כמנהג אשכנז",
    },
    source: {
      fr: "Sources lues sur Sefaria : Talmud, Horayot 12a (Abayé) · Mahzor Koren pour Roch Hachana, rite achkénaze",
      en: "Sources read on Sefaria: Talmud, Horayot 12a (Abaye) · The Koren Rosh HaShana Mahzor, Ashkenaz",
      he: "מקורות שנקראו בספריא: הוריות יב ע״א (אביי) · מחזור קורן לראש השנה, נוסח אשכנז",
    },
    note: {
      fr: "Le mahzor précise que la berakha « bore peri haadama » se dit sur la roubia, qu'il glose « חילבה » — le fenugrec, comme le Choulhan Aroukh.",
      en: "The mahzor places “borei peri ha'adama” over the rubia, which it glosses “חילבה”, fenugreek, as the Shulchan Arukh does.",
      he: "המחזור קובע ״בורא פרי האדמה״ על הרוביא, שאותה הוא מגלה ״חילבה״ — תלתן, כדעת השולחן ערוך.",
    },
    simanim: [
      sim("La pomme trempée dans le miel", "The apple dipped in honey", "התפוח בדבש", Q.annee, { bpe: true, trad: true }),
      sim("La datte — tamar", "The date — tamar", "התמר", Q.tamarK),
      sim("La grenade — rimone", "The pomegranate — rimon", "הרימון", Q.rimonK),
      sim("Le fenugrec — roubia (חילבה)", "Fenugreek — rubia (חילבה)", "הרוביא (חילבה)", Q.rubiaK),
      sim("Le poireau — karti", "The leek — karti", "הכרתי (כרישה)", Q.kartiK),
      sim("La betterave — silka", "The beet — silka", "הסלק", Q.silkaK),
      sim("La courge — kra", "The gourd — kra", "הקרא (דלעת קטנה)", Q.kra),
      sim("La tête de mouton, ou un poisson", "A sheep's head, or a fish", "ראש כבש, או דג", Q.roch),
      sim("Le poisson", "The fish", "הדגים", Q.daguim),
    ],
  },

  // ---------------------------------------------------------------------
  // Djerba, d'après le Brit Kehouna de Rav Moché Khalfon HaCohen — retrouvé
  // par la recherche plein texte, pages 209 et 210. Son sédèr suit l'ordre
  // du Choulhan Aroukh, mais chaque siman porte son nom judéo-arabe, et il
  // ouvre par la courge et non par la pomme. C'est lui qui écrit, pour un
  // lecteur tunisien, « roubia, et en arabe loubia ».
  // ---------------------------------------------------------------------
  djerba: {
    nom: { fr: "Djerba — Brit Kehouna", en: "Djerba — Brit Kehuna", he: "ג׳רבה — ברית כהונה" },
    bandeau: {
      fr: "LES BERAKHOT DU SOIR DE ROCH-HACHANA — LE SÉDÈR DES SIMANIM DE DJERBA",
      en: "THE ROSH HASHANA EVENING BLESSINGS — THE SIMANIM SEDER OF DJERBA",
      he: "ברכות ליל ראש השנה — סדר הסימנים כמנהג ג׳רבה",
    },
    source: {
      fr: "Brit Kehouna, Orah Hayim, Roch Hachana § 12 — Rav Moché Khalfon HaCohen de Djerba (1874-1950), pages 209-210, lues sur hebrewbooks.org/8751",
      en: "Brit Kehuna, Orach Chayim, Rosh Hashana § 12 — Rabbi Moshe Khalfon HaCohen of Djerba (1874-1950), pages 209-210, read on hebrewbooks.org/8751",
      he: "ברית כהונה, אורח חיים, ראש השנה סי׳ יב — הרב משה כלפון הכהן מג׳רבה (1874-1950), עמ׳ 209-210, hebrewbooks.org/8751",
    },
    note: {
      fr: "Chaque siman porte son nom judéo-arabe : la kra est la « kar'a », la roubia la « loubia », la silka le « salq », le karti le « karat ». S'il n'y a pas de pommes, on prend un autre fruit doux.",
      en: "Each siman carries its Judeo-Arabic name: kra is “qar'a”, rubia is “lubia”, silka is “salq”, karti is “karat”. If no apples are to be had, another sweet fruit is taken.",
      he: "כל סימן נושא את שמו הערבי־יהודי: הקרא ״קרעא״, הרוביא ״לוביא״, הסלקא ״סלק״, הכרתי ״כראת״. אם אין תפוחים, לוקחים פרי מתוק אחר.",
    },
    simanim: [
      sim("La courge — kra, « kar'a »", "The gourd — kra, “qar'a”", "הקרא (ובערבי קרעא)", Q.kra, { bpe: true, trad: true }),
      sim("La tête de mouton — avec le souvenir de la ligature d'Its'hak", "The sheep's head — with the remembrance of the binding of Isaac", "ראש כבש — וזכר עקדת יצחק", Q.roch),
      sim("La loubia — roubia, « et en arabe loubia »", "Black-eyed peas — rubia, “and in Arabic lubia”", "הרוביא (ובערבי לוביא)", Q.rubia),
      sim("La blette — silka, « salq »", "The chard — silka, “salq”", "הסלקא (ובערבי סלק)", Q.silka),
      sim("Le poireau — karti, « karat »", "The leek — karti, “karat”", "הכרתי (ובערבי כראת)", Q.karti),
      sim("La datte — tamar", "The date — tamar", "התמר", Q.tamar),
      sim("La grenade — rimone", "The pomegranate — rimon", "הרימון", Q.rimon),
      sim("La pomme trempée dans le miel — « douce sur nous comme le miel »", "The apple dipped in honey — “sweet upon us as honey”", "תפוח מטובל בדבש", Q.annee),
    ],
  },

  // ---------------------------------------------------------------------
  // La Tunisie. Rien à voir avec les deux précédents : le sédèr n'est pas une
  // liste plate mais trois séries, une par bénédiction — fruits de l'arbre,
  // fruits de la terre, puis chéhakol. La figue ouvre, le sésame et l'ail en
  // sont, la pomme est douce « comme la pomme » et non « comme le miel »,
  // lequel a sa propre place et sa propre formule.
  //
  // Transcrit depuis « La page de miel — sédèr de Roch Hachana » (harissa.com,
  // recueil des coutumes des Juifs de Tunisie), lue en entier. Ce document
  // donne la phonétique française et non l'hébreu vocalisé : les formules sont
  // donc imprimées telles qu'elles se disent, sans hébreu — plutôt qu'avec un
  // nikoud reconstitué, qui n'aurait aucune source.
  // ---------------------------------------------------------------------
  tn: {
    nom: { fr: "Tunisie — l'usage de la feuille de miel", en: "Tunisia — the honey sheet custom", he: "תוניסיה — מנהג דף הדבש" },
    bandeau: {
      fr: "LES BERAKHOT DU SOIR DE ROCH-HACHANA — LE SÉDÈR DES SIMANIM DU RITE TUNISIEN",
      en: "THE ROSH HASHANA EVENING BLESSINGS — THE SIMANIM SEDER OF THE TUNISIAN RITE",
      he: "ברכות ליל ראש השנה — סדר הסימנים כמנהג תוניסיה",
    },
    source: {
      fr: "Sédèr de Tunis · feuille imprimée « Séder pour les deux soirées » et « La page de miel », concordantes · à Djerba, le Brit Kehouna suit l'ordre du Choulhan Aroukh",
      en: "Tunis seder · printed sheet “Séder pour les deux soirées” and “La page de miel”, in agreement · in Djerba, Brit Kehuna follows the Shulchan Arukh order",
      he: "סדר תוניס · דף מודפס ״Séder pour les deux soirées״ ו״La page de miel״, תואמים · בג׳רבה, ברית כהונה הולך אחר סדר השולחן ערוך",
    },
    note: {
      fr: "Recueil de coutumes, non un livre de décisionnaire — l'hébreu se lit dans le siddour de votre famille. En Tunisie, le pain du Motsi se trempe dans le sucre, et Chéhé'héyanou se dit une fois sur un fruit nouveau.",
      en: "A collection of customs, not a book of rulings — the Hebrew is in your family's siddur. In Tunisia the Motzi bread is dipped in sugar, and Shehecheyanu is said once over a new fruit.",
      he: "אוסף מנהגים, לא ספר פוסקים — ההברה העברית בסידור של משפחתכם. בתוניסיה טובלים את פרוסת המוציא בסוכר, ואומרים שהחיינו פעם אחת על פרי חדש.",
    },
    intro: {
      fr: "On trempe le pain du Motsi dans le sucre. Sur le premier fruit de l'arbre, on bénit",
      en: "The Motzi bread is dipped in sugar. Over the first fruit of the tree, one says",
      he: "טובלים את פרוסת המוציא בסוכר. על הפרי הראשון של העץ מברכים",
    },
    simanim: [
      tnSim("La figue", "The fig", "התאנה",
        "chetehé chana zo habaa alénou tova oumetouka kadevela",
        "Une année bonne et douce comme la figue.",
        "A good and sweet year, as the fig.",
        "שתהא השנה הזאת טובה ומתוקה כדבלה.",
        { fr: "FRUITS DE L'ARBRE — bore peri haets, sur le premier fruit seulement", en: "FRUITS OF THE TREE — borei peri ha'etz, on the first fruit only", he: "פרי העץ — בורא פרי העץ, על הפרי הראשון בלבד" }),
      tnSim("La grenade", "The pomegranate", "הרימון",
        "chéyirbou zakhiyoténou karimone",
        "Que nos mérites se multiplient comme les grains de la grenade.",
        "May our merits multiply like pomegranate seeds.",
        "שירבו זכיותינו כרימון."),
      tnSim("La pomme", "The apple", "התפוח",
        "chetehé chana zo habaa alénou tova oumetouka katapouah",
        "Une année bonne et douce comme la pomme, et non « comme le miel ».",
        "A good and sweet year, as the apple, not “as honey”.",
        "שתהא השנה הזאת טובה ומתוקה כתפוח."),
      tnSim("Les graines de sésame", "Sesame seeds", "השומשום",
        "chéyirbou zakhiyoténou kachoumchemine",
        "Que nos mérites se multiplient comme les graines de sésame.",
        "May our merits multiply like sesame seeds.",
        "שירבו זכיותינו כשומשמין.",
        { fr: "FRUITS DE LA TERRE — bore peri haadama", en: "FRUITS OF THE GROUND — borei peri ha'adama", he: "פרי האדמה — בורא פרי האדמה" }),
      tnSim("La courge — en beignets au miel", "The gourd — as honey fritters", "הקרא — בלביבות בדבש",
        "chétikra roa guezar dinénou véyikarou lefanékha zakhiyoténou",
        "Que soit déchiré le mauvais décret, et nos mérites lus devant Toi.",
        "May the evil decree be torn up, our merits read before You.",
        "שתקרע רוע גזר דיננו ויקראו לפניך זכיותינו."),
      tnSim("Les épinards — en beignets au miel", "Spinach — as honey fritters", "התרד — בלביבות בדבש",
        "chéyistalkou oyevénou vésonénou vékhol mevakché raaténou mipanénou",
        "Que s'écartent nos ennemis et ceux qui nous veulent du mal.",
        "May our enemies and ill-wishers depart.",
        "שיסתלקו אויבינו ושונאינו וכל מבקשי רעתנו מפנינו."),
      tnSim("Les fèves", "Broad beans", "הפול",
        "chéyipolou sonénou lefanénou",
        "Que nos ennemis tombent devant nous.",
        "May our enemies fall before us.",
        "שיפלו שונאינו לפנינו."),
      tnSim("L'ail", "Garlic", "השום",
        "chéyitamou oyevénou vésonénou vékhol mevakché raaténou mipanénou",
        "Que disparaissent nos ennemis et ceux qui nous veulent du mal.",
        "May our enemies and ill-wishers vanish.",
        "שיתמו אויבינו ושונאינו וכל מבקשי רעתנו מפנינו."),
      tnSim("Le miel", "Honey", "הדבש",
        "chetehé chana zo habaa alénou tova oumetouka kadevach, mérechit hachana véad aharit chana",
        "Douce comme le miel, du début de l'année jusqu'à sa fin.",
        "Sweet as honey, from the start of the year to its end.",
        "שתהא השנה הזאת טובה ומתוקה כדבש, מראשית השנה ועד אחרית שנה.",
        { fr: "CHÉHAKOL — chéhakol nihyé bidvaro", en: "SHEHAKOL — shehakol nihyeh bidvaro", he: "שהכל — שהכל נהיה בדברו" }),
      tnSim("La tête de mouton", "The sheep's head", "ראש כבש",
        "chénihyé leroch vélo lezanav, vétizkor lanou élo chel Its'hak avinou alav hachalom",
        "À la tête et non à la queue ; souviens-Toi du bélier d'Its'hak.",
        "The head and not the tail; remember the ram of Isaac.",
        "שנהיה לראש ולא לזנב, ותזכור לנו אילו של יצחק אבינו עליו השלום."),
      tnSim("Le poisson", "The fish", "הדגים",
        "chénifré vénirbé kadaguim",
        "Féconds comme les poissons. Certains ajoutent « vétichgah alénou beéna pekiha ».",
        "Fruitful as fish. Some add “vetishgah alenu be-eina pekiha”.",
        "שנפרה ונרבה כדגים."),
    ],
  },
};

export const RITE_DEFAUT: Rite = "sa";
export const RITES: Rite[] = ["sa", "ash", "bih", "djerba", "tn"];
