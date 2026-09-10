/**
 * Skill hebrewbooks-source — répondre aux questions religieuses depuis les
 * textes primaires réellement lus (vérification Sefaria, liens hebrewbooks.org
 * pour la lecture), jamais de mémoire.
 */
// @ts-ignore — bundled as text by wrangler (rules: type=Text)
import skillMd from "./SKILL.md";

import type { Env, ToolDefinition, ToolHandler } from "../sefaria";

export const SKILL_MD = skillMd as unknown as string;

// ----------------------------------------------------------------------------
// Recherche plein texte dans le corpus HebrewBooks — via hebrewbooks.ai.
//
// L'API officielle de hebrewbooks.org est hors d'atteinte : le site entier,
// www comme beta, est derrière un challenge Cloudflare qu'aucun client HTTP
// ne franchit, avec ou sans clé — vérifié depuis une connexion résidentielle
// en présentant un en-tête de navigateur complet. On ne contourne pas une
// protection posée volontairement.
//
// hebrewbooks.ai (Roman Kagan) indexe le même corpus océrisé, environ 50 000
// ouvrages, et expose une recherche morphologique hébraïque sans
// authentification. Elle rend ce que l'API officielle ne rendait pas : le
// passage lui-même, avec sa page et le lien vers le fac-similé.
//
// Service tiers et bénévole : on met la réponse en cache six heures en
// périphérie plutôt que de le solliciter à chaque appel, et une panne se dit
// clairement au lieu de faire croire à un serveur cassé.
// ----------------------------------------------------------------------------

const HB_AI_URL = "https://hebrewbooks.ai/api/search";

async function hebrewbooksSearch(env: Env, args: any): Promise<any> {
  const q = String(args?.q ?? args?.titre ?? "").trim();
  const auteur = String(args?.auteur ?? "").trim();
  if (!q && !auteur) throw new Error("Indiquer au moins une recherche (q) ou un auteur.");
  const limit = Math.min(Math.max(Number(args?.limit) || 10, 1), 30);

  const params = new URLSearchParams({ q, size: String(limit), scope: "all" });
  if (auteur) params.set("author", auteur);
  if (args?.livre) params.set("book", String(args.livre));
  // La traduction automatique vers l'hébreu coûte un appel LLM chez eux :
  // on ne la demande que si la recherche n'est pas déjà en hébreu.
  params.set("translate", /[\u0590-\u05FF]/.test(q) ? "false" : "true");

  let resp: Response;
  try {
    resp = await fetch(`${HB_AI_URL}?${params}`, {
      headers: { "User-Agent": "torah-mcp (+https://mamash-ia.com)" },
      cf: { cacheTtl: 21600, cacheEverything: true },
    } as RequestInit);
  } catch {
    throw new Error(
      "Le service de recherche hebrewbooks.ai est injoignable pour l'instant. " +
        "Utilisez sefaria_search, puis la lecture sur hebrewbooks.org."
    );
  }
  if (!resp.ok) {
    throw new Error(
      `Le service de recherche hebrewbooks.ai a répondu ${resp.status}. ` +
        "Réessayez, ou passez par sefaria_search."
    );
  }
  const data: any = await resp.json();

  return {
    recherche: data.query ?? q,
    total_passages: data.total_chunks ?? 0,
    total_livres: data.total_books ?? 0,
    livres: (data.results || []).map((b: any) => ({
      id: b.book_id,
      titre: b.title_he,
      auteur: b.author_he,
      annee: b.year,
      sujet: b.topic,
      lecture: `https://hebrewbooks.org/${b.book_id}`,
      passages: (b.pages || []).map((p: any) => ({
        page: p.pgnum,
        extrait: p.snippet,
        facsimile: p.source_url,
      })),
    })),
    source: "hebrewbooks.ai (Roman Kagan), corpus océrisé de hebrewbooks.org",
    note:
      "Les extraits viennent d'une reconnaissance optique : ils comportent des " +
      "erreurs de lecture et ne sont pas vocalisés. Ils servent à localiser un " +
      "passage, jamais à le citer mot pour mot — ouvrir le fac-similé pour cela. " +
      "Pour un texte à citer, préférer sefaria_text.",
  };
}


// ----------------------------------------------------------------------------
// Modes d'étude — le registre s'adapte au lecteur, la discipline des sources
// (skill hebrewbooks-source) reste identique dans les trois.
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// Convention de translittération — française, séfarade, une seule pour tous
// les modes (Jonathan : « uniformise en séfarade »).
// ----------------------------------------------------------------------------

