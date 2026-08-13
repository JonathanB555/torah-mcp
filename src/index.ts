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
import { LANDING_HTML, PRIVACY_HTML } from "./landing";

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

const allTools = [...sefariaTools, ...hebrewbooksTools];
const allHandlers = { ...sefariaHandlers, ...hebrewbooksHandlers };

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

const SERVER_INSTRUCTIONS = HEBREWBOOKS_INSTRUCTIONS;

async function handleRpc(req: JsonRpcRequest, env: Env) {
  const id = req.id ?? null;
  try {
    switch (req.method) {
      case "initialize":
        return rpcResult(id, {
          protocolVersion: "2025-06-18",
          capabilities: { tools: { listChanged: false }, prompts: { listChanged: false } },
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
        return rpcResult(id, {
          content: [
            { type: "text", text: typeof out === "string" ? out : JSON.stringify(out, null, 2) },
          ],
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
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Page d'accueil auto-suffisante (le lien partagé explique l'installation)
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(LANDING_HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8", ...CORS_HEADERS },
      });
    }

    if (request.method === "GET" && url.pathname === "/privacy") {
      return new Response(PRIVACY_HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8", ...CORS_HEADERS },
      });
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
