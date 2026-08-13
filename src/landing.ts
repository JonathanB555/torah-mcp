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
  a { color:#0038b8; }
</style>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
</head>
<body>
<main>
  <h1>Confidentialité — Torah MCP</h1>
  <p>Le service MCP ne collecte, ne stocke et ne partage aucune donnée personnelle.
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
  <h2>Mesure d'audience du site web</h2>
  <p>Les pages de ce site (torah-mcp.com) utilisent Google Analytics 4 pour
  mesurer la fréquentation de façon agrégée (pages vues, provenance). Cela
  concerne uniquement la consultation du site dans un navigateur.
  <strong>Le connecteur MCP lui-même n'envoie rien à Google Analytics</strong> :
  aucune donnée d'usage dans Claude ou tout autre assistant n'est mesurée, et
  le visualiseur de daf intégré à Claude ne charge aucun traceur.
  Voir les <a href="https://policies.google.com/privacy">règles de
  confidentialité de Google</a>.</p>
  <h2>Website analytics — English</h2>
  <p>The website pages (torah-mcp.com) use Google Analytics 4 for aggregate
  traffic measurement (page views, referrers) — browser visits only.
  <strong>The MCP connector itself sends nothing to Google Analytics</strong>:
  no usage inside Claude or any assistant is measured, and the in-Claude daf
  viewer loads no tracker.</p>
  <p>Contact : <a href="https://github.com/JonathanB555/torah-mcp/issues">github.com/JonathanB555/torah-mcp/issues</a></p>
</main>
</body>
</html>`;

export const LANDING_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Torah MCP — la discipline des sources pour Claude</title>
<meta name="description" content="Claude qui cite la Torah depuis les vrais textes : méthode d'étude, havrouta, guide de paracha, page de Vilna interactive, Sefaria, HebrewBooks, zmanim, guematria. Gratuit, sans compte.">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
<style>
  :root {
    --bg:#f6f8fd; --surface:#ffffff; --ink:#0a1c4d; --muted:#54648f; --line:#d9e2f5;
    --blue:#0038b8; --blue-deep:#021d5e; --blue-soft:#e7eeff; --blue-ghost:#f0f4ff;
    --mono:ui-monospace, "SF Mono", Menlo, monospace;
  }
  * { box-sizing:border-box; margin:0; }
  html { scroll-behavior:smooth; }
  body {
    font:16px/1.65 -apple-system, "Segoe UI", Roboto, sans-serif; color:var(--ink);
    background:
      linear-gradient(var(--line) 1px, transparent 1px),
      linear-gradient(90deg, var(--line) 1px, transparent 1px),
      var(--bg);
    background-size: 44px 44px, 44px 44px, auto;
    background-attachment: fixed;
  }
  .serif { font-family: Georgia, "Times New Roman", serif; }
  a { color:var(--blue); }
  main { max-width:980px; margin:0 auto; padding:0 1.25rem 4rem; }

  nav { position:sticky; top:0; z-index:10; background:rgba(255,255,255,.82); backdrop-filter:blur(12px); border-bottom:1px solid var(--line); }
  nav .in { max-width:980px; margin:0 auto; padding:.75rem 1.25rem; display:flex; align-items:center; gap:1.1rem; flex-wrap:wrap; }
  nav .brand { font-family:var(--mono); font-weight:700; font-size:1rem; letter-spacing:.02em; color:var(--ink); text-decoration:none; }
  nav .brand b { color:var(--blue); }
  nav a.lnk { color:var(--muted); text-decoration:none; font-size:.88rem; }
  nav a.lnk:hover { color:var(--blue); }
  nav .cta { margin-inline-start:auto; background:var(--blue); color:#fff; text-decoration:none; padding:.5rem 1.1rem; border-radius:9px; font-size:.9rem; font-weight:600; transition:transform .15s ease, box-shadow .15s ease; }
  nav .cta:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(0,56,184,.35); }

  .hero { padding:4.5rem 0 3rem; display:grid; grid-template-columns:1.05fr .95fr; gap:2.6rem; align-items:center; position:relative; }
  @media (max-width:800px) { .hero { grid-template-columns:1fr; padding-top:3rem; } }
  .hero h1 { font-family:Georgia, serif; font-size:clamp(2.3rem, 5vw, 3.4rem); line-height:1.08; letter-spacing:-.01em; margin-bottom:1rem; }
  .hero h1 em { color:var(--blue); font-style:normal; }
  .hero p.sub { color:var(--muted); font-size:1.1rem; margin-bottom:1.6rem; max-width:34rem; }
  .btns { display:flex; gap:.7rem; flex-wrap:wrap; }
  .btn { text-decoration:none; padding:.75rem 1.4rem; border-radius:10px; font-weight:600; transition:transform .15s ease, box-shadow .15s ease; }
  .btn.primary { background:var(--blue); color:#fff; }
  .btn.primary:hover { transform:translateY(-2px); box-shadow:0 10px 26px rgba(0,56,184,.35); }
  .btn.ghost { border:1.5px solid var(--blue); color:var(--blue); background:transparent; }
  .btn.ghost:hover { background:var(--blue-soft); }

  .fig { position:relative; border:1.5px dashed var(--blue); border-radius:14px; padding:1.1rem; background:var(--surface); box-shadow:0 18px 50px rgba(2,29,94,.10); }
  .fig::before { content:attr(data-fig); position:absolute; top:-.72rem; inset-inline-start:1rem; background:var(--blue); color:#fff; font-family:var(--mono); font-size:.66rem; letter-spacing:.12em; padding:.18rem .6rem; border-radius:4px; text-transform:uppercase; }
  .fig .tick { position:absolute; width:10px; height:10px; border:1.5px solid var(--blue); }
  .fig .tick.tl { top:-6px; left:-6px; border-right:0; border-bottom:0; }
  .fig .tick.br { bottom:-6px; right:-6px; border-left:0; border-top:0; }
  .msg { border-radius:12px; padding:.65rem .9rem; font-size:.89rem; margin:.5rem 0; max-width:94%; }
  .msg.user { background:var(--blue-soft); margin-inline-start:auto; }
  .msg.ai { background:var(--blue-ghost); border:1px solid var(--line); }
  .msg .he { direction:rtl; display:block; font-family:Georgia, serif; font-size:1.05rem; margin:.35rem 0; }
  .msg .src { display:block; font-family:var(--mono); font-size:.68rem; color:var(--muted); border-top:1px dashed var(--line); margin-top:.45rem; padding-top:.35rem; }

  section { padding:3rem 0 0; }
  section > h2 { font-family:Georgia, serif; font-size:clamp(1.5rem, 3vw, 2rem); margin-bottom:.4rem; letter-spacing:-.01em; }
  section > p.lead { color:var(--muted); margin-bottom:1.2rem; max-width:640px; }
  .kicker { font-family:var(--mono); text-transform:uppercase; letter-spacing:.16em; font-size:.7rem; color:var(--blue); font-weight:700; display:block; margin-bottom:.5rem; }

  .feature { display:grid; grid-template-columns:1fr 1fr; gap:1.7rem; align-items:start; background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:1.6rem; margin:1rem 0; transition:box-shadow .2s ease; }
  .feature:hover { box-shadow:0 14px 40px rgba(2,29,94,.08); }
  @media (max-width:800px) { .feature { grid-template-columns:1fr; } }
  .feature h3 { font-family:Georgia, serif; font-size:1.25rem; margin-bottom:.45rem; }
  .feature ul { padding-left:1.2rem; color:var(--muted); font-size:.94rem; } .feature li { margin:.28rem 0; }
  .try { background:var(--blue-ghost); border:1.5px dashed var(--line); border-radius:12px; padding:.9rem 1.1rem; font-size:.9rem; }
  .try b { display:block; font-family:var(--mono); font-size:.66rem; text-transform:uppercase; letter-spacing:.14em; color:var(--blue); margin-bottom:.4rem; }
  .try q { quotes:"« " " »"; font-style:italic; }

  .vilna { background:#f8f3e6; border:1px solid #d9d0bb; border-radius:10px; padding:1rem 1.2rem; direction:rtl; font-family:Georgia, serif; }
  .vilna .t { font-weight:700; border-bottom:2px solid #22201b; color:#22201b; padding-bottom:.3rem; margin-bottom:.5rem; font-size:1.05rem; }
  .vilna .g { font-size:.98rem; line-height:1.8; text-align:justify; color:#22201b; }
  .vilna .r { margin-top:.6rem; font-size:.8rem; color:#6d675c; border:1px solid #d9d0bb; border-radius:6px; padding:.35rem .6rem; display:flex; justify-content:space-between; }

  .bento { display:grid; grid-template-columns:repeat(6, 1fr); gap:.9rem; margin-top:1.2rem; }
  .cell { background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:1.1rem 1.2rem; grid-column:span 2; transition:transform .18s ease, box-shadow .18s ease; }
  .cell:hover { transform:translateY(-3px); box-shadow:0 12px 30px rgba(2,29,94,.10); }
  .cell.wide { grid-column:span 3; }
  .cell.full { grid-column:span 6; background:linear-gradient(135deg, var(--blue-ghost), var(--surface)); }
  @media (max-width:800px) { .bento { grid-template-columns:1fr; } .cell, .cell.wide, .cell.full { grid-column:span 1; } }
  .cell h4 { font-family:Georgia, serif; font-size:1.05rem; margin-bottom:.3rem; }
  .cell p { font-size:.9rem; color:var(--muted); }
  .cell .ex { display:block; margin-top:.55rem; font-size:.82rem; font-style:italic; color:var(--ink); }
  .tag { display:inline-block; font-family:var(--mono); font-size:.64rem; text-transform:uppercase; letter-spacing:.12em; background:var(--blue-soft); color:var(--blue); border-radius:6px; padding:.2rem .6rem; margin-bottom:.45rem; }

  .duo { position:relative; overflow:hidden; background:var(--blue-deep); color:#eaf0ff; border-radius:20px; padding:2rem 1.8rem; margin-top:1.2rem;
    background-image: linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
    background-size: 36px 36px; }
  .duo a { color:#bcd0ff; }
  .duo .kicker { color:#8fb0ff; }
  .duo h2 { font-family:Georgia, serif; font-size:1.6rem; margin-bottom:.6rem; color:#fff; }
  .url { display:inline-block; background:#01123a; color:#dbe7ff; border:1px solid rgba(255,255,255,.15); border-radius:8px; padding:.55rem .95rem; font-family:var(--mono); font-size:.88rem; margin:.5rem 0; word-break:break-all; }

  .final { text-align:center; padding:3.4rem 0 1rem; }
  .final h2 { font-family:Georgia, serif; font-size:clamp(1.6rem, 3.4vw, 2.1rem); margin-bottom:.5rem; }
  footer { border-top:1px solid var(--line); margin-top:3rem; padding:1.5rem 0 0; font-size:.85rem; color:var(--muted); }
  footer .links { margin-bottom:.8rem; }
</style>
</head>
<body>
<nav><div class="in">
  <a class="brand" href="/">TORAH·<b>MCP</b></a>
  <a class="lnk" href="#methode">La méthode</a>
  <a class="lnk" href="#havrouta">Havrouta</a>
  <a class="lnk" href="#daf">Le daf</a>
  <a class="lnk" href="#bibliotheque">Bibliothèque</a>
  <a class="lnk" href="#quotidien">Au quotidien</a>
  <a class="lnk" href="/daf">Daf en ligne</a>
  <a class="lnk" href="/outils">Outils</a>
  <a class="lnk" href="/he">עברית</a>
  <a class="cta" href="/install">Installer</a>
</div></nav>
<main>

<div class="hero">
  <div>
    <h1 class="serif">Et si Claude citait la Torah <em>depuis les vrais textes</em> ?</h1>
    <p class="sub">Torah MCP branche une discipline des sources sur votre assistant : chaque réponse de halakha ou de limoud est lue dans le texte, citée exactement, reliée à ses commentateurs — jamais inventée de mémoire.</p>
    <div class="btns">
      <a class="btn primary" href="/install">Installer en 2 minutes</a>
      <a class="btn ghost" href="/daf">Essayer sans installer</a>
    </div>
  </div>
  <div class="fig" data-fig="Fig. 1 — réponse sourcée" aria-hidden="true">
    <span class="tick tl"></span><span class="tick br"></span>
    <div class="msg user">Quelle est la source de « si je ne suis pas pour moi, qui le sera » ?</div>
    <div class="msg ai">C'est la michna de Hillel, Pirkei Avot 1:14 — je viens de la lire :
      <span class="he">אִם אֵין אֲנִי לִי, מִי לִי. וּכְשֶׁאֲנִי לְעַצְמִי, מָה אֲנִי.</span>
      <span class="src">SOURCE : SEFARIA · LICENCE CC-BY · LIEN D'ÉTUDE FOURNI</span>
    </div>
  </div>
</div>

<section id="methode">
  <span class="kicker">01 / Le cœur</span>
  <h2>La méthode : jamais de citation de mémoire</h2>
  <p class="lead">Les assistants IA « se souviennent » des textes — et se trompent avec assurance. Torah MCP charge une méthode d'étude avant toute réponse religieuse.</p>
  <div class="feature">
    <div>
      <h3>Ce que la méthode impose</h3>
      <ul>
        <li>Lire le texte réel avant de répondre — et citer depuis cette lecture</li>
        <li>Signaler les divergences : rishonim / aharonim, ashkénaze / séfarade</li>
        <li>Donner les liens hebrewbooks.org pour étudier sur la page</li>
        <li>Ne jamais fabriquer une référence, un daf ou un numéro de page</li>
        <li>Pour la halakha pratique : renvoyer vers un Rav</li>
      </ul>
    </div>
    <div class="try"><b>Essayez</b><q>Que dit la Guemara sur la restitution d'un objet perdu ? Cite la sougya.</q><br><br>Claude charge la méthode, lit Bava Metzia, cite le texte et vous donne où l'étudier.</div>
  </div>
</section>

<section id="havrouta">
  <span class="kicker">02 / Étudier, pas consommer</span>
  <h2>Havrouta et guide de paracha</h2>
  <p class="lead">Un partenaire d'étude ne donne pas les réponses : il les fait naître. Et chaque semaine, la sidra se prépare comme un chantier.</p>
  <div class="feature">
    <div class="try"><b>Essayez</b><q>Étudions Berakhot 2a en havrouta.</q> — une question à la fois, les positions à défendre.<br><br><q>Prépare-moi la paracha de la semaine.</q> — fil par aliya, machloket de commentateurs, questions pour la table de Chabbat.</div>
    <div>
      <h3>Deux modes d'étude</h3>
      <ul>
        <li><strong>Havrouta</strong> : une question par étape, machloket à défendre, kouchiot confrontées aux commentateurs, récapitulatif des chidouchim</li>
        <li><strong>Guide de paracha</strong> (façon AlHaTorah) : résumé aliya par aliya, trois questions du texte avec deux commentateurs qui divergent, l'écho de la haftara, trois questions graduées pour la table</li>
      </ul>
    </div>
  </div>
</section>

<section id="daf">
  <span class="kicker">03 / MCP App</span>
  <h2>Le daf en page de Vilna, dans la conversation</h2>
  <p class="lead">« Montre-moi le daf du jour » — et une page interactive s'ouvre : la Guemara au centre, Rachi et Tossafot dépliables, la traduction au clic. Aussi <a href="/daf">en ligne, sans installation</a>.</p>
  <div class="feature">
    <div class="fig" data-fig="Fig. 2 — daf viewer" aria-hidden="true" style="border-style:solid">
      <div class="vilna">
        <div class="t">ברכות ב׳ א</div>
        <div class="g">מֵאֵימָתַי קוֹרִין אֶת שְׁמַע בְּעַרְבִין? מִשָּׁעָה שֶׁהַכֹּהֲנִים נִכְנָסִים לֶאֱכוֹל בִּתְרוּמָתָן…</div>
        <div class="r"><span>רש״י</span><span>+</span></div>
        <div class="r"><span>תוספות</span><span>+</span></div>
      </div>
    </div>
    <div>
      <h3>Dans le visualiseur</h3>
      <ul>
        <li>Texte vocalisé, justifié, mise en page inspirée du Shas de Vilna</li>
        <li>Un clic sur un passage : la traduction Steinsaltz apparaît</li>
        <li>Rachi et Tossafot du daf, en accordéons</li>
        <li>Sans référence : c'est le daf yomi du jour qui s'ouvre</li>
        <li>Clients sans MCP Apps : résumé texte + lien d'étude (rien ne casse)</li>
      </ul>
    </div>
  </div>
</section>

<section id="bibliotheque">
  <span class="kicker">04 / Les sources</span>
  <h2>Toute la bibliothèque, vérifiable</h2>
  <p class="lead">Quatre outils Sefaria pour lire, relier et retrouver — et la recherche du catalogue HebrewBooks pour prolonger l'étude sur les seforim scannés.</p>
  <div class="bento">
    <div class="cell wide"><span class="tag">texte</span><h4>Lire une référence</h4><p>Tanakh, Talmud, Michné Torah, Choulhan Aroukh, responsa — hébreu et traduction, licence affichée.</p><span class="ex">« Montre-moi Choulhan Aroukh, Orah Hayim 271. »</span></div>
    <div class="cell wide"><span class="tag">commentaires</span><h4>Explorer les commentateurs</h4><p>Rachi, Tossafot, midrachim, halakha — les textes liés à chaque passage, par catégorie.</p><span class="ex">« Que disent Rachi et Tossafot ici ? »</span></div>
    <div class="cell wide"><span class="tag">recherche</span><h4>Retrouver une source</h4><p>Recherche plein texte dans toute la bibliothèque, en hébreu ou en anglais.</p><span class="ex">« Où parle-t-on du prozboul ? »</span></div>
    <div class="cell wide"><span class="tag">hebrewbooks</span><h4>Le catalogue des seforim</h4><p>~65 000 livres scannés cherchables par titre et auteur, avec le lien de lecture exact.</p><span class="ex">« Trouve-moi le Michna Beroura sur HebrewBooks. »</span></div>
  </div>
</section>

<section id="quotidien">
  <span class="kicker">05 / Chaque jour</span>
  <h2>Les outils du quotidien</h2>
  <p class="lead">Parce que l'étude vit dans une journée juive : horaires, dates, calculs et partage — aussi <a href="/outils">utilisables en ligne</a>.</p>
  <div class="bento">
    <div class="cell"><h4>Zmanim et Chabbat</h4><p>Les zmanim du jour et les horaires de Chabbat — Paris, Marseille, Genève, Jérusalem…</p><span class="ex">« À quelle heure rentre Chabbat à Genève ? »</span></div>
    <div class="cell"><h4>Dates hébraïques</h4><p>Conversion dans les deux sens, avec fêtes, Rosh Hodesh et paracha.</p><span class="ex">« Quel jour tombe le 14 août ? »</span></div>
    <div class="cell"><h4>Guematria</h4><p>Cinq méthodes calculées exactement, mot à mot.</p><span class="ex">« La guematria de חי ? »</span></div>
    <div class="cell"><h4>Nikoud</h4><p>Vocalisation par le nakdan de Dicta, variantes comprises.</p><span class="ex">« Mets le nikoud sur ce Rachi. »</span></div>
    <div class="cell"><h4>Fiche source</h4><p>Hébreu, traduction, référence, lien — prête pour WhatsApp.</p><span class="ex">« Une fiche de Pirkei Avot 1:14. »</span></div>
    <div class="cell"><h4>Le limoud du jour</h4><p>Paracha, daf yomi, Rambam quotidien : tous les cycles.</p><span class="ex"><a href="/daily">Voir la page du jour</a></span></div>
  </div>
</section>

<section id="duo">
  <div class="duo">
    <span class="kicker">06 / Complémentaire</span>
    <h2>Le duo idéal avec le MCP officiel de Sefaria</h2>
    <p>Sefaria publie son propre serveur MCP — excellent pour l'accès en profondeur à la bibliothèque (14 outils : dictionnaires, manuscrits, recherche par livre). Installez les deux : l'officiel pour la profondeur, Torah MCP pour la discipline de citation, la méthode, la havrouta et HebrewBooks.</p>
    <span class="url">https://mcp.sefaria.org/sse</span>
    <p style="font-size:.85rem"><a href="https://developers.sefaria.org/docs/the-sefaria-mcp">Documentation du MCP officiel Sefaria</a></p>
  </div>
</section>

<div class="final">
  <h2>Gratuit. Sans compte. Sans collecte de données.</h2>
  <p style="color:var(--muted);margin-bottom:1.2rem">Une URL à coller dans claude.ai, et l'étude change de nature.</p>
  <div class="btns" style="justify-content:center">
    <a class="btn primary" href="/install">Installer maintenant</a>
    <a class="btn ghost" href="https://github.com/JonathanB555/torah-mcp">Code source (MIT)</a>
  </div>
</div>

<footer>
  <div class="links"><a href="/daf">Le daf en ligne</a> · <a href="/outils">Outils en ligne</a> · <a href="/install">Installation et guide technique</a> · <a href="/daily">Le limoud du jour</a> · <a href="/he">עברית</a> · <a href="/privacy">Confidentialité</a> · <a href="https://github.com/JonathanB555/torah-mcp">GitHub</a></div>
  <p><a href="https://www.sefaria.org" aria-label="Powered by Sefaria"><img src="https://files.readme.io/dcee0a8-image.png" alt="Powered by Sefaria" width="116" height="60" style="display:block;margin-bottom:.6rem"></a>
  Textes servis par l'API publique de Sefaria — licences indiquées dans chaque réponse. Vocalisation par le nakdan de Dicta, calendriers Hebcal. Ce projet est indépendant de Sefaria et de hebrewbooks.org.</p>
</footer>
</main>
</body>
</html>`;

export const INSTALL_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Installation — Torah MCP</title>
<meta name="description" content="Installer Torah MCP dans claude.ai, Claude Code ou tout client MCP : le guide technique complet.">
<style>
  :root { --paper:#f6f8fd; --card:#ffffff; --ink:#0a1c4d; --muted:#54648f; --line:#d9e2f5; --accent:#0038b8; }
  * { box-sizing:border-box; margin:0; }
  body { font:16px/1.65 -apple-system, "Segoe UI", Roboto, sans-serif; color:var(--ink); background:var(--paper); padding:0 1.25rem 4rem; }
  main { max-width:680px; margin:0 auto; }
  h1 { font-family:Georgia, serif; font-size:2rem; margin:2.6rem 0 .5rem; }
  h2 { font-family:Georgia, serif; font-size:1.2rem; margin:2rem 0 .6rem; }
  .muted { color:var(--muted); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:1.1rem 1.3rem; margin:.9rem 0; }
  code { background:#e7eeff; border-radius:5px; padding:.15em .45em; font-size:.92em; word-break:break-all; }
  .url { display:block; background:#10304a; color:#eaf3fa; border-radius:8px; padding:.8rem 1rem; font-family:ui-monospace, Menlo, monospace; font-size:.95rem; margin:.6rem 0; word-break:break-all; }
  ol, ul { padding-left:1.3rem; } li { margin:.3rem 0; }
  a { color:var(--accent); }
  .back { display:inline-block; margin-top:1.6rem; color:var(--muted); text-decoration:none; font-size:.9rem; }
</style>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
</head>
<body>
<main>
  <a class="back" href="/">← Retour à l'accueil</a>
  <h1>Installation et guide technique</h1>
  <p class="muted">Torah MCP est un serveur MCP distant (transport HTTP streamable). Gratuit, sans compte, sans collecte de données.</p>

  <h2>claude.ai (2 minutes)</h2>
  <div class="card">
    <ol>
      <li>Ouvrez <a href="https://claude.ai/settings/connectors">claude.ai → Settings → Connectors</a></li>
      <li>Cliquez sur <strong>Add custom connector</strong></li>
      <li>Collez cette URL :</li>
    </ol>
    <span class="url">https://torah-mcp.com/mcp</span>
    <p class="muted">Nommez-le « Torah », validez. Fonctionne ensuite aussi dans l'app mobile.</p>
  </div>

  <h2>Claude Code</h2>
  <div class="card">
    <span class="url">claude mcp add --transport http torah https://torah-mcp.com/mcp</span>
  </div>

  <h2>Autres clients MCP</h2>
  <div class="card">
    <p>Tout client compatible MCP (transport HTTP streamable) fonctionne avec la même URL <code>https://torah-mcp.com/mcp</code>. Le serveur expose 13 outils en lecture seule, 2 prompts (<code>hebrewbooks</code>, <code>havrouta</code>) et une ressource MCP App (le visualiseur de daf).</p>
  </div>

  <h2>Accès sur invitation (optionnel)</h2>
  <div class="card">
    <p>Par défaut le serveur est public. Pour un accès sur invitation, l'hébergeur pose le secret <code>BEARER_TOKENS</code> (liste de tokens séparés par des virgules — un par invité) ; chacun utilise alors <code>https://…/&lt;token&gt;/mcp</code>, et on révoque en retirant le token.</p>
  </div>

  <h2>Héberger votre propre instance</h2>
  <div class="card">
    <p>Le code est libre (MIT). Un clic déploie votre propre copie sur Cloudflare Workers :</p>
    <p><a href="https://deploy.workers.cloudflare.com/?url=https://github.com/JonathanB555/torah-mcp">Deploy to Cloudflare</a> · <a href="https://github.com/JonathanB555/torah-mcp">Code source sur GitHub</a></p>
    <p class="muted">Aucun secret requis. Optionnels : <code>HEBREWBOOKS_API_KEY</code> (recherche catalogue — clé sur demande à developers@hebrewbooks.org), <code>BEARER_TOKENS</code>.</p>
  </div>

  <h2>Bon voisinage</h2>
  <div class="card">
    <ul>
      <li>Requêtes vers Sefaria : User-Agent identifiant + cache edge (24 h textes, 1 h calendriers)</li>
      <li>Limite de débit : 60 requêtes/minute/IP</li>
      <li>Licences des textes restituées dans chaque réponse</li>
    </ul>
  </div>

  <a class="back" href="/">← Retour à l'accueil</a>
</main>
</body>
</html>`;