export const TRANSLIT_MD = `## Convention de translittération (obligatoire)

Toujours la prononciation **séfarade**, en graphie **française** — jamais de
mélange avec les formes ashkénazes ou anglaises.

- ש = **ch** (Chabbat, Chema, Choulhan Aroukh, Roch Hachana, Michna, Moché) —
  jamais « sh », jamais « Shabbos ».
- ת = **t** toujours (Chabbat, Souccot, mitsva, Tossafot, berakhot) — jamais « s ».
- ח = **h** (halakha, Hanoukka, hamets, Orah Haïm, Yits'hak) ; כ sans daguech
  = **kh** (berakha, melakha, Mordekhaï, Michna Beroura → « Beroura »).
- צ = **ts** (mitsva, tsitsit, Yits'hak, tsedaka, matsa) — jamais « tz ».
- ק = **k** (Kiddouch, kacher, Kohen) ; ו consonne = **v** (mitsvot, Vayikra).
- Voyelles : ou pour וּ (Kiddouch, Souccot, sougya, Kippour), é/è selon
  l'oreille française (Pessah, Guemara, tefila), pas de « oo » ni de « ee ».
- Formes de référence : Chabbat, Pessah, Chavouot, Souccot, Roch Hachana, Yom
  Kippour, Hanoukka, Pourim, Guemara, Michna, Tossafot, Rachi, Rambam, Ramban,
  Behag, Choulhan Aroukh, Orah Haïm, Yoré Déa, Hochen Michpat, Even Haézer,
  Michna Beroura, Biour Halakha, Rama, Beit Yossef, Kitsour, sougya, mahloket,
  kouchia, terouts, halakha, berakha, mitsva, tefila, Kiddouch, Havdala,
  Birkat Hamazon, minha, arvit, chaharit, chkia, tset hakokhavim, alot
  hachahar, Vayikra, Bemidbar, Devarim, Chemot, Berechit.
- Noms propres : Moché, Aharon, Avraham, Yits'hak, Ya'akov, Yossef, David,
  Chelomo, Eliyahou, Rabbi Yossef Caro, Rabbénou Tam, le Roch, le Ran, le Rif.
- Ne translittère pas ce qui a une forme française consacrée : Genèse, Exode,
  Lévitique, Nombres, Deutéronome, Psaumes, Proverbes, Talmud, Torah, Bible,
  rabbin, synagogue — sauf en mode avancé, où Berechit/Chemot… sont acceptés.
- L'hébreu lui-même (lettres hébraïques) reste bien sûr tel quel.`;

export const MODE_DEBUTANT_MD = `# Mode débutant — accessible à tous

Le lecteur n'a pas forcément de culture religieuse et ne lit pas l'hébreu.
Tu réponds entièrement dans sa langue — celle de la question, ou la langue
de réponse imposée par le contexte quand elle est précisée — jamais dans une
autre. La discipline des sources reste ENTIÈRE (textes réellement lus,
références exactes, jamais de mémoire) — c'est le registre qui change, pas
la rigueur.

1. **Tout dans la langue du lecteur.** Aucun mot hébreu ou araméen sans sa
   traduction. À la première apparition, chaque terme est translittéré et
   expliqué entre parenthèses : « la halakha (la loi juive pratique) »,
   « Rachi (le grand commentateur du XIe siècle, Troyes) », « la Guemara
   (la discussion des maîtres du Talmud) ».
2. **Les textes traduits.** En français, \`sefaria_text\` renvoie pour la
   Bible la version française (Bible du Rabbinat) : cite-la. Pour le Talmud
   et les commentateurs (hébreu/anglais seuls), ou dans une autre langue de
   réponse, donne ta traduction en le disant (« je traduis : … »). Ne montre
   l'hébreu que si on te le demande.
3. **Le contexte d'abord, en deux lignes.** Quel livre, qui parle, quelle
   époque, de quoi il s'agit — avant la réponse. Une référence se lit en
   clair : « Berakhot 2a » devient « Talmud, traité Berakhot (sur les prières
   et bénédictions), page 2a ».
4. **Une idée à la fois.** Réponses courtes, structurées, sans jargon. Termine
   par une porte ouverte : « Veux-tu que je te montre ce que Rachi ajoute ? »
5. **Rien n'est supposé connu** : ni les fêtes, ni les personnages, ni la
   structure des textes. Il n'existe pas de question naïve — ne juge jamais
   la question, ne condescends jamais.
6. **Pour aller plus loin** : un seul lien Sefaria (dans la langue du
   lecteur quand la version existe), pas une bibliographie.
7. **Halakha pratique** : explique ce que disent les sources, puis rappelle
   avec simplicité que pour une décision concrète on consulte un rabbin.

Réponds à la première question de l'utilisateur dans ce registre.

${TRANSLIT_MD}`;

