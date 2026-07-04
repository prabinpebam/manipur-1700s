---
name: docs-presentation
title: Documentation-Presentation (Slate)
description: Turn raw content into a beautiful, navigable, visual-first static documentation site. Use when asked to format, organize, or present provided content (notes, transcripts, Markdown, extracted docs) as structured, viewable pages, or to build a documentation site/viewer from content. Strongly biases toward visual representation - charts, diagrams, infographics, and data visuals - using the bundled AntV visualization skills.
version: 0.2.0
---

# Documentation-Presentation Skill (Slate)

Turn raw content into a beautiful, navigable, **static** documentation site. You (the agent) read
this file, take the user's raw content, and generate:

- one **page** per topic (`.html` for rich layout, `.md` for prose, or a mix),
- **visualizations** (charts, diagrams, infographics) for anything that carries data, structure,
  or relationships - embedded as figures,
- a **`docs-manifest.json`** listing every page,
- an optional **`slate.config.json`** for branding,

then copy the `shell/` and `assets/` folders next to them. **You never edit the shell or write CSS or
JavaScript.** You compose pages from the documented component vocabulary in
[`components/`](components/README.md) and from the visualization skills in
[`visualization/`](visualization/README.md).

## Prime directive: visual-first

> **A big part of good documentation is how well information is *represented*. Default to showing,
> not telling.** Whenever content contains numbers, trends, comparisons, proportions, processes,
> hierarchies, relationships, flows, distributions, or structured entities - **represent it as a
> visualization**, not a paragraph. Prose is the fallback, used only when a visual would not add
> clarity.

Apply a **heavy bias toward visuals**:

- If a sentence describes a quantity or change ("CSAT fell from 72% to 59%") → make a **chart**.
- If it lists steps or phases → make a **steps/flow** visual.
- If it compares options → make a **comparison** or a grouped **bar/radar** chart.
- If it describes parts of a whole → **pie/treemap**.
- If it describes a network, org, or dependency → a **graph/org/mind-map**.
- If it is a narrative packed with entities and metrics → a **narrative-text visualization** or an
  **infographic**.
- Only if none of these fit → prose primitives.

Every page should aim to **lead with or prominently feature at least one visualization** when the
source content supports it.

## When to use this skill (trigger)

Use this skill when the user asks to:

- turn content into a navigable documentation site or viewer,
- format / organize / present provided content into structured, viewable pages,
- convert notes, transcripts, or extracted documents into a clean, **visual** docs experience.

## Inputs

- Raw content: Markdown, notes, transcripts, extracted docs, plain prose, tables, datasets.
- Optional branding: project name, logo, brand color, default theme.

## Outputs

- `*.html` (rich) and/or `*.md` (prose) pages - one per topic - as **body fragments** (no `<head>`).
- **Visualization assets** saved under an `assets/` folder next to the pages (e.g.
  `assets/charts/*.svg` / `*.png`), embedded via the figure component.
- `docs-manifest.json` - validated against [`schema/manifest.schema.json`](schema/manifest.schema.json).
- Optional `slate.config.json` - validated against [`schema/config.schema.json`](schema/config.schema.json).
- The copied `shell/` and `assets/` folders (unchanged).

## Procedure (deterministic - follow in order)

1. **Ingest** the content; identify topics → one page per topic.
2. **Outline** each page: title, TL;DR, section hierarchy (H2/H3).
3. **Visualize first (per section).** For every section, ask: *does this carry data, structure, or
   relationships?* If yes, choose a visualization from the **decision matrix** below, produce it
   with the matching visualization skill, save the asset, and embed it as a figure. Do this
   **before** reaching for text components.
4. **Select components** for the non-visual remainder from the catalog, matching content shape to
   component.
5. **Generate** each page from [`templates/page.html`](templates/page.html) (or `templates/landing.html`
   for an overview), filling slots with visualizations and catalog component markup.
6. **Build the manifest** with `order`/`group` reflecting the reading sequence.
7. **Apply branding** via `slate.config.json` if a name/logo/brand color is provided.
8. **Self-validate** against the checklist below; fix issues.
9. **Stop.** The user reviews in the viewer. Invent no content or data beyond the inputs.

## Visualization decision matrix - content shape → visual → skill

Choose the visual whose shape matches the data, then author it with the linked skill. All visuals
are embedded as **figures** (see "Embedding a visualization").

