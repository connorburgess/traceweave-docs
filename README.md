# Traceweave documentation site

Public documentation website for [Traceweave](https://github.com/connorburgess/traceweave-spec). Traceweave is an open specification for recognising your own work when it turns up somewhere else, and for producing evidence of the match that anyone can re-run and check.

Status: experimental design draft. Not a standard, not production software.

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

## Checks and production build

```sh
npm run lint
npm run typecheck
npm run check:content
npm run build
```

To verify every cited specification path directly against a local read-only checkout of the published `roadmap-v2` branch of `traceweave-spec`:

```sh
SPEC_CHECKOUT_DIR=/path/to/traceweave-spec npm run check:content
```

## Architecture

- Static Next.js App Router site with TypeScript and build-time Markdown rendering.
- Zero external runtime scripts, external font requests, cookies, analytics, databases, API routes, or environment secrets.
- Client-side search over a build-time static index.
- Light and dark themes (light default, with a two-state toggle saved in `localStorage`).

## Dependencies

- `next` (16.4.6), `react` / `react-dom` (19.3.1), `gray-matter` (4.0.3), `marked` (18.2.1): MIT
- `highlight.js` (11.12.0): BSD-3-Clause
- `@fontsource/ibm-plex-sans` (5.3.0): OFL-1.1 (IBM Plex Sans weights 400, 500, 600, 700, self-hosted from this site's static assets)
- `@fontsource/ibm-plex-mono` (5.3.0): OFL-1.1 (IBM Plex Mono weights 400, 500, self-hosted from this site's static assets)
- `@fontsource/archivo` (5.3.0): OFL-1.1 (Archivo weight 800 only, self-hosted from this site's static assets for the Seatbelt Labs wordmark)

## Licensing

Documentation prose is licensed under CC BY 4.0 ([LICENSES/CC-BY-4.0.txt](LICENSES/CC-BY-4.0.txt)). Site source code, scripts, configuration, and code blocks are licensed under Apache-2.0 ([LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt)). See [LICENSE.md](LICENSE.md).
