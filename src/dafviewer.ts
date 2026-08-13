/**
 * Daf viewer — MCP App (spec ext-apps 2026-01-26).
 *
 * Le tool `daf_viewer` charge une amoud de Guemara (par défaut : le daf yomi
 * du jour) avec Rachi et Tossafot, et renvoie un structuredContent que la
 * View HTML (ressource ui://) met en page façon Vilna : texte au centre,
 * commentateurs dépliables, traduction au clic. Les hôtes sans MCP Apps
 * reçoivent un résumé texte — dégradation gracieuse.
 *
 * La View est autonome (CSP restrictive par défaut : aucune ressource
 * externe) — toutes les données arrivent via ui/notifications/tool-result.
 */

import type { Env, ToolDefinition, ToolHandler } from "./sefaria";

export const DAF_VIEWER_URI = "ui://torah-mcp/daf-viewer.html";
export const MCP_APP_MIME = "text/html;profile=mcp-app";

const USER_AGENT = "torah-mcp/1.5 (+https://torah-mcp.com)";

async function sefariaJson(env: Env, path: string): Promise<any> {
  const resp = await fetch(`${env.SEFARIA_API_URL}${path}`, {
    headers: { Accept: "application/json", "User-Agent": USER_AGENT },
    cf: { cacheTtl: 86400, cacheEverything: true },
  } as RequestInit);
  const text = await resp.text();
  if (!resp.ok) throw new Error(`Sefaria ${resp.status}: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

function stripHtml(s: string): string {
  return s
    .replace(/<sup[^>]*>.*?<\/sup>/g, "")
    .replace(/<i class="footnote">.*?<\/i>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function flatten(t: unknown): string[] {
  if (typeof t === "string") return [t];
  if (Array.isArray(t)) return t.flatMap(flatten);
  return [];
}

async function fetchVersion(env: Env, ref: string, lang: "he" | "en"): Promise<string[]> {
  const encoded = encodeURIComponent(ref.replace(/ /g, "_"));
  try {
    const data = await sefariaJson(
      env,
      `/v3/texts/${encoded}?version=${lang === "he" ? "primary" : "translation"}`
    );
    const v = (data.versions || []).find(
      (x: any) => (x.actualLanguage || x.language) === lang
    ) || (data.versions || [])[0];
    return flatten(v?.text).map(stripHtml).filter(Boolean);
  } catch {
    return [];
  }
}

export const dafViewerTools: ToolDefinition[] = [
  {
    name: "daf_viewer",
    title: "Visualiseur de daf (page de Vilna)",
    annotations: { title: "Visualiseur de daf (page de Vilna)", readOnlyHint: true },
    description:
      "Affiche une page de Guemara en visualiseur interactif façon Vilna : texte au " +
      "centre, Rachi et Tossafot dépliables, traduction au clic. Sans argument : le " +
      "daf yomi du jour. Utiliser dès que l'utilisateur veut VOIR ou étudier un daf " +
      '(ex : "montre-moi le daf du jour", "ouvre Berakhot 2a").',
    inputSchema: {
      type: "object",
      properties: {
        ref: {
          type: "string",
          description: 'Référence du daf (ex : "Berakhot 2a", "Bava Metzia 21a"). Défaut : daf yomi du jour.',
        },
      },
      required: [],
    },
    _meta: {
      ui: { resourceUri: DAF_VIEWER_URI },
      "ui/resourceUri": DAF_VIEWER_URI,
    },
  } as ToolDefinition & { _meta: any },
];

/**
 * Renvoie un CallToolResult complet (content + structuredContent) — le
 * routeur le détecte via la clé __mcpResult.
 */
export const dafViewerHandlers: Record<string, ToolHandler> = {
  daf_viewer: async (args, env) => {
    let ref = String(args?.ref || "").trim();
    if (!ref) {
      const cal = await sefariaJson(env, "/calendars");
      const daf = (cal.calendar_items || []).find((i: any) => i.title?.en === "Daf Yomi");
      if (!daf?.ref) throw new Error("Daf yomi du jour introuvable — préciser une référence.");
      ref = daf.ref;
    }

    const encoded = encodeURIComponent(ref.replace(/ /g, "_"));
    const main = await sefariaJson(env, `/v3/texts/${encoded}?version=primary&version=translation`);
    const heV = (main.versions || []).find((v: any) => (v.actualLanguage || v.language) === "he");
    const enV = (main.versions || []).find((v: any) => (v.actualLanguage || v.language) === "en");
    const he = flatten(heV?.text).map(stripHtml);
    const en = flatten(enV?.text).map(stripHtml);
    if (he.length === 0) {
      throw new Error(`Texte introuvable pour "${ref}" — vérifier la référence (ex : Berakhot 2a).`);
    }

    const canonical = String(main.ref || ref);
    const [rashi, tosafot] = await Promise.all([
      fetchVersion(env, `Rashi on ${canonical}`, "he"),
      fetchVersion(env, `Tosafot on ${canonical}`, "he"),
    ]);

    const cap = (a: string[], n: number) => a.slice(0, n);
    const structuredContent = {
      ref: canonical,
      heRef: main.heRef || "",
      lien: `https://www.sefaria.org/${encoded}`,
      segments: cap(he, 60).map((h, i) => ({ he: h, en: en[i] || "" })),
      rashi: cap(rashi, 60),
      tosafot: cap(tosafot, 60),
      licences: { texte: heV?.license || "", traduction: enV?.license || "" },
    };

    const resume =
      `${canonical} — ${he.length} segments affichés dans le visualiseur` +
      ` (Rachi : ${rashi.length}, Tossafot : ${tosafot.length}).` +
      ` Étudier en ligne : https://www.sefaria.org/${encoded}`;

    return {
      __mcpResult: true,
      content: [{ type: "text", text: resume }],
      structuredContent,
    };
  },
};

