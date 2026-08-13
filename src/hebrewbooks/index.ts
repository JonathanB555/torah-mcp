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

export const HEBREWBOOKS_INSTRUCTIONS = `# Étude des sources (hebrewbooks + Sefaria)

Pour toute question religieuse (halakha, Tanakh, Talmud, responsa, hassidout,
moussar, kabbale) : charger d'abord le skill via \`hebrewbooks_skill\` et suivre
sa méthode — les réponses se fondent sur des textes réellement lus via les
tools \`sefaria_*\`, jamais sur la mémoire du modèle. Donner les liens
hebrewbooks.org pour la lecture des sources, comme le skill l'indique.`;

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
  throw new Error(`Prompt inconnu : "${name}".`);
}
