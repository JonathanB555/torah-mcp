/**
 * Journal statistique privé des questions posées sur /question.
 *
 * - `journaliser()` : une ligne par question dans D1 (binding STATS_DB),
 *   sans adresse IP ni identifiant de visiteur — seulement ce qu'il faut pour
 *   comprendre l'usage (quand, quel niveau, quelle question, combien de temps,
 *   combien de tokens, quel pays en agrégat). Sans binding : no-op.
 * - `pageStats()` : GET /stats, protégé par HTTP Basic auth (secret
 *   STATS_PASSWORD, utilisateur libre). Sans secret : 404, comme si la page
 *   n'existait pas. Aucun GA4 sur cette page.
 * - `csvStats()` : GET /stats.csv, même protection, export complet.
 */

import type { Env } from "./sefaria";
import type { QuestionMeta } from "./question";

export interface JournalEntry {
  meta: QuestionMeta;
  status: number;
  body: any;
  duree_ms: number;
  modele: string;
  pays: string | null;
}

const MAX_QUESTION_STORED = 600;

export async function journaliser(env: Env, e: JournalEntry): Promise<void> {
  if (!env.STATS_DB) return;
  const ok = e.status === 200;
  const statut = ok ? "ok" : e.status === 429 ? "refus" : "erreur";
  try {
    await env.STATS_DB.prepare(
      `INSERT INTO questions (ts, mode, question, statut, cause, duree_ms, nb_sources, tours, tokens_in, tokens_out, modele, pays, reponse_len, lang)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)`
    )
      .bind(
        new Date().toISOString(),
        e.meta.mode,
        e.meta.question.slice(0, MAX_QUESTION_STORED),
        statut,
        ok ? null : String(e.body?.cause || "api_" + e.status),
        e.duree_ms,
        ok ? (Array.isArray(e.body?.sources) ? e.body.sources.length : 0) : null,
        ok ? Number(e.body?.tours) || 0 : null,
        e.meta.tokens_in,
        e.meta.tokens_out,
        e.modele,
        e.pays,
        ok ? String(e.body?.reponse || "").length : null,
        e.meta.lang || "fr"
      )
      .run();
  } catch (err) {
    console.error("stats: insertion impossible", err);
  }
}

// ---------------------------------------------------------------------------
// Accès à la page privée
// ---------------------------------------------------------------------------

function autorise(request: Request, env: Env): boolean {
  if (!env.STATS_PASSWORD) return false;
  const h = request.headers.get("Authorization") || "";
  if (!h.startsWith("Basic ")) return false;
  try {
    const decoded = atob(h.slice(6));
    const mdp = decoded.slice(decoded.indexOf(":") + 1);
    return tempsConstant(mdp, env.STATS_PASSWORD);
  } catch {
    return false;
  }
}