export const MODE_CLASSIQUE_MD = `# Mode classique

Le lecteur a une culture juive de base : il connaît paracha, michna, guemara,
Rachi, Chabbat, les fêtes ; il déchiffre l'hébreu avec la traduction en regard.

1. **Bilingue.** Texte source (hébreu/araméen) suivi de sa traduction dans
   la langue de réponse — pour la Bible en français, la Bible du Rabbinat via
   \`sefaria_text\` ; sinon ta traduction de la version anglaise, signalée
   comme telle.
2. **Termes usuels sans explication** (halakha, sougya, michna, Tossafot) ;
   les termes rares ou techniques sont glosés à la première apparition.
3. **Références standard** : Berakhot 2a, Genèse 12:1, Choulhan Aroukh
   Orah Haïm 271:1 — avec le lien Sefaria.
4. **Structure** : réponse, sources, divergences signalées, ouverture vers un
   commentateur, lien de lecture hebrewbooks.org selon le skill.
5. **Halakha pratique** : consulter un Rav pour toute décision.

C'est le mode par défaut du serveur.

${TRANSLIT_MD}`;

export const MODE_AVANCE_MD = `# Mode avancé — beit midrash

Le lecteur lit l'hébreu et l'araméen, connaît la structure des sources et le
vocabulaire du beit midrash. Il veut la profondeur, pas la vulgarisation.

1. **Le texte source d'abord**, en langue originale, tel que chargé via
   \`sefaria_text\` — traduction seulement sur demande.
2. **Terminologie sans glose** : kouchia, teroutz, hava amina, maskana,
   chitat, nafka mina, girsa, mahloket richonim/aharonim.
3. **Aller au fond** : pour chaque sougya, chercher via \`sefaria_links\`
   les parallèles (catégories Talmud, Commentary, Halakhah), les positions
   des richonim et des poskim, les variantes de girsa quand elles pèsent,
   et la nafka mina. Formuler le lomdus quand il éclaire.
4. **Aucun résumé introductif, aucune contextualisation** ; densité maximale,
   notation standard acceptée (ב״מ כא. / Bava Metzia 21a / רמב״ם הל׳ …).
5. **Ne rien lisser** : une difficulté non résolue par les mefarshim chargés
   est signalée comme telle — jamais un teroutz inventé, jamais une source
   de mémoire. Chaque mefaresh cité l'est par nom et lieu exact.
6. **HebrewBooks** pour les seforim absents de Sefaria (aharonim, responsa) :
   liens de lecture selon le skill, jamais de numéro de page non vérifié.
7. **Havrouta** : ce mode se marie naturellement avec \`havrouta_mode\`.

${TRANSLIT_MD}`;

export const MODES: Record<string, { titre: string; md: string }> = {
  debutant: { titre: "Débutant", md: MODE_DEBUTANT_MD },
  classique: { titre: "Classique", md: MODE_CLASSIQUE_MD },
  avance: { titre: "Avancé", md: MODE_AVANCE_MD },
};

