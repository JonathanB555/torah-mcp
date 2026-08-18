/**
 * torah-mcp — Cloudflare Worker MCP personnel.
 *
 * Sefaria (textes, liens, recherche, calendriers) + skill hebrewbooks-source.
 * Transport MCP HTTP (JSON-RPC), même protocole que bensaid-mcp.
 *
 * Auth : optionnelle. Sans secret BEARER_TOKENS, le serveur est public
 * (il ne proxifie que des API publiques, aucune clé côté serveur).
 * Avec BEARER_TOKENS (tokens séparés par des virgules) : accès sur
 * invitation — header `Authorization: Bearer <token>` ou URL /<token>/mcp.
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
import { journaliser, pageStats, csvStats } from "./stats";
import { limoudTools, limoudHandlers } from "./limoud";
import { renderDaily, outilsHtml } from "./pages";
import { dafViewerTools, dafViewerHandlers, DAF_VIEWER_URI, DAF_VIEWER_HTML, dafViewerHtml, MCP_APP_MIME } from "./dafviewer";
import { ICON_PNG_BASE64, OG_PNG_BASE64 } from "./icon";

// Origines navigateur autorisées à interroger /mcp (protection DNS rebinding).
// Les clients MCP serveur-à-serveur n'envoient pas d'Origin et passent.
const ALLOWED_ORIGINS = new Set([
  "https://claude.ai",
  "https://claude.com",
  "https://app.claude.com",
]);

// ----------------------------------------------------------------------------
// Garde-fou anti-abus — limiteur par IP, par isolate (best effort : chaque
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
  réponse), charger ce mode — Claude questionne et fait défendre les positions.
- \`zmanim\` (zmanim du jour, horaires de Chabbat), \`date_hebraique\`
  (conversion civile/hébraïque) : toujours utiliser ces tools plutôt que la
  mémoire pour tout horaire ou date.
- \`gematria\` (calcul local exact), \`nikoud\` (vocalisation Dicta),
  \`fiche_source\` (fiche partageable WhatsApp d'une référence lue via Sefaria),
  \`hebrewbooks_search\` (catalogue ~65k seforim).`;

async function handleRpc(req: JsonRpcRequest, env: Env) {
  const id = req.id ?? null;
  try {
    switch (req.method) {
      case "initialize":
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
        const out = await handler(req.params?.arguments ?? {}, env);
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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

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
        // Journal statistique privé (D1), hors du chemin de réponse — jamais l'IP.
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

    if (url.pathname.startsWith("/api/")) {
      const toolMap: Record<string, string> = {
        daf: "daf_viewer",
        zmanim: "zmanim",
        date: "date_hebraique",
        gematria: "gematria",
        nikoud: "nikoud",
        fiche: "fiche_source",
        calendrier: "sefaria_calendar",
      };
      const key = url.pathname.slice("/api/".length);
      const toolName = toolMap[key];
      if (!toolName) return jsonResponse({ error: "Endpoint inconnu" }, 404);
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      if (isRateLimited(ip)) {
        return jsonResponse({ error: "Trop de requêtes — réessayez dans un instant." }, 429, { "Retry-After": "30" });
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
        case "/": return html(landingHtml(lang));
        case "/question": return html(questionHtml(lang));
        case "/daf": return html(dafViewerHtml(lang));
        case "/outils": return html(outilsHtml(lang));
        case "/install": return html(installHtml(lang));
        case "/privacy": return html(privacyHtml(lang));
        case "/daily": return html(await renderDaily(env, lang), { "Cache-Control": "public, max-age=900" });
      }
      if (url.pathname === "/og.png") {
        const bytes = Uint8Array.from(atob(OG_PNG_BASE64), (c) => c.charCodeAt(0));
        return new Response(bytes, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" } });
      }
      if (url.pathname === "/icon.png" || url.pathname === "/favicon.ico") {
        const bytes = Uint8Array.from(atob(ICON_PNG_BASE64), (c) => c.charCodeAt(0));
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
        const response = await handleRpc(body, env);
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
