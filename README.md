# Manipur 1700s

Documentation hub for a **historically-accurate life-simulation game** set in the Meitei kingdom of
18th-century Manipur — a *playable ethnography* in the spirit of *Stardew Valley*, where historical
accuracy is a design constraint rather than set dressing.

The documentation is presented with **Slate**, a zero-build static docs viewer (the
`docs-presentation` skill), reproduced here unchanged.

## Repository layout

```
manipur-1700s/
├─ docs-presentation-skill/   # the Slate docs-presentation skill (the viewer engine) — do not edit
└─ docs/                      # the live documentation site (content root)
   ├─ index.html              # viewer entry → ../docs-presentation-skill/shell
   ├─ slate.config.json       # branding
   ├─ docs-manifest.json      # the page list / navigation
   ├─ landing.html            # Overview
   ├─ methodology.html        # How We Work (the 9-phase method)
   ├─ backlog.html            # Documentation backlog / "doc debt" tracker
   ├─ 00-foundation/          # vision, scope, canonical year, glossary
   ├─ 10-historical-research/ # the Knowledge Bible + fact database
   ├─ 20-game-design/         # systems derived from history
   ├─ 30-narrative/           # story, characters, folklore
   ├─ 40-art-audio/           # visual & audio direction
   ├─ 50-technical/           # engine, architecture, content pipeline
   ├─ 60-production/          # roadmap, team, risks
   └─ 70-cultural-integrity/  # advisory board, sensitivity, community
```

The eight numbered folders are the **documentation domains**. Each has an overview (`README.html`) that
lists and tracks the detail documents still to be written — this is how we "slowly detail out every
aspect." Add new pages into the relevant folder and register them in `docs/docs-manifest.json`.

## Viewing the docs

The viewer loads content with `fetch()`, so it needs an HTTP server (it will not run from `file://`).

```powershell
# from the repository root
python -m http.server 8080
# then open http://localhost:8080/docs/
```

If GitHub Pages is enabled (source: `main` / root), the site is live at:

> https://prabinpebam.github.io/manipur-1700s/docs/

## Authoring new documentation

1. Read `docs-presentation-skill/SKILL.md` — it is the agent-facing guide.
2. Copy `docs-presentation-skill/templates/page.html`, fill the slots, and save it into the right
   domain folder.
3. Lead every page with a **TL;DR**, and **visualise any data** (charts, diagrams, inline SVG) before
   falling back to prose.
4. Add an entry to `docs/docs-manifest.json` (`path`, `title`, `order`, `group`).
5. Flip the item's status on its domain overview and on `backlog.html`.

## Provenance

The concept and methodology were developed in a planning conversation and distilled into the
nine-phase method documented under **How We Work**. No historical claim here is authoritative yet —
every "seed fact" must be promoted to a rated entry in the fact database (see *Historical Research*).
