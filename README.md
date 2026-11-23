# Traceweave documentation site

Public documentation website for [Traceweave](https://github.com/connorburgess/traceweave-spec), an experimental open specification (0.1.0-draft.1) for recognising your own content when it reappears elsewhere and producing evidence that someone else can re-run and check.

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
- Zero external runtime scripts, external fonts, cookies, analytics, databases, API routes, or environment secrets.
- Client-side search over a build-time static index.
- Light and dark themes following system preference, with an explicit toggle.

## Licensing

Documentation prose is licensed under CC BY 4.0 ([LICENSES/CC-BY-4.0.txt](LICENSES/CC-BY-4.0.txt)). Site source code, scripts, configuration, and code blocks are licensed under Apache-2.0 ([LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt)). See [LICENSE.md](LICENSE.md).