// ----------------------------------------------------------------------------
// La View — page de Vilna autonome
// ----------------------------------------------------------------------------

export const DAF_VIEWER_HTML = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Daf</title>
<style>
  :root {
    --paper:#f8f3e6; --ink:#22201b; --muted:#6d675c; --line:#d9d0bb;
    --accent:#7a1f1f; --panel:#f2ecdc;
  }
  .dark {
    --paper:#1f1c17; --ink:#e9e4d8; --muted:#9a917f; --line:#3c372e;
    --accent:#d08770; --panel:#26221c;
  }
  * { box-sizing:border-box; margin:0; }
  html, body { background:var(--paper); color:var(--ink); }
  body { font-family: Georgia, "Times New Roman", "SBL Hebrew", "David", serif; padding:14px 16px 18px; }
  header { display:flex; align-items:baseline; justify-content:space-between; gap:10px; border-bottom:2px solid var(--ink); padding-bottom:8px; margin-bottom:10px; }
  header .he { font-size:1.45rem; font-weight:700; }
  header .en { font-size:.8rem; color:var(--muted); direction:ltr; }
  #gemara { font-size:1.22rem; line-height:1.85; text-align:justify; }
  #gemara span.seg { cursor:pointer; border-radius:3px; padding:0 1px; }
  #gemara span.seg:hover { background:rgba(122,31,31,.12); }
  #gemara span.seg.open { background:rgba(122,31,31,.16); }
  .tr { direction:ltr; text-align:left; font-size:.86rem; color:var(--muted); border-inline-start:3px solid var(--accent); padding:4px 10px; margin:6px 0 10px; display:block; font-style:italic; }
  details { border:1px solid var(--line); background:var(--panel); border-radius:6px; margin-top:12px; }
  summary { cursor:pointer; padding:8px 12px; font-weight:700; font-size:1.02rem; list-style:none; display:flex; justify-content:space-between; }
  summary::after { content:"+"; color:var(--muted); }
  details[open] summary::after { content:"−"; }
  .comm { padding:2px 14px 12px; font-size:1.02rem; line-height:1.7; text-align:justify; }
  .comm p { margin:0 0 8px; }
  .comm p::first-letter { font-weight:700; }
  footer { margin-top:12px; font-size:.72rem; color:var(--muted); display:flex; justify-content:space-between; direction:ltr; }
  #loading { color:var(--muted); font-size:.95rem; padding:20px 0; text-align:center; }
  .hint { font-size:.72rem; color:var(--muted); margin:4px 0 8px; }
