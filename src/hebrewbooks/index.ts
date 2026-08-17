/**
 * Skill hebrewbooks-source — répondre aux questions religieuses depuis les
 * textes primaires réellement lus (vérification Sefaria, liens hebrewbooks.org
 * pour la lecture), jamais de mémoire.
 */
// @ts-ignore — bundled as text by wrangler (rules: type=Text)
import skillMd from "./SKILL.md";

import type { Env, ToolDefinition, ToolHandler } from "../sefaria";

const SKILL_MD = skillMd as unknown as string;

// ----------------------------------------------------------------------------
// Recherche catalogue HebrewBooks — via leur API officielle sur clé
// (accordée aux développeurs sur demande : developers@hebrewbooks.org).
// Le site public est derrière un challenge Cloudflare qu'on ne contourne pas ;
// sans clé, le tool explique la marche à suivre.
// ----------------------------------------------------------------------------

const DEFAULT_HB_API_URL = "https://beta.hebrewbooks.org";

/** Décapsule une réponse JSONP `cb({...});` → objet JSON. */
function unwrapJsonp(text: string): any {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Réponse HebrewBooks illisible.");
  return JSON.parse(text.slice(start, end + 1));
}

async function hebrewbooksSearch(env: Env, args: any): Promise<any> {
  if (!env.HEBREWBOOKS_API_KEY) {
    throw new Error(
      "Recherche HebrewBooks non configurée : ce tool utilise l'API officielle " +
        "HebrewBooks.org, qui requiert une clé accordée sur demande " +
        "(developers@hebrewbooks.org). Une fois la clé reçue : " +
        "wrangler secret put HEBREWBOOKS_API_KEY. " +
        "En attendant, chercher le titre via sefaria_search et construire la " +
        "lecture avec les liens hebrewbooks.org donnés par le skill."
    );
  }
  const title = String(args?.titre || "").trim();
  const author = String(args?.auteur || "").trim();
  if (!title && !author) throw new Error("Indiquer au moins un titre ou un auteur.");
  const limit = Math.min(Math.max(Number(args?.limit) || 10, 1), 30);

  const params = new URLSearchParams({
    title_search: title,
    author_search: author,
    start: "0",
    length: String(limit),
    callback: "cb",
    api_key: env.HEBREWBOOKS_API_KEY,
  });
  const base = env.HEBREWBOOKS_API_URL || DEFAULT_HB_API_URL;
  const resp = await fetch(`${base}/api/api.ashx?${params}`, {
    headers: { "User-Agent": "torah-mcp/1.3 (+https://torah-mcp.com)" },
  });
  const text = await resp.text();
  if (!resp.ok) throw new Error(`HebrewBooks ${resp.status}: ${text.slice(0, 200)}`);
  const data = unwrapJsonp(text);

  return {
    total: data.total ?? 0,
    livres: (data.data || []).map((b: any) => ({
      id: b.id ?? b.ID,
      titre: b.title ?? b.Title,
      auteur: b.author ?? b.Author,
      annee: b.year ?? b.Year,
      lieu: b.city ?? b.City,
      lecture: `https://hebrewbooks.org/${b.id ?? b.ID}`,
    })),
    note: "Liens à ouvrir dans le navigateur (lecture humaine). Ne jamais citer un numéro de page non vérifié.",
  };
}


// ----------------------------------------------------------------------------
// Modes d'étude — le registre s'adapte au lecteur, la discipline des sources
// (skill hebrewbooks-source) reste identique dans les trois.
// ----------------------------------------------------------------------------

export const MODE_DEBUTANT_MD = `# Mode débutant — accessible à tous

Le lecteur n'a pas forcément de culture religieuse et ne lit pas l'hébreu.
Il pose ses questions en français ; tu réponds en français, entièrement.
La discipline des sources reste ENTIÈRE (textes réellement lus, références
exactes, jamais de mémoire) — c'est le registre qui change, pas la rigueur.

1. **Tout en français.** Aucun mot hébreu ou araméen sans sa traduction.
   À la première apparition, chaque terme est translittéré et expliqué entre
   parenthèses : « la halakha (la loi juive pratique) », « Rachi (le grand
   commentateur du XIe siècle, Troyes) », « la Guemara (la discussion des
   maîtres du Talmud) ».
2. **Les textes en français.** \`sefaria_text\` renvoie pour la Bible la
   version française (Bible du Rabbinat) : cite-la. Pour le Talmud et les
   commentateurs (hébreu/anglais seuls), donne ta traduction française en le
   disant (« je traduis : … »). Ne montre l'hébreu que si on te le demande.
3. **Le contexte d'abord, en deux lignes.** Quel livre, qui parle, quelle
   époque, de quoi il s'agit — avant la réponse. Une référence se lit en
   clair : « Berakhot 2a » devient « Talmud, traité Berakhot (sur les prières
   et bénédictions), page 2a ».
4. **Une idée à la fois.** Réponses courtes, structurées, sans jargon. Termine
   par une porte ouverte : « Veux-tu que je te montre ce que Rachi ajoute ? »
5. **Rien n'est supposé connu** : ni les fêtes, ni les personnages, ni la
   structure des textes. Il n'existe pas de question naïve — ne juge jamais
   la question, ne condescends jamais.
6. **Pour aller plus loin** : un seul lien Sefaria (en français quand la
   version existe), pas une bibliographie.
7. **Halakha pratique** : explique ce que disent les sources, puis rappelle
   avec simplicité que pour une décision concrète on consulte un rabbin.

Réponds à la première question de l'utilisateur dans ce registre.`;

export const MODE_CLASSIQUE_MD = `# Mode classique

Le lecteur a une culture juive de base : il connaît paracha, michna, guemara,
Rachi, Chabbat, les fêtes ; il déchiffre l'hébreu avec la traduction en regard.

1. **Bilingue.** Texte source (hébreu/araméen) suivi de sa traduction —
   française pour la Bible (Bible du Rabbinat via \`sefaria_text\`), sinon
   ta traduction française de la version anglaise, signalée comme telle.
2. **Termes usuels sans explication** (halakha, sougya, michna, Tossafot) ;
   les termes rares ou techniques sont glosés à la première apparition.
3. **Références standard** : Berakhot 2a, Genèse 12:1, Choulhan Aroukh
   Orah Haïm 271:1 — avec le lien Sefaria.
4. **Structure** : réponse, sources, divergences signalées, ouverture vers un
   commentateur, lien de lecture hebrewbooks.org selon le skill.
5. **Halakha pratique** : consulter un Rav pour toute décision.

C'est le mode par défaut du serveur.`;

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
7. **Havrouta** : ce mode se marie naturellement avec \`havrouta_mode\`.`;

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
changer de mode à tout moment.`;

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
    title: "HebrewBooks — recherche catalogue",
    annotations: { title: "HebrewBooks — recherche catalogue", readOnlyHint: true },
    description:
      "Recherche dans le catalogue HebrewBooks.org (~65 000 seforim scannés) par titre " +
      "et/ou auteur, via leur API officielle. Renvoie les références vérifiées avec le " +
      "lien de lecture hebrewbooks.org/<id> à ouvrir dans le navigateur.",
    inputSchema: {
      type: "object",
      properties: {
        titre: { type: "string", description: "Titre (hébreu ou translittéré)." },
        auteur: { type: "string", description: "Auteur." },
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
