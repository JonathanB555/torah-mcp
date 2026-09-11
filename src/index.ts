/**
 * torah-mcp. Cloudflare Worker MCP personnel.
 *
 * Sefaria (textes, liens, recherche, calendriers) + skill hebrewbooks-source.
 * Transport MCP HTTP (JSON-RPC), même protocole que bensaid-mcp.
 *
 * Auth : optionnelle. Sans secret BEARER_TOKENS, le serveur est public
 * (il ne proxifie que des API publiques, aucune clé côté serveur).
 * Avec BEARER_TOKENS (tokens séparés par des virgules) : accès sur
 * invitation, header `Authorization: Bearer <token>` ou URL /<token>/mcp.
 */

import { sefariaTools, sefariaHandlers } from "./sefaria";
import type { Env } from "./sefaria";
import {
  hebrewbooksTools,
  hebrewbooksHandlers,
  HEBREWBOOKS_INSTRUCTIONS,
  listHebrewbooksPrompts,
  getHebrewbooksPrompt,
} from "./hebrewbooks";
import { landingHtml, privacyHtml, installHtml } from "./landing";
import { repondreQuestion } from "./question";
import { questionHtml } from "./question-page";
import { parseLang } from "./i18n";
import { journaliser, pageStats, csvStats, journaliserFeuille, journaliserAppel} from "./stats";
import { genererChabbat, chabbatPage, servirGif } from "./chabbat";
import { chiourimPage, rafraichirChiourim, chiourSemaine } from "./chiourim";
import { limoudTools, limoudHandlers } from "./limoud";
import { renderDaily, outilsHtml } from "./pages";
import { mielPage, VILLES_MIEL } from "./miel";
import { retourHtml, enregistrerRetour } from "./retour";
import { rochHachanaHtml } from "./rochhachana";
import { dafViewerTools, dafViewerHandlers, DAF_VIEWER_URI, DAF_VIEWER_HTML, dafViewerHtml, MCP_APP_MIME } from "./dafviewer";
import { ICON_PNG_BASE64, OG_JPEG_BASE64 } from "./icon";
import { PICTOS_PNG_BASE64 } from "./pictos";

// Origines navigateur autorisées à interroger /mcp (protection DNS rebinding).
// Les clients MCP serveur-à-serveur n'envoient pas d'Origin et passent.
const ALLOWED_ORIGINS = new Set([
  "https://claude.ai",
  "https://claude.com",
  "https://app.claude.com",
]);

// ----------------------------------------------------------------------------
// Garde-fou anti-abus, limiteur par IP, par isolate (best effort : chaque
// isolate a son compteur, mais un scraper mono-POP est efficacement freiné).
// Le cache edge sur Sefaria fait le reste.
// ----------------------------------------------------------------------------

const RATE_LIMIT_PER_MINUTE = 60;
const rateBuckets = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > 60_000) {
    // Purge opportuniste pour borner la mémoire
    if (rateBuckets.size > 10_000) rateBuckets.clear();
    rateBuckets.set(ip, { count: 1, windowStart: now });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_PER_MINUTE;
}

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: number | string | null;
  method: string;
  params?: any;
}

const allTools = [...sefariaTools, ...hebrewbooksTools, ...limoudTools, ...dafViewerTools];

const allHandlers = { ...sefariaHandlers, ...hebrewbooksHandlers, ...limoudHandlers, ...dafViewerHandlers };

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, mcp-session-id",
  "Access-Control-Expose-Headers": "mcp-session-id",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...extra },
  });
}

function sseResponse(data: unknown) {
  return new Response(`event: message\ndata: ${JSON.stringify(data)}\n\n`, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...CORS_HEADERS,
    },
  });
}