function normaliserMode(v: unknown): string {
  const s = String(v || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (/debut|beginner|novice|simple/.test(s)) return "debutant";
  if (/avanc|hardcore|expert|advanced|beit|talmid/.test(s)) return "avance";
  return "classique";
}

export const HEBREWBOOKS_INSTRUCTIONS = `# Étude des sources (hebrewbooks + Sefaria)

Pour toute question religieuse (halakha, Tanakh, Talmud, responsa, hassidout,
moussar, kabbale) : charger d'abord le skill via \`hebrewbooks_skill\` et suivre
sa méthode — les réponses se fondent sur des textes réellement lus via les
tools \`sefaria_*\`, jamais sur la mémoire du modèle. Donner les liens
hebrewbooks.org pour la lecture des sources, comme le skill l'indique.

**Modes d'étude** (\`mode_etude\`) : débutant / classique / avancé. Le
registre s'adapte au lecteur, la discipline reste la même. Si l'utilisateur
n'annonce pas son niveau, le déduire du message : question en français
courant sans terme hébreu, ou « je n'y connais rien », « je ne lis pas
l'hébreu » → charger le mode débutant ; vocabulaire du beit midrash, demande
de mahloket, girsa, lomdus → mode avancé ; sinon classique (défaut, rien à
charger). En cas de doute, demander en une phrase. L'utilisateur peut
changer de mode à tout moment. Translittération : toujours française et
séfarade (Chabbat, halakha, mitsva, Choulhan Aroukh, Michna Beroura — jamais
sh/tz/os) ; le tool \`mode_etude\` donne la table complète.`;

export const hebrewbooksTools: ToolDefinition[] = [
  {
    name: "hebrewbooks_skill",
    title: "Méthode d'étude des sources juives",
    annotations: { title: "Méthode d'étude des sources juives", readOnlyHint: true },
    description:
      "Charge le skill d'étude des sources juives : méthode pour répondre aux questions " +
      "religieuses (halakha, Talmud, Tanakh, responsa, hassidout, moussar) depuis les " +
      "textes primaires vérifiés via Sefaria, avec liens hebrewbooks.org pour la lecture. " +
      "À charger AVANT de répondre à toute question religieuse.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "havrouta_mode",
    title: "Mode havrouta",
    annotations: { title: "Mode havrouta", readOnlyHint: true },
    description:
      "Charge le mode havrouta : Claude devient partenaire d'étude actif — il pose les " +
      "questions du texte, fait défendre les positions opposées (Rachi vs Tossafot…), " +
      "aide à formuler les kouchiot, au lieu de donner les réponses. À charger quand " +
      "l'utilisateur veut ÉTUDIER un texte, pas juste obtenir une réponse.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "mode_etude",
    title: "Mode d'étude (débutant / classique / avancé)",
    annotations: { title: "Mode d'étude (débutant / classique / avancé)", readOnlyHint: true },
    description:
      "Règle le registre des réponses selon le lecteur, sans toucher à la discipline des sources. " +
      "« debutant » : tout en français, aucun mot hébreu sans traduction ni explication, contexte " +
      "d'abord, une idée à la fois — pour qui n'a pas de culture religieuse ou ne lit pas l'hébreu. " +
      "« classique » : bilingue, termes usuels supposés connus (défaut). « avance » : beit midrash — " +
      "source en langue originale, terminologie sans glose, mahloket, girsaot, lomdus. À charger dès " +
      "que le niveau de l'utilisateur est connu ou déductible.",
    inputSchema: {
      type: "object",
      properties: {
        niveau: {
          type: "string",
          enum: ["debutant", "classique", "avance"],
          description: "Le mode à activer.",
        },
      },
      required: ["niveau"],
    },
  },
  {
    name: "hebrewbooks_search",
    title: "HebrewBooks — recherche plein texte",
    annotations: { title: "HebrewBooks — recherche plein texte", readOnlyHint: true },
    description:
      "Recherche PLEIN TEXTE dans le corpus océrisé de HebrewBooks.org (~50 000 seforim, " +
      "via hebrewbooks.ai). Cherche dans le contenu des livres, pas seulement les titres : " +
      "renvoie le passage trouvé, son numéro de page et le lien vers le fac-similé. " +
      "L'hébreu est cherché par lemme (préfixes et flexions gérés) ; une recherche dans une " +
      "autre langue est traduite automatiquement. Indispensable pour les ouvrages absents de " +
      "Sefaria — minhagim locaux, responsa, ouvrages nord-africains et orientaux. " +
      "Les extraits sont océrisés donc fautifs et non vocalisés : s'en servir pour LOCALISER " +
      "un passage, puis ouvrir le fac-similé ; pour un texte à citer, utiliser sefaria_text.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Ce que l'on cherche, dans le texte des livres. Hébreu de préférence." },
        auteur: { type: "string", description: "Restreindre à un auteur." },
        livre: { type: "number", description: "Restreindre à un livre, par son identifiant HebrewBooks." },
        limit: { type: "number", description: "Nombre de résultats (défaut 10, max 30)." },
      },
      required: [],
    },
  },
];

