---
title: Contributing and licences
description: How to contribute to the Traceweave specification, run local validation, report security issues, and comply with the dual-licence split.
section: Project
---

## Contributing to the specification

The specification repository lives at [github.com/connorburgess/traceweave-spec](https://github.com/connorburgess/traceweave-spec) (active public branch: `roadmap-v2`). Guidelines from [CONTRIBUTING.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/CONTRIBUTING.md):

- **Start from a concrete use case:** name the affected draft sections, explain what changes, and cite primary sources for any external technical claim. Distinguish proposed mechanisms, measured results, and normative requirements.
- **Move formats, examples, and tests together:** wire-format changes must update schemas, valid examples, negative rejection cases, and version identifiers in the same change. Released identifiers will not be silently repurposed; draft identifiers may change before a stable release.
- **Profile proposals:** must specify deterministic extraction, supported inputs, matching semantics, hand-derived test fixtures, and known failures.
- **Numerical detection claims:** must include held-out evaluation and a stated false-alarm unit with denominators.
- **Keep private material out of contributions:** never submit private keys, real private catalogues, unpublished suspect content, or identifying investigation records. Use redistributable synthetic fixtures only, and keep similarity results scoped to observed technical matches.
- **Independent implementations are welcome:** any CLI or agent workflow is an optional interface, not a core conformance requirement ([spec/conformance.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/conformance.md)).
- **Contact:** [connor@seatbeltlabs.com](mailto:connor@seatbeltlabs.com).

## Checking the specification repository locally

Requires Python 3.11 or newer ([README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md)):

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
.venv/bin/python tools/validate.py
.venv/bin/python -m unittest discover -s tests -v
```

What `tools/validate.py` checks (offline, zero network requests):
- Draft schema structure, synthetic examples, and exact fixture digests
- Commitment openings (`test-vectors/commitment.json`) and DSSE PAE framing (`test-vectors/dsse-pae.json`)
- Promoted extraction, matching, TypeScript, and text vector checkers (each must exit 0)
- Local Markdown links

What CI and `tools/validate.py` do **not** establish: they do not authenticate a signer, validate a timestamp authority, run toolchain cross-checks (`Go`/`Rust`/`Node`), measure clone detection, or establish a false-positive rate ([CONTRIBUTING.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/CONTRIBUTING.md)).

## Security and private evidence

From [SECURITY.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/SECURITY.md):

- Traceweave is an experimental specification, not a security-reviewed detector.
- Keep real keys, private catalogues, nonces, and investigation material outside public repositories and public CI.
- Implementations must treat ingested files as hostile data: no source code execution, no automatic URL fetching from records, no uncontrolled symlink following, and strict parser, memory, file-size, and nesting-depth bounds.
- Report non-sensitive design issues via minimal repository issues; for confidential security issues, use GitHub private vulnerability reporting if enabled or ask the maintainer for a private channel before posting sensitive details.

## Licences

Both the specification repository ([LICENSE.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSE.md)) and this documentation website follow the same dual-licence split:

| Material | Licence | Full text |
| --- | --- | --- |
| **Specification prose and Markdown documentation** | Creative Commons Attribution 4.0 International (**CC BY 4.0**) | [LICENSES/CC-BY-4.0.txt](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSES/CC-BY-4.0.txt) |
| **Schemas, examples, test vectors, source code, scripts, configuration, and code blocks in documentation** | Apache License, Version 2.0 (**Apache-2.0**) | [LICENSES/Apache-2.0.txt](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSES/Apache-2.0.txt) |
| **Derived Unicode 17.0.0 data tables** (`unicode-17.0.0-tables.json`, `text-tables-17.0.0.json` in `traceweave-spec`) | **Unicode License v3** (Copyright © 1991–2026 Unicode, Inc.) | [LICENSES/Unicode-3.0.txt](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSES/Unicode-3.0.txt) |

Attribution for the specification may identify **"Traceweave contributors"** and link to [github.com/connorburgess/traceweave-spec](https://github.com/connorburgess/traceweave-spec). These licences cover the specification and documentation artifacts only; they do not change the rights in any external content processed by an implementation, and no claim of patent clearance or standards-body endorsement is made.
