# Service page content brief

You are writing the copy for individual service pages on an existing DevOps
consultancy website. The pages are generated from a template, so what you produce
is **data, not markup** — one JSON file per service. The template guarantees the
layout, imagery and animation; you guarantee the words.

## Files you must read first

1. **`client/src/content/_source-data.md`** — the authoritative list of service
   ids, their names, their current one-line summaries and bullets, every valid
   technology id, every valid icon key, and the site-level numbers. Generated
   from the site's own data, so it cannot be out of date.
2. **`client/src/content/services/cicd.json`** — a complete, hand-written
   example. **This is the quality bar.** Match its structure, length, level of
   specificity and tone exactly. If your copy is vaguer or more salesy than this
   file, it is wrong.

## What to produce

One JSON file per service id, at:

```
client/src/content/services/<id>.json
```

The filename must exactly match the `id` field inside it.

## Exact schema

Every field is required. Do not add extra fields. Do not omit any.

```jsonc
{
  "id": "cicd",                       // must equal the filename, and must be an id from the source data
  "tagline": "…",                     // 9–16 words. One sentence, no full stop needed if it reads as a fragment. States the outcome.

  "overview": [                       // EXACTLY 2 paragraphs
    "…",                              // 45–75 words each. Prose, not bullets.
    "…"
  ],

  "problems": [                       // EXACTLY 4 items
    "…"                               // 7–16 words each. A recognisable pain point, stated as the reader would say it.
  ],

  "includes": [                       // EXACTLY 6 items
    { "icon": "pipeline", "title": "…", "text": "…" }
    // icon  : a valid key from the source data
    // title : 2–5 words
    // text  : 16–34 words, 1–2 sentences, concrete
  ],

  "deliverables": [                   // EXACTLY 5 items
    "…"                               // 6–14 words. A tangible artefact the client keeps. A noun phrase, not a sentence.
  ],

  "stack": ["github", "docker"],      // 5–8 ids from the technology list. Only tools genuinely relevant to this service.

  "outcomes": [                       // EXACTLY 3 items
    { "value": "8 min", "label": "Median commit-to-feedback" }
    // value : very short — a number with its unit ("8 min", "1 click", "0", "40%")
    // label : 2–5 words, sentence case, no full stop
  ],

  "process": [                        // EXACTLY 4 items
    { "title": "…", "text": "…" }
    // title : 3–6 words
    // text  : 15–30 words, 1–2 sentences
  ],

  "faqs": [                           // EXACTLY 4 items
    { "q": "…", "a": "…" }
    // q : a real objection a technical buyer would raise. Ends in "?"
    // a : 25–60 words. Answer honestly, including limitations.
  ],

  "related": ["gitops", "testing"],   // 3 ids. Other services from the source data. Must not include this service's own id.

  "seo": {
    "title": "…",                     // 50–60 characters including spaces. Must contain the service name or a close paraphrase.
    "description": "…"                // 140–158 characters including spaces.
  }
}
```

## Voice

The house style is a senior engineer explaining their work to a peer. Use it.

**Do:**
- Be specific. Name the tools, the stages, the artefacts, the numbers.
- Say what the client ends up with. Concrete nouns beat adjectives.
- Acknowledge trade-offs and limits. "This is rarely the thing that fixes a slow
  pipeline" is more persuasive than a promise, and it is honest.
- Write in plain English at roughly the reading level of the existing site.
- Address the reader as "you" and the consultancy as "we".

**Do not:**
- Use any of these words or phrases: passionate, cutting-edge, world-class,
  best-in-class, seamless, robust, leverage (as a verb), synergy, unlock,
  empower, revolutionise, game-changing, state-of-the-art, one-stop shop, take it
  to the next level, in today's fast-paced world, we're excited to, we believe.
- Use exclamation marks anywhere.
- Invent client names, company names, logos, certifications, awards, or named
  individuals.
- Invent testimonials or attribute quotes to anyone.
- Promise a specific guaranteed result. Use "typically", "most teams", or a
  plausible range instead.
- Contradict the site-level numbers in the source data (120+ pipelines shipped,
  99.95% average platform uptime, 40% faster release cycles, 15 min median
  incident response).
- Write placeholder text, lorem ipsum, "TODO", or "coming soon".
- Reuse whole sentences between services. Overlapping *themes* are fine and
  expected — copying text is not. Every page is read on its own and also compared
  against its siblings.

## Uniqueness requirement

Your services must not share sentences with each other, and ideally not with the
exemplar. There is a validator (`deploy/verify-service-content.js`) that fails on
any sentence repeated across two services, so write each page from its own angle.

Where services overlap (many of them genuinely do), differentiate by **emphasis
and depth**, not by rewording the same claim: lead with the different problem,
the different tooling, the different deliverable.

## Writing each field so the page reads well

The rendered page order is:

1. `tagline` + `overview` — the hero
2. `problems` — "what this fixes"
3. `includes` — "what's included" cards
4. `deliverables` — the artefact list
5. `stack` — logo strip
6. `outcomes` — the numbers
7. `process` — how the work runs
8. `faqs` — objections
9. `related` — cross-links

So `overview` must not read as a repeat of `tagline`, `problems` must not repeat
`overview`, and so on. Each block should add new information a reader would
notice the absence of.

## Definition of done for your batch

- One file per assigned service id, named `<id>.json`
- Valid JSON — no comments, no trailing commas, no smart quotes that break
  parsing (the em dash `—` is fine and encouraged; use plain `"` quotes)
- Every count exactly as specified above
- Every `stack`, `icon`, `related` value drawn only from the source data lists
- No sentence duplicated within your batch, or against `cicd.json`
- Report back: the list of ids you wrote, and anything you deliberately left
  out or were unsure about