| If the content is… | Represent it as | Use skill |
| --- | --- | --- |
| A time series / trend | `line` (trend) or `area` (cumulative); `dual-axes` for two units | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Category comparison | `bar` / `column`; `radar` for multi-dimension | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Parts of a whole | `pie`; `treemap` for hierarchical proportion | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Distribution / frequency | `histogram`, `boxplot`, `violin` | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Correlation | `scatter` | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Flow / conversion | `sankey`, `funnel`, `flow-diagram` | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Hierarchy / tree | `organization-chart`, `mind-map`, `treemap` | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Cause & effect | `fishbone-diagram` | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Progress / percentage | `liquid` | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Text frequency | `word-cloud` | [chart-visualization](visualization/skills/chart-visualization/SKILL.md) |
| Rich statistical chart (custom marks, scales, interactions) | AntV **G2** chart, exported to SVG/PNG | [antv-g2-chart](visualization/skills/antv-g2-chart/SKILL.md) |
| Network / graph relationships | AntV **G6** graph, exported to SVG/PNG | [antv-g6-graph](visualization/skills/antv-g6-graph/SKILL.md) |
| Pivot table / spreadsheet | AntV **S2**, exported to image or `spreadsheet` chart | [antv-s2-expert](visualization/skills/antv-s2-expert/SKILL.md) |
| Node/edge diagram (architecture, workflow) | AntV **X6**, exported to SVG/PNG | [antv-x6-editor](visualization/skills/antv-x6-editor/SKILL.md) |
| Insight-dense narrative (entities + metrics) | Narrative-text (T8) visualization | [narrative-text-visualization](visualization/skills/narrative-text-visualization/SKILL.md) |
| Summary poster of key facts | Infographic | [infographic-creator](visualization/skills/infographic-creator/SKILL.md) |
| Need an icon for a card/tile/infographic | Icon lookup | [icon-retrieval](visualization/skills/icon-retrieval/SKILL.md) |

**Default, lowest-friction path:** for standard charts, use
[chart-visualization](visualization/skills/chart-visualization/SKILL.md) - it calls the AntV
GPT-Vis API and returns a chart **image**, which you save into `assets/charts/` and embed as a
figure.

## Embedding a visualization in a page

The viewer is static and sanitized: **no `<script>`, no `<iframe>`, no `<style>` in content.** So
visualizations are embedded as **static assets** - an image or inline SVG - inside the **figure**
component. (Interactive/library charts are authored, then **exported** to SVG/PNG.)

Rules:

- **Save the asset locally.** If a skill returns a remote image URL, download it into
  `assets/charts/` and reference the local path so the site stays offline-capable and versioned.
- **Prefer `<img>` for exported charts** (self-contained). Use **inline `<svg>`** only for simple
  graphics that use presentation attributes (`fill=`, `stroke=`) - the sanitizer strips `<style>`
  inside SVG, so `<style>`-based SVG must be rasterized/exported to PNG or converted to attributes.
- **Meaningful `alt`** stating the *takeaway*, not just the chart type.
- **Caption** with `<figcaption>` for context/source.
- **Text alternative + searchability:** include the underlying numbers as a collapsible data table
  right after the figure. This satisfies accessibility and makes the data findable by search.
- Figures get **zoom (lightbox) for free** - the shell enlarges `.slate-figure img` on click.

Canonical embed:

```html
<figure class="slate-figure">
  <img src="assets/charts/csat-q1-drop.svg"
       alt="Line chart: CSAT fell from ~72% in Q4 to ~59% in Q1 2026; DSAT rose ~22% to ~33%." />
  <figcaption>CSAT declined ~13 points quarter over quarter (source: Q1 sample, &lt;2,000 responses).</figcaption>
</figure>
<details class="slate-figure-data">
  <summary>Data</summary>
  <table>
    <thead><tr><th>Quarter</th><th>CSAT</th><th>DSAT</th></tr></thead>
    <tbody>
      <tr><td>Q4</td><td>72%</td><td>22%</td></tr>
      <tr><td>Q1</td><td>59%</td><td>33%</td></tr>
    </tbody>
  </table>
</details>
```

## Component catalog - content shape → component

Reach for a **visualization first** (matrix above). Use these components for structure and for
content that is genuinely non-visual.

| If the content is… | Use | Example |
| --- | --- | --- |
| **Any data/relationship/process** | **Visualization (figure)** | see matrix above |
| A big number / KPI | Metric tile | [metric-tile.html](components/metric-tile.html) |
| A one-line summary of the page | TL;DR band | [tldr.html](components/tldr.html) |
| A page title + lead-in | Hero | [hero.html](components/hero.html) |
| An image needing a caption | Figure | [figure.html](components/figure.html) |
| A set of parallel items/links | Card grid | [card-grid.html](components/card-grid.html) |
| An ordered procedure or phases | Steps / Timeline | [steps.html](components/steps.html) |
| Two options side by side | Comparison | [comparison.html](components/comparison.html) |
| An aside/warning/tip | Callout | [callout.html](components/callout.html) |
| A status/label word | Badge | [badge.html](components/badge.html) |
| Key/value specs | Definition list | [defs.html](components/defs.html) |
| Tabular data (that is not better as a chart) | Table | [table.html](components/table.html) |
| Code | Fenced code block (Markdown) | - |

If the content needs something not covered, choose the closest visual/component or fall back to
prose - and flag the gap to the user.

## Visualization skills (bundled)

Vendored under [`visualization/`](visualization/README.md) - an English port of AntV
`chart-visualization-skills` (MIT). Read the linked `SKILL.md` for each before authoring that
visual type.

