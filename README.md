# Manipuri Life

Documentation hub for a small, cozy **historically-accurate 2D pixel-art life-simulation RPG** set in the
Meitei kingdom of Manipur - a *playable ethnography* in the spirit of *Stardew Valley*, where historical
accuracy is a design constraint rather than set dressing. The game is quest- and relationship-led, gentle,
and quietly educational. The era is decided: the **1850–1900** window - the stable reign of Chandrakirti
Singh, before the 1891 British annexation (see *Era & Canonical Year* in the docs); the single canonical
year inside it is still being fixed.

The documentation is presented with **Slate**, a zero-build static docs viewer (the
`docs-presentation` skill), reproduced here unchanged.

> **Live at:** https://prabinpebam.github.io/manipuri-life/ (redirects to `…/docs/`)

## Repository layout

```
manipuri-life/
├─ index.html                 # root redirect → docs/ (for the bare GitHub Pages URL)
├─ .nojekyll                  # serve the site as raw static files (bypass Jekyll)
├─ _intake/                    # messy inbox: drop raw assets here (temporary)
├─ docs-presentation-skill/    # the Slate docs-presentation skill (the viewer engine) - do not edit
└─ docs/                       # the live documentation site (content root)
   ├─ index.html              # viewer entry → ../docs-presentation-skill/shell
   ├─ slate.config.json       # branding
   ├─ docs-manifest.json      # the page list / navigation
   ├─ landing.html            # Overview
   ├─ why.html                # What's the Proposal - the pitch (for players & contributors)
   ├─ methodology.html        # How We Work (the 9-phase method)
   ├─ backlog.html            # Documentation backlog / "doc debt" tracker
   ├─ assets/                 # organized asset library (referenced by docs pages)
   ├─ 00-foundation/          # vision, scope, canonical year, glossary, naming, asset mgmt
   ├─ 10-historical-research/ # the Knowledge Bible + fact database
   ├─ 15-benchmarking/        # Stardew Valley & Japanese rural-life references
   ├─ 20-game-design/         # systems derived from history
   ├─ 30-narrative/           # story, characters, folklore
   ├─ 40-art-audio/           # visual & audio direction, art style, font design
   ├─ 50-technical/           # engine, architecture, content pipeline
   ├─ 60-production/          # roadmap, team, risks
   ├─ 70-cultural-integrity/  # advisory board, sensitivity, community
   └─ 80-game-development-field-guide/ # lessons, principles, quotes, and technical tips
```

The ten numbered folders are the **documentation domains**. Each has an overview (`README.html`) that
lists and tracks the detail documents still to be written - this is how we "slowly detail out every
aspect." Add new pages into the relevant folder and register them in `docs/docs-manifest.json`.

## Documentation status at a glance

The pitch and method are settled; the domain docs are being detailed out from the top down. Current state:

| Area | Page(s) | Status |
|------|---------|--------|
| Overview | `landing.html` | stable |
| What's the Proposal (pitch) | `why.html` | stable |
| How We Work (method) | `methodology.html` | stable |
| 00 · Foundation | `README`, `vision-pillars`, `canonical-year` | draft · era **decided: 1850-1900** |
| 10 · Historical Research | `README` | draft |
| 15 · Benchmarking | `framework`, `stardew-valley`, `japanese-rural-life`, `cross-platform`, `lessons-for-us` | draft |
| 20 · Game Design | `README` | stub |
| 30 · Narrative | `README`, `plot` | draft |
| 40 · Art & Audio | `README`, `art-style`, `initial-explorations`, `font-design` | draft (font: stub) |
| 50 · Technical | `README`, `cross-platform-strategy` | stub |
| 60 · Production | `README` | stub |
| 70 · Cultural Integrity | `README` | stub |
| 80 · Game Development Field Guide | `README`, `marketing` | draft |

The first concept art is in: an exploratory **cover-art** piece and a set of **cozy isometric pixel-art**
look-development renders (the Kangla gatehouse across a morning/noon/night lighting cycle, a village
*yumjao*, and hand-woven bamboo craft props) live on **Art Style - Explorations**
(`docs/40-art-audio/initial-explorations.html`). See `backlog.html` for the full "doc debt" tracker.

## Managing assets

Images, references, fonts, and audio follow a simple two-stage flow:

1. **`_intake/`** - a repo-root inbox. Drop anything here, any name, no rules. It's meant to be messy and
   temporary.
2. **`docs/assets/…`** - the organized library. Rename, web-optimize, and move files here, then reference
   them from docs pages with `<img>` (only ever point at the library, never at `_intake/`).

The full workflow, folder map, and naming convention live on the **Asset Management** page
(`docs/00-foundation/asset-management.html`). Heavy source files (PSD, RAW, uncompressed audio/video) are
git-ignored - commit a web-friendly export instead.

## Live site (GitHub Pages)

The site is published with GitHub Pages from the **`master`** branch at the **repository root**
(`Settings → Pages → Source: Deploy from a branch → master / root`). Root - not `/docs` - is required
because `docs/index.html` loads the viewer engine from `../docs-presentation-skill/`, a path that sits
*above* the `docs/` folder. A root `index.html` redirect and a `.nojekyll` marker make the site work from
the bare URL and serve as raw static files.

## Viewing the docs locally

The viewer loads content with `fetch()`, so it needs an HTTP server (it will not run from `file://`).

```powershell
# from the repository root
python -m http.server 8080
# then open http://localhost:8080/docs/
```

## Authoring new documentation

1. Read `docs-presentation-skill/SKILL.md` - it is the agent-facing guide.
2. Copy `docs-presentation-skill/templates/page.html`, fill the slots, and save it into the right
   domain folder.
3. Lead every page with a **TL;DR**, and **visualise any data** (charts, diagrams, inline SVG) before
   falling back to prose.
4. Add an entry to `docs/docs-manifest.json` (`path`, `title`, `order`, `group`).
5. Flip the item's status on its domain overview and on `backlog.html`.

## Provenance

The concept and methodology were developed in a planning conversation and distilled into the
parallel-track disciplines documented under **How We Work**. No historical claim here is authoritative yet -
every "seed fact" must be promoted to a rated entry in the fact database (see *Historical Research*).