function tempsConstant(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function demanderAuth(): Response {
  return new Response("Authentification requise.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Torah MCP — statistiques", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

// ---------------------------------------------------------------------------
// Requêtes
// ---------------------------------------------------------------------------

interface Totaux { n: number; ok: number; refus: number; erreur: number; duree: number | null; tin: number; tout: number; sources: number | null }

async function totaux(db: D1Database, depuisISO: string | null): Promise<Totaux> {
  const where = depuisISO ? "WHERE ts >= ?1" : "";
  const st = db.prepare(
    `SELECT COUNT(*) AS n,
            SUM(statut='ok') AS ok, SUM(statut='refus') AS refus, SUM(statut='erreur') AS erreur,
            AVG(CASE WHEN statut='ok' THEN duree_ms END) AS duree,
            COALESCE(SUM(tokens_in),0) AS tin, COALESCE(SUM(tokens_out),0) AS tout,
            AVG(CASE WHEN statut='ok' THEN nb_sources END) AS sources
     FROM questions ${where}`
  );
  const r = await (depuisISO ? st.bind(depuisISO) : st).first<any>();
  return { n: r?.n || 0, ok: r?.ok || 0, refus: r?.refus || 0, erreur: r?.erreur || 0, duree: r?.duree ?? null, tin: r?.tin || 0, tout: r?.tout || 0, sources: r?.sources ?? null };
}

async function repartition(db: D1Database, col: "mode" | "pays" | "cause" | "lang", depuisISO: string, limite = 12): Promise<{ k: string; n: number }[]> {
  const extra = col === "cause" ? "AND statut <> 'ok'" : "";
  const { results } = await db
    .prepare(`SELECT COALESCE(${col},'—') AS k, COUNT(*) AS n FROM questions WHERE ts >= ?1 ${extra} GROUP BY k ORDER BY n DESC LIMIT ${limite}`)
    .bind(depuisISO)
    .all<any>();
  return (results || []).map((r) => ({ k: String(r.k), n: Number(r.n) }));
}

async function parJour(db: D1Database, jours: number): Promise<{ j: string; n: number; ok: number }[]> {
  const depuis = new Date(Date.now() - jours * 86_400_000).toISOString().slice(0, 10);
  const { results } = await db
    .prepare(`SELECT substr(ts,1,10) AS j, COUNT(*) AS n, SUM(statut='ok') AS ok FROM questions WHERE ts >= ?1 GROUP BY j ORDER BY j`)
    .bind(depuis)
    .all<any>();
  const parDate = new Map((results || []).map((r) => [String(r.j), { n: Number(r.n), ok: Number(r.ok) }]));
  // Toutes les journées, zéros compris, pour une courbe à pas constant.
  return Array.from({ length: jours + 1 }, (_, i) => {
    const j = new Date(Date.now() - (jours - i) * 86_400_000).toISOString().slice(0, 10);
    const v = parDate.get(j) || { n: 0, ok: 0 };
    return { j, n: v.n, ok: v.ok };
  });
}

async function dernieres(db: D1Database, limite: number): Promise<any[]> {
  const { results } = await db
    .prepare(`SELECT id, ts, mode, question, statut, cause, duree_ms, nb_sources, tokens_in, tokens_out, pays FROM questions ORDER BY id DESC LIMIT ?1`)
    .bind(limite)
    .all<any>();
  return results || [];
}

// ---------------------------------------------------------------------------
// Rendu
// ---------------------------------------------------------------------------

const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const nf = new Intl.NumberFormat("fr-FR");
const num = (n: number | null | undefined) => (n == null ? "—" : nf.format(Math.round(n)));
const sec = (ms: number | null) => (ms == null ? "—" : (ms / 1000).toFixed(0) + " s");
const NIV: Record<string, string> = { debutant: "débutant", classique: "classique", avance: "avancé" };
// Ordre de grandeur, prix publics Sonnet (3 $/M entrée, 15 $/M sortie) — indicatif.
const cout = (tin: number, tout: number) => ((tin * 3 + tout * 15) / 1_000_000).toFixed(2) + " $";

function dateFr(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function bloc(titre: string, t: Totaux): string {
  return `<div class="k"><span class="lab">${titre}</span><b>${num(t.n)}</b><span class="d">${num(t.ok)} réponses · ${num(t.refus)} refus · ${num(t.erreur)} erreurs<br>${sec(t.duree)} en moyenne · ${t.sources == null ? "—" : t.sources.toFixed(1)} sources<br>${num(t.tin + t.tout)} tokens ≈ ${cout(t.tin, t.tout)}</span></div>`;
}

function liste(titre: string, rows: { k: string; n: number }[], total: number, libelle: (k: string) => string = (k) => k): string {
  if (!rows.length) return "";
  const max = rows[0].n || 1;
  return `<div class="rep"><span class="lab">${titre}</span><ul>${rows
    .map((r) => `<li><span class="n">${esc(libelle(r.k))}</span><span class="bar"><i style="width:${Math.round((r.n / max) * 100)}%"></i></span><span class="v">${num(r.n)}${total ? ` <small>${Math.round((r.n / total) * 100)} %</small>` : ""}</span></li>`)
    .join("")}</ul></div>`;
}

function courbe(jours: { j: string; n: number; ok: number }[]): string {
  if (!jours.length) return "";
  const max = Math.max(...jours.map((d) => d.n), 1);
  return `<div class="jours"><span class="lab">Par jour — 30 derniers</span><div class="cols">${jours
    .map((d) => `<div class="col" title="${d.j} : ${d.n} questions, ${d.ok} réponses"><i style="height:${Math.round((d.n / max) * 100)}%"></i><em>${d.j.slice(8)}</em></div>`)
    .join("")}</div></div>`;
}

export async function pageStats(request: Request, env: Env): Promise<Response> {
  if (!env.STATS_PASSWORD || !env.STATS_DB) return new Response("Introuvable", { status: 404 });
  if (!autorise(request, env)) return demanderAuth();
  const db = env.STATS_DB;
  const now = Date.now();
  const iso = (ms: number) => new Date(now - ms).toISOString();
  const [tout, j30, j7, j1, modes, pays, causes, langs, jours, recentes] = await Promise.all([
    totaux(db, null),
    totaux(db, iso(30 * 86_400_000)),
    totaux(db, iso(7 * 86_400_000)),
    totaux(db, iso(86_400_000)),
    repartition(db, "mode", iso(30 * 86_400_000)),
    repartition(db, "pays", iso(30 * 86_400_000)),
    repartition(db, "cause", iso(30 * 86_400_000)),
    repartition(db, "lang", iso(30 * 86_400_000)),
    parJour(db, 30),
    dernieres(db, 200),
  ]);

  const lignes = recentes
    .map(
      (r) => `<tr class="${esc(r.statut)}"><td class="t">${esc(dateFr(r.ts))}</td><td class="m">${esc(NIV[r.mode] || r.mode)}</td><td class="q">${esc(r.question)}</td><td class="s">${r.statut === "ok" ? sec(r.duree_ms) + " · " + num(r.nb_sources) + " src" : esc(r.cause || r.statut)}</td><td class="p">${esc(r.pays || "")}</td></tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Statistiques — Torah MCP</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&display=swap');
  :root { --paper:#f7f6f1; --ink:#082a99; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --muted:rgba(8,42,153,.65); --hl:#dbe3ff; }
  * { box-sizing:border-box; } html { scroll-behavior:auto; }
  body { margin:0; background:var(--paper); color:var(--ink); font:16px/1.6 "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  main { max-width:64rem; margin:0 auto; } a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.4rem 0; border-bottom:1px solid var(--ink-15); }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; text-decoration:none; } nav .wm b { font-weight:600; border-bottom:3px solid var(--ink); }
  nav .r a { text-decoration:none; margin-left:1.1rem; font-size:.9rem; }
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2rem,4vw,2.8rem); margin:2.4rem 0 .4rem; letter-spacing:-.02em; } h1 strong { font-weight:600; }
  p.muted { color:var(--muted); margin:0 0 2rem; font-size:.95rem; }
  .lab { display:block; font-size:.74rem; letter-spacing:.16em; text-transform:uppercase; opacity:.55; margin-bottom:.4rem; }
  .ks { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; }
  .k { border:1.5px solid var(--ink-15); padding:.9rem 1rem 1rem; } .k b { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:2.2rem; line-height:1; display:block; margin:.1rem 0 .5rem; } .k .d { font-size:.82rem; color:var(--muted); line-height:1.5; }
  .grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:2rem; margin-top:2.4rem; }
  .rep ul { list-style:none; margin:0; padding:0; } .rep li { display:grid; grid-template-columns:7rem 1fr 4.5rem; gap:.6rem; align-items:center; font-size:.9rem; padding:.2rem 0; }
  .rep .bar { height:.55rem; background:var(--ink-15); } .rep .bar i { display:block; height:100%; background:var(--ink); } .rep .v { text-align:right; font-variant-numeric:tabular-nums; } .rep small { opacity:.55; }
  .jours { margin-top:2.4rem; } .cols { display:flex; gap:3px; align-items:flex-end; height:7rem; border-bottom:1px solid var(--ink-15); }
  .col { flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; position:relative; } .col i { display:block; width:100%; background:var(--ink); min-height:1px; } .col em { position:absolute; bottom:-1.3rem; font-size:.6rem; font-style:normal; opacity:.5; }
  h2 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; margin:3.2rem 0 .8rem; }
  table { width:100%; border-collapse:collapse; font-size:.88rem; } td { padding:.4rem .5rem .4rem 0; border-bottom:1px solid var(--ink-15); vertical-align:top; }
  td.t { white-space:nowrap; font-variant-numeric:tabular-nums; opacity:.7; width:5.5rem; } td.m { white-space:nowrap; font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; opacity:.6; padding-top:.55rem; width:6rem; }
  td.s { white-space:nowrap; text-align:right; opacity:.75; width:7rem; } td.p { width:2.5rem; text-align:right; opacity:.5; }
  tr.erreur td.s, tr.refus td.s { color:#7a1f1f; opacity:1; }
  .exp { margin-top:1.4rem; font-size:.9rem; } .exp a { text-decoration:none; } .exp a::before { content:"[ "; color:var(--ink-40); } .exp a::after { content:" ]"; color:var(--ink-40); } .exp a:hover::before { content:"[ → "; }
  footer { margin-top:4rem; font-size:.85rem; color:var(--muted); border-top:1px solid var(--ink-15); padding-top:1.2rem; }
  @media (max-width:900px) { .ks { grid-template-columns:1fr 1fr; } .grid { grid-template-columns:1fr; } td.p { display:none; } }
</style></head>
<body><main>
  <nav><a class="wm" href="/"><b>Torah</b>&nbsp;MCP</a><span class="r"><a href="/question">La question</a><a href="/outils">Outils</a><a href="/install">Installer</a></span></nav>
  <h1>Les <strong>questions</strong> posées.</h1>
  <p class="muted">Journal privé de <code>/question</code> — sans adresse IP ni identifiant. Heures de Paris. Coût indicatif aux prix publics Sonnet.</p>
  <div class="ks">${bloc("Depuis le début", tout)}${bloc("30 jours", j30)}${bloc("7 jours", j7)}${bloc("24 heures", j1)}</div>
  <div class="grid">${liste("Niveau — 30 j", modes, j30.n, (k) => NIV[k] || k)}${liste("Pays — 30 j", pays, j30.n)}${liste("Échecs — 30 j", causes, 0)}${liste("Langue — 30 j", langs, j30.n)}</div>
  ${courbe(jours)}
  <h2>Les 200 dernières</h2>
  <table><tbody>${lignes || '<tr><td colspan="5">Aucune question enregistrée pour l’instant.</td></tr>'}</tbody></table>
  <p class="exp"><a href="/stats.csv">Exporter tout en CSV</a></p>
  <footer><p>Un projet personnel de Jonathan Bensaid.</p></footer>
</main></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}

export async function csvStats(request: Request, env: Env): Promise<Response> {
  if (!env.STATS_PASSWORD || !env.STATS_DB) return new Response("Introuvable", { status: 404 });
  if (!autorise(request, env)) return demanderAuth();
  const { results } = await env.STATS_DB.prepare(`SELECT * FROM questions ORDER BY id`).all<any>();
  const cols = ["id", "ts", "mode", "lang", "question", "statut", "cause", "duree_ms", "nb_sources", "tours", "tokens_in", "tokens_out", "modele", "pays", "reponse_len"];
  const cell = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const csv = "﻿" + [cols.join(";"), ...(results || []).map((r) => cols.map((c) => cell(r[c])).join(";"))].join("\n");
  return new Response(csv, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="torah-mcp-questions.csv"', "Cache-Control": "no-store" },
  });
}
