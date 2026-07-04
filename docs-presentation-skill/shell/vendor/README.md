# Vendored dependencies

Runtime libraries are vendored here so the viewer works fully **offline / air-gapped** with no CDN
(D-PERF-1, REQ-AP-11). Populated in [Phase 2](../../../implementation-plan/phase-2-design-system-extraction.md).

| File | Library | Purpose |
| --- | --- | --- |
| `marked.min.js` | marked 14.x | Markdown → HTML |
| `highlight.min.js` | highlight.js 11.x | Code syntax highlighting |
| `github.min.css` | highlight.js theme (light) | Code theme (light) |
| `github-dark.min.css` | highlight.js theme (dark) | Code theme (dark) |
| `purify.min.js` | DOMPurify | HTML sanitization (§09 / P3) |
| `mermaid.min.js` | Mermaid (v1.1) | Diagrams - deferred |

The single-file build may inline these; the split build references them locally. Neither requires a
network (REQ-AP-12). Until Phase 2, the repo-root `index.html` loads these from a CDN.
