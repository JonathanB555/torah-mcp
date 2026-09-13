/**
 * /kippour, la journée du Cohen Gadol, station par station.
 *
 * L'idée de la page : Kippour, on croit le connaître par le jeûne. Or la
 * Michna décrit d'abord une journée de travail, celle d'un homme seul qui
 * entre là où personne n'entre. On avance station par station, et chaque
 * station montre son texte.
 *
 * Tout ce qui est cité ici a été lu sur Sefaria, jamais de mémoire. Les
 * références exactes sont dans STATIONS et dans la section des sources.
 */

import { type Lang, href, altLinks, langSwitcher, htmlAttrs, colophon, retourTab, SITE } from "./i18n";

const PATH = "/kippour";

/** Une station de la journée : son texte hébreu, sa traduction, sa référence. */
type Station = {
  cle: string;
  heb: string;
  ref: string;
  fr: { t: string; g: string; d: string };
  en: { t: string; g: string; d: string };
  he: { t: string; g: string; d: string };
};

const STATIONS: Station[] = [
  {
    cle: "sorts",
    heb: "אֶחָד כָּתוּב עָלָיו לַשֵּׁם וְאֶחָד כָּתוּב עָלָיו לַעֲזָאזֵל",
    ref: "Michna Yoma 4:1",
    fr: {
      t: "Les deux sorts",
      g: "« Sur l'un est écrit : pour le Nom. Sur l'autre : pour Azazel. »",
      d: "Deux boucs identiques, achetés ensemble, de même taille et de même prix. Rien ne les distingue jusqu'à ce que la main tirée au hasard décide lequel monte à l'autel et lequel part au désert. Le peuple répond alors : béni soit le nom de la gloire de son règne.",
    },
    en: {
      t: "The two lots",
      g: "“Upon one is written: for God. Upon the other: for Azazel.”",
      d: "Two identical goats, bought together, alike in size and price. Nothing tells them apart until a hand drawn at random decides which one goes to the altar and which one goes to the wilderness. The people then answer: blessed be the name of His glorious kingdom.",
    },
    he: {
      t: "שני הגורלות",
      g: "«אחד כתוב עליו לשם ואחד כתוב עליו לעזאזל»",
      d: "שני שעירים זהים, נקנים יחד, שווים במראה ובדמים. דבר אינו מבחין ביניהם עד שהיד העולה בגורל קובעת מי לה' ומי למדבר. והעם עונה אחריו: ברוך שם כבוד מלכותו לעולם ועד.",
    },
  },
  {
    cle: "encens",
    heb: "צָבַר אֶת הַקְּטֹרֶת עַל גַּבֵּי גֶחָלִים, וְנִתְמַלֵּא כָל הַבַּיִת כֻּלּוֹ עָשָׁן",
    ref: "Michna Yoma 5:1",
    fr: {
      t: "L'entrée",
      g: "« Il amoncelle l'encens sur les braises, et toute la maison s'emplit de fumée. »",
      d: "Une fois l'an, un seul homme franchit le rideau. La Michna précise que la mesure de l'encens est celle de ses propres mains : le grand selon sa grandeur, le petit selon sa petitesse. Le rite est le même pour tous, l'instrument est le corps de celui qui l'accomplit.",
    },
    en: {
      t: "The entry",
      g: "“He piles the incense upon the coals, and the whole chamber fills with smoke.”",
      d: "Once a year, one man alone passes the curtain. The Mishna notes that the measure of incense is his own hands: the large according to his size, the small according to his. The rite is the same for everyone, the instrument is the body of the one performing it.",
    },
    he: {
      t: "הכניסה",
      g: "«צבר את הקטורת על גבי גחלים, ונתמלא כל הבית כולו עשן»",
      d: "אחת בשנה, אדם אחד בלבד עובר את הפרוכת. המשנה מדייקת שמידת הקטורת היא מידת חופניו: הגדול לפי גודלו והקטן לפי קוטנו. המעשה אחד לכול, והכלי הוא גופו של העושה.",
    },
  },
  {
    cle: "priere",
    heb: "וְלֹא הָיָה מַאֲרִיךְ בִּתְפִלָּתוֹ, שֶׁלֹּא לְהַבְעִית אֶת יִשְׂרָאֵל",
    ref: "Michna Yoma 5:1",
    fr: {
      t: "La prière courte",
      g: "« Il ne prolongeait pas sa prière, pour ne pas effrayer Israël. »",
      d: "C'est la ligne la plus humaine de tout le traité. Dehors, le peuple compte les secondes. Si le Cohen Gadol tarde, on en conclura qu'il est mort à l'intérieur. Sa prière doit donc être brève, non par manque de ferveur, mais par égard pour ceux qui attendent.",
    },
    en: {
      t: "The short prayer",
      g: "“He would not extend his prayer, so as not to alarm Israel.”",
      d: "This is the most human line in the whole tractate. Outside, the people are counting the seconds. If the High Priest lingers, they will conclude he has died inside. His prayer must be brief, not from lack of fervour, but out of regard for those waiting.",
    },
    he: {
      t: "התפילה הקצרה",
      g: "«ולא היה מאריך בתפילתו, שלא להבעית את ישראל»",
      d: "זו השורה האנושית ביותר במסכת כולה. בחוץ העם סופר את הרגעים. אם יאחר הכהן הגדול, יסיקו שמת בפנים. תפילתו חייבת אפוא להיות קצרה, לא מחוסר כוונה אלא מתוך התחשבות במי שממתין.",
    },
  },
  {
    cle: "desert",
    heb: "דַּרְכִּיּוֹת הָיוּ עוֹשִׂין, וּמְנִיפִין בַּסּוּדָרִין",
    ref: "Michna Yoma 6:8",
    fr: {
      t: "Le bouc au désert",
      g: "« On dressait des estrades, et l'on agitait des étoffes. »",
      d: "Trois milles séparent Jérusalem du bord du désert. Pour savoir que le bouc est arrivé, on poste des hommes sur des estrades tout au long du chemin, et ils se passent le signal en agitant des tissus. Un télégraphe de foulards, deux mille ans avant le télégraphe.",
    },
    en: {
      t: "The goat to the wilderness",
      g: "“They would build platforms, and wave scarves.”",
      d: "Three mil separate Jerusalem from the edge of the wilderness. To know the goat has arrived, men are posted on platforms along the way, relaying the signal by waving cloths. A telegraph of scarves, two thousand years before the telegraph.",
    },
    he: {
      t: "השעיר למדבר",
      g: "«דרכיות היו עושין, ומניפין בסודרין»",
      d: "שלושה מילין מפרידים בין ירושלים לקצה המדבר. כדי לדעת שהגיע השעיר, מציבים אנשים על דרכיות לאורך הדרך, והם מעבירים את האות בהנפת סודרים. מברק של סודרים, אלפיים שנה לפני המברק.",
    },
  },
  {
    cle: "fil",
    heb: "וּכְשֶׁהִגִּיעַ שָׂעִיר לַמִּדְבָּר הָיָה הַלָּשׁוֹן מַלְבִּין",
    ref: "Michna Yoma 6:8",
    fr: {
      t: "Le fil qui blanchit",
      g: "« Quand le bouc atteignait le désert, la langue de laine blanchissait. »",
      d: "Un fil teint en écarlate est noué à l'entrée du sanctuaire. À l'instant où le bouc arrive, il change de couleur. Rabbi Yichmaël rattache le signe au verset d'Isaïe : si vos fautes sont comme l'écarlate, elles blanchiront comme la neige.",
    },
    en: {
      t: "The thread that whitens",
      g: "“When the goat reached the wilderness, the strip would turn white.”",
      d: "A crimson-dyed thread is tied at the entrance of the Sanctuary. The moment the goat arrives, it changes colour. Rabbi Yishmael ties the sign to the verse in Isaiah: though your sins be as scarlet, they shall become white as snow.",
    },
    he: {
      t: "הלשון שהלבינה",
      g: "«וכשהגיע שעיר למדבר היה הלשון מלבין»",
      d: "לשון של זהורית קשורה על פתחו של היכל. ברגע שהשעיר מגיע, היא מחליפה את צבעה. רבי ישמעאל תולה את הסימן בפסוק בישעיהו: אם יהיו חטאיכם כשנים כשלג ילבינו.",
    },
  },
];

