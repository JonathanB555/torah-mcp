# Torah MCP

**A source discipline for Claude** — never quote Torah from model memory.
Before answering any religious question, Claude loads a bundled study method
that forces it to read the actual texts (Sefaria API), quote exactly, flag
divergent opinions, and point to [hebrewbooks.org](https://hebrewbooks.org)
for further study — never fabricating a reference. A HebrewBooks catalog
search (~65,000 seforim) completes the loop.

Pairs ideally with [Sefaria's official MCP](https://developers.sefaria.org/docs/the-sefaria-mcp)
(`https://mcp.sefaria.org/sse`) — install both: the official server for deep
library access (14 tools), Torah MCP for the citation discipline, the study
method and HebrewBooks.

Free, no account, no data collected. Hosted instance:

```
https://torah-mcp.com/mcp
```

## Install

**claude.ai** — Settings → Connectors → *Add custom connector* → paste the URL
above. Works on mobile too once added.

**Claude Code**

```bash
claude mcp add --transport http torah https://torah-mcp.com/mcp
```

**Any MCP client** — streamable HTTP transport at the same URL.

## Tools

| Tool | Purpose |
|---|---|
| `hebrewbooks_skill` | **The core**: the study method loaded before answering any religious question — sources actually read, exact quotes, [hebrewbooks.org](https://hebrewbooks.org) reading links |
| `hebrewbooks_search` | HebrewBooks catalog search (~65,000 scanned seforim) by title/author via their official API — requires a `HEBREWBOOKS_API_KEY` (granted on request: developers@hebrewbooks.org) |
| `mode_etude` | Study register — `debutant` (all in French, every term explained, for readers with no background or no Hebrew), `classique` (bilingual, default), `avance` (beit midrash: original text, no glosses, mahloket, girsaot, lomdus). Same source discipline in all three |
| `havrouta_mode` | Study-partner mode: Claude asks the questions, makes you defend Rashi against Tosafot, never hands out answers |
| `guide_paracha` | AlHaTorah-style weekly study guide: aliyot, three textual questions with diverging commentators, haftarah echo, Shabbat-table questions |
| `daf_viewer` | MCP App: an interactive Vilna page in the conversation (Gemara, Rashi, Tosafot, click-to-translate). Also at `/daf` |
| `zmanim` · `date_hebraique` · `gematria` · `nikoud` · `fiche_source` | Daily-life tools: Hebcal times, Hebrew dates, 5-method gematria, Dicta vocalization, WhatsApp-ready source cards |
| `sefaria_text` | Text of any reference (Hebrew + translation — **French first when Sefaria has it**, e.g. Bible du Rabbinat for Tanakh, else English): `Berakhot 2a`, `Shulchan Arukh, Orach Chayim 1:1`… |
| `sefaria_links` | Linked commentaries and sources (Rashi, Tosafot, midrash, halakhah…), filterable by category |
| `sefaria_search` | Full-text search across the whole library (Hebrew or English) |
| `sefaria_calendar` | Parashat hashavua, haftarah, daf yomi, daily Rambam… |

The server also ships an `instructions` block (loaded by MCP clients at
initialize) telling the model to load the skill before answering any religious
question, and five MCP prompts (`hebrewbooks`, `havrouta`, `paracha`, `debutant`, `avance`).

## The website — Mamash IA

The website now lives under its own brand, **Mamash IA** (the connector keeps
its `torah-mcp` identity; torah-mcp.com redirects, and torah-mcp.com/mcp keeps
serving installed connectors forever). Everything the MCP does also exists on the web, no install needed, in three
languages: French at the root ([mamash-ia.com](https://mamash-ia.com)),
English under [/en](https://mamash-ia.com/en), Hebrew (RTL) under
[/he](https://mamash-ia.com/he) — same slugs everywhere (`/question`, `/daf`,
`/outils`, `/install`, `/daily`, `/privacy`), a FR · EN · עב switcher on
every page, `hreflang` links for search engines.

- `/question` — ask in plain language; Claude runs server-side with the same
  tools and method and answers **in the language of the page**, with the
  sources it actually read (copy / share / local history).
- `/daf` — the Vilna-style daf viewer; `/outils` — zmanim, Hebrew date,
  gematria, nikkud, source sheets; `/daily` — today's study cycles.

Optional secrets for the site: `ANTHROPIC_API_KEY` (enables `/question`),
`STATS_PASSWORD` (private `/stats` page over the D1 question log — no IPs).

## Deploy your own

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/JonathanB555/torah-mcp)

Or manually:

```bash
npm install
npx wrangler deploy
```

No secrets required. Optional: set a `BEARER_TOKENS` secret (comma-separated
list) to switch from public access to invitation-only — each guest then uses
`https://<your-worker>/<token>/mcp`, and you revoke by removing a token.

## Good-citizen notes

- Requests to Sefaria carry an identifying `User-Agent` and are edge-cached
  (24 h for texts and links, 1 h for calendars) so repeated study of the same
  daf costs Sefaria a single API call.
- A per-IP rate limit (60 req/min) protects the public endpoint.
- Text licenses are returned with every response. Data by the wonderful
  [Sefaria](https://www.sefaria.org/developers) — support them.

[![Powered by Sefaria](https://files.readme.io/dcee0a8-image.png)](https://www.sefaria.org)

## License

MIT — see [LICENSE](LICENSE). The bundled study-method skill and this server
are unaffiliated with Sefaria and hebrewbooks.org.
