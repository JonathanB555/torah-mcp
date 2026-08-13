/**
 * Page d'accueil servie sur GET / — le lien se suffit à lui-même :
 * ce que c'est, comment l'installer, crédits Sefaria.
 */

export const PRIVACY_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Torah MCP — Confidentialité / Privacy</title>
<style>
  body { font:16px/1.65 -apple-system, "Segoe UI", Roboto, sans-serif; color:#1f2430; background:#faf9f6; padding:3rem 1.25rem; }
  main { max-width:680px; margin:0 auto; }
  h1 { font-size:1.6rem; margin-bottom:1rem; } h2 { font-size:1.1rem; margin:1.6rem 0 .5rem; }
  a { color:#0f5c8c; }
</style>
</head>
<body>
<main>
  <h1>Confidentialité — Torah MCP</h1>
  <p>Ce serveur ne collecte, ne stocke et ne partage aucune donnée personnelle.
  Il ne demande aucun compte, ne dépose aucun cookie, et ne conserve aucun
  historique des questions posées. Les requêtes transitent vers l'API publique
  de <a href="https://www.sefaria.org">Sefaria</a> pour récupérer les textes
  demandés, et l'infrastructure Cloudflare produit des journaux techniques
  opérationnels de courte durée (adresse IP, horodatage) utilisés uniquement
  pour la sécurité et la limitation de débit.</p>
  <h2>Privacy — English</h2>
  <p>This server collects, stores and shares no personal data. No account, no
  cookies, no history of queries. Requests are forwarded to the public
  <a href="https://www.sefaria.org">Sefaria</a> API to fetch the requested
  texts; Cloudflare's infrastructure produces short-lived operational logs
  (IP address, timestamp) used solely for security and rate limiting.</p>
  <p>Contact : <a href="https://github.com/JonathanB555/torah-mcp/issues">github.com/JonathanB555/torah-mcp/issues</a></p>
</main>
</body>
</html>`;

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
  <p class="muted">La discipline des sources pour Claude : jamais de citation de mémoire. Textes lus via Sefaria, catalogue HebrewBooks, et une méthode d'étude embarquée. Gratuit, sans compte, sans collecte de données.</p>

  <h2>Ce que ça change</h2>
  <p>Les assistants IA répondent aux questions de halakha « de mémoire » — avec le risque de citations approximatives ou inventées. Torah MCP impose une <strong>méthode</strong> : avant toute réponse religieuse, Claude charge une discipline d'étude qui l'oblige à lire le texte réel (via l'API publique de Sefaria), à citer exactement, à signaler les divergences (rishonim/aharonim, ashkénaze/séfarade), et à donner les liens <a href="https://hebrewbooks.org">hebrewbooks.org</a> pour étudier sur la page — sans jamais fabriquer une référence.</p>

  <h2>Le duo idéal : avec le MCP officiel de Sefaria</h2>
  <div class="card">
    <p>Sefaria publie son propre serveur MCP, excellent pour l'accès en profondeur à la bibliothèque (14 outils : dictionnaires, manuscrits, recherche par livre…). Installez les deux — l'officiel pour la profondeur, Torah MCP pour la discipline de citation, la méthode et HebrewBooks :</p>
    <span class="url">https://mcp.sefaria.org/sse</span>
    <p class="muted"><a href="https://developers.sefaria.org/docs/the-sefaria-mcp">Documentation du MCP officiel Sefaria</a></p>
  </div>

  <h2>Installation — claude.ai (2 minutes)</h2>
  <div class="card">
    <ol>
      <li>Ouvrez <a href="https://claude.ai/settings/connectors">claude.ai → Settings → Connectors</a></li>
      <li>Cliquez sur <strong>Add custom connector</strong></li>
      <li>Collez cette URL :</li>
    </ol>
    <span class="url">https://torah-mcp.com/mcp</span>
    <p class="muted">Nommez-le « Torah », validez. Fonctionne ensuite aussi dans l'app mobile.</p>
  </div>

  <h2>Installation — Claude Code</h2>
  <div class="card">
    <span class="url">claude mcp add --transport http torah https://torah-mcp.com/mcp</span>
  </div>

  <h2>Les outils</h2>
  <ul>
    <li><code>hebrewbooks_skill</code> — <strong>le cœur</strong> : la méthode d'étude, chargée avant toute réponse religieuse</li>
    <li><code>hebrewbooks_search</code> — recherche dans le catalogue HebrewBooks (~65 000 seforim), liens de lecture vérifiés</li>
    <li><code>sefaria_text</code> — le texte d'une référence, hébreu et traduction</li>
    <li><code>sefaria_links</code> — commentaires et textes liés, par catégorie</li>
    <li><code>sefaria_search</code> — recherche dans toute la bibliothèque</li>
    <li><code>sefaria_calendar</code> — paracha, daf yomi, Rambam quotidien</li>
  </ul>

  <section class="en">
    <h2>English</h2>
    <p>Torah MCP gives Claude a source discipline: before answering any religious question it loads a study method that forces reading the actual texts (Sefaria API), quoting exactly, flagging divergent opinions, and pointing to hebrewbooks.org for further study — never fabricating a reference. Pairs ideally with <a href="https://developers.sefaria.org/docs/the-sefaria-mcp">Sefaria's official MCP</a> for deep library access.</p>
    <p><strong>Install:</strong> claude.ai → Settings → Connectors → Add custom connector → paste the URL above. No account, no data collected.</p>
  </section>

  <footer>
    <p><a href="https://www.sefaria.org" aria-label="Powered by Sefaria"><img src="https://files.readme.io/dcee0a8-image.png" alt="Powered by Sefaria" width="139" height="72" style="display:block;margin-bottom:.7rem"></a>
    Textes servis par l'API publique de <a href="https://www.sefaria.org">Sefaria</a> — licences indiquées dans chaque réponse. Ce projet est indépendant de Sefaria. Code source : <a href="https://github.com/JonathanB555/torah-mcp">github.com/JonathanB555/torah-mcp</a> (MIT).</p>
  </footer>
</main>
</body>
</html>`;