/** Les cinq interdits de la Michna, avec ce que chacun retire vraiment. */
const INUYIM = [
  { heb: "אֲכִילָה וּשְׁתִיָּה", fr: "Manger et boire", en: "Eating and drinking", he: "אכילה ושתייה" },
  { heb: "רְחִיצָה", fr: "Se laver", en: "Washing", he: "רחיצה" },
  { heb: "סִיכָה", fr: "S'oindre", en: "Anointing", he: "סיכה" },
  { heb: "נְעִילַת הַסַּנְדָּל", fr: "Porter le cuir", en: "Wearing leather", he: "נעילת הסנדל" },
  { heb: "תַּשְׁמִישׁ הַמִּטָּה", fr: "L'union conjugale", en: "Conjugal relations", he: "תשמיש המיטה" },
];

const S = {
  fr: {
    titre: "La journée du Cohen Gadol",
    sur: "Kippour",
    meta: "Kippour vu depuis le traité Yoma : les deux sorts, l'entrée dans le Saint des saints, le fil écarlate, les cinq interdits. Chaque étape avec son texte.",
    chapeau: "On croit connaître Kippour par le jeûne. La Michna, elle, décrit d'abord une journée de travail : celle d'un homme seul qui entre une fois l'an là où personne n'entre, pendant que dehors le peuple compte les secondes.",
    navJour: "La journée", navCinq: "Les cinq", navFil: "Le fil", navBougie: "La bougie", navSources: "Les sources",
    jourTitre: "Station par station",
    jourAide: "Choisissez une station. Le texte de la Michna apparaît, dans sa langue et dans la vôtre.",
    cinqTitre: "Les cinq interdits",
    cinqIntro: "La Michna en énumère six, la tradition en compte cinq : manger et boire ne font qu'un.",
    cinqHeb: "יוֹם הַכִּפּוּרִים אָסוּר בַּאֲכִילָה וּבִשְׁתִיָּה וּבִרְחִיצָה וּבְסִיכָה וּבִנְעִילַת הַסַּנְדָּל וּבְתַשְׁמִישׁ הַמִּטָּה",
    cinqRef: "Michna Yoma 8:1",
    cinqSurprise: "Ce que la même michna ajoute, et qu'on cite rarement",
    cinqSurpriseP: "Rabbi Éliézer accorde trois exceptions : le roi et la jeune mariée peuvent se laver le visage, et la femme qui vient d'accoucher peut se chausser. Le roi pour sa dignité, la mariée parce qu'elle est dans son premier mois, l'accouchée parce que le froid la ferait souffrir. Puis vient la phrase la plus brève du traité : et les sages interdisent. Trois égards humains proposés, trois refusés, et les deux avis conservés côte à côte.",
    cinqSurpriseHeb: "וְהַמֶּלֶךְ וְהַכַּלָּה יִרְחֲצוּ אֶת פְּנֵיהֶם, וְהֶחָיָה תִנְעֹל אֶת הַסַּנְדָּל, דִּבְרֵי רַבִּי אֱלִיעֶזֶר, וַחֲכָמִים אוֹסְרִין",
    filTitre: "Le jour où le fil a cessé de blanchir",
    filP1: "Le fil écarlate n'a pas toujours blanchi. Une braïta du traité Yoma rapporte que pendant les quarante années qui ont précédé la destruction du second Temple, quatre signes se sont éteints ensemble : le sort pour le Nom ne montait plus dans la main droite, le fil ne blanchissait plus, la lampe occidentale du candélabre ne brûlait plus, et les portes du sanctuaire s'ouvraient d'elles-mêmes.",
    filP2: "Rabban Yohanan ben Zakkaï finit par s'adresser au bâtiment lui-même : sanctuaire, sanctuaire, pourquoi t'effraies-tu ? Je sais de toi que tu seras détruit.",
    filP3: "Et le Talmud ajoute une étymologie qui éclaire tout le reste. Pourquoi le Temple est-il appelé Levanon ? Parce qu'il blanchit les fautes d'Israël. Le fil ne faisait donc qu'afficher au dehors ce que la maison portait dans son nom.",
    filHeb: "לָמָּה נִקְרָא שְׁמוֹ לְבָנוֹן, שֶׁמַּלְבִּין עֲוֹנוֹתֵיהֶן שֶׁל יִשְׂרָאֵל",
    filRef: "Talmud, Yoma 39b : lu sur Sefaria",
    bougieTitre: "Pourquoi une bougie brûle vingt-quatre heures",
    bougieP1: "On la croit funèbre. La Michna Beroura dit l'inverse. Le prophète demande d'honorer le jour saint de l'Éternel, et ce jour, écrit-elle, c'est Kippour. Or une fête s'honore par un repas. Celle-là ne le peut pas. On l'honore donc par des vêtements propres et par la lumière : la bougie remplace le repas.",
    bougieP2: "Il y en a deux, et la seconde est bien pour les morts. Le Rama demande d'allumer aussi une bougie d'âme pour son père et sa mère. La Michna Beroura explique à quoi elle sert, en deux mots : pour les expier. Ce n'est pas un souvenir, c'est une réparation, et Kippour pardonne aussi à ceux qui ne sont plus là.",
    bougieP3: "Le Rama ajoute enfin ce qu'il faut faire si elle s'éteint dans la journée. On ne la rallume pas, et l'on ne demande à personne de le faire. On la rallume à la sortie de Kippour, on la laisse brûler jusqu'au bout, et l'on s'engage pour tous ses jours à ce qu'elle ne soit plus jamais éteinte.",
    bougieHeb: "גַּם נֵר נְשָׁמָה לְאָבִיו וּלְאִמּוֹ שֶׁמֵּתוּ",
    bougieRef: "Choulhan Aroukh, Orah Hayim 610:4, glose du Rama · Michna Beroura 610:9 et 610:12",
    sourcesTitre: "Les sources, une par une",
    sourcesIntro: "Tout ce qui est cité sur cette page a été lu dans le texte, sur Sefaria. Rien n'est cité de mémoire, rien n'est vocalisé par nos soins.",
    retour: "Retour au site",
    sommaire: "Sommaire",
    question: "Poser une question",
    quest: "Une question sur Kippour ?",
    questP: "Le connecteur lit les textes et répond à partir de ce qu'il a lu, en vous montrant ses sources.",
  },
  en: {
    titre: "The High Priest's day",
    sur: "Yom Kippur",
    meta: "Yom Kippur through tractate Yoma: the two lots, the entry into the Holy of Holies, the crimson thread, the five prohibitions. Each step with its text.",
    chapeau: "We think we know Yom Kippur through the fast. The Mishna describes something else first: a working day, that of one man who enters once a year where no one enters, while outside the people count the seconds.",
    navJour: "The day", navCinq: "The five", navFil: "The thread", navBougie: "The candle", navSources: "Sources",
    jourTitre: "Station by station",
    jourAide: "Choose a station. The text of the Mishna appears, in its own language and in yours.",
    cinqTitre: "The five prohibitions",
    cinqIntro: "The Mishna lists six, tradition counts five: eating and drinking are one.",
    cinqHeb: "יוֹם הַכִּפּוּרִים אָסוּר בַּאֲכִילָה וּבִשְׁתִיָּה וּבִרְחִיצָה וּבְסִיכָה וּבִנְעִילַת הַסַּנְדָּל וּבְתַשְׁמִישׁ הַמִּטָּה",
    cinqRef: "Mishna Yoma 8:1",
    cinqSurprise: "What the same mishna adds, and is rarely quoted",
    cinqSurpriseP: "Rabbi Eliezer allows three exceptions: the king and the new bride may wash their faces, and a woman who has just given birth may wear shoes. The king for his dignity, the bride because she is in her first month, the new mother because the cold would cause her pain. Then comes the shortest sentence in the tractate: and the Sages forbid. Three human allowances offered, three refused, and both views kept side by side.",
    cinqSurpriseHeb: "וְהַמֶּלֶךְ וְהַכַּלָּה יִרְחֲצוּ אֶת פְּנֵיהֶם, וְהֶחָיָה תִנְעֹל אֶת הַסַּנְדָּל, דִּבְרֵי רַבִּי אֱלִיעֶזֶר, וַחֲכָמִים אוֹסְרִין",
    filTitre: "The day the thread stopped turning white",
    filP1: "The crimson thread did not always turn white. A baraita in tractate Yoma reports that during the forty years before the destruction of the Second Temple, four signs went out together: the lot for God no longer came up in the right hand, the thread no longer turned white, the westernmost lamp of the candelabrum no longer burned, and the doors of the Sanctuary opened by themselves.",
    filP2: "Rabban Yohanan ben Zakkai ended up addressing the building itself: Sanctuary, Sanctuary, why do you frighten yourself? I know about you that you will be destroyed.",
    filP3: "And the Talmud adds an etymology that lights up everything else. Why is the Temple called Levanon? Because it whitens the sins of Israel. The thread was only displaying outside what the house carried in its name.",
    filHeb: "לָמָּה נִקְרָא שְׁמוֹ לְבָנוֹן, שֶׁמַּלְבִּין עֲוֹנוֹתֵיהֶן שֶׁל יִשְׂרָאֵל",
    filRef: "Talmud, Yoma 39b: read on Sefaria",
    bougieTitre: "Why a candle burns twenty-four hours",
    bougieP1: "It is thought to be funereal. The Mishna Berura says the opposite. The prophet asks that the holy day of the Lord be honoured, and that day, it writes, is Yom Kippur. Now a festival is honoured with a meal. This one cannot be. So it is honoured with clean clothes and with light: the candle replaces the meal.",
    bougieP2: "There are two, and the second one is indeed for the dead. The Rema asks that a soul candle also be lit for one's father and mother. The Mishna Berura explains its purpose in two words: to atone for them. It is not remembrance, it is repair, and Yom Kippur forgives those who are no longer here too.",
    bougieP3: "The Rema finally adds what to do if it goes out during the day. You do not relight it, and you ask no one else to. You relight it at the close of Yom Kippur, you let it burn to the end, and you undertake for all your days that it will never be put out again.",
    bougieHeb: "גַּם נֵר נְשָׁמָה לְאָבִיו וּלְאִמּוֹ שֶׁמֵּתוּ",
    bougieRef: "Shulchan Arukh, Orach Chayim 610:4, Rema's gloss · Mishna Berura 610:9 and 610:12",
    sourcesTitre: "The sources, one by one",
    sourcesIntro: "Everything quoted on this page was read in the text, on Sefaria. Nothing is quoted from memory, nothing is vocalised by us.",
    retour: "Back to the site",
    sommaire: "Contents",
    question: "Ask a question",
    quest: "A question about Yom Kippur?",
    questP: "The connector reads the texts and answers from what it has read, showing you its sources.",
  },
  he: {
    titre: "יומו של הכהן הגדול",
    sur: "יום הכיפורים",
    meta: "יום הכיפורים מתוך מסכת יומא: שני הגורלות, הכניסה לקודש הקודשים, לשון הזהורית, חמשת העינויים. כל שלב עם מקורו.",
    chapeau: "נדמה לנו שאנו מכירים את יום הכיפורים דרך הצום. המשנה מתארת קודם כול דבר אחר: יום עבודה, יומו של אדם אחד הנכנס פעם בשנה למקום שאיש אינו נכנס אליו, בעוד בחוץ העם סופר את הרגעים.",
    navJour: "היום", navCinq: "החמישה", navFil: "הלשון", navBougie: "הנר", navSources: "המקורות",
    jourTitre: "תחנה אחר תחנה",
    jourAide: "בחרו תחנה. לשון המשנה תופיע, בשפתה ובשפתכם.",
    cinqTitre: "חמשת העינויים",
    cinqIntro: "המשנה מונה שישה, והמסורת מונה חמישה: אכילה ושתייה אחת הן.",
    cinqHeb: "יוֹם הַכִּפּוּרִים אָסוּר בַּאֲכִילָה וּבִשְׁתִיָּה וּבִרְחִיצָה וּבְסִיכָה וּבִנְעִילַת הַסַּנְדָּל וּבְתַשְׁמִישׁ הַמִּטָּה",
    cinqRef: "משנה יומא ח׳:א׳",
    cinqSurprise: "מה שאותה משנה מוסיפה, וממעטים לצטט",
    cinqSurpriseP: "רבי אליעזר מתיר שלושה: המלך והכלה רוחצים את פניהם, והחיה נועלת את הסנדל. המלך מפני כבודו, הכלה מפני שהיא בחודשה הראשון, והיולדת מפני שהצינה מצערת אותה. ואז באה השורה הקצרה במסכת: וחכמים אוסרין. שלוש התחשבויות אנושיות הוצעו, שלוש נדחו, ושתי הדעות נשמרו זו לצד זו.",
    cinqSurpriseHeb: "וְהַמֶּלֶךְ וְהַכַּלָּה יִרְחֲצוּ אֶת פְּנֵיהֶם, וְהֶחָיָה תִנְעֹל אֶת הַסַּנְדָּל, דִּבְרֵי רַבִּי אֱלִיעֶזֶר, וַחֲכָמִים אוֹסְרִין",
    filTitre: "היום שבו חדלה הלשון להלבין",
    filP1: "לשון הזהורית לא תמיד הלבינה. ברייתא במסכת יומא מוסרת שבארבעים השנים שקדמו לחורבן הבית השני כבו ארבעה סימנים יחד: הגורל לשם לא היה עולה בימין, הלשון לא הייתה מלבינה, נר מערבי לא היה דולק, ודלתות ההיכל היו נפתחות מאליהן.",
    filP2: "רבן יוחנן בן זכאי פנה בסופו של דבר אל הבניין עצמו: היכל היכל, מפני מה אתה מבעית עצמך? יודע אני בך שסופך ליחרב.",
    filP3: "והתלמוד מוסיף מדרש שם המאיר את כל השאר. למה נקרא שמו לבנון? שמלבין עוונותיהן של ישראל. הלשון רק הראתה כלפי חוץ את מה שהבית נשא בשמו.",
    filHeb: "לָמָּה נִקְרָא שְׁמוֹ לְבָנוֹן, שֶׁמַּלְבִּין עֲוֹנוֹתֵיהֶן שֶׁל יִשְׂרָאֵל",
    filRef: "תלמוד בבלי, יומא ל״ט ב, נקרא בספריא",
    bougieTitre: "מדוע נר דולק עשרים וארבע שעות",
    bougieP1: "חושבים שהוא נר אבלות. המשנה ברורה אומרת את ההפך. הנביא מבקש לכבד את קדוש ה׳, ואותו יום, היא כותבת, הוא יום הכיפורים. והרי חג מכבדים בסעודה. את זה אי אפשר. מכבדים אותו אפוא בכסות נקייה ובנרות: הנר בא במקום הסעודה.",
    bougieP2: "שניים הם, והשני אכן למתים. הרמ״א מבקש להדליק גם נר נשמה לאביו ולאמו. המשנה ברורה מסבירה את תכליתו בשתי מילים: לכפר עליהם. אין זה זיכרון אלא תיקון, ויום הכיפורים מכפר גם על מי שאינם עוד.",
    bougieP3: "הרמ״א מוסיף לבסוף מה לעשות אם כבה במהלך היום. אין מדליקים אותו, ואין אומרים לאחר להדליקו. מדליקים אותו במוצאי יום הכיפורים, מניחים לו לדלוק עד גמירא, ומקבלים על עצמו לכל ימיו שלא יכבה עוד לעולם.",
    bougieHeb: "גַּם נֵר נְשָׁמָה לְאָבִיו וּלְאִמּוֹ שֶׁמֵּתוּ",
    bougieRef: "שולחן ערוך אורח חיים תר״י:ד׳, הגהת הרמ״א · משנה ברורה תר״י:ט׳ ותר״י:י״ב",
    sourcesTitre: "המקורות, אחד אחד",
    sourcesIntro: "כל המצוטט בעמוד זה נקרא בגוף הטקסט, בספריא. דבר אינו מצוטט מן הזיכרון, ודבר אינו מנוקד בידינו.",
    retour: "חזרה לאתר",
    sommaire: "תוכן",
    question: "לשאול שאלה",
    quest: "שאלה על יום הכיפורים?",
    questP: "המחבר קורא את הטקסטים ומשיב מתוך מה שקרא, ומראה לכם את מקורותיו.",
  },
} as const;

