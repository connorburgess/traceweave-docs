---
title: Roadmap and status
description: Gate-by-gate progress counts from ROADMAP.md (version 2), implementation track status, and owner decisions.
section: Project
status: Active research roadmap v2 (updated 2026-11-22 / decisions 2026-11-23)
---

Traceweave tracks progress through verifiable **gates** rather than dates or milestone narratives ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)). No release dates and no detection accuracy promises are made.

## How progress is counted

Every gate has a type, a verifiable criterion, an owner (**S** = spec repo, **I** = implementation repo), and a status:

- **E (engineering):** closes only when **met** with committed evidence anyone can recheck from a clean clone.
- **R (research question):** closes when **met** or **negative-result** (a negative result is a valid answer).
- **O (owner decision):** closes when a decision record exists.

Checkpoints, evidence reviews, and dry runs are progress records and do not close gates on their own.

## Progress count summary

Counts from [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md#progress-count):

| Gate group | Total | Met | Negative-result | Open |
| --- | --- | --- | --- | --- |
| **Core M0–M5** | 47 | **11** (`M0.1`, `M0.2`, `M0.3`, `M0.4`, `M2.5`, `M2.8`, `M2.10`, `M2.11`, `M3.0`, `M4.1`, `M4.2`) | 0 | **36** |
| **Later profiles, EXT and RC** | 41 | **3** (`IMGF.2`, `IMGF.3`, `IMGF.4`) | 0 | **38** |

The synthetic carrier records (`SYN.1`–`SYN.5`) are research records and are not counted in the 47 core gates.

## Core milestones (M0–M5)

| Milestone | Scope | Met gates | Open gates | Key status notes |
| --- | --- | --- | --- | --- |
| **M0 — Explain and bound** | Use cases, discovery lanes, example matrix, repo validator | `M0.1`–`M0.4` (4/4) | None | Complete. 13/13 capability verification plans verified by non-author recount; `tools/validate.py` + 6 unit tests pass. |
| **M1 — Freeze one code experiment** | First case-study code profiles (Go and Rust), vectors, schemas, two independent implementations, MUST map | 0/6 | `M1.1`–`M1.6` | Draft promotion to `spec/`, `schemas/`, `profiles/`, `test-vectors/` approved and in progress; Rust & Go extractors match vendored vectors (9.89M differential cases), awaiting strict public spec pin (`M1.4`), item map (`M1.1`), and MUST requirement map (`M1.5`). |
| **M2 — Local comparison** | Offline walkthrough, positive/control fixtures, deterministic reports, storage boundary, boilerplate suppression, distinct-hash evidence | `M2.5`, `M2.8`, `M2.10`, `M2.11` (4/11) | `M2.1`–`M2.4`, `M2.6`, `M2.7`, `M2.9` | Containment vs Jaccard (`M2.5`), private storage boundary + 3/3 fault injection (`M2.8`), explicit boilerplate catalogue (`M2.10`), and distinct-hash evidence (`M2.11`) are **met**. Still needed: `scripts/offline` wrapper (`M2.1`), frozen manifest (`M2.2`), vendor control class (`M2.3`, `M2.6`), B10 clean-clone rebuild (`M2.4`), review packets (`M2.7`), and candidate-generation sidecar record (`M2.9`). |
| **M2E — Embed and detect** | Select or omit carrier, eligible subset, behavior checks, mark-record schema, controls | 0/8 | `M2E.0`–`M2E.7` | `M2E.0` (owner decision to select a carrier or omit embedding) is open. Lane 06 found no code carrier ready for `M2E.1`. |
| **M3 — Measure usefulness** | False-alarm budget, corpus manifest, disjoint splits, ancestor freeze, held-out report, rerun, computed verdict | `M3.0` (1/7) | `M3.1`–`M3.6` | `M3.0` **met**: budget 1 in 20 per unordered repository search (alarms ≤ 6 of 132 held-out searches). Corpus acquisition approved (48 repos), but **no corpus has been acquired and M3 has not been run**. |
| **M4 — Verify evidence** | Go/Rust DSSE interop, commitments, negative crypto vectors, two strict parsers, in-toto/trust policy, commitment review | `M4.1`, `M4.2` (2/6) | `M4.3`–`M4.6` | Bounded DSSE interop (66 outcomes) and native Go/Rust commitments (50 outcomes) are **met**. Negative vectors (`M4.3`), two independent strict parsers (`M4.4`), trust policy/timestamp decision (`M4.5`), and non-author review (`M4.6`) remain open. |
| **M5 — Candidate release** | Full MUST map, README claim audit, clean-clone demo, release notes, conformance matrix | 0/5 | `M5.1`–`M5.5` | Not started; depends on M1–M3 (and M4 if signing is claimed; otherwise labelled unsigned detector-only). |

## Later profiles, adapters, EXT, and RC

| Track | Scope | Met | Open | Status summary |
| --- | --- | --- | --- | --- |
| **TS** (TypeScript/JS) | Profile (`TS.1`), hand vectors (`TS.2`), two implementations (`TS.3`), own M3 split (`TS.4`) | 0/4 | `TS.1`–`TS.4` | `ts-tokens` (`draft-2`) profile & vectors promoted and frozen for stage 1; `tsx-tokens` deferred. Implementation gates open. |
| **IMGF** (Image fingerprints) | Profile (`IMGF.1`), PDQ/ISCC reference vectors (`IMGF.2`), frozen protocol (`IMGF.3`), 200-image synthetic check (`IMGF.4`), C++ comparison (`IMGF.5`), real-image false-match study (`IMGF.6`) | `IMGF.2`, `IMGF.3`, `IMGF.4` (3/6) | `IMGF.1`, `IMGF.5`, `IMGF.6` | Synthetic contract check `e-img-f-2` completed and independently rechecked. `IMGF.6` (real images) is owner-gated. |
| **IMG** (Image marks) | UC-7 (`IMG.0`), pins/licences (`IMG.1`), offline run (`IMG.2`), frozen protocol (`IMG.3`), measured run (`IMG.4`), shared record (`IMG.5`) | 0/6 | `IMG.0`–`IMG.5` | Synthetic images and permissive weights approved (2026-11-23); Lane 12 licences cleared; protocol `e-img-m-2` frozen and reviewed to start; measured run not yet committed in the published checkout. Real images, non-commercial weights, and GPU spend remain owner-gated. |
| **TXT** (Text/prose) | UC-8 (`TXT.0`), profile (`TXT.1`), vectors (`TXT.2`), two implementations (`TXT.3`), repo-prose stage 1 (`TXT.4`), PAN-PC-10 (`TXT.5`–`TXT.6`), limits (`TXT.7`), text-mark negative result (`TXT.8`) | 0/9 | `TXT.0`–`TXT.8` | `text-plain` (`draft-1`) frozen for stage 1; `text-markdown` draft. `TXT.0`, `TXT.5` (PAN-PC-10 download), and `TXT.8` (any text-mark experiment) require owner action. |
| **BIN** (Binaries) | Primary-source review (`BIN.1`), scope decision (`BIN.2`) | 0/2 | `BIN.1`–`BIN.2` | Deferred after `M3.4`. |
| **RES** (Resolver threat model) | Threat model (`RES.1`), leakage study (`RES.2`), independent review (`RES.3`) | 0/3 | `RES.1`–`RES.3` | Deferred after `M3.4`. |
| **C2PA** | Version-pinned mapping (`C2PA.1`), round-trip fixtures with C2PA tool (`C2PA.2`), no-claim check (`C2PA.3`) | 0/3 | `C2PA.1`–`C2PA.3` | In progress by 2026-11-23 override; draft C2PA 2.5 mapping written, no C2PA tool run yet. |
| **SK** (Agent skill) | CLI wrapper (`SK.1`), canary leak check (`SK.2`) | 0/2 | `SK.1`–`SK.2` | Deferred after `I2`. |
| **STRUCT / KEYED** | Structural/semantic arm (`STRUCT.1`), keyed feature selection (`KEYED.1`) | 0/2 | `STRUCT.1`, `KEYED.1` | Deferred after `M3.4`. |
| **EXT / RC** | Named non-contributor review (`EXT.1`), release candidate gates (`RC.1`–`RC.3`) | 0/4 | `EXT.1`, `RC.1`–`RC.3` | Awaits core M1–M5 closure. |

## Implementation track status (Rust + Go)

Two independent implementations — a Rust primary CLI and a second Go implementation, both with hand-written lexers — live in a separate implementation repository (`traceweave`, local only per [docs/implementation-repo-plan.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/implementation-repo-plan.md)) as evidence that the specification can be implemented independently ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)):

