# torah-mcp

Serveur MCP personnel — étude des sources juives. Worker Cloudflare servi sur
`https://torah-mcp.jonathan-ef2.workers.dev` (sous-domaine workers.dev, pas de
domaine custom).

## Outils

- `sefaria_text` — texte d'une référence (hébreu + traduction) : Tanakh, Talmud,
  Choulhan Aroukh, Michné Torah, responsa…
- `sefaria_links` — commentaires et textes liés (Rachi, midrachim, halakha…),
  filtrables par catégorie
- `sefaria_search` — recherche plein texte dans toute la bibliothèque (he/en)
- `sefaria_calendar` — parachat hachavoua, daf yomi, Rambam quotidien…
- `hebrewbooks_skill` — le skill d'étude : méthode pour répondre depuis les
  textes réellement lus (jamais de mémoire), avec liens hebrewbooks.org pour la
  lecture. Aussi exposé en prompt MCP (`/mcp__torah-mcp__hebrewbooks`).
  Source de vérité : `~/.claude/skills/hebrewbooks-source/SKILL.md`

Données : API publique [sefaria.org](https://www.sefaria.org/developers) —
merci à Sefaria ; licences des textes indiquées dans chaque réponse.

## Partage

Le serveur est **public par défaut** (aucune clé côté serveur, il ne proxifie
que des API publiques). Pour le partager : donner l'URL
`https://torah-mcp.jonathan-ef2.workers.dev/mcp` à ajouter comme connecteur
personnalisé dans claude.ai (Settings → Connectors) ou :

```bash
claude mcp add --transport http torah https://torah-mcp.jonathan-ef2.workers.dev/mcp
```

Pour passer en accès sur invitation : poser le secret `BEARER_TOKENS`
(tokens séparés par des virgules — un par ami, révocation en le retirant) :

```bash
npx wrangler secret put BEARER_TOKENS
```

Chaque ami utilise alors `https://…workers.dev/<son-token>/mcp`.

## Déployer

```bash
npm install
npx wrangler deploy
```
