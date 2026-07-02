---
name: chart-visualization
description: Visualize data as charts. Invoke this skill when users need to generate bar charts, line charts, pie charts, scatter plots, radar charts, Sankey diagrams, mind maps, flowcharts, and other charts. Use curl to call the AntV API and generate chart images.
---

Visualize the data as a chart based on the user's input.

## Steps
1. Analyze the user's data and requirements, and choose the most appropriate chart type
2. Construct a JSON request body that conforms to the specification
3. Use curl to call the API and generate the chart image
4. Output the returned image URL in Markdown image format

## Chart Selection Guide

Choose the most appropriate chart type based on the user's data characteristics and requirements:

- **Time series**: Use `line` for trends or `area` for cumulative trends; use `dual-axes` for two different units of measure
- **Comparisons**: Use `bar` for horizontal category comparisons or `column` for vertical category comparisons; use `histogram` for frequency distributions
- **Composition**: Use `pie` for proportional composition or `treemap` for hierarchical proportions
- **Relationships and flows**: Use `scatter` for correlations, `sankey` for flows, or `venn` for set overlaps
- **Hierarchies and trees**: Use `organization-chart` or `mind-map`
- **Specialized types**:
  - `radar`: multidimensional comparison
  - `funnel`: conversion across process stages
  - `liquid`: percentage/progress
  - `word-cloud`: text word frequency
  - `boxplot` / `violin`: statistical distribution
  - `network-graph`: complex node relationships
  - `fishbone-diagram`: cause-and-effect analysis
  - `flow-diagram`: flowchart
  - `spreadsheet`: structured data table or pivot table

## API Endpoint

POST https://antv-studio.alipay.com/api/gpt-vis

The request body is JSON and must include the `type` and `source: "chart-visualization-skills"` fields.

Example:
```bash
curl -X POST https://antv-studio.alipay.com/api/gpt-vis \
  -H "Content-Type: application/json" \
  -d '{"type":"line","source":"chart-visualization-skills","data":[{"time":"2025-01","value":100}],"title":"Sample Chart"}'
```

Example response:
```json
{"success":true,"resultObj":"https://..."}
```

Output the URL in `resultObj` in Markdown image format: `![Chart](URL)`

## Supported Chart Types

| Category | Chart Types |
|------|---------|
| Comparisons | Bar chart (bar), column chart (column), waterfall chart (waterfall), dual-axes chart (dual-axes) |
| Trends | Area chart (area), line chart (line), scatter plot (scatter) |
| Distributions | Box plot (boxplot), histogram (histogram), violin plot (violin), funnel chart (funnel) |
| Composition | Pie chart (pie), liquid chart (liquid), word cloud (word-cloud) |
| Hierarchies | Organization chart (organization-chart), mind map (mind-map), treemap (treemap), Sankey diagram (sankey) |
| Relationships | Network graph (network-graph), Venn diagram (venn) |
| Flows | Flowchart (flow-diagram), fishbone diagram (fishbone-diagram) |
| Multidimensional | Radar chart (radar) |
| Tables | Table/pivot table (spreadsheet) |

## Common Optional Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| theme | string | "default" | Theme: "default" / "academy" / "dark" |
| width | number | 600 | Chart width |
| height | number | 400 | Chart height |
| title | string | "" | Chart title |
| style.texture | string | "default" | Texture: "default" / "rough" (hand-drawn style) |

Charts with axes also support: axisXTitle, axisYTitle.

## Data Format for Each Chart

- **area / line**: `{time: string, value: number, group?: string}[]`, optional stack: boolean
- **bar**: `{category: string, value: number, group?: string}[]`, optional group / stack (default stack: true)
- **column**: `{category: string, value: number, group?: string}[]`, optional group (default true) / stack
- **scatter**: `{x: number, y: number, group?: string}[]`
- **pie**: `{category: string, value: number}[]`, optional innerRadius: number (0-1)
- **radar**: `{name: string, value: number, group?: string}[]`
- **funnel**: `{category: string, value: number}[]`
- **waterfall**: `{category: string, value?: number, isTotal?: boolean, isIntermediateTotal?: boolean}[]`
- **dual-axes**: categories: string[], series: {type: "column"|"line", data: number[], axisYTitle?: string}[]
- **histogram**: `number[]`, optional binNumber: number
- **boxplot / violin**: `{category: string, value: number, group?: string}[]`
- **liquid**: percent: number (0-1), optional shape: "circle"|"rect"|"pin"|"triangle"
- **word-cloud**: `{text: string, value: number}[]`
- **sankey**: `{source: string, target: string, value: number}[]`, optional nodeAlign
- **treemap**: `{name: string, value: number, children?: ...}[]` (up to 3 levels deep)
- **venn**: `{sets: string[], value: number, label?: string}[]`
- **network-graph / flow-diagram**: `{nodes: {name: string}[], edges: {source: string, target: string, name?: string}[]}`
- **fishbone-diagram / mind-map**: `{name: string, children?: ...}` (up to 3 levels deep)
- **organization-chart**: `{name: string, description?: string, children?: ...}` (up to 3 levels deep), optional orient: "horizontal"|"vertical"
- **spreadsheet**: `Record<string, string | number>[]`, optional rows / columns / values (pivot table fields)