function rpcError(id: any, code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function rpcResult(id: any, result: any) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Auth optionnelle : null = OK, sinon message d'erreur. */
function checkAuth(request: Request, env: Env, urlToken?: string): string | null {
  const tokens = (env.BEARER_TOKENS || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return null; // pas de secret → public

  const matches = (candidate: string) => tokens.some((t) => safeEqual(candidate, t));
  if (urlToken && matches(urlToken)) return null;
  const m = (request.headers.get("Authorization") || "").match(/^Bearer\s+(.+)$/i);
  if (m && matches(m[1])) return null;
  return "Accès sur invitation : token requis (Authorization: Bearer … ou /<token>/mcp).";
}

const SERVER_INSTRUCTIONS = `${HEBREWBOOKS_INSTRUCTIONS}

# Limoud au quotidien

- \`havrouta_mode\` : quand l'utilisateur veut ÉTUDIER un texte (pas juste une
  réponse), charger ce mode. Claude questionne et fait défendre les positions.
- \`zmanim\` (zmanim du jour, horaires de Chabbat), \`date_hebraique\`
  (conversion civile/hébraïque) : toujours utiliser ces tools plutôt que la
  mémoire pour tout horaire ou date.
- \`gematria\` (calcul local exact), \`nikoud\` (vocalisation Dicta),
  \`fiche_source\` (fiche partageable WhatsApp d'une référence lue via Sefaria),
  \`mot_chabbat\` (le petit mot de Chabbat de la semaine, prêt pour WhatsApp
  paracha, verset en français, horaires d'allumage ; à proposer chaque fin de
  semaine, personnalisable),
  \`hebrewbooks_search\` (recherche PLEIN TEXTE dans ~50 000 seforim océrisés : renvoie le passage, sa page et le fac-similé : pour localiser un texte, pas pour le citer).`;

async function handleRpc(
  req: JsonRpcRequest,
  env: Env,
  journal?: { pays: string | null; differer: (p: Promise<unknown>) => void }
) {
  const id = req.id ?? null;
  try {
    switch (req.method) {
      case "initialize":
        // Une session qui s'ouvre : utile pour rapporter les appels d'outils
        // à un nombre de conversations, sans rien identifier.
        journal?.differer(journaliserAppel(env, { outil: "initialize", pays: journal.pays, ms: 0, ok: true }));
        return rpcResult(id, {
          protocolVersion: "2025-06-18",
          capabilities: {
            tools: { listChanged: false },
            prompts: { listChanged: false },
            resources: { listChanged: false, subscribe: false },
          },
          serverInfo: { name: env.SERVER_NAME, version: env.SERVER_VERSION },
          instructions: SERVER_INSTRUCTIONS,
        });

      case "notifications/initialized":
      case "notifications/cancelled":
        return rpcResult(null, {});

      case "tools/list":
        return rpcResult(id, { tools: allTools });

      case "tools/call": {
        const name: string = req.params?.name;
        const handler = (allHandlers as any)[name];
        if (!handler) return rpcError(id, -32601, `Unknown tool: ${name}`);
        // On mesure l'appel pour savoir quels outils servent réellement. Le nom
        // de l'outil et rien d'autre : jamais les arguments, qui portent la
        // question de l'utilisateur.
        const debut = Date.now();
        let out: any;
        try {
          out = await handler(req.params?.arguments ?? {}, env);
        } catch (err) {
          journal?.differer(journaliserAppel(env, { outil: name, pays: journal.pays, ms: Date.now() - debut, ok: false }));
          throw err;
        }
        journal?.differer(journaliserAppel(env, { outil: name, pays: journal.pays, ms: Date.now() - debut, ok: true }));
        // Un handler peut renvoyer un CallToolResult complet (MCP Apps :
        // content + structuredContent) via la cle __mcpResult.
        if (out && typeof out === "object" && (out as any).__mcpResult) {
          const { __mcpResult, ...result } = out as any;
          return rpcResult(id, result);
        }
        return rpcResult(id, {
          content: [
            { type: "text", text: typeof out === "string" ? out : JSON.stringify(out, null, 2) },
          ],
        });
      }

      case "resources/list":
        return rpcResult(id, {
          resources: [
            {
              uri: DAF_VIEWER_URI,
              name: "daf-viewer",
              description: "Visualiseur de daf facon Vilna (MCP App)",
              mimeType: MCP_APP_MIME,
            },
          ],
        });

      case "resources/templates/list":
        return rpcResult(id, { resourceTemplates: [] });

      case "resources/read": {
        const uri: string = req.params?.uri;
        if (uri !== DAF_VIEWER_URI) return rpcError(id, -32002, `Resource inconnue : ${uri}`);
        return rpcResult(id, {
          contents: [{ uri: DAF_VIEWER_URI, mimeType: MCP_APP_MIME, text: DAF_VIEWER_HTML }],
        });
      }

      case "ping":
        return rpcResult(id, {});

      case "prompts/list":
        return rpcResult(id, { prompts: listHebrewbooksPrompts() });

      case "prompts/get": {
        const name: string = req.params?.name;
        if (!name) return rpcError(id, -32602, "Missing prompt name");
        try {
          return rpcResult(id, getHebrewbooksPrompt(name));
        } catch (e: any) {
          return rpcError(id, -32602, e?.message || String(e));
        }
      }

      default:
        return rpcError(id, -32601, `Method not found: ${req.method}`);
    }
  } catch (e: any) {
    return rpcError(id, -32000, e?.message || String(e));
  }
}

/** Chemins qui restent servis sur l'ancien domaine (connecteurs, API, admin). */
function resterSurAncienDomaine(path: string): boolean {
  return (
    path === "/mcp" || path.endsWith("/mcp") || // y compris /<token>/mcp
    path.startsWith("/api/") ||
    path === "/stats" || path === "/stats.csv" ||
    path === "/chabbat/generer" ||
    path === "/health" ||
    path === "/og.png" || path === "/icon.png" || path === "/favicon.ico"
  );
}

export default {
  // Cron du vendredi matin : composer le WhatsApp de Chabbat de la semaine.
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(genererChabbat(env).then((r) => console.log("chabbat:", JSON.stringify(r))));
    ctx.waitUntil(rafraichirChiourim(env).then((r) => console.log("chiourim:", JSON.stringify(r))));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // http → https (les liens nus tapés ou linkifiés en http arrivent ici).
    // Jamais en dev local (wrangler dev sert en http ; DEV=1 dans .dev.vars).
    if (url.protocol === "http:" && !env.DEV) {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    // Migration de marque : torah-mcp.com → mamash-ia.com. Les pages redirigent ;
    // le connecteur (/mcp), l'API et l'admin continuent de servir sur l'ancien
    // domaine pour toujours (connecteurs installés, fiche Anthropic, registre).
    const hote = url.hostname;
    if ((hote === "torah-mcp.com" || hote === "www.torah-mcp.com" || hote === "www.mamash-ia.com") && request.method === "GET" && !resterSurAncienDomaine(url.pathname)) {
      return Response.redirect(`https://mamash-ia.com${url.pathname}${url.search}`, 301);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ------------------------------------------------------------------
    // API web publique : les mêmes fonctions que les tools MCP, en JSON,
    // pour les pages du site (/daf, /outils). Même limiteur de débit.
    // ------------------------------------------------------------------
    // Question en français (Claude côté serveur, mêmes tools, même méthode).
    if (url.pathname === "/api/question") {
      if (request.method !== "POST") return jsonResponse({ error: "POST attendu" }, 405);
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      let body: any = {};
      try { body = await request.json(); } catch { return jsonResponse({ error: "JSON invalide" }, 400); }
      if (body?.site) return jsonResponse({ error: "Requête rejetée." }, 400); // pot de miel
      const debut = Date.now();
      const r = await repondreQuestion(env, allTools, allHandlers as any, body, ip);
      if (r.meta) {
        // Journal statistique privé (D1), hors du chemin de réponse : jamais l'IP.
        ctx.waitUntil(journaliser(env, {
          meta: r.meta, status: r.status, body: r.body, duree_ms: Date.now() - debut,
          modele: env.ANTHROPIC_MODEL || "claude-sonnet-5",
          pays: request.headers.get("CF-IPCountry") || null,
        }));
      }
      return jsonResponse(r.body, r.status);
    }

    // Statistiques privées des questions (Basic auth, secret STATS_PASSWORD).
    if (request.method === "GET" && url.pathname === "/stats") return pageStats(request, env);
    if (request.method === "GET" && url.pathname === "/stats.csv") return csvStats(request, env);
    // Régénération manuelle du message de Chabbat (même Basic auth que /stats).
    if (request.method === "POST" && url.pathname === "/chabbat/generer") {
      const page = await pageStats(request, env);
      if (page.status !== 200) return page; // 404 sans secret, 401 sans mot de passe
      return jsonResponse(await genererChabbat(env));
    }

    // GIF de Chabbat : sélection servie par le Worker (index borné).
    if (request.method === "GET" && url.pathname === "/api/gif") return servirGif(request);

    // Compteur des feuilles de miel, côté serveur (les bloqueurs de pistage
    // rendent GA4 aveugle). Aucune donnée personnelle : jamais le prénom.
    if (request.method === "POST" && url.pathname === "/api/miel-compteur") {
      let corps: any = {};
      try { corps = await request.json(); } catch {}
      const mode = ["impression", "image", "whatsapp"].includes(corps?.mode) ? corps.mode : "impression";
      const ville = typeof corps?.ville === "string" && VILLES_MIEL[corps.ville] ? corps.ville
        : corps?.ville === "autre" ? "autre" : null;
      const langue = ["fr", "en", "he"].includes(corps?.langue) ? corps.langue : null;
      ctx.waitUntil(
        journaliserFeuille(env, { mode, ville, langue, pays: request.headers.get("cf-ipcountry") })
      );
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Retour d'un visiteur : un bug rencontré, une amélioration souhaitée.
    // Aucune donnée personnelle n'est exigée et l'IP n'est jamais conservée ;
    // le champ « site » est un piège à robots, il doit rester vide.
    if (request.method === "POST" && url.pathname === "/api/retour") {
      let corps: any = {};
      try { corps = await request.json(); } catch {}
      if (typeof corps?.site === "string" && corps.site.trim() !== "") {
        return jsonResponse({ ok: true }, 200); // robot : on acquiesce sans écrire
      }
      const r = await enregistrerRetour(env, {
        genre: String(corps?.genre || "idee"),
        message: String(corps?.message || ""),
        page: typeof corps?.page === "string" ? corps.page : null,
        contact: typeof corps?.contact === "string" ? corps.contact : null,
        langue: typeof corps?.langue === "string" ? corps.langue : null,
        pays: request.headers.get("cf-ipcountry"),
      });
      return jsonResponse(r, r.ok ? 200 : 400);
    }

    // Horaires de Tichri 5787 pour le générateur de feuilles de miel (/miel).
    // Villes en liste fermée (pas de proxy ouvert) ; réponse cachée 6 h en périphérie.
    if (request.method === "GET" && url.pathname === "/api/miel-horaires") {
      const cle = url.searchParams.get("v") || "";
      const ville = VILLES_MIEL[cle];
      if (!ville) return jsonResponse({ error: "ville inconnue" }, 400);
      const r = await fetch(
        `https://www.hebcal.com/hebcal?v=1&cfg=json&start=2026-09-10&end=2026-10-05&maj=on&c=on&M=on&geonameid=${ville.g}`,
        { cf: { cacheTtl: 21600, cacheEverything: true } } as RequestInit
      );
      if (!r.ok) return jsonResponse({ error: "horaires indisponibles" }, 502);
      const data: any = await r.json();
      const heures: Record<string, string> = {};
      const CIBLES: Record<string, [string, string]> = {
        veille: ["candles", "2026-09-11"], soir2: ["candles", "2026-09-12"], sortieRH: ["havdalah", "2026-09-13"],
        kolnidre: ["candles", "2026-09-20"], sortieYK: ["havdalah", "2026-09-21"],
        souccot: ["candles", "2026-09-25"], finFetes: ["havdalah", "2026-10-04"],
      };
      for (const item of data.items || []) {
        for (const [k, [cat, jour]] of Object.entries(CIBLES)) {
          if (item.category === cat && String(item.date).startsWith(jour)) {
            const m = String(item.title).match(/(\d{1,2}:\d{2})/);
            if (m) heures[k] = m[1];
          }
        }
      }
      return new Response(JSON.stringify(heures), {
        headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=21600" },
      });
    }

    if (url.pathname.startsWith("/api/")) {
      const toolMap: Record<string, string> = {
        daf: "daf_viewer",
        zmanim: "zmanim",
        date: "date_hebraique",
        gematria: "gematria",
        nikoud: "nikoud",
        fiche: "fiche_source",
        chabbat: "mot_chabbat",
        calendrier: "sefaria_calendar",
      };
      const key = url.pathname.slice("/api/".length);
      const toolName = toolMap[key];
      if (!toolName) return jsonResponse({ error: "Endpoint inconnu" }, 404);
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      if (isRateLimited(ip)) {
        return jsonResponse({ error: "Trop de requêtes, réessayez dans un instant." }, 429, { "Retry-After": "30" });
      }
      let args: Record<string, unknown> = {};
      if (request.method === "POST") {
        try { args = await request.json(); } catch { return jsonResponse({ error: "JSON invalide" }, 400); }
      } else {
        for (const [k, v] of url.searchParams) {
          args[k] = v === "true" ? true : v === "false" ? false : v;
        }
      }
      try {
        const out = await (allHandlers as any)[toolName](args, env);
        const payload = out && typeof out === "object" && (out as any).__mcpResult
          ? (out as any).structuredContent
          : out;
        return jsonResponse(payload);
      } catch (e: any) {
        return jsonResponse({ error: e?.message || String(e) }, 400);
      }
    }

    // ------------------------------------------------------------------
    // Pages du site, en trois langues : FR à la racine, /en/…, /he/….
    // ------------------------------------------------------------------
    if (request.method === "GET") {
      const { lang, path } = parseLang(url.pathname);
      const html = (body: string, extra: Record<string, string> = {}) =>
        new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Language": lang, ...extra, ...CORS_HEADERS } });
      switch (path) {
        case "/": return html(await landingHtml(lang, env));
        case "/question": return html(questionHtml(lang));
        case "/daf": return html(dafViewerHtml(lang));
        case "/outils": return html(outilsHtml(lang));
        case "/miel": return html(mielPage(lang));
        case "/retour": return html(retourHtml(lang));
        case "/roch-hachana": return html(rochHachanaHtml(lang), { "Cache-Control": "public, max-age=3600" });
        case "/install": return html(installHtml(lang));
        case "/privacy": return html(privacyHtml(lang));
        case "/daily": return html(await renderDaily(env, lang), { "Cache-Control": "public, max-age=900" });
        case "/chabbat": return html(await chabbatPage(env, lang));
        case "/chiourim": return html(await chiourimPage(env, lang), { "Cache-Control": "public, max-age=3600" });
      }
      if (url.pathname === "/og.png") {
        const bytes = Uint8Array.from(atob(OG_JPEG_BASE64), (c) => c.charCodeAt(0));
        return new Response(bytes, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" } });
      }
      if (url.pathname === "/icon.png" || url.pathname === "/favicon.ico") {
        const bytes = Uint8Array.from(atob(ICON_PNG_BASE64), (c) => c.charCodeAt(0));
        return new Response(bytes, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" } });
      }
      const picto = url.pathname.match(/^\/picto-(debutant|classique|avance)\.png$/);
      if (picto) {
        const bytes = Uint8Array.from(atob(PICTOS_PNG_BASE64[picto[1] as "debutant" | "classique" | "avance"]), (c) => c.charCodeAt(0));
        return new Response(bytes, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" } });
      }
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse({
        status: "ok",
        server: { name: env.SERVER_NAME, version: env.SERVER_VERSION },
        tools_count: allTools.length,
        auth: (env.BEARER_TOKENS || "").trim() ? "invitation" : "public",
      });
    }

    // Token éventuel dans le chemin : /<token>/mcp
    let pathname = url.pathname;
    let urlToken: string | undefined;
    const pathMatch = pathname.match(/^\/([A-Za-z0-9_-]{16,128})(\/mcp|\/sse|\/?)$/);
    if (pathMatch) {
      urlToken = pathMatch[1];
      pathname = pathMatch[2] && pathMatch[2] !== "/" ? pathMatch[2] : "/mcp";
    }

    if (pathname === "/mcp" || pathname === "/sse") {
      // Validation de l'Origin (exigence sécurité MCP : anti DNS rebinding)
      const origin = request.headers.get("Origin");
      if (origin && !ALLOWED_ORIGINS.has(origin)) {
        return jsonResponse({ error: "Origin non autorisée" }, 403);
      }

      const authError = checkAuth(request, env, urlToken);
      if (authError) {
        return jsonResponse({ error: authError }, 401, {
          "WWW-Authenticate": 'Bearer realm="torah-mcp"',
        });
      }

      if (request.method === "POST") {
        const ip = request.headers.get("CF-Connecting-IP") || "unknown";
        if (isRateLimited(ip)) {
          return jsonResponse(
            { error: "Rate limit: 60 requêtes/minute. Réessayez dans un instant." },
            429,
            { "Retry-After": "30" }
          );
        }
        let body: JsonRpcRequest;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, 400);
        }
        const response = await handleRpc(body, env, {
          pays: request.headers.get("cf-ipcountry"),
          differer: (p) => ctx.waitUntil(p),
        });
        const accept = request.headers.get("Accept") || "";
        return accept.includes("text/event-stream") ? sseResponse(response) : jsonResponse(response);
      }

      if (request.method === "GET") {
        return new Response(": ok\n\n", {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            ...CORS_HEADERS,
          },
        });
      }
    }

    return jsonResponse({ error: "Not Found", path: url.pathname }, 404);
  },
} satisfies ExportedHandler<Env>;