export function kippourHtml(lang: Lang): string {
  const s = S[lang];
  const rtl = lang === "he";

  const boutons = STATIONS.map((st, i) =>
    `<button class="rb${i === 0 ? " on" : ""}" data-st="${st.cle}" type="button">` +
    `<b>${i + 1}</b> ${st[lang].t}</button>`
  ).join("");

  const panneaux = STATIONS.map((st, i) =>
    `<article class="st" data-st="${st.cle}"${i === 0 ? "" : " hidden"}>
      <p class="heb">${st.heb}</p>
      <p class="tr">${st[lang].g}</p>
      <p class="ref">${st.ref}</p>
      <p class="dit">${st[lang].d}</p>
    </article>`
  ).join("");

  const cartesInui = INUYIM.map((x, i) =>
    `<li><span class="num">${i + 1}</span><span class="ih">${x.heb}</span><span class="il">${x[lang]}</span></li>`
  ).join("");

  return `<!doctype html>
<html ${htmlAttrs(lang)}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.titre} · ${s.sur} · Mamash IA</title>
<meta name="description" content="${s.meta}">
<meta property="og:title" content="${s.titre} · ${s.sur}">
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
  nav { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1.5rem 0; flex-wrap:wrap; }
  nav .wm { font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.92rem; text-transform:uppercase; letter-spacing:.05em; text-decoration:none; direction:ltr; display:flex; align-items:center; gap:.55rem; }
  nav .wm img { width:30px; height:30px; border-radius:50%; }
  nav .r { display:flex; align-items:center; gap:1.1rem; flex-wrap:wrap; }
  nav .r a { font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.7rem; letter-spacing:.09em; text-transform:uppercase; text-decoration:none; }
  main { max-width:1080px; margin:0 auto; }
  h1 { font-family:"Fraunces",Georgia,serif; font-weight:300; font-size:clamp(2.4rem,6vw,4.4rem); line-height:1.02; letter-spacing:-.025em; margin-top:1.5rem; }
  h1 .sur { display:block; font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.2em; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); margin-bottom:.9rem; }
  [dir="rtl"] h1 { font-family:"Frank Ruhl Libre",Georgia,serif; letter-spacing:0; }
  .chapeau { margin-top:1.4rem; font-size:clamp(1.05rem,1.7vw,1.28rem); max-width:34em; color:var(--muted); }
  h2 { font-family:"Fraunces",Georgia,serif; font-weight:300; font-size:clamp(1.7rem,3.4vw,2.6rem); line-height:1.08; letter-spacing:-.02em; }
  [dir="rtl"] h2, [dir="rtl"] h3 { font-family:"Frank Ruhl Libre",Georgia,serif; letter-spacing:0; }
  section { margin-top:clamp(3.2rem,6vw,5rem); scroll-margin-top:7.5rem; }

  .toc { position:sticky; top:0; z-index:40; display:flex; flex-wrap:wrap; gap:0; margin-top:2.4rem;
    background:var(--paper); border-top:2px solid var(--ink); border-bottom:2px solid var(--ink); }
  .toc a { display:flex; align-items:baseline; gap:.5rem; padding:.7rem 1rem .75rem; text-decoration:none;
    font-family:"Rubik","Arial Black",sans-serif; font-weight:900; font-size:.68rem; letter-spacing:.11em;
    text-transform:uppercase; border-inline-end:1px solid var(--line); transition:background .2s, color .2s; }
  [dir="rtl"] .toc a { font-family:"Frank Ruhl Libre",serif; letter-spacing:0; font-size:.82rem; }
  .toc a b { font-family:"Frank Ruhl Libre",serif; font-size:1.05rem; font-weight:700; color:var(--muted); }
  .toc a:hover { background:var(--pop); }
  .toc a.ici { background:var(--ink); color:var(--pop); }
  .toc a.ici b { color:var(--pop); }
  .toc a.tocq { margin-inline-start:auto; border-inline-end:0; background:var(--pop); }
  .toc a.tocq:hover { background:var(--ink); color:var(--pop); }

  .ot { display:inline-grid; place-items:center; width:2.1rem; height:2.1rem; background:var(--ink);
    color:var(--pop); font-family:"Frank Ruhl Libre",serif; font-size:1.25rem; font-weight:700;
    line-height:1; margin-bottom:.7rem; }
  .dossier .ot { background:var(--pop); color:var(--ink); }
  .stitre { margin-top:.7rem; color:var(--muted); max-width:38em; }

  /* --- la journée, station par station --- */
  .rbs { display:flex; flex-wrap:wrap; gap:.6rem; margin:1.6rem 0 .6rem; }
  .rb { font:inherit; font-size:.95rem; text-align:start; color:var(--ink); background:#fff; border:1.5px solid var(--line); padding:.6rem .95rem .65rem; cursor:pointer; transition:border-color .2s, background .2s; }
  .rb b { font-family:"Rubik",sans-serif; font-size:.72rem; color:var(--muted); margin-inline-end:.35rem; }
  .rb:hover { border-color:var(--ink); }
  .rb.on { background:var(--pop); border-color:var(--ink); border-width:2px; padding:calc(.6rem - .5px) calc(.95rem - .5px) calc(.65rem - .5px); font-weight:600; }
  .rb.on b { color:var(--ink); }
  .aide { font-size:.9rem; color:var(--muted); margin-bottom:1.6rem; }
  .st { border-top:2px solid var(--ink); border-bottom:2px solid var(--ink); padding:2rem 0 2.2rem; }
  .st[hidden] { display:none; }
  .st .heb { font-family:"Frank Ruhl Libre",serif; font-size:clamp(1.3rem,2.9vw,2.1rem); line-height:1.75; direction:rtl; text-align:center; }
  .st .tr { font-family:"Fraunces",Georgia,serif; font-weight:300; font-size:clamp(1.1rem,2vw,1.5rem); line-height:1.35; text-align:center; max-width:28em; margin:1.2rem auto 0; }
  .st .ref { margin-top:1rem; text-align:center; font-size:.85rem; color:var(--muted); }
  .st .dit { margin:1.6rem auto 0; max-width:38em; }

  /* --- les cinq --- */
  .cinq { list-style:none; padding:0; display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr)); gap:1rem; margin-top:1.8rem; }
  .cinq li { border-top:2px solid var(--ink); padding-top:.8rem; display:grid; gap:.25rem; }
  .cinq .num { font-family:"Rubik",sans-serif; font-weight:900; font-size:.7rem; color:var(--muted); }
  .cinq .ih { font-family:"Frank Ruhl Libre",serif; font-size:1.3rem; direction:rtl; text-align:start; }
  .cinq .il { font-size:.93rem; color:var(--muted); }
  .surp { margin-top:2.4rem; border-inline-start:3px solid var(--pop); padding-inline-start:1.3rem; max-width:42em; }
  .surp h3 { font-family:"Fraunces",Georgia,serif; font-weight:600; font-size:1.1rem; }
  .surp p { margin-top:.7rem; }
  .surp .hebline { font-family:"Frank Ruhl Libre",serif; direction:rtl; text-align:start; font-size:1.15rem; margin-top:1rem; color:var(--muted); }

  /* --- le dossier --- */
  .dossier { background:var(--ink); color:var(--paper); padding:clamp(2rem,4vw,3.4rem); }
  .dossier h2 { color:var(--pop); }
  .dossier p { margin-top:1rem; max-width:42em; }
  .dossier .cit { font-family:"Frank Ruhl Libre",serif; direction:rtl; text-align:center; font-size:clamp(1.25rem,2.6vw,1.9rem); line-height:1.7; color:var(--pop); margin:2rem 0 .8rem; }
  .dossier .ref { text-align:center; font-size:.85rem; opacity:.7; }

  /* --- la bougie --- */
  .bougie p { margin-top:1rem; max-width:40em; }
  .bougie .cit { font-family:"Frank Ruhl Libre",serif; direction:rtl; text-align:center; font-size:clamp(1.2rem,2.4vw,1.7rem); margin:2rem 0 .7rem; }
  .bougie .ref { text-align:center; font-size:.85rem; color:var(--muted); }

  .srcs { list-style:none; padding:0; margin-top:1.6rem; max-width:44em; }
  .srcs li { border-top:1px solid var(--line); padding:.7rem 0; display:flex; justify-content:space-between; gap:1.2rem; flex-wrap:wrap; font-size:.93rem; }
  .srcs .quoi { color:var(--muted); }

  .quest { border-top:2px solid var(--ink); padding-top:1.6rem; }
  .quest a.cta { display:inline-block; margin-top:1rem; background:var(--ink); color:var(--pop); text-decoration:none;
    font-family:"Rubik",sans-serif; font-weight:900; font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; padding:.85em 1.4em .9em; }
  .quest a.cta:hover { background:var(--pop); color:var(--ink); }

  footer.site { margin-top:4.5rem; padding-top:1.4rem; border-top:1px solid var(--line); font-size:.86rem; color:var(--muted); }
  footer.site img { width:26px; height:26px; border-radius:50%; display:inline-block; vertical-align:-8px; margin-inline-end:.45rem; }
  .lang a { text-decoration:none; opacity:.6; } .lang .cur { font-weight:700; opacity:1; } .lang .dot { opacity:.35; margin:0 .4em; }

  .rv { opacity:0; transform:translateY(14px); transition:opacity .6s var(--ease), transform .6s var(--ease); }
  .rv.in { opacity:1; transform:none; }
  @media (prefers-reduced-motion:reduce) { .rv { opacity:1; transform:none; transition:none; } html { scroll-behavior:auto; } }
  @media (max-width:760px) {
    .toc a { flex:1 1 auto; justify-content:center; font-size:.56rem; padding:.42rem .4rem .46rem; letter-spacing:.06em; }
    .toc a b { font-size:.9rem; }
    .toc a.tocq { margin-inline-start:0; }
  }
</style>
</head>
<body>
<nav>
  <a class="wm" href="${href(lang, "/")}"><img src="/icon.png" alt="">Mamash IA</a>
  <span class="r"><a href="${href(lang, "/roch-hachana")}">${rtl ? "ראש השנה" : "Roch Hachana"}</a><a href="${href(lang, "/")}">${s.retour}</a><span class="lang">${langSwitcher(lang, PATH)}</span></span>
</nav>
<main>
  <h1><span class="sur">${s.sur}</span>${s.titre}.</h1>
  <p class="chapeau">${s.chapeau}</p>

  <nav class="toc" id="toc" aria-label="${s.sommaire}">
    <a href="#journee" data-cible="journee"><b>א</b>${s.navJour}</a>
    <a href="#cinq" data-cible="cinq"><b>ב</b>${s.navCinq}</a>
    <a href="#fil" data-cible="fil"><b>ג</b>${s.navFil}</a>
    <a href="#bougie" data-cible="bougie"><b>ד</b>${s.navBougie}</a>
    <a href="#sources" data-cible="sources"><b>ה</b>${s.navSources}</a>
    <a href="${href(lang, "/question")}" class="tocq">${s.question}</a>
  </nav>

  <section id="journee">
    <p class="ot">א</p>
    <h2>${s.jourTitre}.</h2>
    <p class="aide">${s.jourAide}</p>
    <div class="rbs" id="rbs">${boutons}</div>
    <div id="stations">${panneaux}</div>
  </section>

  <section id="cinq" class="rv">
    <p class="ot">ב</p>
    <h2>${s.cinqTitre}.</h2>
    <p class="stitre">${s.cinqIntro}</p>
    <ul class="cinq">${cartesInui}</ul>
    <div class="surp">
      <h3>${s.cinqSurprise}</h3>
      <p class="hebline">${s.cinqSurpriseHeb}</p>
      <p>${s.cinqSurpriseP}</p>
      <p class="ref" style="margin-top:.8rem;font-size:.85rem;color:var(--muted)">${s.cinqRef}</p>
    </div>
  </section>

  <section id="fil" class="dossier rv">
    <p class="ot">ג</p>
    <h2>${s.filTitre}</h2>
    <p>${s.filP1}</p>
    <p>${s.filP2}</p>
    <p>${s.filP3}</p>
    <p class="cit">${s.filHeb}</p>
    <p class="ref">${s.filRef}</p>
  </section>

  <section id="bougie" class="bougie rv">
    <p class="ot">ד</p>
    <h2>${s.bougieTitre}.</h2>
    <p>${s.bougieP1}</p>
    <p>${s.bougieP2}</p>
    <p>${s.bougieP3}</p>
    <p class="cit">${s.bougieHeb}</p>
    <p class="ref">${s.bougieRef}</p>
  </section>

  <section id="sources" class="rv">
    <p class="ot">ה</p>
    <h2>${s.sourcesTitre}.</h2>
    <p class="stitre">${s.sourcesIntro}</p>
    <ul class="srcs">
      ${STATIONS.map((st) => `<li><span>${st.ref}</span><span class="quoi">${st[lang].t}</span></li>`).join("")}
      <li><span>${s.cinqRef}</span><span class="quoi">${s.cinqTitre}</span></li>
      <li><span>${rtl ? "תלמוד בבלי, יומא ל״ט ב" : "Talmud, Yoma 39b"}</span><span class="quoi">${s.filTitre}</span></li>
      <li><span>${s.bougieRef}</span><span class="quoi">${s.bougieTitre}</span></li>
    </ul>
  </section>

  <section id="poser" class="quest rv">
    <h2>${s.quest}</h2>
    <p class="stitre">${s.questP}</p>
    <a class="cta" href="${href(lang, "/question")}">${s.question}</a>
  </section>

  <footer class="site">
    <a href="${href(lang, "/")}"><img src="/icon.png" alt="">Mamash IA</a>
    <p style="margin-top:.8rem">${colophon(lang)}</p>
  </footer>
</main>

<script>
(function () {
  "use strict";

  // --- la journée : un bouton montre sa station, les autres se retirent ---
  var rbs = document.getElementById("rbs");
  var panneaux = Array.prototype.slice.call(document.querySelectorAll(".st"));
  if (rbs) {
    rbs.addEventListener("click", function (e) {
      var b = e.target.closest(".rb");
      if (!b) return;
      Array.prototype.forEach.call(rbs.querySelectorAll(".rb"), function (x) {
        x.classList.toggle("on", x === b);
      });
      var cle = b.getAttribute("data-st");
      panneaux.forEach(function (p) { p.hidden = p.getAttribute("data-st") !== cle; });
    });
  }

  // --- les sections apparaissent en arrivant, jamais avant ---
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (x) {
        if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    Array.prototype.forEach.call(document.querySelectorAll(".rv"), function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll(".rv"), function (el) { el.classList.add("in"); });
  }

  // --- le sommaire marque la section où l'on se trouve ---
  var toc = document.getElementById("toc");
  var liens = toc ? Array.prototype.slice.call(toc.querySelectorAll("a[data-cible]")) : [];
  var sections = liens.map(function (a) { return document.getElementById(a.getAttribute("data-cible")); });
  function marquer() {
    var repere = (toc ? toc.getBoundingClientRect().height : 0) + 24;
    var courant = 0;
    sections.forEach(function (sec, i) {
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      if (r.top <= repere && r.bottom > repere) courant = i;
      else if (r.bottom <= repere) courant = Math.max(courant, i);
    });
    liens.forEach(function (a, i) { a.classList.toggle("ici", i === courant); });
  }
  if (liens.length) {
    marquer();
    window.addEventListener("scroll", marquer, { passive: true });
    window.addEventListener("resize", marquer);
  }
})();
</script>
${retourTab(lang, PATH)}
</body>
</html>`;
}
