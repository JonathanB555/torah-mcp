/**
 * Outils de limoud au quotidien :
 * - zmanim + horaires de Chabbat (API Hebcal, libre)
 * - conversion de dates hébraïques (Hebcal)
 * - guematria (calcul local, plusieurs méthodes)
 * - nikoud (API publique du nakdan de Dicta — dicta.org.il)
 * - fiche source partageable (texte Sefaria mis en forme pour WhatsApp)
 */

import type { Env, ToolDefinition, ToolHandler } from "./sefaria";

const HEBCAL_URL = "https://www.hebcal.com";
const DICTA_NAKDAN_URL = "https://nakdan-2-0.loadbalancer.dicta.org.il/api";
const USER_AGENT = "torah-mcp/1.4 (+https://torah-mcp.com)";

// Villes usuelles → geonameid Hebcal
const VILLES: Record<string, number> = {
  paris: 2988507,
  marseille: 2995469,
  lyon: 2996944,
  nice: 2990440,
  strasbourg: 2973783,
  geneve: 2660646,
  bruxelles: 2800866,
  anvers: 2803138,
  londres: 2643743,
  jerusalem: 281184,
  "tel-aviv": 293397,
  haifa: 294801,
  "new-york": 5128581,
  montreal: 6077243,
  miami: 4164138,
  "los-angeles": 5368361,
  casablanca: 2553604,
};

