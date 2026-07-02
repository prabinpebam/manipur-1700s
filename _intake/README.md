# _intake — the messy drop zone

This is the **staging area** for raw assets. Drop anything here without worrying about
naming, folders, or format. It is deliberately allowed to be disorganized.

Think of it as an inbox: things land here, get processed, and then leave.

## How to use it

1. **Drop** — save screenshots, reference images, sketches, font specimens, audio clips,
   PDFs, whatever, straight into this folder (subfolders are fine but not required).
2. **Process** — when you have a moment, move each file to the right home under
   `docs/assets/…`, rename it to the convention below, and (usually) shrink it for the web.
3. **Reference** — add the processed file to the relevant documentation page with an
   `<img>` tag and a real caption.
4. **Clear** — once a file has moved out, it should no longer live here. `_intake` should
   trend back toward empty.

## Where things go next

| Kind of asset                                   | Destination under `docs/assets/`            |
| ----------------------------------------------- | ------------------------------------------- |
| Stardew Valley screenshots / references         | `benchmarking/stardew-valley/`              |
| Japanese rural-life game references             | `benchmarking/japanese-rural-life/`         |
| Art references, concept art, moodboards         | `art-style/references/`, `art-style/moodboards/` |
| Font specimens, Meetei Mayek references         | `fonts/specimens/`, `fonts/references/`     |
| Logo / title / naming visuals                   | `naming/`                                   |

## Naming convention (apply when you move a file out)

```
<area>-<subject>-<short-desc>-<nn>.<ext>
```

- lowercase, words separated by hyphens, no spaces
- `<area>` = short tag such as `sdv`, `jp`, `art`, `font`, `name`
- `<nn>` = two-digit sequence when there are several of the same subject

Examples:

```
sdv-farm-spring-layout-01.jpg
jp-sakuna-ricefield-ui-02.png
art-costume-phanek-innaphi-ref-01.jpg
font-meeteimayek-consonants-chart-01.png
```

## Rules

- **Never reference a file in `_intake/` from a documentation page.** Docs only point at
  files under `docs/assets/…`. Intake files can be deleted at any time.
- Keep large source files (PSD, RAW, uncompressed audio) out of git if they get heavy —
  see `.gitignore`. Export a web-friendly version into `docs/assets/…` instead.
- When in doubt about where something goes, read
  `docs/00-foundation/asset-management.html` (the Asset Management page in the docs site).
