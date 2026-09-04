---
name: hebrewbooks-source
description: Ground answers to Jewish religious questions (halacha, Talmud, Tanakh, responsa, hassidout, mussar, séfarade sources) in primary texts actually read, never in memory. Verification via the Sefaria API; hebrewbooks.org links given for the user's own reading. Trigger automatically whenever the user asks a religious/Torah question, or explicitly via /hebrewbooks-source.
---

# Primary sources for religious questions

When this skill is active, you must ground answers to Jewish religious questions in primary texts you have actually downloaded and read during this turn, before answering from general knowledge.

## Two layers, never confused

**hebrewbooks.org is behind a Cloudflare challenge since July 2026.** Every automated request returns 403 (`cf-mitigated: challenge`), with or without a browser User-Agent, on `hebrewbooks.org` as on `beta.hebrewbooks.org`. **Never attempt to bypass it.** Independently of the 403, the collection is page scans: even reachable, it could not be used to verify the spelling of a Hebrew word.

So:

- **Verification layer: Sefaria**, via its API, in source text. This is where every Hebrew quote must come from.
- **Reading layer: hebrewbooks.org**, cited as a link at the end of the answer. Those links open fine in the user's browser; the challenge only blocks robots.

Both appear in the answer. Neither replaces the other.

## When to activate

Activate automatically (without being asked) when the user's question involves:
- Halacha (Shulchan Aruch, Mishneh Torah, responsa, etc.)
- Tanakh commentary (Rashi, Ramban, Ibn Ezra, Malbim...)
- Talmud Bavli/Yerushalmi and meforshim
- Hassidout (Tanya, Likutei Moharan, Noam Elimelech, Sfat Emet...)
- Mussar (Mesillat Yesharim, Chovot HaLevavot, Orchot Tzaddikim...)
- Séfarade poskim (Ben Ish Chai, Kaf HaChaim, Yabia Omer...)
- Kabbalah (Zohar, Etz Chaim, Pri Etz Chaim...)
- Minhagim, customs, history of poskim

Skip if the question is purely cultural/historical with no halachic or textual dimension, or if the user explicitly says "don't use hebrewbooks".

## Workflow

### Step 1 — Resolve the exact reference

Guessing a Sefaria ref wastes a round-trip. Resolve it:

```
curl -s "https://www.sefaria.org/api/name/<title>"
```

The response gives `is_ref` and `completions`, which show the exact node names (e.g. `Chovot HaLevavot, Fourth Treatise on Trust`, `Tanya, Part IV; Iggeret HaKodesh`, `Ben Ish Hai, Halachot 1st Year, <Parasha>`). For a chapter structure, `https://www.sefaria.org/api/v2/index/<title>` returns the full tree.

### Step 2 — Download and read the source text yourself

```
curl -s "https://www.sefaria.org/api/v3/texts/<REF>?version=source" -o out.json
```

Then read `versions[0].text` (sometimes a nested list: flatten it) and strip HTML tags. Read the passage with your own eyes before quoting it.

Two traps, both of which have already produced wrong Hebrew:

- **Nikud.** The editions are vocalized, and the vowel marks sit between the letters. A substring search for `באב` will never match `בְּאָב`. Strip Unicode category `M*` before matching.
- **Never quote Hebrew from a `WebFetch` summary.** WebFetch answers through a small model that paraphrases, and it silently mangles Hebrew into plausible-looking nonsense. Use it for orientation, never for the text of a quote.

For Talmud, `Berakhot.5b`; for Shulchan Aruch, `Shulchan_Arukh,_Orach_Chayim.131.6`; for Mishna Berura, `Mishnah_Berurah.131`.

### Step 3 — Answer with citations

Structure the answer:

1. **Réponse courte** (2–4 lignes) — the halachic/textual conclusion
2. **Source(s)** — for each source cited:
   - Sefer + author + reference (siman/perek/daf)
   - Short quote (≤15 words, in quotation marks) if directly relevant
   - Markdown link to the Sefaria ref that was actually read
   - Where a printed page helps, the hebrewbooks.org sefer link (`hebrewbooks.org/<id>`) for the user's own reading. Never a `pdfpager.aspx?req=...&pgnum=N` URL: the page number can no longer be verified, and an unverified page number is a fabricated citation.
3. **Nuances / opinions divergentes** if relevant (Ashkenaze vs Sefarade, machloket rishonim/acharonim)
4. **Disclaimer**: *"Pour une décision halachique pratique, consulter un Rav."*

Do not append a standing note explaining the hebrewbooks 403. It is the permanent, normal state of affairs, not an incident, and repeating it every time is noise. Mention it only if the user asks.

### Step 4 — When the text cannot be found

If Sefaria does not have the text (some acharonim, most responsa, Kaf HaChaim, Yabia Omer):
- Say so explicitly: *"Je n'ai pas trouvé ce texte en version vérifiable ; voici ce que j'en sais, sans citation hébraïque."*
- Answer from general knowledge **without inventing a Hebrew quote**, and say plainly that the wording is unverified.
- Other machine-readable options worth trying: he.wikisource.org, AlHaTorah, Dicta.
- Never fabricate a hebrewbooks.org identifier, a page number, or a Sefaria ref.

