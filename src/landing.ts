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
<meta property="og:type" content="website">
<meta property="og:title" content="Torah MCP — la discipline des sources pour Claude">
<meta property="og:description" content="Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com/">
<meta name="twitter:card" content="summary_large_image">
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
  <h2>« Poser une question » sur le site</h2>
  <p>La page <a href="/question">/question</a> envoie votre question, telle que vous l'avez écrite, à l'API d'Anthropic (Claude) pour rédiger la réponse à partir des textes lus sur Sefaria. Nous ne conservons ni la question ni la réponse ; l'adresse IP sert uniquement au limiteur de débit, en mémoire, sans journal. Le traitement par Anthropic relève de sa <a href="https://www.anthropic.com/legal/privacy">politique de confidentialité</a> (données d'API non utilisées pour l'entraînement). N'y écrivez pas d'informations personnelles.</p>

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
  <h2>"Ask a question" on the website — English</h2>
  <p>The <a href="/question">/question</a> page sends your question, as written, to Anthropic's API (Claude) to draft an answer from texts read on Sefaria. We store neither the question nor the answer; the IP address is only used by the in-memory rate limiter, without logs. Anthropic's processing is governed by its <a href="https://www.anthropic.com/legal/privacy">privacy policy</a> (API data is not used for training). Do not include personal information.</p>

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
<meta name="description" content="Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode d'étude, havrouta, guide de paracha, page de Vilna interactive, Sefaria, HebrewBooks, zmanim, guematria. Gratuit, sans compte.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Frank+Ruhl+Libre:wght@300;400;700&display=swap" rel="stylesheet">
<meta property="og:type" content="website">
<meta property="og:title" content="Torah MCP — la discipline des sources pour Claude">
<meta property="og:description" content="Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com/">
<meta name="twitter:card" content="summary_large_image">
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
    --paper:#f7f6f1; --ink:#082a99; --ink-deep:#041a66; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14);
    --hl:#dbe3ff;
    --ease:cubic-bezier(0.16, 1, 0.3, 1);
  }
  * { box-sizing:border-box; margin:0; }
  html { scroll-behavior:smooth; overflow-x:clip; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; }
  ::selection { background:var(--ink); color:var(--paper); }
  a { color:var(--ink); text-decoration-thickness:1px; text-underline-offset:3px; }
  a:hover { text-decoration-thickness:2px; }
  .fr { font-family:"Fraunces", Georgia, serif; }

  /* ---- liens-crochets, pas de boutons ---- */
  .lnk { font-family:"Fraunces", Georgia, serif; font-weight:600; text-decoration:none; white-space:nowrap; }
  .lnk::before { content:"[ "; color:var(--ink-40); }
  .lnk::after { content:" ]"; color:var(--ink-40); }
  .lnk:hover::before { content:"[ → "; }

  /* ---- nav : une ligne, rien d'autre ---- */
  nav { position:fixed; top:0; left:0; right:0; z-index:20; display:flex; justify-content:space-between; align-items:baseline;
        padding:1.1rem 4vw; mix-blend-mode:multiply; }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:1.05rem; text-decoration:none; letter-spacing:.01em; }
  nav .wm b { font-weight:600; border-bottom:3px solid var(--ink); padding-bottom:1px; }
  nav .r { display:flex; gap:1.1rem; font-size:.92rem; align-items:baseline; }
  nav .grp { font-size:.66rem; letter-spacing:.16em; text-transform:uppercase; opacity:.5; }
  nav .sep { width:1px; height:.9rem; background:var(--ink-15); align-self:center; }
  nav .r a { text-decoration:none; }
  nav .r a:hover { text-decoration:underline; }
  @media (max-width:720px) {
    nav { padding:.9rem 4vw; }
    nav .r { gap:.8rem; font-size:.84rem; }
    nav .r .hide-m { display:none; }
  }

  /* ---- ouverture plein écran ---- */
  .cover { min-height:100svh; position:relative; display:flex; flex-direction:column; justify-content:center; padding:0 4vw; overflow:hidden; }
  .cover .he-giant { position:absolute; inset-inline-end:-2vw; top:50%; transform:translateY(-54%); font-weight:700;
    font-size:clamp(7rem, 34vw, 30rem); line-height:1; color:transparent; -webkit-text-stroke:1.5px var(--ink-15); pointer-events:none; user-select:none; direction:rtl; }
  .cover h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.6rem, 7.2vw, 6.2rem); line-height:1.02; letter-spacing:-.02em; max-width:11em; position:relative; }
  .cover h1 strong { font-weight:600; }
  .cover h1 .no { position:relative; white-space:nowrap; }
  .cover h1 .no::after { content:""; position:absolute; left:-.04em; right:-.04em; top:.56em; height:.055em; background:var(--ink);
    transform:scaleX(0); transform-origin:left center; }
  .cover h1 strong { opacity:0; }
  body.ready .cover h1 .no::after { animation:strike .55s var(--ease) 1.15s forwards; }
  body.ready .cover h1 strong { animation:affirm .7s var(--ease) 1.6s forwards; }
  @keyframes strike { to { transform:scaleX(1); } }
  @keyframes affirm { from { opacity:0; transform:translateY(.15em); } to { opacity:1; transform:none; } }

  /* chorégraphie d'entrée */
  .chor { opacity:0; transform:translateY(34px); }
  body.ready .chor { animation:rise .9s var(--ease) forwards; }
  body.ready .chor.c1 { animation-delay:.05s } body.ready .chor.c2 { animation-delay:.55s }
  body.ready .chor.c3 { animation-delay:.75s } body.ready .chor.c4 { animation-delay:1.9s }
  @keyframes rise { to { opacity:1; transform:none; } }
  .he-giant { opacity:0; }
  body.ready .he-giant { animation:emerge 1.6s var(--ease) .2s forwards; }
  @keyframes emerge { from { opacity:0; transform:translateY(-54%) scale(1.04); } to { opacity:1; transform:translateY(-54%) scale(1); } }
  nav { opacity:0; }
  body.ready nav { animation:rise .8s var(--ease) .9s forwards; transform:none; }
  @media (prefers-reduced-motion: reduce) {
    .chor, .he-giant, nav, .cover h1 strong { opacity:1 !important; animation:none !important; transform:none !important; }
    .cover h1 .no::after { transform:scaleX(1); animation:none !important; }
  }
  .cover p.deck { margin-top:2rem; max-width:34rem; font-size:1.12rem; color:var(--ink); opacity:.85; position:relative; }
  .cover .acts { margin-top:2.6rem; display:flex; gap:2.4rem; flex-wrap:wrap; font-size:1.1rem; position:relative; }
  .cover .hint { position:absolute; bottom:2rem; left:4vw; font-size:.8rem; letter-spacing:.18em; text-transform:uppercase; opacity:.5; }

  /* ---- reveal ---- */
  .rv { opacity:0; transform:translateY(28px); transition:opacity .9s var(--ease), transform .9s var(--ease); }
  .rv.in { opacity:1; transform:none; }
  .rv.d1 { transition-delay:.08s } .rv.d2 { transition-delay:.16s } .rv.d3 { transition-delay:.24s }
  @media (prefers-reduced-motion: reduce) { .rv { opacity:1; transform:none; transition:none; } html { scroll-behavior:auto; } }

  /* ---- section daf : le manifeste commenté ---- */
  .amud { padding:9rem 4vw 5rem; max-width:1200px; margin:0 auto; }
  .amud-head { display:flex; align-items:baseline; gap:1.4rem; margin-bottom:3.5rem; }
  .amud-head .otiot { font-size:2rem; font-weight:700; direction:rtl; }
  .amud-head .rule { flex:1; height:1px; background:var(--ink-15); }
  .amud-head .lbl { font-size:.8rem; letter-spacing:.22em; text-transform:uppercase; opacity:.55; }

  .daf { display:grid; grid-template-columns: 1fr 2fr 1fr; gap:3.2rem; align-items:start; }
  .guf { font-size:clamp(1.25rem, 1.9vw, 1.6rem); line-height:1.85; font-weight:400; }
  .guf p + p { margin-top:1.4em; }
  .guf mark { background:transparent; color:inherit; border-bottom:2px solid var(--ink-40); cursor:default; transition:background .35s var(--ease); padding:0 .08em; }
  .guf mark.on, .guf mark:hover { background:var(--hl); border-bottom-color:var(--ink); }
  .margin { font-size:.86rem; line-height:1.6; display:flex; flex-direction:column; gap:2.2rem; position:sticky; top:7rem; }
  .glose { border-inline-start:2px solid var(--ink-15); padding-inline-start:1rem; transition:border-color .35s var(--ease); }
  .glose.on, .glose:hover { border-color:var(--ink); }
  .glose h3 { font-size:.78rem; letter-spacing:.16em; text-transform:uppercase; margin-bottom:.4rem; }
  .glose p { opacity:.8; }
  .glose .try { display:block; margin-top:.5rem; font-style:italic; opacity:.95; }
  .glose a { font-size:.82rem; }
  @media (max-width:900px) {
    .daf { grid-template-columns:1fr; gap:2rem; }
    .margin { position:static; flex-direction:column; gap:1.4rem; }
  }

  /* ---- le mafteah : index à points de conduite ---- */
  .mafteah { max-width:1200px; margin:0 auto; padding:4rem 4vw 6rem; }
  .toc { border-top:1px solid var(--ink-15); }
  .toc a { display:flex; align-items:baseline; gap:.8rem; padding:1.05rem 0; border-bottom:1px solid var(--ink-15); text-decoration:none;
           transition:padding-inline-start .4s var(--ease), background .4s var(--ease); }
  .toc a:hover { padding-inline-start:1rem; background:rgba(219,227,255,.5); }
  .toc .t { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:clamp(1.15rem, 2.2vw, 1.7rem); white-space:nowrap; }
  .toc .dots { flex:1; border-bottom:2px dotted var(--ink-40); transform:translateY(-.35em); min-width:2rem; }
  .toc .d { font-size:.9rem; opacity:.75; text-align:right; max-width:44%; }
  .toc .he { direction:rtl; font-weight:700; white-space:nowrap; }
  @media (max-width:720px) { .toc .d { display:none; } }

  /* ---- trois modes : trois colonnes typographiques ---- */
  .modes { max-width:1200px; margin:0 auto; padding:2rem 4vw 6rem; }
  .modes .cols { display:grid; grid-template-columns:repeat(3, 1fr); gap:3rem; }
  .modes .col { border-top:2px solid var(--ink); padding-top:1.2rem; }
  .modes .col h3 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:clamp(1.5rem, 2.4vw, 2rem); letter-spacing:-.01em; margin-bottom:.2rem; }
  .modes .who { font-size:.8rem; letter-spacing:.14em; text-transform:uppercase; opacity:.55; margin-bottom:1rem; }
  .modes .col p { line-height:1.65; }
  .modes .try { display:block; margin-top:1rem; font-style:italic; opacity:.85; }
  .modes .note { margin-top:3rem; max-width:44rem; opacity:.7; font-size:.95rem; }
  @media (max-width:900px) { .modes .cols { grid-template-columns:1fr; gap:2.2rem; } }
  @media (max-width:720px) { .modes { padding:1rem 5vw 4rem; } }

  /* ---- bande daf viewer, pleine largeur, parchemin ---- */
  .band { background:#f4ecd7; color:#22201b; padding:6rem 4vw; }
  .band .in { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1.1fr .9fr; gap:4rem; align-items:center; }
  @media (max-width:900px) { .band .in { grid-template-columns:1fr; } }
  .band h2 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2rem, 4.4vw, 3.4rem); line-height:1.06; letter-spacing:-.015em; margin-bottom:1.2rem; }
  .band p { max-width:30rem; opacity:.85; }
  .band .acts { margin-top:2rem; font-size:1.05rem; display:flex; gap:1.2rem 2.2rem; flex-wrap:wrap; }
  .band .lnk::before, .band .lnk::after { color:rgba(34,32,27,.4); }
  .band a { color:#22201b; }
  .vilna { background:#faf5e6; border:1px solid #d9d0bb; padding:1.4rem 1.6rem; direction:rtl; box-shadow:0 30px 60px rgba(34,32,27,.14); }
  .vilna .t { font-weight:700; border-bottom:2px solid #22201b; padding-bottom:.35rem; margin-bottom:.6rem; font-size:1.1rem; }
  .vilna .g { line-height:1.85; text-align:justify; font-size:1.02rem; }
  .vilna .r { margin-top:.7rem; font-size:.82rem; color:#6d675c; border-top:1px dotted #b7ad93; padding-top:.45rem; display:flex; justify-content:space-between; }

  /* ---- fin : l'invitation ---- */
  .invite { padding:9rem 4vw 7rem; max-width:1200px; margin:0 auto; }
  .invite h2 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.4rem, 6.4vw, 5.4rem); line-height:1.04; letter-spacing:-.02em; max-width:14em; }
  .invite h2 strong { font-weight:600; }
  .invite .acts { margin-top:3rem; display:flex; gap:2.6rem; flex-wrap:wrap; font-size:1.2rem; }
  .invite .note { margin-top:2.4rem; font-size:.92rem; opacity:.7; max-width:36rem; }

  footer { border-top:1px solid var(--ink-15); max-width:1200px; margin:0 auto; padding:2rem 4vw 3rem; font-size:.88rem; }
  footer .row { display:flex; flex-wrap:wrap; gap:1.6rem; margin-bottom:1.2rem; }
  footer .row a { text-decoration:none; opacity:.8; } footer .row a:hover { text-decoration:underline; opacity:1; }
  footer p { opacity:.65; max-width:52rem; }

  @media (max-width:720px) {
    body { font-size:16px; }
    .amud { padding:5.5rem 5vw 3.5rem; }
    .amud-head { margin-bottom:2.2rem; }
    .mafteah { padding:2.5rem 5vw 4rem; }
    .band { padding:3.5rem 5vw; }
    .band .in { gap:2.4rem; }
    .invite { padding:5rem 5vw 4.5rem; }
    .invite .acts { gap:1.4rem 2rem; font-size:1.1rem; }
    .cover .acts { gap:1.2rem 2rem; font-size:1.02rem; }
    .cover p.deck { font-size:1.05rem; }
    .toc .t { white-space:normal; }
    .toc a { gap:.6rem; }
    .guf { line-height:1.8; }
  }
</style>
<noscript><style>.chor,.he-giant,nav,.cover h1 strong{opacity:1 !important;transform:none !important}.cover h1 .no::after{transform:scaleX(1)}</style></noscript>
</head>
<body>

<nav>
  <a class="wm" href="/"><b>Torah</b>&nbsp;MCP</a>
  <div class="r">
    <span class="grp hide-m">Sur le site</span>
    <a href="/question">Une question</a>
    <a href="/daf">Le daf</a>
    <a href="/outils" class="hide-m">Outils</a>
    <a href="/daily" class="hide-m">Limoud du jour</a>
    <span class="sep hide-m"></span>
    <span class="grp hide-m">Dans Claude</span>
    <a href="/install"><strong>Installer le MCP</strong></a>
    <span class="sep hide-m"></span>
    <a href="/he">עברית</a>
  </div>
</nav>

<header class="cover">
  <div class="he-giant" aria-hidden="true">מקור</div>
  <h1 class="fr chor c1">Claude cite la Torah <span class="no">de&nbsp;mémoire</span> <strong>depuis les textes</strong>.</h1>
  <p class="deck chor c2">Un serveur MCP gratuit qui impose une discipline des sources à Claude : chaque réponse de halakha ou de limoud est lue dans le texte réel, citée exactement, reliée à ses commentateurs. En français, à votre niveau — du débutant qui ne lit pas l'hébreu au talmid hakham. Et chaque outil existe aussi en version web, ici même, sans Claude.</p>
  <div class="acts chor c3">
    <a class="lnk" href="/install">Installer dans Claude — 2 min</a>
    <a class="lnk" href="/question">Poser une question — sans Claude</a>
  </div>
  <span class="hint chor c4" style="opacity:0">Gratuit · sans compte · sans collecte — défilez</span>
</header>

<section class="amud" id="daf-a">
  <div class="amud-head rv"><span class="otiot">א</span><span class="rule"></span><span class="lbl">Le manifeste, commenté en marge</span></div>
  <div class="daf">
    <aside class="margin rv d1" aria-label="Commentaires — colonne intérieure">
      <div class="glose" data-ref="methode">
        <h3>La méthode</h3>
        <p>Chargée avant toute réponse religieuse : lire, citer depuis la lecture, signaler les mahloket, ne jamais fabriquer une référence.</p>
        <span class="try">« Que dit la Guemara sur l'objet perdu ? Cite la sougya. »</span>
      </div>
      <div class="glose" data-ref="havrouta">
        <h3>La havrouta</h3>
        <p>Claude questionne au lieu de répondre : une kouchia à la fois, Rachi à défendre contre Tossafot, récapitulatif des chidouchim.</p>
        <span class="try">« Étudions Berakhot 2a en havrouta. »</span>
      </div>
      <div class="glose" data-ref="paracha">
        <h3>Le guide de paracha</h3>
        <p>Fil par aliya, trois questions du texte tranchées par deux commentateurs qui divergent, l'écho de la haftara, questions pour la table.</p>
        <span class="try">« Prépare-moi la paracha. »</span>
      </div>
    </aside>
    <div class="guf rv">
      <p>Les assistants répondent aux questions de Torah <mark data-ref="memoire">de mémoire</mark> — avec l'assurance de celui qui n'a pas ouvert le livre. Torah MCP renverse le geste : avant toute réponse, votre assistant charge <mark data-ref="methode">une méthode d'étude</mark> qui l'oblige à lire le texte, à le citer tel qu'il est écrit, et à dire où l'étudier.</p>
      <p>Parce qu'on n'apprend pas seul, il sait aussi devenir <mark data-ref="havrouta">partenaire de havrouta</mark> — celui qui pose les questions plutôt que d'y répondre — et préparer <mark data-ref="paracha">la paracha de la semaine</mark> comme un chantier : aliya par aliya, machloket comprises.</p>
      <p>Et parce que l'étude vit dans une journée juive, il porte <mark data-ref="quotidien">les outils du quotidien</mark> — zmanim, dates, guematria, nikoud, fiches à partager — et <mark data-ref="sources">toute la bibliothèque</mark> : Sefaria pour lire et relier, HebrewBooks pour étudier sur la page scannée.</p>
      <p>Et parce que la Torah n'appartient pas aux seuls savants, il parle <mark data-ref="modes">à chacun selon son niveau</mark> : tout en français et chaque mot expliqué pour qui débute, la source en langue originale et le lomdus pour qui la maîtrise.</p>
    </div>
    <aside class="margin rv d2" aria-label="Commentaires — colonne extérieure">
      <div class="glose" data-ref="memoire">
        <h3>Pourquoi c'est grave</h3>
        <p>Une citation approximative est une citation fausse. La discipline du texte n'est pas un luxe : c'est la condition du limoud.</p>
      </div>
      <div class="glose" data-ref="quotidien">
        <h3>Le quotidien</h3>
        <p>Zmanim et horaires de Chabbat, dates hébraïques, guematria exacte, nikoud (Dicta), fiche source prête pour WhatsApp.</p>
        <a href="/outils">Utilisables en ligne, sans installation</a>
      </div>
      <div class="glose" data-ref="modes">
        <h3>Trois modes</h3>
        <p>Débutant, classique, avancé — le registre change, la discipline des sources jamais. Claude devine votre niveau à votre question, et vous changez de mode d'un mot.</p>
        <span class="try">« Je n'y connais rien, explique-moi simplement. »</span>
        <a href="/question">Poser une question sur le site, sans Claude</a>
      </div>
      <div class="glose" data-ref="sources">
        <h3>Les sources</h3>
        <p>Textes, commentateurs et recherche Sefaria — licences affichées — et le catalogue HebrewBooks (~65 000 seforim).</p>
        <a href="https://developers.sefaria.org/docs/the-sefaria-mcp">S'accorde avec le MCP officiel de Sefaria</a>
      </div>
    </aside>
  </div>
</section>

<section class="modes" id="modes">
  <div class="amud-head rv"><span class="otiot">ב</span><span class="rule"></span><span class="lbl">Trois modes — à chacun selon son niveau</span></div>
  <div class="cols">
    <div class="col rv d1">
      <h3>Débutant</h3>
      <p class="who">Pas de culture religieuse, ou pas d'hébreu.</p>
      <p>Tout en français. Aucun mot hébreu sans sa traduction, le contexte avant la réponse, une idée à la fois — et jamais de question jugée naïve.</p>
      <span class="try">« C'est quoi, la halakha ? »</span>
    </div>
    <div class="col rv d2">
      <h3>Classique</h3>
      <p class="who">Culture de base, hébreu avec traduction.</p>
      <p>Bilingue : la source, puis sa traduction — française pour la Bible. Termes usuels supposés connus, références standard, mahloket signalées. Le mode par défaut.</p>
      <span class="try">« Que dit Rachi sur ce verset ? »</span>
    </div>
    <div class="col rv d3">
      <h3>Avancé</h3>
      <p class="who">Le beit midrash.</p>
      <p>Source en langue originale, terminologie sans glose, richonim et poskim, girsaot quand elles pèsent, nafka mina, lomdus. Densité maximale, rien de lissé.</p>
      <span class="try">« Chitat ha-Rambam contre Tossafot ici ? »</span>
    </div>
  </div>
  <p class="note rv">Un même moteur, une même rigueur : les textes sont toujours réellement lus et cités exactement. Seul le registre s'adapte — et vous en changez d'un mot. Pas de Claude ? <a href="/question">Posez votre question ici même</a>, en français : la réponse est lue dans les textes, avec ses sources.</p>
</section>

<section class="band" id="daf-viewer">
  <div class="in">
    <div class="rv">
      <h2>« Montre-moi le daf du jour. »</h2>
      <p>Et une page de Vilna s'ouvre dans la conversation : la Guemara au centre, Rachi et Tossafot dépliables, la traduction au clic sur chaque segment. Sans référence, c'est le daf yomi qui s'ouvre.</p>
      <div class="acts">
        <a class="lnk" href="/daf">Ouvrir le daf en ligne</a>
        <a class="lnk" href="/daily">Le limoud du jour</a>
      </div>
    </div>
    <div class="vilna rv d1" aria-hidden="true">
      <div class="t">ברכות ב׳ א</div>
      <div class="g">מֵאֵימָתַי קוֹרִין אֶת שְׁמַע בְּעַרְבִין? מִשָּׁעָה שֶׁהַכֹּהֲנִים נִכְנָסִים לֶאֱכוֹל בִּתְרוּמָתָן…</div>
      <div class="r"><span>רש״י</span><span>תוספות</span></div>
    </div>
  </div>
</section>

<section class="mafteah" id="mafteah">
  <div class="amud-head rv"><span class="otiot">ג</span><span class="rule"></span><span class="lbl">Mafteah — l'index des seize outils</span></div>
  <div class="toc rv d1">
    <a href="/install"><span class="t">La méthode d'étude</span><span class="dots"></span><span class="d">chargée avant toute réponse religieuse</span></a>
    <a href="/question"><span class="t">Une question, en français</span><span class="dots"></span><span class="d">sur le site, sans Claude — réponse lue dans les textes</span></a>
    <a href="#modes"><span class="t">Trois modes d'étude</span><span class="dots"></span><span class="d">débutant · classique · avancé</span></a>
    <a href="/install"><span class="t">Havrouta</span><span class="dots"></span><span class="d">le partenaire qui questionne</span></a>
    <a href="/install"><span class="t">Guide de paracha</span><span class="dots"></span><span class="d">aliyot, mahloket, table de Chabbat</span></a>
    <a href="/daf"><span class="t">Le daf — page de Vilna</span><span class="dots"></span><span class="d">MCP App interactive, aussi en ligne</span></a>
    <a href="/install"><span class="t">Textes, commentateurs, recherche</span><span class="dots"></span><span class="d">la bibliothèque Sefaria, vérifiable</span></a>
    <a href="/install"><span class="t">Catalogue HebrewBooks</span><span class="dots"></span><span class="d">~65 000 seforim par titre et auteur</span></a>
    <a href="/outils"><span class="t">Zmanim et Chabbat</span><span class="dots"></span><span class="d">Paris, Marseille, Genève, Jérusalem…</span></a>
    <a href="/outils"><span class="t">Dates hébraïques</span><span class="dots"></span><span class="d">conversion, fêtes, Rosh Hodesh</span></a>
    <a href="/outils"><span class="t">Guematria</span><span class="dots"></span><span class="d">cinq méthodes, calcul exact</span></a>
    <a href="/outils"><span class="t">Nikoud</span><span class="dots"></span><span class="d">vocalisation par le nakdan de Dicta</span></a>
    <a href="/outils"><span class="t">Le mot de Chabbat</span><span class="dots"></span><span class="d">paracha, verset, allumage — pour WhatsApp</span></a>
    <a href="/outils"><span class="t">Fiche source</span><span class="dots"></span><span class="d">hébreu, traduction, lien — pour WhatsApp</span></a>
    <a href="/daily"><span class="t">Le limoud du jour</span><span class="dots"></span><span class="d">paracha, daf yomi, Rambam quotidien</span></a>
  </div>
</section>

<section class="invite">
  <h2 class="fr rv">Une URL à coller dans claude.ai, et l'étude <strong>change de nature</strong>.</h2>
  <div class="acts rv d1">
    <a class="lnk" href="/install">Installer maintenant</a>
    <a class="lnk" href="https://github.com/JonathanB555/torah-mcp">Code source — MIT</a>
  </div>
  <p class="note rv d2">Gratuit, sans compte, sans collecte de données. S'accorde avec le MCP officiel de Sefaria — installez les deux : l'officiel pour la profondeur de la bibliothèque, Torah MCP pour la discipline de citation, la havrouta et HebrewBooks.</p>
</section>

<footer>
  <div class="row">
    <a href="/daf">Le daf en ligne</a><a href="/outils">Outils</a><a href="/install">Installation</a><a href="/daily">Limoud du jour</a><a href="/he">עברית</a><a href="/privacy">Confidentialité</a><a href="https://github.com/JonathanB555/torah-mcp">GitHub</a>
  </div>
  <p><a href="https://www.sefaria.org" aria-label="Powered by Sefaria"><img src="https://files.readme.io/dcee0a8-image.png" alt="Powered by Sefaria" width="104" height="54" style="display:block;margin-bottom:.7rem"></a>
  Textes servis par l'API publique de Sefaria — licences indiquées dans chaque réponse. Vocalisation par le nakdan de Dicta, calendriers Hebcal. Un projet personnel de Jonathan Bensaid — indépendant de Sefaria et de hebrewbooks.org.</p>
</footer>

<script>
(function () {
  // Chorégraphie d'entrée (après chargement des polices)
  function go(){ document.body.classList.add("ready"); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go); setTimeout(go, 900); } else { setTimeout(go, 120); }

  // Révélations au défilement
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

  // Le daf vivant : une glose éclaire sa phrase, une phrase éclaire sa glose
  function link(sel, other) {
    document.querySelectorAll(sel).forEach(function (el) {
      var ref = el.getAttribute("data-ref");
      el.addEventListener("mouseenter", function () {
        document.querySelectorAll(other + '[data-ref="' + ref + '"], ' + sel + '[data-ref="' + ref + '"]').forEach(function (m) { m.classList.add("on"); });
      });
      el.addEventListener("mouseleave", function () {
        document.querySelectorAll('[data-ref="' + ref + '"]').forEach(function (m) { m.classList.remove("on"); });
      });
    });
  }
  link(".glose", ".guf mark");
  link(".guf mark", ".glose");
})();
</script>
</body>
</html>`;

export const INSTALL_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Installation — Torah MCP</title>
<meta name="description" content="Installer Torah MCP dans claude.ai, Claude Code ou tout client MCP : le guide technique complet.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&display=swap" rel="stylesheet">
<meta property="og:type" content="website">
<meta property="og:title" content="Torah MCP — la discipline des sources pour Claude">
<meta property="og:description" content="Claude cite la Torah depuis les textes, plus jamais de mémoire. Méthode, havrouta, guide de paracha, daf interactif, zmanim, guematria. Gratuit.">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com/">
<meta name="twitter:card" content="summary_large_image">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NG6P5HPH9K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-NG6P5HPH9K');
</script>
<style>
  :root { --paper:#f7f6f1; --ink:#082a99; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --ease:cubic-bezier(0.16,1,0.3,1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  ::selection { background:var(--ink); color:var(--paper); }
  main { max-width:820px; margin:0 auto; }
  a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.1rem 0; }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; text-decoration:none; }
  nav .wm b { font-weight:600; border-bottom:3px solid var(--ink); padding-bottom:1px; }
  nav a.b { text-decoration:none; } nav a.b:hover { text-decoration:underline; }
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.2rem,5vw,3.6rem); line-height:1.05; letter-spacing:-.02em; margin:3.5rem 0 .8rem; }
  .amud-head { display:flex; align-items:baseline; gap:1.2rem; margin:3.2rem 0 1.2rem; }
  .amud-head .ot { font-size:1.5rem; font-weight:700; direction:rtl; }
  .amud-head .rule { flex:1; height:1px; background:var(--ink-15); }
  .amud-head .lbl { font-size:.76rem; letter-spacing:.2em; text-transform:uppercase; opacity:.55; }
  p.muted { opacity:.75; max-width:38rem; }
  ol, ul { padding-left:1.3rem; } li { margin:.35rem 0; }
  .url { display:block; background:var(--ink); color:var(--paper); padding:.85rem 1.1rem; font-family:ui-monospace, Menlo, monospace; font-size:.92rem; margin:1rem 0; word-break:break-all; }
  .url::selection { background:var(--paper); color:var(--ink); }
  code { border-bottom:1px dotted var(--ink-40); font-family:ui-monospace, Menlo, monospace; font-size:.9em; }
  .lnk { font-family:"Fraunces", Georgia, serif; font-weight:600; text-decoration:none; }
  .lnk::before { content:"[ "; color:var(--ink-40); } .lnk::after { content:" ]"; color:var(--ink-40); }
  .lnk:hover::before { content:"[ → "; }
</style>
</head>
<body>
<main>
  <nav><a class="wm" href="/"><b>Torah</b>&nbsp;MCP</a><a class="b" href="/">← l'accueil</a></nav>
  <h1>L'installation, en deux minutes.</h1>
  <p class="muted">Torah MCP est un serveur MCP distant (HTTP streamable). Gratuit, sans compte, sans collecte de données.</p>

  <div class="amud-head"><span class="ot">א</span><span class="rule"></span><span class="lbl">claude.ai</span></div>
  <ol>
    <li>Ouvrez <a href="https://claude.ai/settings/connectors">claude.ai → Settings → Connectors</a></li>
    <li>Cliquez sur <strong>Add custom connector</strong></li>
    <li>Collez cette URL, nommez-le « Torah », validez — l'app mobile suit toute seule :</li>
  </ol>
  <span class="url">https://torah-mcp.com/mcp</span>

  <div class="amud-head"><span class="ot">ב</span><span class="rule"></span><span class="lbl">Claude Code</span></div>
  <span class="url">claude mcp add --transport http torah https://torah-mcp.com/mcp</span>

  <div class="amud-head"><span class="ot">ג</span><span class="rule"></span><span class="lbl">Autres clients MCP</span></div>
  <p>Tout client compatible (transport HTTP streamable) fonctionne avec la même URL. Le serveur expose 16 outils en lecture seule, 5 prompts (<code>hebrewbooks</code>, <code>havrouta</code>, <code>paracha</code>, <code>debutant</code>, <code>avance</code>) et une MCP App — le visualiseur de daf.</p>

  <div class="amud-head"><span class="ot">ד</span><span class="rule"></span><span class="lbl">Votre niveau</span></div>
  <p>Dites-le simplement au début de la conversation — « je débute, je ne lis pas l'hébreu » ou « mode avancé » — ou laissez Claude le déduire de votre question. Le tool <code>mode_etude</code> règle le registre (débutant / classique / avancé) sans rien changer à la discipline des sources ; vous en changez à tout moment.</p>

  <div class="amud-head"><span class="ot">ה</span><span class="rule"></span><span class="lbl">Accès sur invitation — optionnel</span></div>
  <p>Par défaut le serveur est public. Pour un accès sur invitation, l'hébergeur pose le secret <code>BEARER_TOKENS</code> (un token par invité, séparés par des virgules) ; chacun utilise alors <code>https://…/&lt;token&gt;/mcp</code>, et l'on révoque en retirant le token.</p>

  <div class="amud-head"><span class="ot">ו</span><span class="rule"></span><span class="lbl">Héberger votre propre instance</span></div>
  <p>Le code est libre (MIT), sans aucun secret requis. Optionnels : <code>HEBREWBOOKS_API_KEY</code> (recherche catalogue — clé sur demande à developers@hebrewbooks.org), <code>BEARER_TOKENS</code>.</p>
  <p style="margin-top:1rem"><a class="lnk" href="https://deploy.workers.cloudflare.com/?url=https://github.com/JonathanB555/torah-mcp">Deploy to Cloudflare</a>&nbsp;&nbsp;&nbsp;<a class="lnk" href="https://github.com/JonathanB555/torah-mcp">Code source</a></p>

  <div class="amud-head"><span class="ot">ז</span><span class="rule"></span><span class="lbl">Bon voisinage</span></div>
  <ul>
    <li>Requêtes vers Sefaria : User-Agent identifiant + cache edge (24 h textes, 1 h calendriers)</li>
    <li>Limite de débit : 60 requêtes/minute/IP</li>
    <li>Licences des textes restituées dans chaque réponse</li>
  </ul>

  <p style="margin-top:3rem"><a class="lnk" href="/">Retour à l'accueil</a></p>
  <footer style="margin-top:2.5rem;font-size:.88rem;opacity:.65"><p>Un projet personnel de Jonathan Bensaid.</p></footer>
</main>
</body>
</html>`;