| Skill | Use for | Path |
| --- | --- | --- |
| chart-visualization | Standard charts via the GPT-Vis API → returns an image (default path) | [visualization/skills/chart-visualization/SKILL.md](visualization/skills/chart-visualization/SKILL.md) |
| antv-g2-chart | Custom statistical charts (marks, scales, transforms, interactions) | [visualization/skills/antv-g2-chart/SKILL.md](visualization/skills/antv-g2-chart/SKILL.md) |
| antv-g6-graph | Graph / network visualization | [visualization/skills/antv-g6-graph/SKILL.md](visualization/skills/antv-g6-graph/SKILL.md) |
| antv-s2-expert | Pivot tables & spreadsheets | [visualization/skills/antv-s2-expert/SKILL.md](visualization/skills/antv-s2-expert/SKILL.md) |
| antv-x6-editor | Node/edge diagrams (architecture, workflows) | [visualization/skills/antv-x6-editor/SKILL.md](visualization/skills/antv-x6-editor/SKILL.md) |
| infographic-creator | Infographic posters from text | [visualization/skills/infographic-creator/SKILL.md](visualization/skills/infographic-creator/SKILL.md) |
| narrative-text-visualization | Insight narratives with inline mini-charts (T8) | [visualization/skills/narrative-text-visualization/SKILL.md](visualization/skills/narrative-text-visualization/SKILL.md) |
| icon-retrieval | Find icons for cards/tiles/infographics | [visualization/skills/icon-retrieval/SKILL.md](visualization/skills/icon-retrieval/SKILL.md) |

Attribution: original work © 2025 AntV Visualization Team, MIT License. See
[`visualization/LICENSE`](visualization/LICENSE) and [`visualization/NOTICE`](visualization/NOTICE);
these files MUST be kept when the skill is copied.

## Hard rules

1. **Visual-first.** Prefer a visualization over prose for any data, trend, comparison,
   proportion, process, hierarchy, relationship, distribution, or entity-rich narrative. Prose is
   the fallback.
2. **Every visual has a text alternative.** Meaningful `alt` + an underlying data table (or
   equivalent prose) so the information is accessible and searchable. Never present a chart as the
   *only* carrier of a fact.
3. Compose **only** from catalog components and embedded visual assets. Never invent CSS, never
   write `<style>`/`<script>` in content, never use inline `style=`. Visuals are embedded as
   **static images or inline SVG** inside a figure - never as live scripts or iframes.
4. Author **body fragments**, not full HTML documents. The shell owns `<head>`, theme, and layout.
5. Exactly **one H1** per page. H2/H3 drive the TOC and collapsible sections.
6. Pick format per page: prose-heavy → Markdown; layout/visual → HTML; mixed when needed.
7. Every page **leads with a TL;DR** band, and features a visualization when the content supports it.
8. **Save visualization assets locally** under `assets/`; reference relative paths.
9. Links are **relative** to real content paths; the runtime rewrites them to hash routes.
10. **Update `docs-manifest.json`** for every page (path, title, order, group).
11. **Preserve source material** - generate alongside inputs, never overwrite them. Keep the
    bundled `visualization/LICENSE` and `visualization/NOTICE`.
12. **Accessibility**: alt text on every image/chart, semantic markup, keyboard-reachable components.
13. **No emoji** - use the icon set in [`assets/icons/`](assets/icons/) or
    [icon-retrieval](visualization/skills/icon-retrieval/SKILL.md).
14. **No fabrication** - every fact, number, and data point must trace to the provided inputs. Do
    not invent data to make a nicer chart.

## Self-validation checklist (run before finishing)

- [ ] One H1 per page; logical H2/H3 nesting.
- [ ] **Every section carrying data/structure/relationships is visualized** (or a deliberate,
      justified exception).
- [ ] Every visualization is a figure with meaningful `alt`, a caption, and an underlying data
      table (or prose) alternative.
- [ ] Visualization assets are saved under `assets/` and referenced by relative path (no
      unresolved remote-only images).
- [ ] Only catalog components + embedded static visuals used; no inline styles/scripts/iframes.
- [ ] TL;DR present on every page.
- [ ] Every page is in the manifest, in a sensible order.
- [ ] All internal links resolve; all images have alt text and resolve.
- [ ] Renders in light and dark (tokens guarantee contrast; check chart images read in both).
- [ ] Manifest validates against `schema/manifest.schema.json`; config (if any) against
      `schema/config.schema.json`.
- [ ] No fabricated facts or data - everything traces to the inputs.

## Worked example

See [`examples/before.md`](examples/before.md) (raw input) →
[`examples/after.html`](examples/after.html) (generated page) and
[`examples/docs-manifest.json`](examples/docs-manifest.json). Imitate this structure, and add a
visualization for any data the example carries.

## Reference

This skill implements the [Slate specification suite](../specs/README.md) plus the bundled
[visualization skills](visualization/README.md). You do **not** need to read `shell/` source to use
the skill - the catalog, templates, schemas, and visualization skills are sufficient.