## Chabad sources — the Rebbe's torah

**Likkutei Sichot is copyrighted (© Kehot Publication Society). Never reproduce a sicha in full**, whatever the user asks: summarize its argument, quote at most a few short lines with the volume and page, and send the reader to the official scan for the full text.

The complete set is hosted on hebrewbooks.org (verified 2026-09-04, sefer detail pages checked by title). Volume → id:

| Vol | id | Vol | id | Vol | id |
|---|---|---|---|---|---|
| 1 | 14924 | 14 | 14939 | 27 | 14950 |
| 2 | 14925 | 15 | 14933 | 28 | 14951 |
| 3 | 14926 | 16 | 14934 | 29 | 14952 |
| 4 | 14927 | 17 | 14940 | 30 | 14953 |
| 5 | 14928 | 18 | 14941 | 31 | 14954 |
| 6 | 14929 | 19 | 14942 | 32 | 14955 |
| 7 | 14930 | 20 | 14943 | 33 | 14956 |
| 8 | 14931 | 21 | 14944 | 34 | 14957 |
| 9 | 14932 | 22 | 14945 | 35 | 14958 |
| 10 | 14935 | 23 | 14946 | 36 | 14959 |
| 11 | 14936 | 24 | 14947 | 37 | 14960 |
| 12 | 14937 | 25 | 14948 | 38 | 14961 |
| 13 | 14938 | 26 | 14949 | 39 | 14962 |

(ids are NOT in volume order — trust this table, never extrapolate). Cite as: `Likkutei Sichot vol. 29 — hebrewbooks.org/14952` (sefer link only, still no pdfpager page numbers). French adapted sichot: fr.chabad.org.

An **English rendition** also sits on hebrewbooks.org ("Likkutei Sichos — An Anthology of Talks", English rendition by Rabbi Eliyahu Touger, © Kehot). Verified volumes (title pages checked 2026-09-04):
- Vol. VI (Bereishis) — hebrewbooks.org/15455
- Vol. VII (Shmos) — hebrewbooks.org/15456
- Vol. VIII (Vayikra) — hebrewbooks.org/15457
- Vol. IX (Bamidbar) — hebrewbooks.org/15458
- Vol. X (Devarim) — hebrewbooks.org/15454

Other English volumes may exist nearby, but their ids are UNVERIFIED — never cite an id you have not checked; offer a hebrewbooks.org title search instead. Same copyright rule as the Hebrew set: link for reading, never reproduce.

**The Tanya, by contrast, is readable in full through Sefaria** (license CC-BY-NC granted by Kehot) — quote it like any other source text. Exact ref syntax (the index is complex, plain "Tanya 1" fails):
- `Tanya, Part I; Likkutei Amarim 41` (chapters 1-53)
- `Tanya, Part II; Shaar HaYichud VehaEmunah 3`
- `Tanya, Part III; Iggeret HaTeshuvah 4`
- `Tanya, Part IV; Iggeret HaKodesh 12`
- `Tanya, Part V; Kuntres Acharon 5`

Likkutei Torah (the Alter Rebbe's) exists on Sefaria as a complex index — resolve the exact section (e.g. via sefaria_search) before quoting. Torah Or is NOT on Sefaria (verified 2026-09-04): send readers to hebrewbooks.org.

## Quality rules

- **Never invent** a sefer reference, page number, or URL. If unsure, omit.
- **Quote sparingly** — copyright-safe excerpts only (<15 words per quote, max 1 quote per source).
- **Hebrew + French/English** — give the Hebrew term once, then use the translation.
- **Transliteration (French answers)** — always French Sephardic spelling, never mixed with Ashkenazi/English forms: Chabbat, halakha, mitsva, berakha, Choulhan Aroukh, Orah Haïm, Michna Beroura, Tossafot, Rachi, sougya, mahloket (ש→ch, ת→t, ח→h, צ→ts, ק→k ; jamais sh/tz/os). The `mode_etude` tool carries the full table.
- **Multiple opinions** — when poskim disagree, present both sides with sources, don't pick a winner.
- **No psak** — you are a research assistant, not a posek. Always end halachic answers with the disclaimer.

## Example skeleton

> **Question** : Peut-on allumer les bougies de Shabbat après le coucher du soleil ?
>
> **Réponse** : Non, l'allumage doit avoir lieu avant le coucher du soleil (shkia). Allumer après est un chillul Shabbat de la Torah selon la majorité des poskim.
>
> **Sources** :
> - Choul'han Aroukh, Orah Haim 263:4 : [sefaria.org/Shulchan_Arukh,_Orach_Chayim.263.4](https://www.sefaria.org/Shulchan_Arukh,_Orach_Chayim.263.4)
> - Michna Beroura ad loc., s.k. 17 : [sefaria.org/Mishnah_Berurah.263](https://www.sefaria.org/Mishnah_Berurah.263)
>
> **Nuances** : Certains autorisent un allumage tardif via une non-juive en cas de force majeure (voir Ben Ish Chai, Parshat Noach §6).
>
> *Pour une décision halachique pratique, consulter un Rav.*
