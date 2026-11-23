---
title: Governance
description: How decisions are recorded, how independent review works, and how to contribute or report problems in Traceweave.
section: Project
status: Open, non-commercial, independent specification
---

Traceweave is an **open, non-commercial, independent specification**. It has no standards-body endorsement, no certification program, and no paid service requirements ([CONTRIBUTING.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/CONTRIBUTING.md), [LICENSE.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSE.md)).

## How decisions are recorded

Project decisions are tracked publicly in the specification repository through two mechanisms in [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md):

1. **The roadmap gate table:** Every milestone (`M0`–`M5`) and later profile track (`TS`, `IMGF`, `IMG`, `TXT`, `BIN`, `RES`, `C2PA`, `SK`, `STRUCT`, `KEYED`, `EXT`, `RC`) is broken into verifiable gates with an explicit ID, type, owner (**S** = specification repository, **I** = implementation repository), and status:
   - **E (engineering):** closes only when **met** with committed evidence that someone who did not do the work can recheck from a clean clone.
   - **R (research question):** closes when **met** or **negative-result**. A negative result is a valid, recorded answer.
   - **O (owner decision):** closes only when an explicit decision record is committed.
2. **Decision records:** Scope choices, parameter confirmations, false-alarm budgets, corpus approvals, and profile openings are recorded directly in [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md#owner-decisions-2026-11-23) with dates, options considered, and revisit conditions. Checkpoints and evidence reviews are progress records and do not close gates on their own; a gate's status changes only in the same commit as its committed evidence.

Items explicitly reserved for the project owner (such as publishing history, normative wire-format changes beyond approved promotion, corpus acquisition, false-alarm budget changes, choosing or omitting an embedded carrier under `M2E.0`, and real-image or model-weight approvals) are listed under [ROADMAP.md — Needs the owner](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md#needs-the-owner).

## How review works

Changes are accepted one reviewable unit per decision or capability, backed by a concrete use case, primary sources, normative delta, fixtures, measured results, and known failures ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md#how-work-is-accepted), [CONTRIBUTING.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/CONTRIBUTING.md)):

- **Independent review before acceptance:** Specifications, contracts, evaluation protocols, and experiment freezes undergo independent non-author review before changes are accepted or measured runs begin (for example, clean-room contract reviews, non-author recounts of verification plans under `M0.1`, protocol reviews before freezing `e-img-f-2` and `e-img-m-2`, and dispositioned findings in `research/reviews/`).
- **Evidence before claims:** Proposal documents, external research summaries, and synthetic fixtures are explicitly separated from measured results and normative requirements ([docs/sources.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/sources.md)).
- **Reproducibility checks:** Every pull request runs repository validation (`tools/validate.py`), unit tests, Markdown link checks, byte-identical vector regeneration, and repository hygiene checks. Stable conformance profiles require two independent implementations agreeing on positive and negative vectors ([spec/conformance.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/conformance.md)).

## How to contribute and report problems

- **Design proposals, bugs, and pull requests:** Open a minimal issue or pull request on the specification repository at [github.com/connorburgess/traceweave-spec](https://github.com/connorburgess/traceweave-spec). Follow [CONTRIBUTING.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/CONTRIBUTING.md) and run the local validation commands before proposing changes. Wire-format changes must move schemas, examples, negative fixtures, and version identifiers together.
- **Security and private-evidence reports:** Follow [SECURITY.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/SECURITY.md). Never post private keys, real private catalogues, nonces, unpublished suspect content, or identifying investigation records in public issues or pull requests. For confidential vulnerabilities, use GitHub private vulnerability reporting on the specification repository if enabled; if unavailable, ask the maintainer for a private channel without posting exploit details or sensitive material.
- **Licensing:** Contributions are made under the repository's dual-licence split: documentation prose under CC BY 4.0 and code, schemas, test vectors, examples, and configuration under Apache-2.0 ([Contributing & licences](/docs/contributing)).
- **Contact:** [connor@seatbeltlabs.com](mailto:connor@seatbeltlabs.com).