- **I1 (Extraction):** merged and reviewed ([research/reviews/implementation-merge-i1-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/implementation-merge-i1-review.md)): 9.89M differential cases agree, and both reproduce vendored vectors. Exit gate still open until re-vendoring from the promoted public spec commit (`check-spec-pin --strict`).
- **I2 (Catalogue, comparison, report):** merged and reviewed ([research/reviews/implementation-merge-i2-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/implementation-merge-i2-review.md)): 76/76 report bodies, 5,000/5,000 clean-room pairs, and 10,311/10,311 differential cases agree. Exit gate open (`scripts/offline` missing; M2.1–M2.4, M2.6, M2.7, M2.9 open).
- **I3–I5 (Evaluation harness, DSSE verifier, embedding):** not started.

## Recorded owner decisions (2026-11-23)

From [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md#owner-decisions-2026-11-23):

1. **False-alarm budget (`M3.0`, met):** 1 in 20 per unordered repository search on the 48-repository corpus (132 held-out searches, met at ≤ 6 alarms); 1 in 100 tested on a larger corpus only if this passes.
2. **Corpus acquisition approved:** 48 Go/Rust repositories + mechanical replacements, stored outside every working tree (`$TRACEWEAVE_EVAL_DIR`), failing closed on licence recheck.
3. **Promotion approved:** reviewed drafts promoted to `spec/`, `schemas/`, `profiles/`, and `test-vectors/`.
4. **Public branch push:** rewritten public history pushed to `origin/roadmap-v2` (leaving `origin/main` untouched).
5. **Decided-in-draft items confirmed:** extraction bounds (`k ≤ 16`, `w ≤ 128`, `maxInputBytes ≤ 8 MiB`), explicit boilerplate catalogue (`OD-C5`), distinct-hash minimum evidence, comparison bounds, JSON nesting depth 64, A5–A8 behavioral rules, `ts-tokens` stage-1 decisions, and `text-plain` stage-1 decisions.
6. **Image mark study & C2PA opened:** synthetic images and permissively licensed weights approved for `IMG.1`–`IMG.5`; `C2PA.1`–`C2PA.3` started ahead of M4.

### Still owner-blocked

- `M2E.0` (select a code carrier or omit embedding from the next release)
- Real-image sets (`IMGF.6` and any real-image mark run), non-commercial/unclear weights, and GPU spend
- `TXT.0` (UC-8 wording), `TXT.5`–`TXT.6` (PAN-PC-10 download), and `TXT.8` (any new text-mark experiment)
