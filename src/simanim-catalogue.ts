/**
 * Le catalogue des simanim, pour la page /roch-hachana : une illustration et
 * un jeu de mots par aliment. Les sédarim eux-mêmes vivent dans
 * miel-sedarim.ts ; ici on n'ajoute que ce qui sert à les donner à voir.
 */

import type { Lang } from "./i18n";
import type { Siman } from "./miel-sedarim";

/** Le fichier d'illustration, déduit du nom hébreu du siman.
 *  L'ordre des tests compte : שומשום contient שום, et la roubia se dit
 *  fenugrec ou loubia selon le rite qui la nomme. */
export function imageDe(si: Siman): string {
  const h = si.lab.he;
  if (h.includes("שומשום")) return "sesame";
  if (h.includes("רוביא")) return h.includes("לוביא") ? "loubia" : "fenugrec";
  if (h.includes("תפוח")) return "pomme";
  if (h.includes("תמר")) return "datte";
  if (h.includes("רימון")) return "grenade";
  if (h.includes("קרא")) return "courge";
  if (h.includes("כרתי")) return "poireau";
  if (h.includes("תרד")) return "blette";
  if (h.includes("סלקא")) return "blette";
  if (h.includes("סלק")) return "betterave";
  if (h.includes("ראש")) return "tete";
  if (h.includes("דגים")) return "poisson";
  if (h.includes("תאנה")) return "figue";
  if (h.includes("פול")) return "feves";
  if (h.includes("שום")) return "ail";
  if (h.includes("דבש")) return "miel";
  return "grenade";
}

export interface FicheSiman {
  cle: string;
  nom: Record<Lang, string>;
  /** Le mot hébreu ou judéo-arabe sur lequel porte le jeu. */
  mot: string;
  /** Ce que le nom fait entendre. */
  jeu: Record<Lang, string>;
}

