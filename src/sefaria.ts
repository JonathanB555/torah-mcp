/**
 * Tools Sefaria — bibliothèque juive numérique (sefaria.org), API publique.
 * Textes (Tanakh, Talmud, Choulhan Aroukh, responsa…), liens/commentaires,
 * recherche plein texte et calendriers d'étude.
 */

export interface Env {
  SERVER_NAME: string;
  SERVER_VERSION: string;
  SEFARIA_API_URL: string;
  BEARER_TOKENS?: string;
  /** Clé API HebrewBooks (accordée sur demande à developers@hebrewbooks.org). */
  HEBREWBOOKS_API_KEY?: string;
  HEBREWBOOKS_API_URL?: string;
}

export interface ToolDefinition {
  name: string;
  title?: string;
  annotations?: { title?: string; readOnlyHint?: boolean; destructiveHint?: boolean };
  description?: string;
  inputSchema: any;
  /** MCP Apps : lie le tool à sa ressource UI (spec ext-apps). */
  _meta?: Record<string, unknown>;
}

export type ToolHandler = (args: any, env: Env) => Promise<any>;

const USER_AGENT = "torah-mcp/1.0 (+https://github.com/JonathanB555/torah-mcp)";

/**
 * GET JSON avec cache edge Cloudflare — un même daf demandé cent fois ne
 * coûte qu'un appel à Sefaria. TTL par type de ressource (les textes sont
 * quasi immuables, les calendriers changent chaque jour).
 */
