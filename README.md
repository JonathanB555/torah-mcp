# Torah MCP

**The Sefaria library inside Claude** — Tanakh, Talmud, Mishneh Torah, Shulchan
Arukh, responsa, and daily study calendars, served over the
[Model Context Protocol](https://modelcontextprotocol.io). Answers to halachic
and textual questions get grounded in the actual sources — exact quotes,
verifiable references, linked commentaries — instead of model memory.

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
| `sefaria_text` | Text of any reference (Hebrew + translation): `Berakhot 2a`, `Shulchan Arukh, Orach Chayim 1:1`… |
| `sefaria_links` | Linked commentaries and sources (Rashi, Tosafot, midrash, halakhah…), filterable by category |
| `sefaria_search` | Full-text search across the whole library (Hebrew or English) |
| `sefaria_calendar` | Parashat hashavua, haftarah, daf yomi, daily Rambam… |
| `hebrewbooks_skill` | The study method: answer religious questions from texts actually read (never from memory), with [hebrewbooks.org](https://hebrewbooks.org) links for further reading |

The server also ships an `instructions` block (loaded by MCP clients at
initialize) telling the model to load the skill before answering any religious
question, and an MCP prompt (`/mcp__torah-mcp__hebrewbooks`).

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
