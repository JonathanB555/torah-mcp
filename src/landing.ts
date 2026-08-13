/**
 * Page d'accueil servie sur GET / — le lien se suffit à lui-même :
 * ce que c'est, comment l'installer, crédits Sefaria.
 */

export const LANDING_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Torah MCP — Sefaria dans Claude</title>
<meta name="description" content="Serveur MCP gratuit : Tanakh, Talmud, Choulhan Aroukh, responsa et calendriers d'étude (Sefaria) directement dans Claude.">
<style>
  :root { --ink:#1f2430; --muted:#5b6272; --accent:#0f5c8c; --paper:#faf9f6; --card:#ffffff; --line:#e5e2da; }
  * { box-sizing:border-box; margin:0; }
  body { font:16px/1.65 -apple-system, "Segoe UI", Roboto, sans-serif; color:var(--ink); background:var(--paper); padding:3rem 1.25rem 4rem; }
  main { max-width:680px; margin:0 auto; }
  h1 { font-size:2rem; line-height:1.2; margin-bottom:.5rem; }
  h2 { font-size:1.15rem; margin:2.2rem 0 .7rem; }
  p, li { color:var(--ink); }
  .muted { color:var(--muted); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:1.1rem 1.3rem; margin:.9rem 0; }
  code { background:#eef1f5; border-radius:5px; padding:.15em .45em; font-size:.92em; word-break:break-all; }
  .url { display:block; background:#10304a; color:#eaf3fa; border-radius:8px; padding: .8rem 1rem; font-family:ui-monospace, Menlo, monospace; font-size:.95rem; margin:.6rem 0; word-break:break-all; }
  ol { padding-left:1.3rem; } ol li { margin:.35rem 0; }
  ul { padding-left:1.3rem; } ul li { margin:.3rem 0; }
  a { color:var(--accent); }
  .en { border-top:1px solid var(--line); margin-top:2.8rem; padding-top:1.8rem; }
  footer { margin-top:2.5rem; font-size:.88rem; color:var(--muted); }
</style>
</head>
<body>
<main>
  <h1>Torah MCP</h1>
  <p class="muted">La bibliothèque Sefaria — Tanakh, Talmud, Michné Torah, Choulhan Aroukh, responsa — directement dans Claude. Gratuit, sans compte, sans collecte de données.</p>

  <h2>Ce que ça change</h2>
  <p>Quand vous posez une question de halakha ou de limoud, Claude va <em>lire les textes réels</em> (via l'API publique de Sefaria) au lieu de répondre de mémoire : citation exacte, référence vérifiable, commentaires liés (Rachi, Tossafot…), et liens <a href="https://hebrewbooks.org">hebrewbooks.org</a> pour étudier sur la page.</p>

  <h2>Installation — claude.ai (2 minutes)</h2>
  <div class="card">
    <ol>
      <li>Ouvrez <a href="https://claude.ai/settings/connectors">claude.ai → Settings → Connectors</a></li>
      <li>Cliquez sur <strong>Add custom connector</strong></li>
      <li>Collez cette URL :</li>
    </ol>
    <span class="url">https://torah-mcp.jonathan-ef2.workers.dev/mcp</span>
    <p class="muted">Nommez-le « Torah », validez. Fonctionne ensuite aussi dans l'app mobile.</p>
  </div>

  <h2>Installation — Claude Code</h2>
  <div class="card">
    <span class="url">claude mcp add --transport http torah https://torah-mcp.jonathan-ef2.workers.dev/mcp</span>
  </div>

  <h2>Les outils</h2>
  <ul>
    <li><code>sefaria_text</code> — le texte d'une référence, hébreu et traduction</li>
    <li><code>sefaria_links</code> — commentaires et textes liés, par catégorie</li>
    <li><code>sefaria_search</code> — recherche dans toute la bibliothèque</li>
    <li><code>sefaria_calendar</code> — paracha, daf yomi, Rambam quotidien</li>
    <li><code>hebrewbooks_skill</code> — la méthode : répondre depuis les sources lues, jamais de mémoire</li>
  </ul>

  <section class="en">
    <h2>English</h2>
    <p>Free MCP server that puts the Sefaria library (Tanakh, Talmud, Shulchan Arukh, responsa, study calendars) inside Claude. Answers get grounded in the actual texts — exact quotes, verifiable references, linked commentaries — instead of model memory.</p>
    <p><strong>Install:</strong> claude.ai → Settings → Connectors → Add custom connector → paste the URL above. No account, no data collected.</p>
  </section>

  <footer>
    <p>Textes servis par l'API publique de <a href="https://www.sefaria.org">Sefaria</a> — licences indiquées dans chaque réponse. Code source : <a href="https://github.com/JonathanB555/torah-mcp">github.com/JonathanB555/torah-mcp</a> (MIT).</p>
  </footer>
</main>
</body>
</html>`;
