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
import { type Lang, href, altLinks, langSwitcher } from "./i18n";

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
        langue: {
          type: "string",
          enum: ["fr", "en"],
          description: 'Langue de traduction souhaitée : "fr" (défaut — français si Sefaria en a une, sinon anglais) ou "en" (anglais en priorité).',
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
    // Français en priorité quand Sefaria en a une (Tanakh : Bible du Rabbinat) ; sinon la traduction par défaut (anglais).
    const main = await sefariaJson(env, `/v3/texts/${encoded}?version=primary&version=french&version=translation`);
    const heV = (main.versions || []).find((v: any) => (v.actualLanguage || v.language) === "he");
    const frV = (main.versions || []).find((v: any) => (v.actualLanguage || v.language) === "fr");
    const enV = (main.versions || []).find((v: any) => (v.actualLanguage || v.language) === "en");
    // langue=en (site /en et /he) : anglais en priorité ; sinon comportement historique.
    const trV = String(args?.langue || "fr") === "en" ? enV || frV : frV || enV;
    const he = flatten(heV?.text).map(stripHtml);
    const en = flatten(trV?.text).map(stripHtml);
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
      traduction: { langue: !trV ? "" : trV === frV ? "fr" : "en", version: trV?.versionTitle || "" },
      licences: { texte: heV?.license || "", traduction: trV?.license || "" },
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

type Strings = {
  title: string; description: string; open: string; today: string; all: string; hideAll: string;
  back: string; loading: string; error: string; hint: string; rashi: string; tosafot: string;
  trFr: string; trEn: string;
};

/** Chaînes de l'interface. Le FR est la référence (identique au visualiseur historique). */
const T: Record<Lang, Strings> = {
  fr: {
    title: "Daf",
    description: "Visualiseur de daf façon Vilna : Guemara au centre, Rachi et Tossafot dépliables, traduction au clic.",
    open: "Ouvrir",
    today: "Daf du jour",
    all: "Tout traduire",
    hideAll: "Masquer les traductions",
    back: "← torah-mcp.com",
    loading: "טוען את הדף…",
    error: "Erreur de chargement — réessayez.",
    hint: "לחיצה על קטע — תרגום. Un clic sur un segment affiche sa traduction.",
    rashi: "רש״י",
    tosafot: "תוספות",
    trFr: "Traduction française (Bible du Rabbinat).",
    trEn: "Traduction anglaise (pas de version française de ce texte sur Sefaria).",
  },
  en: {
    title: "Daf",
    description: "Vilna-style daf viewer: Gemara in the centre, Rashi and Tosafot expandable, translation on click.",
    open: "Open",
    today: "Today's daf",
    all: "Translate all",
    hideAll: "Hide translations",
    back: "← torah-mcp.com",
    loading: "Loading the daf…",
    error: "Loading error — please try again.",
    hint: "לחיצה על קטע — תרגום. Click a segment to show its translation.",
    rashi: "Rashi",
    tosafot: "Tosafot",
    trFr: "French translation (Bible du Rabbinat).",
    trEn: "English translation.",
  },
  he: {
    title: "דף",
    description: "צפייה בדף גמרא בפריסת וילנא: הגמרא במרכז, רש״י ותוספות נפתחים, תרגום בלחיצה.",
    open: "פתיחה",
    today: "הדף היומי",
    all: "תרגם הכול",
    hideAll: "הסתר תרגומים",
    back: "torah-mcp.com →",
    loading: "טוען את הדף…",
    error: "שגיאה בטעינה — נסו שוב.",
    hint: "לחיצה על קטע מציגה את תרגומו.",
    rashi: "רש״י",
    tosafot: "תוספות",
    trFr: "תרגום לצרפתית (Bible du Rabbinat).",
    trEn: "תרגום לאנגלית.",
  },
};

/**
 * La View, dans la langue de l'interface. Le document reste `lang="he" dir="rtl"`
 * dans les trois langues (le flux est celui de la Guemara) ; seuls les
 * éléments d'interface (barre de référence, pied) changent de sens en hébreu.
 * FR = ressource MCP App historique (`DAF_VIEWER_HTML`), servie aux hôtes.
 */
export function dafViewerHtml(lang: Lang): string {
  const s = T[lang];
  const uiDir = lang === "he" ? "rtl" : "ltr";
  // Langue de traduction demandée à /api/daf : rien en FR (comportement historique), anglais sur /en et /he.
  const trLang = lang === "fr" ? "" : "en";
  const js = JSON.stringify({ all: s.all, hideAll: s.hideAll, loading: s.loading, error: s.error, trFr: s.trFr, trEn: s.trEn });
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${s.title}</title>
<meta name="description" content="${s.description}">
${altLinks(lang, "/daf")}
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
  footer { margin-top:12px; font-size:.72rem; color:var(--muted); display:flex; justify-content:space-between; direction:${uiDir}; }
  #loading { color:var(--muted); font-size:.95rem; padding:20px 0; text-align:center; }
  .hint { font-size:.72rem; color:var(--muted); margin:4px 0 8px; }
  #topbar form { display:flex; gap:8px 18px; flex-wrap:wrap; align-items:baseline; direction:${uiDir}; }
  #refinput { flex:1; min-width:200px; padding:.45rem .1rem; border:0; border-bottom:1.5px solid var(--line); border-radius:0; background:transparent; color:var(--ink); font-size:.95rem; font-family:inherit; }
  #refinput:focus { outline:none; border-bottom-color:var(--ink); }
  #refinput::placeholder { color:var(--muted); opacity:.8; }
  .bk { padding:.35rem 0; border:0; border-radius:0; background:transparent; color:var(--ink); font-weight:700; cursor:pointer; font-family:inherit; font-size:.95rem; }
  .bk::before { content:"[ "; color:var(--muted); } .bk::after { content:" ]"; color:var(--muted); }
  .bk:hover::before { content:"[ → "; }
  .bk.sec { font-weight:400; }
  .lang { font-size:.82rem; letter-spacing:.08em; color:var(--muted); }
  .lang a { color:inherit; text-decoration:none; opacity:.6; }
  .lang a:hover { opacity:1; text-decoration:underline; }
  .lang .cur { font-weight:700; }
  .lang .dot { opacity:.35; margin:0 .45em; }
</style>
</head>
<body>
  <div id="topbar" style="display:none; margin-bottom:12px;">
    <form id="refform">
      <input id="refinput" dir="ltr" placeholder="Berakhot 2a, Bava Metzia 21a…">
      <button type="submit" class="bk">${s.open}</button>
      <button type="button" id="today" class="bk sec">${s.today}</button>
      <button type="button" id="all" class="bk sec">${s.all}</button>
      <a href="${href(lang, "/")}" style="font-size:.8rem; color:var(--muted); text-decoration:none;">${s.back}</a>
      ${langSwitcher(lang, "/daf")}
    </form>
  </div>
  <div id="loading">${s.loading}</div>
  <div id="app" style="display:none">
    <header><span class="he" id="heref"></span><span class="en" id="enref"></span></header>
    <p class="hint">${s.hint} <span id="trlang"></span></p>
    <div id="gemara"></div>
    <details id="rashi-box"><summary>${s.rashi}</summary><div class="comm" id="rashi"></div></details>
    <details id="tosafot-box"><summary>${s.tosafot}</summary><div class="comm" id="tosafot"></div></details>
    <footer><span id="lic"></span><span>Sefaria · Torah MCP</span></footer>
  </div>
<script>
(function () {
  var S = ${js};
  var TRLANG = ${JSON.stringify(trLang)};
  var PAGE = ${JSON.stringify(href(lang, "/daf"))};
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
    var segs = [];
    function openTr(o) {
      if (o.tr || !o.s.en) return;
      o.tr = document.createElement("span");
      o.tr.className = "tr";
      o.tr.textContent = o.s.en;
      o.sp.after(o.tr);
      o.sp.classList.add("open");
    }
    function closeTr(o) {
      if (!o.tr) return;
      o.tr.remove(); o.tr = null; o.sp.classList.remove("open");
    }
    (d.segments || []).forEach(function (s, i) {
      var sp = document.createElement("span");
      sp.className = "seg";
      sp.textContent = s.he + " ";
      var o = { s: s, sp: sp, tr: null };
      segs.push(o);
      sp.addEventListener("click", function () {
        if (o.tr) closeTr(o); else openTr(o);
        reportSize();
      });
      g.appendChild(sp);
    });
    var allBtn = document.getElementById("all");
    if (allBtn) {
      allBtn.onclick = function () {
        var anyClosed = segs.some(function (o) { return o.s.en && !o.tr; });
        segs.forEach(anyClosed ? openTr : closeTr);
        allBtn.textContent = anyClosed ? S.hideAll : S.all;
        reportSize();
      };
      allBtn.textContent = S.all;
    }
    var trl = document.getElementById("trlang");
    if (trl) trl.textContent = d.traduction && d.traduction.langue === "fr" ? S.trFr : d.traduction && d.traduction.langue === "en" ? S.trEn : "";
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
  var standalone = (window.parent === window);
  if (standalone) {
    // Mesure d'audience uniquement sur le site web — jamais dans un hôte MCP.
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K";
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", "G-NG6P5HPH9K");
    // Mode web : la page est servie sur torah-mcp.com/daf — on interroge l'API.
    document.getElementById("topbar").style.display = "block";
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) applyTheme("dark");
    var refQs = function (ref) { return ref ? "?ref=" + encodeURIComponent(ref) : ""; };
    var apiQs = function (ref) {
      var q = refQs(ref);
      if (!TRLANG) return q;
      return q + (q ? "&" : "?") + "langue=" + TRLANG;
    };
    var loadRef = function (ref) {
      document.getElementById("app").style.display = "none";
      var l = document.getElementById("loading");
      l.style.display = "block";
      l.textContent = S.loading;
      fetch("/api/daf" + apiQs(ref))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.error) { l.textContent = d.error; return; }
          render({ structuredContent: d });
          var seg = (d.segments || []).length;
          document.title = d.ref + " — Torah MCP";
          if (history.replaceState) history.replaceState(null, "", PAGE + refQs(ref));
        })
        .catch(function () { l.textContent = S.error; });
    };
    document.getElementById("refform").addEventListener("submit", function (e) {
      e.preventDefault();
      loadRef(document.getElementById("refinput").value.trim());
    });
    document.getElementById("today").addEventListener("click", function () {
      document.getElementById("refinput").value = "";
      loadRef("");
    });
    var initial = new URLSearchParams(location.search).get("ref") || "";
    if (initial) document.getElementById("refinput").value = initial;
    loadRef(initial);
  } else {
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
  }
})();
</script>
</body>
</html>`;
}

/** Compatibilité : la ressource MCP App et /daf (FR) — identique au visualiseur historique. */
export const DAF_VIEWER_HTML = dafViewerHtml("fr");
