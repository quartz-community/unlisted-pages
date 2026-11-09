---
"@quartz-community/unlisted-pages": minor
---

Requires Quartz 5.1 (`quartz.quartzVersion: ">=5.1.0"`): it keeps file-backed virtual pages (e.g. Excalidraw drawings) unlisted through `virtualPageHtmlPlugins`. On an older Quartz the build warns, and fails in CI; update Quartz with `npx quartz upgrade`.