async function getJson(url: string, label: string, cacheTtl = 86400): Promise<any> {
  const resp = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": USER_AGENT },
    cf: { cacheTtl, cacheEverything: true },
  } as RequestInit);
  const text = await resp.text();
  if (!resp.ok) throw new Error(`${label} ${resp.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

/** Réf Sefaria : espaces → underscores, le reste encodé. */
function encodeRef(ref: string): string {
  return encodeURIComponent(ref.trim().replace(/ /g, "_"));
}

export const sefariaTools: ToolDefinition[] = [
  {
    name: "sefaria_text",
    title: "Sefaria — texte d'une référence",
    annotations: { title: "Sefaria — texte d'une référence", readOnlyHint: true },
    description:
      "Texte d'une référence Sefaria (hébreu + traduction anglaise si disponible). " +
      'Réfs : "Genesis 1:1", "Berakhot 2a", "Shulchan Arukh, Orach Chayim 1:1", ' +
      '"Mishneh Torah, Laws of Repentance 2:1", "Shabbat 31a"… ' +
      "TOUJOURS citer depuis le texte réellement lu ici, jamais de mémoire.",
    inputSchema: {
      type: "object",
      properties: {
        ref: { type: "string", description: "Référence (format Sefaria, anglais)." },
      },
      required: ["ref"],
    },
  },
  {
    name: "sefaria_links",
    title: "Sefaria — commentaires liés",
    annotations: { title: "Sefaria — commentaires liés", readOnlyHint: true },
    description:
      "Commentaires et textes liés à une référence (Rachi, Tossafot, midrachim, " +
      "halakha, responsa…). Renvoie les réfs liées par catégorie — charger ensuite " +
      "le texte voulu avec sefaria_text.",
    inputSchema: {
      type: "object",
      properties: {
        ref: { type: "string", description: "Référence source." },
        category: {
          type: "string",
          description: "Filtre optionnel : Commentary, Midrash, Halakhah, Responsa, Talmud…",
        },
      },
      required: ["ref"],
    },
  },
  {
    name: "sefaria_search",
    title: "Sefaria — recherche",
    annotations: { title: "Sefaria — recherche", readOnlyHint: true },
    description:
      "Recherche plein texte dans toute la bibliothèque Sefaria (hébreu ou anglais). " +
      "Utile pour retrouver une source dont on connaît les mots mais pas la référence.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Termes de recherche (hébreu ou anglais)." },
        size: { type: "number", description: "Nombre de résultats (défaut 8, max 20)." },
      },
      required: ["query"],
    },
  },
  {
    name: "sefaria_calendar",
    title: "Sefaria — calendriers d'étude",
    annotations: { title: "Sefaria — calendriers d'étude", readOnlyHint: true },
    description:
      "Calendriers d'étude du jour : parachat hachavoua, haftara, daf yomi, " +
      "Rambam quotidien, halakha quotidienne… Sans argument : aujourd'hui.",
    inputSchema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Date YYYY-MM-DD (défaut : aujourd'hui)." },
      },
      required: [],
    },
  },
];

export const sefariaHandlers: Record<string, ToolHandler> = {
  sefaria_text: async (args, env) => {
    const ref = String(args?.ref || "").trim();
    if (!ref) throw new Error('Paramètre "ref" requis (ex : Berakhot 2a).');
    const data = await getJson(
      `${env.SEFARIA_API_URL}/v3/texts/${encodeRef(ref)}?version=primary&version=french&version=translation`,
      "Sefaria"
    );
    // On allège : versions → texte seul, sans les métadonnées volumineuses.
    return {
      ref: data.ref,
      heRef: data.heRef,
      versions: (data.versions || []).map((v: any) => ({
        language: v.actualLanguage || v.language,
        versionTitle: v.versionTitle,
        license: v.license,
        text: v.text,
      })),
    };
  },

  sefaria_links: async (args, env) => {
    const ref = String(args?.ref || "").trim();
    if (!ref) throw new Error('Paramètre "ref" requis.');
    const data = await getJson(
      `${env.SEFARIA_API_URL}/links/${encodeRef(ref)}?with_text=0`,
      "Sefaria links"
    );
    const category = (args?.category || "").trim().toLowerCase();
    const links = (Array.isArray(data) ? data : [])
      .filter((l: any) => !category || String(l.category || "").toLowerCase() === category)
      .map((l: any) => ({ ref: l.ref, category: l.category, index_title: l.index_title }));
    // Dédupliqué et plafonné pour rester lisible
    const seen = new Set<string>();
    const unique = links.filter((l: any) => {
      if (seen.has(l.ref)) return false;
      seen.add(l.ref);
      return true;
    });
    return { total: unique.length, links: unique.slice(0, 120) };
  },

  sefaria_search: async (args, env) => {
    const query = String(args?.query || "").trim();
    if (!query) throw new Error('Paramètre "query" requis.');
    const size = Math.min(Math.max(Number(args?.size) || 8, 1), 20);
    const resp = await fetch(`${env.SEFARIA_API_URL}/search-wrapper`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT },
      body: JSON.stringify({ query, type: "text", size }),
    });
    const text = await resp.text();
    if (!resp.ok) throw new Error(`Sefaria search ${resp.status}: ${text.slice(0, 300)}`);
    const data = JSON.parse(text);
    const hits = (data?.hits?.hits || []).map((h: any) => ({
      ref: h._source?.ref,
      heRef: h._source?.heRef,
      extraits: (h.highlight?.exact || h.highlight?.naive_lemmatizer || []).slice(0, 2),
    }));
    return { total: data?.hits?.total ?? hits.length, hits };
  },

  sefaria_calendar: async (args, env) => {
    const date = (args?.date || "").trim();
    const params = date
      ? (() => {
          const [y, m, d] = date.split("-");
          return `?year=${y}&month=${Number(m)}&day=${Number(d)}`;
        })()
      : "";
    const data = await getJson(`${env.SEFARIA_API_URL}/calendars${params}`, "Sefaria calendars", 3600);
    return {
      date: data.date,
      items: (data.calendar_items || []).map((i: any) => ({
        title: i.title?.en,
        display: i.displayValue?.en,
        he: i.displayValue?.he,
        ref: i.ref,
      })),
    };
  },
};
