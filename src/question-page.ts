/**
 * Page /question — poser une question en français, sans Claude installé.
 * Le mode (débutant / classique / avancé) est partagé avec /outils via
 * localStorage (clé tm_mode). Débutant par défaut.
 */

export const QUESTION_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Poser une question — Torah MCP</title>
<meta name="description" content="Posez votre question sur la Torah, la halakha, le Talmud, en français. La réponse est lue dans les textes réels (Sefaria) et citée exactement — sans rien installer.">
<link rel="icon" href="/icon.png" type="image/png">
<meta property="og:type" content="website">
<meta property="og:title" content="Poser une question — Torah MCP">
<meta property="og:description" content="Une question sur la Torah, en français. La réponse est lue dans les textes réels et citée exactement.">
<meta property="og:image" content="https://torah-mcp.com/og.png">
<meta property="og:url" content="https://torah-mcp.com/question">
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
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Frank+Ruhl+Libre:wght@400;700&display=swap');
  :root { --paper:#f7f6f1; --ink:#082a99; --ink-40:rgba(8,42,153,.4); --ink-15:rgba(8,42,153,.14); --muted:rgba(8,42,153,.65); --hl:#dbe3ff; --ease:cubic-bezier(0.16,1,0.3,1); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--paper); color:var(--ink); font:17px/1.7 "Frank Ruhl Libre", Georgia, serif; padding:0 4vw 5rem; }
  ::selection { background:var(--ink); color:var(--paper); }
  main { max-width:820px; margin:0 auto; }
  a { color:var(--ink); }
  nav { display:flex; justify-content:space-between; align-items:baseline; padding:1.1rem 0; font-size:.92rem; }
  nav .wm { font-family:"Fraunces", Georgia, serif; font-weight:300; text-decoration:none; font-size:1.05rem; }
  nav .wm b { font-weight:600; border-bottom:3px solid var(--ink); padding-bottom:1px; }
  nav .r a { text-decoration:none; margin-left:1.1rem; } nav .r a:hover { text-decoration:underline; }
  h1 { font-family:"Fraunces", Georgia, serif; font-weight:300; font-size:clamp(2.2rem,5vw,3.6rem); line-height:1.05; letter-spacing:-.02em; margin:3rem 0 .8rem; }
  h1 strong { font-weight:600; }
  p.muted { color:var(--muted); max-width:40rem; }
  /* Étape 1 — le niveau, en évidence */
  .step { display:flex; align-items:baseline; gap:1rem; margin:2.6rem 0 1rem; }
  .step .n { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.6rem; }
  .step .t { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; }
  .step .rule { flex:1; height:1px; background:var(--ink-15); }
  .step .s { font-size:.78rem; letter-spacing:.18em; text-transform:uppercase; opacity:.55; }
  .modes { display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin:0 0 .6rem; }
  .modes label { display:block; cursor:pointer; border:1.5px solid var(--ink-15); padding:1rem 1.1rem 1.1rem; transition:border-color .3s var(--ease), background .3s var(--ease); position:relative; }
  .modes label:hover { border-color:var(--ink-40); }
  .modes label:has(input:checked) { border-color:var(--ink); background:var(--hl); }
  .modes label:has(input:checked)::after { content:"→ choisi"; position:absolute; top:.6rem; right:.9rem; font-size:.7rem; letter-spacing:.14em; text-transform:uppercase; opacity:.7; }
  .modes .h { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; display:block; }
  .modes .w { display:block; font-size:.78rem; letter-spacing:.12em; text-transform:uppercase; opacity:.55; margin:.1rem 0 .5rem; }
  .modes .d { display:block; font-size:.9rem; line-height:1.5; opacity:.85; }
  .modes input { position:absolute; opacity:0; pointer-events:none; }
  .modehelp { display:none; }
  @media (max-width:720px) { .modes { grid-template-columns:1fr; } }
  textarea { width:100%; min-height:110px; padding:.6rem .1rem; border:0; border-bottom:1.5px solid var(--ink-15); border-radius:0; background:transparent; color:var(--ink); font:inherit; font-size:1.15rem; resize:vertical; }
  textarea:focus { outline:none; border-bottom-color:var(--ink); }
  textarea::placeholder { color:var(--ink-40); }
  .row { display:flex; gap:1.6rem; align-items:baseline; flex-wrap:wrap; margin-top:1rem; }
  button { padding:.4rem 0; border:0; background:transparent; color:var(--ink); font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.1rem; cursor:pointer; }
  button::before { content:"[ "; color:var(--ink-40); } button::after { content:" ]"; color:var(--ink-40); }
  button:hover::before { content:"[ → "; }
  button:disabled { opacity:.45; cursor:default; }
  .count { font-size:.82rem; color:var(--muted); }
  .ex { margin-top:2rem; font-size:.95rem; }
  .ex span { display:block; font-size:.78rem; letter-spacing:.16em; text-transform:uppercase; opacity:.55; margin-bottom:.4rem; }
  .ex a { display:inline-block; margin:0 1.2rem .4rem 0; font-style:italic; text-decoration:none; border-bottom:1px dotted var(--ink-40); }
  .ex a:hover { border-bottom-style:solid; }
  #wait { display:none; margin-top:2.6rem; font-style:italic; color:var(--muted); }
  #wait .dot { display:inline-block; width:.45em; height:.45em; background:var(--ink); border-radius:50%; margin-right:.6rem; animation:pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:.25 } 50% { opacity:1 } }
  #out { display:none; margin-top:2.6rem; border-top:2px solid var(--ink); padding-top:1.4rem; }
  #out h2 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.25rem; margin:1.6rem 0 .5rem; }
  #out h3 { font-family:"Fraunces", Georgia, serif; font-weight:600; font-size:1.05rem; margin:1.2rem 0 .3rem; }
  #out p { margin:.6rem 0; } #out ul, #out ol { padding-left:1.3rem; margin:.5rem 0; } #out li { margin:.25rem 0; }
  #out blockquote { border-inline-start:2px solid var(--ink); padding-inline-start:1rem; margin:.8rem 0; opacity:.9; }
  #out .he { direction:rtl; font-size:1.15em; }
  #out code { border-bottom:1px dotted var(--ink-40); font-family:ui-monospace, Menlo, monospace; font-size:.9em; }
  .srcs { margin-top:1.6rem; font-size:.9rem; }
  .srcs a { margin-right:1rem; }
  .disc { margin-top:2rem; font-size:.82rem; color:var(--muted); max-width:44rem; }
  .err { color:#7a1f1f; margin-top:1.4rem; }
  .again { margin-top:1.4rem; }
  footer { margin-top:4rem; font-size:.88rem; color:var(--muted); border-top:1px solid var(--ink-15); padding-top:1.4rem; }
  @media (max-width:720px) { h1 { margin-top:2rem; } .step { flex-wrap:wrap; } .step .s { display:none; } }
</style>
</head>
<body>
<main>
  <nav>
    <a class="wm" href="/"><b>Torah</b>&nbsp;MCP</a>
    <span class="r"><a href="/outils">Outils</a><a href="/daf">Le daf</a><a href="/install"><strong>Installer le MCP</strong></a></span>
  </nav>

  <h1>Posez votre <strong>question</strong>.</h1>
  <p class="muted">En français, comme elle vous vient. La réponse est lue dans les textes réels — Bible, Talmud, commentateurs, via Sefaria — et citée exactement, avec ses sources. Rien à installer.</p>

  <form id="f" autocomplete="off">
    <div class="step"><span class="n">1</span><span class="t">Choisissez votre niveau</span><span class="rule"></span><span class="s">on commence par là</span></div>
    <div class="modes" role="radiogroup" aria-label="Niveau">
      <label><input type="radio" name="mode" value="debutant" checked><span class="h">Débutant</span><span class="w">Je débute, ou je ne lis pas l'hébreu</span><span class="d">Tout en français, chaque terme expliqué, le contexte avant la réponse.</span></label>
      <label><input type="radio" name="mode" value="classique"><span class="h">Classique</span><span class="w">J'ai les bases</span><span class="d">La source puis sa traduction ; les termes usuels sont supposés connus.</span></label>
      <label><input type="radio" name="mode" value="avance"><span class="h">Avancé</span><span class="w">Beit midrash</span><span class="d">Langue originale, terminologie sans glose, mahloket et lomdus.</span></label>
    </div>
    <div class="modehelp" id="mh"></div>
    <div class="step"><span class="n">2</span><span class="t">Posez votre question</span><span class="rule"></span></div>
    <textarea id="q" maxlength="600" placeholder="Par exemple : pourquoi allume-t-on deux bougies le vendredi soir ?" required></textarea>
    <input type="text" name="site" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
    <div class="row">
      <button type="submit" id="go">Demander</button>
      <span class="count" id="cnt">0 / 600</span>
    </div>
  </form>

  <div class="ex" id="ex">
    <span>Pour essayer</span>
    <a href="#" data-q="C'est quoi exactement la halakha, et d'où ça vient ?">C'est quoi exactement la halakha ?</a>
    <a href="#" data-q="Que dit la Torah sur le fait de rendre un objet perdu ?">Que dit la Torah sur l'objet perdu ?</a>
    <a href="#" data-q="Pourquoi la paracha de cette semaine s'appelle-t-elle comme ça, et de quoi parle-t-elle ?">De quoi parle la paracha de cette semaine ?</a>
    <a href="#" data-q="Quelle est la différence entre la Michna et la Guemara ?">Michna, Guemara : quelle différence ?</a>
    <a href="#" data-q="Que dit Rachi sur le premier verset de la Genèse ?">Que dit Rachi sur Genèse 1:1 ?</a>
  </div>

  <div id="wait"><span class="dot"></span><span id="wtxt">Lecture des sources…</span></div>
  <div class="err" id="err"></div>

  <section id="out" aria-live="polite">
    <div id="ans"></div>
    <div class="srcs" id="srcs"></div>
    <p class="disc">Réponse rédigée par Claude à partir des textes lus sur Sefaria, selon la méthode Torah MCP — vérifiez toujours les sources citées. Pour une décision de halakha pratique, consultez un rabbin.</p>
    <p class="again"><a href="#" id="again">Poser une autre question</a> · <a href="/install">Installer Torah MCP dans Claude pour aller plus loin</a></p>
  </section>

  <footer><p><a href="/">Accueil</a> · <a href="/outils">Outils</a> · <a href="/privacy">Confidentialité</a></p><p>Un projet personnel de Jonathan Bensaid.</p></footer>
</main>
<script>
(function () {
  var HELP = {
    debutant: "Tout en français, chaque terme expliqué, le contexte d'abord — pour qui débute ou ne lit pas l'hébreu.",
    classique: "Bilingue : la source puis sa traduction, termes usuels supposés connus.",
    avance: "Beit midrash : source en langue originale, terminologie sans glose, mahloket et lomdus."
  };
  var f = document.getElementById("f"), q = document.getElementById("q"), go = document.getElementById("go");
  var wait = document.getElementById("wait"), wtxt = document.getElementById("wtxt"), err = document.getElementById("err");
  var out = document.getElementById("out"), ans = document.getElementById("ans"), srcs = document.getElementById("srcs");
  var mh = document.getElementById("mh"), cnt = document.getElementById("cnt");
  var radios = f.querySelectorAll('input[name=mode]');
  var saved = null; try { saved = localStorage.getItem("tm_mode"); } catch (e) {}
  radios.forEach(function (r) {
    if (saved && r.value === saved) r.checked = true;
    r.addEventListener("change", function () { mh.textContent = HELP[r.value]; try { localStorage.setItem("tm_mode", r.value); } catch (e) {} });
  });
  mh.textContent = HELP[mode()];
  function mode() { var c = f.querySelector('input[name=mode]:checked'); return c ? c.value : "debutant"; }
  q.addEventListener("input", function () { cnt.textContent = q.value.length + " / 600"; });
  document.querySelectorAll("#ex a").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); q.value = a.getAttribute("data-q"); cnt.textContent = q.value.length + " / 600"; q.focus(); });
  });
  document.getElementById("again").addEventListener("click", function (e) { e.preventDefault(); out.style.display = "none"; q.value = ""; cnt.textContent = "0 / 600"; q.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); });

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function inline(s) {
    s = esc(s);
    s = s.replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^\\*])\\*([^\\*]+?)\\*/g, "$1<em>$2</em>");
    s = s.replace(/\\x60([^\\x60]+?)\\x60/g, "<code>$1</code>");
    s = s.replace(/\\[([^\\]]+?)\\]\\((https?:[^\\s)]+)\\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/(^|[\\s(])(https?:\\/\\/[^\\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
    return s;
  }
  function md(src) {
    var lines = src.split(/\\r?\\n/), html = "", list = null, para = [];
    function flushP() { if (para.length) { var t = para.join(" "); var he = /^[\\u0590-\\u05FF\\s\\u05BE\\u05C0-\\u05C7"'\\-,.:;()]+$/.test(t.replace(/<[^>]+>/g, "")); html += '<p' + (he ? ' class="he"' : '') + '>' + inline(t) + '</p>'; para = []; } }
    function flushL() { if (list) { html += "</" + list + ">"; list = null; } }
    lines.forEach(function (l) {
      var m;
      if ((m = l.match(/^\\s*(#{1,3})\\s+(.*)$/))) { flushP(); flushL(); var lv = m[1].length === 1 ? 2 : m[1].length; html += "<h" + lv + ">" + inline(m[2]) + "</h" + lv + ">"; return; }
      if ((m = l.match(/^\\s*[-*•]\\s+(.*)$/))) { flushP(); if (list !== "ul") { flushL(); list = "ul"; html += "<ul>"; } html += "<li>" + inline(m[1]) + "</li>"; return; }
      if ((m = l.match(/^\\s*\\d+[.)]\\s+(.*)$/))) { flushP(); if (list !== "ol") { flushL(); list = "ol"; html += "<ol>"; } html += "<li>" + inline(m[1]) + "</li>"; return; }
      if ((m = l.match(/^\\s*>\\s?(.*)$/))) { flushP(); flushL(); html += "<blockquote>" + inline(m[1]) + "</blockquote>"; return; }
      if (!l.trim()) { flushP(); flushL(); return; }
      flushL(); para.push(l.trim());
    });
    flushP(); flushL();
    return html;
  }

  var steps = ["Lecture des sources…", "Ouverture des textes sur Sefaria…", "Lecture des commentateurs…", "Rédaction de la réponse…"];
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var question = q.value.trim(); if (!question) return;
    err.textContent = ""; out.style.display = "none"; wait.style.display = "block"; go.disabled = true;
    var i = 0; wtxt.textContent = steps[0];
    var tick = setInterval(function () { i = Math.min(i + 1, steps.length - 1); wtxt.textContent = steps[i]; }, 5000);
    fetch("/api/question", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: question, mode: mode() }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        clearInterval(tick); wait.style.display = "none"; go.disabled = false;
        if (!x.ok || x.d.error) { err.textContent = x.d.error || "Erreur — réessayez."; return; }
        ans.innerHTML = md(x.d.reponse || "");
        srcs.innerHTML = (x.d.sources && x.d.sources.length) ? "<strong>Textes lus :</strong> " + x.d.sources.map(function (s) { return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.ref) + '</a>'; }).join("") : "";
        out.style.display = "block";
        out.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function () { clearInterval(tick); wait.style.display = "none"; go.disabled = false; err.textContent = "Erreur réseau — réessayez."; });
  });
})();
</script>
</body>
</html>`;
