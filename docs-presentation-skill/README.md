# Slate - Documentation-Presentation Skill Package

> **Status:** Working (v0.1). The shell (`shell/index.html` + `slate.css` + `slate.js`) is a
> functioning viewer: it renders Markdown **and** HTML content through one sanitized pipeline, with
> navigation, search, TOC, theming, config-driven branding, and the full v1 component library. A
> runnable [`demo/`](demo/) exercises everything. Remaining plan items: dependency vendoring for
> offline use, the generator, and automated tests (see [implementation plan](../implementation-plan/README.md)).

This folder is the **drop-in skill package**. Copy it (unchanged) into any project, hand an AI agent
some raw content, and the agent - reading [`SKILL.md`](SKILL.md) - produces navigable HTML/Markdown
pages plus a manifest that the viewer renders consistently.

## Try the demo

Serve the repo over HTTP and open the demo content root:

```powershell
python -m http.server 8080
# then open http://localhost:8080/docs-presentation-skill/demo/
```

See [running & manual testing](../implementation-plan/running-and-manual-testing.md) for what to
check. The viewer needs HTTP (it cannot run from `file://`).

## What's here

```
docs-presentation-skill/
  SKILL.md          # agent instructions: when + how to use this skill
  README.md         # this file
  shell/            # the viewer runtime (index.html + slate.css + slate.js + vendor/)
  demo/             # a runnable content root that exercises the framework
  components/       # component catalog: one example per component (few-shot patterns)
  templates/        # page + landing scaffolds the agent fills in
  visualization/    # bundled AntV chart/graph/infographic skills (MIT) - visual-first authoring
  assets/icons/     # system icon set (no emoji)
  schema/           # JSON Schemas for manifest + config
  examples/         # a worked before/after conversion + example manifest
```

## For agents

Read [`SKILL.md`](SKILL.md). You never edit `shell/`. **Bias heavily toward visuals**: for any
data, trend, comparison, proportion, process, hierarchy, or relationship, produce a visualization
using the bundled [`visualization/`](visualization/README.md) skills and embed it as a figure,
*before* falling back to prose. You compose pages from [`components/`](components/README.md) using
[`templates/`](templates/page.html), then write a `docs-manifest.json` validated by
[`schema/manifest.schema.json`](schema/manifest.schema.json).

## For humans

- The design system and component vocabulary are specified in
  [`specs/03-design-tokens.md`](../specs/03-design-tokens.md) and
  [`specs/04-component-library.md`](../specs/04-component-library.md).
- To adopt in a new project: copy this folder, add your Content + `docs-manifest.json`, optionally add
  `slate.config.json`, and serve over HTTP. No code edits.

## Adoption (zero-code)

1. Copy `docs-presentation-skill/shell/` to your content root (or reference it like `demo/` does).
2. Add content pages (`.md`/`.html`) and a `docs-manifest.json` (or run the generator).
3. Optional: add `slate.config.json` for branding.
4. Serve over a static HTTP server and open `index.html`.

## Status of shell files

The `shell/*` files are a working viewer, validated in-browser against the [`demo/`](demo/) content
(Markdown + HTML rendering, sanitization, nav, search, TOC, theming, components). It was implemented
directly in the skill package; the repo-root [`index.html`](../index.html) remains as the original
reference viewer. Still open per the plan: vendoring dependencies for full offline use
([Phase 2](../implementation-plan/phase-2-design-system-extraction.md)), the manifest generator
([Phase 7](../implementation-plan/phase-7-generator.md)), and automated tests.