async function getJson(url: string, label: string, cacheTtl = 3600): Promise<any> {
  const resp = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": USER_AGENT },
    cf: { cacheTtl, cacheEverything: true },
  } as RequestInit);
  const text = await resp.text();
  if (!resp.ok) throw new Error(`${label} ${resp.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

function resolveLieu(args: any): string {
  const ville = String(args?.ville || "").trim().toLowerCase().replace(/\s+/g, "-");
  if (ville && VILLES[ville]) return `geonameid=${VILLES[ville]}`;
  if (args?.geonameid) return `geonameid=${Number(args.geonameid)}`;
  if (args?.latitude !== undefined && args?.longitude !== undefined && args?.tzid) {
    return `latitude=${Number(args.latitude)}&longitude=${Number(args.longitude)}&tzid=${encodeURIComponent(String(args.tzid))}`;
  }
  throw new Error(
    `Lieu requis : ville parmi [${Object.keys(VILLES).join(", ")}], ou geonameid, ou latitude+longitude+tzid.`
  );
}

// ----------------------------------------------------------------------------
// Guematria — calcul local
// ----------------------------------------------------------------------------

const HECHRECHI: Record<string, number> = {
  "א": 1, "ב": 2, "ג": 3, "ד": 4, "ה": 5, "ו": 6, "ז": 7, "ח": 8, "ט": 9,
  "י": 10, "כ": 20, "ך": 20, "ל": 30, "מ": 40, "ם": 40, "נ": 50, "ן": 50,
  "ס": 60, "ע": 70, "פ": 80, "ף": 80, "צ": 90, "ץ": 90, "ק": 100, "ר": 200,
  "ש": 300, "ת": 400,
};
const GADOL_FINALES: Record<string, number> = { "ך": 500, "ם": 600, "ן": 700, "ף": 800, "ץ": 900 };
const ALPHABET = "אבגדהוזחטיכלמנסעפצקרשת";
const ATBASH: Record<string, string> = {};
for (let i = 0; i < ALPHABET.length; i++) {
  ATBASH[ALPHABET[i]] = ALPHABET[ALPHABET.length - 1 - i];
}
const FINALE_VERS_BASE: Record<string, string> = { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" };

/** Retire nikoud, teamim et tout caractère non hébreu. */
function lettresHebraiques(texte: string): string {
  return texte.normalize("NFKD").replace(/[^א-ת]/g, "");
}

function valeur(mot: string, methode: string): number {
  let total = 0;
  for (const l of mot) {
    const base = FINALE_VERS_BASE[l] || l;
    switch (methode) {
      case "gadol":
        total += GADOL_FINALES[l] ?? HECHRECHI[l] ?? 0;
        break;
      case "katan": {
        // réduction : 20→2, 300→3
        let v = HECHRECHI[base] ?? 0;
        while (v >= 10) v = v / 10;
        total += v;
        break;
      }
      case "siduri":
        total += ALPHABET.indexOf(base) + 1;
        break;
      case "atbash":
        total += HECHRECHI[ATBASH[base] ?? base] ?? 0;
        break;
      default:
        total += HECHRECHI[base] ?? 0;
    }
  }
  return total;
}

// ----------------------------------------------------------------------------
// Helpers fiche source
// ----------------------------------------------------------------------------

function stripHtml(s: string): string {
  return s
    .replace(/<sup[^>]*>.*?<\/sup>/g, "")
    .replace(/<i class="footnote">.*?<\/i>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function aplatir(t: unknown): string[] {
  if (typeof t === "string") return [t];
  if (Array.isArray(t)) return t.flatMap(aplatir);
  return [];
}

// ----------------------------------------------------------------------------
// Tools
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// Guide de paracha — façon AlHaTorah : étude structurée de la sidra
// ----------------------------------------------------------------------------

export const PARACHA_GUIDE_MD = `# Guide d'étude de la paracha

Tu construis un guide d'étude structuré de la paracha, dans l'esprit des study
guides d'AlHaTorah : nourri aux sources réelles, jamais de mémoire.

## Démarche

1. **Identifier la paracha** : utilise les données fournies par le tool
   (paracha de la semaine, référence, haftara) ou celle que demande
   l'utilisateur.
2. **Lire avant d'écrire** : charge le texte par sections via \`sefaria_text\`
   et les commentaires clés via \`sefaria_links\` (catégorie Commentary).
   Chaque citation vient d'un texte chargé.

## Structure du guide

1. **En un regard** — 3 phrases : où on en est dans le récit, ce qui arrive,
   pourquoi c'est charnière.
2. **Fil de la paracha** — résumé aliya par aliya (7 aliyot + maftir), une à
   deux phrases chacune, avec la référence exacte de chaque aliya.
3. **Trois questions du texte** — des difficultés que le TEXTE pose (un mot
   surprenant, une répétition, une contradiction apparente), chacune avec :
   la question, ce que disent DEUX commentateurs qui divergent (Rachi vs
   Ramban, Ibn Ezra vs Sforno…), cités depuis les textes chargés, et une
   invitation à trancher.
4. **La haftara et son écho** — pourquoi CETTE haftara pour CETTE paracha :
   le lien thématique, avec les références.
5. **Pour la table de Chabbat** — 3 questions ouvertes sans réponse fournie,
   graduées (enfant / ado / adulte).
6. **Pour aller plus loin** — liens Sefaria de la paracha et des commentaires,
   et lecture sur hebrewbooks.org selon les règles du skill.

## Règles

- Jamais de citation de mémoire ; référence exacte pour chaque source.
- Citer les versets en français : \`sefaria_text\` renvoie pour le Tanakh la
  version française (Bible du Rabbinat) à côté de l'hébreu — l'utiliser de
  préférence à l'anglais. Pour les commentateurs (hébreu seul), traduire en
  français en le signalant comme ta traduction.
- Signaler les divergences plutôt que les lisser.
- Adapter la profondeur au mode d'étude actif (débutant / classique / avancé —
  voir \`mode_etude\`) ou à ce que précise le lecteur.
- Terminer par : Chabbat chalom.`;

const LIEU_PROPS = {
  ville: {
    type: "string",
    description: `Ville connue : ${Object.keys(VILLES).join(", ")}. Sinon utiliser geonameid ou latitude/longitude/tzid.`,
  },
  geonameid: { type: "number", description: "Identifiant GeoNames (geonames.org)." },
  latitude: { type: "number" },
  longitude: { type: "number" },
  tzid: { type: "string", description: "Fuseau IANA (ex : Europe/Paris) — requis avec latitude/longitude." },
};

export const limoudTools: ToolDefinition[] = [
  {
    name: "guide_paracha",
    title: "Guide d'étude de la paracha",
    annotations: { title: "Guide d'étude de la paracha", readOnlyHint: true },
    description:
      "Charge la méthode du guide d'étude de la paracha (façon AlHaTorah : fil par aliya, " +
      "questions du texte avec commentateurs en désaccord, haftara, questions pour la table " +
      "de Chabbat) avec les données de la semaine (paracha, référence, haftara). À utiliser " +
      "dès que l'utilisateur veut préparer ou étudier la paracha.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "zmanim",
    title: "Zmanim et horaires de Chabbat",
    annotations: { title: "Zmanim et horaires de Chabbat", readOnlyHint: true },
    description:
      "Zmanim du jour (alot, netz, sof zman kriat shema/tefila, hatsot, minha, shkia, tzeit…) " +
      "et, avec chabbat=true, les horaires d'entrée/sortie de Chabbat et la paracha. " +
      "Données Hebcal. Villes prédéfinies ou coordonnées libres.",
    inputSchema: {
      type: "object",
      properties: {
        ...LIEU_PROPS,
        date: { type: "string", description: "YYYY-MM-DD (défaut : aujourd'hui)." },
        chabbat: { type: "boolean", description: "true : horaires de Chabbat au lieu des zmanim du jour." },
      },
      required: [],
    },
  },
  {
    name: "date_hebraique",
    title: "Conversion de dates hébraïques",
    annotations: { title: "Conversion de dates hébraïques", readOnlyHint: true },
    description:
      "Convertit une date civile en date hébraïque (ou l'inverse) avec les événements du jour " +
      "(Rosh Hodesh, fêtes, paracha). Sens civil→hébreu : passer date (YYYY-MM-DD). " +
      "Sens hébreu→civil : passer annee_h, mois_h (ex : Elul, Tishrei, Nisan), jour_h.",
    inputSchema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Date civile YYYY-MM-DD (défaut : aujourd'hui)." },
        apres_coucher: { type: "boolean", description: "true si le moment est après le coucher du soleil." },
        annee_h: { type: "number", description: "Année hébraïque (ex : 5786)." },
        mois_h: { type: "string", description: "Mois hébraïque en anglais Hebcal (Nisan, Iyyar, Sivan, Tamuz, Av, Elul, Tishrei, Cheshvan, Kislev, Tevet, Shvat, Adar, Adar1, Adar2)." },
        jour_h: { type: "number", description: "Jour du mois hébraïque (1-30)." },
      },
      required: [],
    },
  },
  {
    name: "gematria",
    title: "Guematria",
    annotations: { title: "Guematria", readOnlyHint: true },
    description:
      "Calcule la guematria d'un texte hébreu, mot par mot et au total, selon plusieurs " +
      "méthodes : hechrechi (standard), gadol (finales 500-900), katan (réduction), " +
      "siduri (ordinale), atbash. Le nikoud est ignoré. Calcul local, exact.",
    inputSchema: {
      type: "object",
      properties: {
        texte: { type: "string", description: "Texte hébreu (avec ou sans nikoud)." },
      },
      required: ["texte"],
    },
  },
  {
    name: "nikoud",
    title: "Nikoud (vocalisation) — Dicta",
    annotations: { title: "Nikoud (vocalisation) — Dicta", readOnlyHint: true },
    description:
      "Vocalise un texte hébreu non ponctué via le nakdan de Dicta (dicta.org.il, outil " +
      "académique). Genres : premodern (textes rabbiniques — défaut), modern, poetry. " +
      "Renvoie la meilleure vocalisation et les variantes par mot ambigu.",
    inputSchema: {
      type: "object",
      properties: {
        texte: { type: "string", description: "Texte hébreu sans nikoud (max ~2000 caractères)." },
        genre: { type: "string", enum: ["premodern", "modern", "poetry"], description: "Registre du texte (défaut premodern)." },
      },
      required: ["texte"],
    },
  },
  {
    name: "fiche_source",
    title: "Fiche source partageable",
    annotations: { title: "Fiche source partageable", readOnlyHint: true },
    description:
      "Compose une fiche source prête à partager (WhatsApp/message) pour une référence : " +
      "texte hébreu, traduction, référence exacte et liens d'étude. Le texte est réellement " +
      "lu via Sefaria — jamais de citation de mémoire.",
    inputSchema: {
      type: "object",
      properties: {
        ref: { type: "string", description: 'Référence Sefaria (ex : "Berakhot 2a", "Genesis 1:1", "Pirkei Avot 1:14").' },
        segments: { type: "number", description: "Nombre max de segments de texte à inclure (défaut 3)." },
      },
      required: ["ref"],
    },
  },
];