</style>
</head>
<body>
  <div id="loading">טוען את הדף…</div>
  <div id="app" style="display:none">
    <header><span class="he" id="heref"></span><span class="en" id="enref"></span></header>
    <p class="hint">לחיצה על קטע — תרגום. Un clic sur un segment affiche la traduction.</p>
    <div id="gemara"></div>
    <details id="rashi-box"><summary>רש״י</summary><div class="comm" id="rashi"></div></details>
    <details id="tosafot-box"><summary>תוספות</summary><div class="comm" id="tosafot"></div></details>
    <footer><span id="lic"></span><span>Sefaria · Torah MCP</span></footer>
  </div>
<script>
(function () {
  var nextId = 1, pending = {};
  function req(method, params) {
    var id = nextId++;
    parent.postMessage({ jsonrpc: "2.0", id: id, method: method, params: params }, "*");
    return new Promise(function (res, rej) { pending[id] = { res: res, rej: rej }; });
  }
  function notif(method, params) {
    parent.postMessage({ jsonrpc: "2.0", method: method, params: params }, "*");
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function reportSize() {
    notif("ui/notifications/size-changed", { height: Math.min(document.documentElement.scrollHeight + 8, 1400) });
  }
  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
  }
  function render(result) {
    var d = (result && result.structuredContent) || null;
    if (!d) return;
    document.getElementById("loading").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("heref").textContent = d.heRef || d.ref;
    document.getElementById("enref").textContent = d.ref;
    var g = document.getElementById("gemara");
    g.innerHTML = "";
    (d.segments || []).forEach(function (s, i) {
      var sp = document.createElement("span");
      sp.className = "seg";
      sp.textContent = s.he + " ";
      var tr = null;
      sp.addEventListener("click", function () {
        if (tr) { tr.remove(); tr = null; sp.classList.remove("open"); }
        else if (s.en) {
          tr = document.createElement("span");
          tr.className = "tr";
          tr.textContent = s.en;
          sp.after(tr);
          sp.classList.add("open");
        }
        reportSize();
      });
      g.appendChild(sp);
    });
    function fill(id, arr) {
      var box = document.getElementById(id + "-box");
      var el = document.getElementById(id);
      if (!arr || !arr.length) { box.style.display = "none"; return; }
      el.innerHTML = arr.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
      box.addEventListener("toggle", reportSize);
    }
    fill("rashi", d.rashi);
    fill("tosafot", d.tosafot);
    var lic = [];
    if (d.licences && d.licences.texte) lic.push(d.licences.texte);
    document.getElementById("lic").textContent = lic.join(" · ");
    reportSize();
  }
  window.addEventListener("message", function (e) {
    var m = e.data;
    if (!m || m.jsonrpc !== "2.0") return;
    if (m.id !== undefined && (m.result !== undefined || m.error !== undefined)) {
      var p = pending[m.id];
      if (p) { delete pending[m.id]; m.error ? p.rej(m.error) : p.res(m.result); }
      return;
    }
    if (m.method === "ui/notifications/tool-result") render(m.params);
    if (m.method === "ui/notifications/host-context-changed" && m.params && m.params.theme) applyTheme(m.params.theme);
  });
  req("ui/initialize", {
    protocolVersion: "2026-01-26",
    clientInfo: { name: "torah-mcp-daf-viewer", version: "1.0.0" },
    appCapabilities: { availableDisplayModes: ["inline"] },
  }).then(function (init) {
    var ctx = (init && init.hostContext) || {};
    if (ctx.theme) applyTheme(ctx.theme);
    notif("ui/notifications/initialized", {});
    reportSize();
  }).catch(function () { /* hôte sans MCP Apps : rien à faire */ });
})();
</script>
</body>
</html>`;
