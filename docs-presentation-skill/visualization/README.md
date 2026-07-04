# chart-visualization-skills-en

An **English translation** of the `skills/` from
[antvis/chart-visualization-skills](https://github.com/antvis/chart-visualization-skills)
(originally authored primarily in Chinese).

This repository exists so the skill documentation can be inspected, modified, and extended
in English. All content is a faithful translation - code, API names, identifiers, file
paths, links, and markdown structure are preserved unchanged; only human-language prose,
headings, table text, code comments, and example data values were translated.

## Attribution & License

- **Original work:** [antvis/chart-visualization-skills](https://github.com/antvis/chart-visualization-skills)
- **Original copyright:** © 2025 AntV Visualization Team
- **License:** MIT (unchanged) - see [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE)

This is a derivative work distributed under the same MIT License. The original copyright
notice and permission notice are retained in `LICENSE`, as the license requires.

## Skills

| Skill | Description |
|-------|-------------|
| [`antv-g2-chart`](./skills/antv-g2-chart) | Statistical charts with AntV **G2** (marks, scales, transforms, interactions, compositions…) |
| [`antv-g6-graph`](./skills/antv-g6-graph) | Graph / network visualization with AntV **G6** (elements, layouts, behaviors, plugins) |
| [`antv-s2-expert`](./skills/antv-s2-expert) | Pivot tables & spreadsheets with AntV **S2** |
| [`antv-x6-editor`](./skills/antv-x6-editor) | Node/edge diagram editor with AntV **X6** |
| [`chart-visualization`](./skills/chart-visualization) | Generate chart images via the AntV GPT-Vis API |
| [`icon-retrieval`](./skills/icon-retrieval) | Icon retrieval helper |
| [`infographic-creator`](./skills/infographic-creator) | Infographic creation |
| [`narrative-text-visualization`](./skills/narrative-text-visualization) | Narrative-text visualization |

## Layout

```
skills/
  <skill-name>/
    SKILL.md          # entry point (frontmatter: name, description)
    references/       # supporting reference docs (larger skills)
```

## Notes

- Skill and directory **names** are kept identical to the source (they are identifiers).
- If you spot a translation that reads awkwardly for a technical term, prefer the original
  AntV terminology; the goal is clarity, not literalness.