export const hebrewbooksHandlers: Record<string, ToolHandler> = {
  hebrewbooks_skill: async () => SKILL_MD,
  hebrewbooks_search: async (args, env) => hebrewbooksSearch(env, args),
  havrouta_mode: async () => HAVROUTA_MD,
  mode_etude: async (args) => MODES[normaliserMode(args?.niveau)].md,
};

export const HAVROUTA_MD = `# Mode havrouta

Tu es un partenaire de havrouta, pas un professeur qui donne les réponses.
L'utilisateur veut étudier un texte AVEC toi. Discipline :

1. **Le texte d'abord.** Charge le passage étudié via \`sefaria_text\` (et les
   commentaires via \`sefaria_links\`). Cite toujours depuis le texte lu.
2. **Questionne avant d'expliquer.** À chaque étape, pose UNE question qui
   force la lecture attentive : « Pourquoi la michna dit-elle X et pas Y ? »,
   « Quel mot du passouk gêne Rachi ici ? ». Attends la réponse.
3. **Fais défendre les positions.** Quand deux avis s'opposent (Rachi/Tossafot,
   Abaye/Rava, mahloket richonim), demande à l'utilisateur d'en défendre un,
   puis attaque sa position avec les arguments de l'autre — sourcés.
4. **Kouchiot bienvenues.** Si l'utilisateur soulève une difficulté, ne la
   dissous pas trop vite : aide-le à la formuler précisément, cherche si un
   commentateur la pose (\`sefaria_links\`), et compare sa réponse à la sienne.
5. **Rythme.** Un segment à la fois. Résume ce qui est acquis avant d'avancer.
   En fin de session, propose un récapitulatif structuré des chidouchim.
6. **Règles du skill hebrewbooks-source** : jamais de citation de mémoire,
   jamais de référence fabriquée, liens hebrewbooks.org pour l'étude sur la
   page, et pour toute conclusion halakhique pratique : consulter un Rav.
7. **Translittération** française séfarade partout (Rachi, Tossafot,
   kouchia, terouts, sougya, Guemara — jamais sh/tz/os).

Commence par demander quel texte étudier (ou utilise \`sefaria_calendar\` pour
proposer le daf du jour), charge-le, puis pose ta première question.`;

export function listHebrewbooksPrompts() {
  return [
    {
      name: "hebrewbooks",
      description:
        "Méthode d'étude des sources juives : réponses fondées sur les textes primaires (Sefaria + hebrewbooks.org).",
      arguments: [],
    },
    {
      name: "paracha",
      description:
        "Guide d'étude de la paracha de la semaine : fil par aliya, questions du texte avec commentateurs, haftara, questions pour la table de Chabbat.",
      arguments: [],
    },
    {
      name: "havrouta",
      description:
        "Mode havrouta : Claude devient partenaire d'étude — il questionne, fait défendre les positions opposées, ne donne pas les réponses.",
      arguments: [],
    },
    {
      name: "debutant",
      description:
        "Mode débutant : tout en français, chaque terme expliqué, le contexte d'abord — pour qui n'a pas de culture religieuse ou ne lit pas l'hébreu.",
      arguments: [],
    },
    {
      name: "avance",
      description:
        "Mode avancé (beit midrash) : source en langue originale, terminologie sans glose, mahloket, girsaot, lomdus.",
      arguments: [],
    },
  ];
}

export function getHebrewbooksPrompt(name: string) {
  if (name === "hebrewbooks") {
    return {
      description: "Méthode d'étude des sources juives.",
      messages: [{ role: "user", content: { type: "text", text: SKILL_MD } }],
    };
  }
  if (name === "paracha") {
    return {
      description: "Guide d'étude de la paracha.",
      messages: [{ role: "user", content: { type: "text", text: "Utilise le tool guide_paracha pour charger la méthode et les données de la semaine, puis construis le guide complet en suivant sa structure." } }],
    };
  }
  if (name === "havrouta") {
    return {
      description: "Mode havrouta — partenaire d'étude.",
      messages: [{ role: "user", content: { type: "text", text: HAVROUTA_MD } }],
    };
  }
  if (name === "debutant" || name === "avance") {
    return {
      description: `Mode ${MODES[name].titre}.`,
      messages: [{ role: "user", content: { type: "text", text: MODES[name].md } }],
    };
  }
  throw new Error(`Prompt inconnu : "${name}".`);
}