export const limoudHandlers: Record<string, ToolHandler> = {
  guide_paracha: async (_args, env) => {
    let semaine = "";
    try {
      const data = await getJson(`${env.SEFARIA_API_URL}/calendars`, "Sefaria calendars", 1800);
      const items = (data.calendar_items || []) as any[];
      const par = items.find((i) => i.title?.en === "Parashat Hashavua");
      const haf = items.find((i) => i.title?.en === "Haftarah");
      semaine =
        `\n\n## Cette semaine\n\n` +
        `- Paracha : ${par?.displayValue?.en ?? "?"} (${par?.displayValue?.he ?? ""}) — réf. ${par?.ref ?? "?"}\n` +
        `- Haftara : ${haf?.displayValue?.en ?? "?"} — réf. ${haf?.ref ?? "?"}`;
    } catch {
      semaine = "\n\n(Calendrier momentanément indisponible — demander la paracha à étudier.)";
    }
    return PARACHA_GUIDE_MD + semaine;
  },
  zmanim: async (args, _env) => {
    const lieu = resolveLieu(args);
    if (args?.chabbat) {
      const data = await getJson(`${HEBCAL_URL}/shabbat?cfg=json&${lieu}&M=on`, "Hebcal shabbat");
      return {
        lieu: data.location?.title,
        evenements: (data.items || []).map((i: any) => ({
          categorie: i.category,
          titre: i.title,
          hebreu: i.hebrew,
          date: i.date,
        })),
      };
    }
    const date = (args?.date || "").trim();
    const dateParam = date ? `&date=${date}` : "";
    const data = await getJson(`${HEBCAL_URL}/zmanim?cfg=json&${lieu}${dateParam}`, "Hebcal zmanim", 1800);
    return { lieu: data.location?.title, date: data.date, zmanim: data.times };
  },

  date_hebraique: async (args, _env) => {
    let url: string;
    if (args?.annee_h && args?.mois_h && args?.jour_h) {
      url = `${HEBCAL_URL}/converter?cfg=json&hy=${Number(args.annee_h)}&hm=${encodeURIComponent(String(args.mois_h))}&hd=${Number(args.jour_h)}&h2g=1`;
    } else {
      const d = (args?.date || "").trim() || new Date().toISOString().slice(0, 10);
      const [gy, gm, gd] = d.split("-").map(Number);
      const gs = args?.apres_coucher ? "&gs=on" : "";
      url = `${HEBCAL_URL}/converter?cfg=json&gy=${gy}&gm=${gm}&gd=${gd}&g2h=1${gs}`;
    }
    return getJson(url, "Hebcal converter");
  },

  gematria: async (args, _env) => {
    const texte = String(args?.texte || "").trim();
    if (!texte) throw new Error('Paramètre "texte" requis (texte hébreu).');
    const mots = texte.split(/\s+/).map(lettresHebraiques).filter(Boolean);
    if (mots.length === 0) throw new Error("Aucune lettre hébraïque trouvée dans le texte.");
    const methodes = ["hechrechi", "gadol", "katan", "siduri", "atbash"] as const;
    const parMot = mots.map((m) => ({
      mot: m,
      ...Object.fromEntries(methodes.map((me) => [me, valeur(m, me)])),
    }));
    const totaux = Object.fromEntries(
      methodes.map((me) => [me, mots.reduce((s, m) => s + valeur(m, me), 0)])
    );
    return { mots: parMot, totaux };
  },

  nikoud: async (args, _env) => {
    const texte = String(args?.texte || "").trim().slice(0, 2000);
    if (!texte) throw new Error('Paramètre "texte" requis (texte hébreu).');
    const genre = ["premodern", "modern", "poetry"].includes(args?.genre) ? args.genre : "premodern";
    const resp = await fetch(DICTA_NAKDAN_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8", "User-Agent": USER_AGENT },
      body: JSON.stringify({ task: "nakdan", data: texte, genre }),
    });
    const raw = await resp.text();
    if (!resp.ok) throw new Error(`Dicta nakdan ${resp.status}: ${raw.slice(0, 200)}`);
    const data = JSON.parse(raw);
    const vocalise = (data as any[])
      .map((w) => (w.sep ? w.word : (w.options?.[0] || w.word).replace(/\|/g, "")))
      .join("");
    const ambigus = (data as any[])
      .filter((w) => !w.sep && (w.options?.length || 0) > 1)
      .map((w) => ({ mot: w.word, options: w.options.map((o: string) => o.replace(/\|/g, "")) }));
    return {
      vocalise,
      mots_ambigus: ambigus.slice(0, 30),
      credit: "Vocalisation : nakdan de Dicta (dicta.org.il).",
    };
  },

  fiche_source: async (args, env) => {
    const ref = String(args?.ref || "").trim();
    if (!ref) throw new Error('Paramètre "ref" requis.');
    const maxSeg = Math.min(Math.max(Number(args?.segments) || 3, 1), 10);
    const encoded = encodeURIComponent(ref.replace(/ /g, "_"));
    const data = await getJson(
      `${env.SEFARIA_API_URL}/v3/texts/${encoded}?version=primary&version=french&version=translation`,
      "Sefaria",
      86400
    );
    const he = (data.versions || []).find((v: any) => (v.actualLanguage || v.language) === "he");
    // Français d'abord (Bible du Rabbinat pour le Tanakh), sinon la traduction par défaut.
    const en =
      (data.versions || []).find((v: any) => (v.actualLanguage || v.language) === "fr") ||
      (data.versions || []).find((v: any) => (v.actualLanguage || v.language) === "en");
    const heSegs = aplatir(he?.text).map(stripHtml).filter(Boolean).slice(0, maxSeg);
    const enSegs = aplatir(en?.text).map(stripHtml).filter(Boolean).slice(0, maxSeg);
    if (heSegs.length === 0 && enSegs.length === 0) {
      throw new Error(`Texte introuvable pour "${ref}" — vérifier la référence avec sefaria_search.`);
    }
    const lien = `https://www.sefaria.org/${encoded}`;
    const lignes = [
      `*${data.ref}*${data.heRef ? ` · ${data.heRef}` : ""}`,
      "",
      ...heSegs,
      ...(enSegs.length ? ["", ...enSegs.map((s: string) => `_${s}_`)] : []),
      "",
      `Étudier : ${lien}`,
    ];
    return {
      fiche: lignes.join("\n"),
      licence_he: he?.license,
      traduction: en ? `${en.actualLanguage || en.language} — ${en.versionTitle}` : "",
      licence_traduction: en?.license,
      note: "Prêt à coller dans WhatsApp (le *gras* et l'_italique_ y sont interprétés). Texte lu depuis Sefaria.",
    };
  },
};
