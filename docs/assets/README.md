# docs/assets - the organized asset library

Everything in here is **curated and safe to reference** from documentation pages. Files
arrive from `../../_intake/` after being renamed and web-optimized.

## Layout

```
assets/
  benchmarking/
    stardew-valley/         Reference shots & analysis images for Stardew Valley
    japanese-rural-life/    Japanese Rural Life Adventure, etc.
  art-style/
    references/             Real-world & historical visual references
    moodboards/             Assembled moodboards / style targets
  fonts/
    references/             Meetei Mayek script references
    specimens/              Type specimens of our English-as-Meetei-Mayek face
  naming/                   Title treatments, logo sketches, name visuals
```

## Referencing an asset from a docs page

Use a path **relative to the page that includes it**.

- From a top-level page (e.g. `docs/landing.html`):
  `assets/benchmarking/stardew-valley/sdv-farm-01.jpg`
- From a subfolder page (e.g. `docs/40-art-audio/art-style.html`):
  `../assets/art-style/moodboards/art-moodboard-village-01.jpg`

Always inside a `slate-figure` with real `alt` text and a caption:

```html
<figure class="slate-figure">
  <img src="../assets/art-style/moodboards/art-moodboard-village-01.jpg"
       alt="Moodboard of a timber-and-brick Meitei village at dawn.">
  <figcaption>Target mood for the opening village - warm timber, wet paddy, low mist.</figcaption>
</figure>
```

## Conventions

- Web-optimize before committing: JPG/WebP for photos, PNG for flat/UI, SVG for diagrams.
  Aim for ≤ ~300 KB per image where possible.
- Keep the naming convention from `_intake/README.md`.
- One subject per file; don't overwrite - increment the `-nn` suffix.
