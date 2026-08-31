# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

The local catalog is imported from the public AItoolsBot sitemap. Keep the searchable summary index at `public/data/tools.json`, full records under `public/data/tool-details/`, and mirrored thumbnails under `public/tool-images/`. Re-run `npm run import:data` to resume or refresh the import without re-downloading completed records.

## Durable product decisions

- Keep one combined `/about` page named "من أنا" that includes the personal profile and full résumé; `/resume` redirects to it.
- Do not place a Projects link in the top navigation because projects are already presented on the home page.
- The home hero introduction must be structured, polished, and visually integrated with the portrait; avoid loose text beneath the portrait.
- On library item pages, the attachment/download action sits directly below the cover image, aligned to the right on desktop.
- Articles support uploaded inline images between paragraphs, not only a cover image.
- The educational AI assistant is restricted to the official curriculum and site content; out-of-scope questions must be declined rather than answered from general model knowledge.