export const FICHES: FicheSiman[] = [
  { cle: "pomme", nom: { fr: "La pomme", en: "The apple", he: "התפוח" }, mot: "תפוח",
    jeu: { fr: "Trempée dans le miel : que l'année soit douce. C'est l'ajout du Rema, repris partout — sauf à Tunis, où la pomme est douce « comme la pomme », le miel ayant sa propre place.",
           en: "Dipped in honey, for a sweet year. The Rema's addition, followed everywhere — except in Tunis, where the apple is sweet “as the apple”, honey having its own place.",
           he: "טובלים בדבש, לשנה מתוקה. תוספת הרמ״א — חוץ מתוניס, שם התפוח מתוק ״כתפוח״, והדבש עומד בפני עצמו." } },
  { cle: "datte", nom: { fr: "La datte", en: "The date", he: "התמר" }, mot: "תמר · יתמו",
    jeu: { fr: "Tamar fait entendre yitamou : que cessent ceux qui nous veulent du mal. Le Ben Ich Haï en mange une, dit la formule, puis en mange une seconde.",
           en: "Tamar sounds like yitamu: may those who wish us harm come to an end. The Ben Ish Hai eats one, says the formula, then eats a second.",
           he: "תמר מזכיר ״יתמו״. הבן איש חי אוכל אחד, אומר את הנוסח, ואוכל שני." } },
  { cle: "grenade", nom: { fr: "La grenade", en: "The pomegranate", he: "הרימון" }, mot: "רימון",
    jeu: { fr: "Autant de mérites que la grenade a de grains. Certains disent « que nos mérites se multiplient », d'autres « que nous soyons remplis de mitsvot ».",
           en: "As many merits as the pomegranate has seeds. Some say “may our merits multiply”, others “may we be full of mitzvot”.",
           he: "כמניין גרגירי הרימון. יש אומרים ״שירבו זכיותינו״ ויש ״שנהיה מלאים מצוות״." } },
  { cle: "courge", nom: { fr: "La courge", en: "The gourd", he: "הקרא" }, mot: "קרא · תקרע · יקראו",
    jeu: { fr: "Kra porte deux demandes d'un coup : que soit déchiré (tikra) le mauvais décret, et que soient lus (yikarou) nos mérites. À Djerba on la nomme kar'a, à Tunis on la mange en beignets au miel.",
           en: "Kra carries two requests at once: may the evil decree be torn (tikra), and may our merits be read (yikaru). In Djerba it is called qar'a; in Tunis it is eaten as honey fritters.",
           he: "קרא נושא שתי בקשות: שתקרע רוע הגזר, ושיקראו זכיותינו. בג׳רבה ״קרעא״, בתוניס בלביבות בדבש." } },
  { cle: "fenugrec", nom: { fr: "Le fenugrec", en: "Fenugreek", he: "תלתן · חילבה" }, mot: "רוביא · ירבו",
    jeu: { fr: "Le Choulhan Aroukh écrit « roubia, c'est-à-dire tiltan », et Rachi dit de même sur Horayot 12a. Le mahzor Koren le glose « חילבה ». C'est la lecture du texte.",
           en: "The Shulchan Arukh writes “rubia, that is tiltan”, and Rashi says the same on Horayot 12a. The Koren mahzor glosses it “חילבה”. That is the reading of the text.",
           he: "השולחן ערוך: ״רוביא דהיינו תלתן״, וכן רש״י בהוריות יב ע״א. מחזור קורן מגלה ״חילבה״." } },
  { cle: "loubia", nom: { fr: "La loubia", en: "Black-eyed peas", he: "לוביא" }, mot: "לוביא · ירבו · לב",
    jeu: { fr: "Le Ben Ich Haï écrit que la roubia est « ce qu'on appelle loubia en arabe », et Rav Khalfon de Djerba écrit pareil. En pays arabophone, on ajoute « outelabevénou » : le mot fait entendre lev, le cœur.",
           en: "The Ben Ish Hai writes that rubia is “what we call lubia in Arabic”, and Rav Khalfon of Djerba writes the same. In Arabic-speaking lands one adds “u-telabevenu”: the word sounds of lev, the heart.",
           he: "הבן איש חי: ״הרוביא — מה שקורין בלשון ערבי לוביא״, וכן הרב כלפון מג׳רבה. מוסיפים ״ותלבבנו״, על שם לב." } },
  { cle: "poireau", nom: { fr: "Le poireau", en: "The leek", he: "הכרתי" }, mot: "כרתי · יכרתו",
    jeu: { fr: "Karti fait entendre yikartou : qu'ils soient retranchés. À Djerba, karat.",
           en: "Karti sounds like yikartu: may they be cut off. In Djerba, karat.",
           he: "כרתי מזכיר ״שיכרתו״. בג׳רבה ״כראת״." } },
  { cle: "blette", nom: { fr: "La blette", en: "The chard", he: "הסלקא" }, mot: "סלקא · יסתלקו",
    jeu: { fr: "Silka fait entendre yistalkou : qu'ils s'écartent. À Djerba, salq. À Tunis, ce sont les épinards, en beignets au miel.",
           en: "Silka sounds like yistalku: may they depart. In Djerba, salq. In Tunis, spinach, as honey fritters.",
           he: "סלקא מזכיר ״שיסתלקו״. בג׳רבה ״סלק״. בתוניס — תרד, בלביבות בדבש." } },
  { cle: "betterave", nom: { fr: "La betterave", en: "The beet", he: "הסלק" }, mot: "סלק · יסתלקו",
    jeu: { fr: "Même jeu de mots, autre légume : le rite achkénaze prend la betterave là où le séfarade prend la blette.",
           en: "Same wordplay, another vegetable: the Ashkenazi rite takes the beet where the Sephardi takes chard.",
           he: "אותו משחק מילים, ירק אחר: אשכנז נוטל סלק, ספרד סלקא." } },
  { cle: "tete", nom: { fr: "La tête", en: "The head", he: "הראש" }, mot: "ראש",
    jeu: { fr: "À la tête et non à la queue. Tête d'agneau de préférence, en souvenir du bélier d'Its'hak ; à défaut, une tête de poisson. Le Ben Ich Haï écarte la tête de chèvre.",
           en: "The head and not the tail. A lamb's head by preference, recalling Isaac's ram; failing that, a fish head. The Ben Ish Hai rules out a goat's head.",
           he: "לראש ולא לזנב. ראש כבש, זכר לאילו של יצחק; ואם אין — ראש דג. הבן איש חי שולל ראש עז." } },
  { cle: "poisson", nom: { fr: "Le poisson", en: "The fish", he: "הדגים" }, mot: "דגים",
    jeu: { fr: "Féconds et nombreux comme les poissons. À Tunis, certains ajoutent : et veille sur nous d'un œil ouvert, car le poisson n'a pas de paupière.",
           en: "Fruitful and many as fish. In Tunis some add: and watch over us with an open eye, for the fish has no eyelid.",
           he: "שנפרה ונרבה כדגים. בתוניס יש מוסיפים ״ותשגח עלינו בעינא פקיחא״." } },
  { cle: "figue", nom: { fr: "La figue", en: "The fig", he: "התאנה" }, mot: "דבלה",
    jeu: { fr: "Elle ouvre le sédèr de Tunis, avant même la grenade et la pomme : que l'année soit douce comme la figue.",
           en: "It opens the Tunis seder, before the pomegranate and the apple: may the year be sweet as the fig.",
           he: "פותחת את סדר תוניס, לפני הרימון והתפוח: שנה מתוקה כדבלה." } },
  { cle: "sesame", nom: { fr: "Le sésame", en: "Sesame", he: "השומשום" }, mot: "שומשמין · ירבו",
    jeu: { fr: "Propre à Tunis : que nos mérites soient aussi nombreux que les graines de sésame.",
           en: "Particular to Tunis: may our merits be as many as sesame seeds.",
           he: "מיוחד לתוניס: שירבו זכיותינו כשומשמין." } },
  { cle: "feves", nom: { fr: "Les fèves", en: "Broad beans", he: "הפול" }, mot: "פול · יפלו",
    jeu: { fr: "Propre à Tunis : foul fait entendre yipolou, qu'ils tombent devant nous.",
           en: "Particular to Tunis: foul sounds like yipolu, may they fall before us.",
           he: "מיוחד לתוניס: פול מזכיר ״שיפלו״." } },
  { cle: "ail", nom: { fr: "L'ail", en: "Garlic", he: "השום" }, mot: "שום · יתמו",
    jeu: { fr: "Propre à Tunis, où il porte la demande que d'autres attachent à la datte : que disparaissent de devant nous ceux qui nous veulent du mal.",
           en: "Particular to Tunis, carrying the request others attach to the date: may those who wish us harm vanish from before us.",
           he: "מיוחד לתוניס, ונושא את הבקשה שאחרים תולים בתמר." } },
  { cle: "miel", nom: { fr: "Le miel", en: "Honey", he: "הדבש" }, mot: "דבש",
    jeu: { fr: "À Tunis, le miel est un siman à part entière, avec sa propre bénédiction chéhakol : douce comme le miel, du début de l'année jusqu'à sa fin.",
           en: "In Tunis, honey is a siman in its own right, with its own shehakol blessing: sweet as honey, from the start of the year to its end.",
           he: "בתוניס הדבש הוא סימן בפני עצמו, בברכת שהכל: מתוקה כדבש, מראשית השנה ועד אחרית שנה." } },
];
