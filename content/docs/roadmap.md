---
title: Roadmap and status
description: Gate-by-gate progress counts from ROADMAP.md (version 2), implementation track status, and owner decisions.
section: Project
status: Draft 0.1.0-draft.1 · Active research roadmap v2 (updated 2026-11-23)
---

Traceweave tracks progress through verifiable **gates** rather than dates or milestone narratives ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)). No release dates and no detection accuracy promises are made.

## How progress is counted

Every gate has a type, a verifiable criterion, an owner (**S** = spec repo, **I** = implementation repo), and a status:

- **E (engineering):** closes only when **met** with committed evidence anyone can recheck from a clean clone.
- **R (research question):** closes when **met** or **negative-result** (a negative result is a valid answer).
- **O (owner decision):** closes when a decision record exists.

Checkpoints, evidence reviews, and dry runs are progress records and do not close gates on their own.

## Progress count summary

Counts from [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md#progress-count) (published commit `577f9ed`, 2026-11-23):

| Gate group | Total | Met | Negative-result | Open |
| --- | --- | --- | --- | --- |
| **Core M0–M5** | 47 | **19** (`M0.1`–`M0.4`, `M1.1`–`M1.3`, `M1.5`, `M2.1`, `M2.4`–`M2.8`, `M2.10`, `M2.11`, `M3.0`, `M4.1`, `M4.2`) | 0 | **28** |
| **Later profiles, EXT and RC** | 55 | **8** (`IMGF.2`–`IMGF.4`, `IMG.0`–`IMG.4`) | 0 | **47** |

The synthetic carrier records (`SYN.1`–`SYN.5`) are research records and are not counted in the 47 core gates. Among the 47 open later-profile gates, Python (`py-tokens` draft-1), TypeScript (`ts-tokens` draft-2), and plain text (`text-plain` draft-1) are frozen as specified, not yet implemented (`PY.1`–`PY.4`, `TS.1`–`TS.4`, `TXT.1`–`TXT.4`), and `WEB.0`–`WEB.6` and `SK.3`–`SK.5` are planned.

## Core milestones (M0–M5)

| Milestone | Scope | Met gates | Open gates | Key status notes |
| --- | --- | --- | --- | --- |
| **M0 — Explain and bound** | Use cases, discovery lanes, example matrix, repo validator | `M0.1`–`M0.4` (4/4) | None | Complete. 13/13 capability verification plans verified by non-author recount (`UC-7` added as row 14); `tools/validate.py` + unit tests pass. |
| **M1 — Freeze one code experiment** | First case-study code profiles (Go and Rust), vectors, schemas, two independent implementations, MUST map | `M1.1`, `M1.2`, `M1.3`, `M1.5` (4/6) | `M1.4`, `M1.6` | `M1.1` (13-item + 6-construct registration map in `profiles/code.md`), `M1.2` (183 hand-derived extraction vectors — 49 Go, 118 Rust, 10 exclusion-rule, 3+3 limits — with one-to-one paired rejections and 151 ±1 offset-shift checks), `M1.3` (schemas + required-field rejections), and `M1.5` (28-clause MUST requirement map, 0 unmapped) are **met** ([core gates review](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/core-gates-m1-m2-review.md)). Open (implementation-only): `M1.4` and `M1.6` (both lanes re-vendoring the updated M1.2 vectors and reproducing every exact rejection offset). |
| **M2 — Local comparison** | Offline walkthrough, positive/control fixtures, deterministic reports, storage boundary, boilerplate suppression, distinct-hash evidence | `M2.1`, `M2.4`, `M2.5`, `M2.6`, `M2.7`, `M2.8`, `M2.10`, `M2.11` (8/11) | `M2.2`, `M2.3`, `M2.9` | `M2.1`, `M2.4`, `M2.5`, `M2.8`, `M2.10`, and `M2.11` are **met**; `M2.6` (90 matching vectors: 84 `hand` with hand-written token streams + 6 `mixed`) and `M2.7` (draft-2 review-packet schema and 4 valid / 67 invalid fixtures; implementation follow-up under I2) are now **met** on the specification side ([core gates review](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/core-gates-m1-m2-review.md)). Open (implementation-only; specification side done): `M2.2` (frozen manifest `349bd149…`: 11 cases, 56 spans, 33 digests N/N), `M2.3` (report every control class including vendor), and `M2.9` (validate `candidate-generation.json` and build an index with two retrieval paths). |
| **M2E — Embed and detect** | Select or omit carrier, eligible subset, behavior checks, mark-record schema, controls | 0/8 | `M2E.0`–`M2E.7` | `M2E.0` (owner decision to select a carrier or omit embedding) is open. Lane 06 found no code carrier ready for `M2E.1`. |
| **M3 — Measure usefulness** | False-alarm budget, corpus manifest, disjoint splits, ancestor freeze, held-out report, rerun, computed outcome | `M3.0` (1/7) | `M3.1`–`M3.6` | `M3.0` **met**: budget 1 in 20 per unordered repository search (alarms ≤ 6 of 132 held-out searches). Protocol at `m3-eval-draft-10`; evaluation harness (`i3-eval` `07621b8`) passes 216 checks on stamped binaries at `af3af2b`, with the reviewer's final pass in progress. **No corpus acquired and M3 has not been run.** |
| **M4 — Verify evidence** | Go/Rust DSSE interop, commitments, negative crypto vectors, two strict parsers, in-toto/trust policy, commitment review | `M4.1`, `M4.2` (2/6) | `M4.3`–`M4.6` | Bounded DSSE interop (66 outcomes) and native Go/Rust commitments (50 outcomes) are **met**. Registration record design is at `draft-2` ([registration-record.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/registration-record.md), confirmation review pending; implementation blocked on owner decision on contacting external TSAs). `M4.3`–`M4.6` open. |
| **M5 — Candidate release** | Full MUST map, README claim audit, clean-clone demo, release notes, conformance matrix | 0/5 | `M5.1`–`M5.5` | Not started; depends on M1–M3 (and M4 if signing is claimed; otherwise labelled unsigned detector-only). |

## Later profiles, adapters, WEB, EXT, and RC

| Track | Scope | Met | Open | Status summary |
| --- | --- | --- | --- | --- |
| **TS** (TypeScript/JS) | Profile (`TS.1`), hand vectors (`TS.2`), two implementations (`TS.3`), own M3 split (`TS.4`) | 0/4 | `TS.1`–`TS.4` | `ts-tokens` (`draft-2`) profile & vectors frozen for stage-1 implementation (specified, not yet implemented); `tsx-tokens` deferred. Implementation gates open. |
| **PY** (Python) | Profile (`PY.1`), hand vectors (`PY.2`), two implementations (`PY.3`), own M3 split (`PY.4`) | 0/4 | `PY.1`–`PY.4` | `py-tokens` (`draft-1`) frozen for stage-1 implementation (`58c25a9`) after clean-room review (`0db8b44`) and registered in `spec/catalogue-report.md` (A13/A14); 107 vectors + 1,847/1,847 CPython 3.14.6 stdlib agreement. Specified, not yet implemented. |
| **IMGF** (Image fingerprints) | Profile (`IMGF.1`), PDQ/ISCC reference vectors (`IMGF.2`), frozen protocol (`IMGF.3`), 200-image synthetic check (`IMGF.4`), C++ comparison (`IMGF.5`), real-image false-match study (`IMGF.6`) | `IMGF.2`–`IMGF.4` (3/6) | `IMGF.1`, `IMGF.5`, `IMGF.6` | Synthetic contract check `e-img-f-2` completed and independently rechecked. `IMGF.6` (real images) is owner-gated. |
| **IMG** (Image marks) | UC-7 (`IMG.0`), pins/licences (`IMG.1`), offline run (`IMG.2`), frozen protocol (`IMG.3`), measured run (`IMG.4`), shared record (`IMG.5`) | `IMG.0`–`IMG.4` (5/6) | `IMG.5` | Measured synthetic run `e-img-m-2` committed and independently rechecked (0 mismatches in 7,500 queries): 100/100 clean matches for TrustMark-Q & PixelSeal, but 100/100 keyless re-embed and 82/90 residual transplant accepted — image marks serve as a finding aid, not evidence of origin. `IMG.5` (container vs profile record) open; real images and GPU spend remain owner-gated. |
| **TXT** (Text/prose) | UC-8 (`TXT.0`), profile (`TXT.1`), vectors (`TXT.2`), two implementations (`TXT.3`), repo-prose stage 1 (`TXT.4`), PAN-PC-10 (`TXT.5`–`TXT.6`), limits (`TXT.7`), text-mark negative result (`TXT.8`) | 0/9 | `TXT.0`–`TXT.8` | `text-plain` (`draft-1`) frozen for stage-1 implementation (specified, not yet implemented); `text-markdown` draft. `TXT.0`, `TXT.5` (PAN-PC-10 download), and `TXT.8` (non-author confirmation / any text-mark experiment) remain open. |
| **BIN** (Binaries) | Primary-source review (`BIN.1`), scope decision (`BIN.2`) | 0/2 | `BIN.1`–`BIN.2` | Deferred after `M3.4`. |
| **RES** (Resolver threat model) | Threat model (`RES.1`), leakage study (`RES.2`), independent review (`RES.3`) | 0/3 | `RES.1`–`RES.3` | Deferred after `M3.4`. |
| **C2PA** | Version-pinned mapping (`C2PA.1`), round-trip fixtures with C2PA tool (`C2PA.2`), no-claim check (`C2PA.3`) | 0/3 | `C2PA.1`–`C2PA.3` | In progress by 2026-11-23 override; draft C2PA 2.5 mapping updated to use the owned `org.traceweave` namespace; no C2PA tool run yet. |
| **SK** (Agent skill & A2A) | CLI wrapper (`SK.1`), canary leak check (`SK.2`), local-first A2A design (`SK.3`), A2A interop (`SK.4`), hosted-service owner decision (`SK.5`) | 0/5 | `SK.1`–`SK.5` | `SK.1`–`SK.2` deferred after `I2`; `SK.3`–`SK.5` planned (A2A registration/verification design drafted in `registration-record.md`, no implementation lane yet). |
| **STRUCT / KEYED** | Structural/semantic arm (`STRUCT.1`), keyed feature selection (`KEYED.1`) | 0/2 | `STRUCT.1`, `KEYED.1` | Deferred after `M3.4`. |
| **WEB** (Browser tool) | Owner start decision (`WEB.0`), Rust-to-WASM byte identity (`WEB.1`), zero-network offline check (`WEB.2`), CLI flow parity (`WEB.3`), live testing page (`WEB.4`), claim audit (`WEB.5`), keyboard & size budgets (`WEB.6`) | 0/7 | `WEB.0`–`WEB.6` | Planned, not started, no lane assigned; sequenced after `M3.4` (free to use, no accounts, no uploads). |
| **EXT / RC** | Named non-contributor review (`EXT.1`), release candidate gates (`RC.1`–`RC.3`) | 0/4 | `EXT.1`, `RC.1`–`RC.3` | Awaits core M1–M5 closure; name clearance (`RC.3`) remains open. |

## Implementation track status (Rust + Go)

Two independent implementations — a Rust primary CLI and a second Go implementation, both with hand-written lexers — live in a separate private implementation repository (`traceweave`, per [docs/implementation-repo-plan.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/implementation-repo-plan.md)) as evidence that the specification can be implemented independently ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)). CI passed on `af3af2b` (2026-11-23) with jobs `hygiene`, `check (ubuntu-latest)` (first passing Linux run), and `check (macos-latest)`, with `--version-json` in both CLIs and `check-spec-pin --strict --mirror` passing 43/43 against published commit `c06b214`:

- **I0 (Scaffold & pin):** **exit met.** `fmt`, `clippy`, tests, `vet`, `go test`, strict pin check (43/43), and conformance pass in both languages.
- **I1 (Extraction):** **exit met.** Both extractors reproduce every vendored extraction vector at pin `c06b214`, `check-vector-precedence` passes, and differentials agree 100% on two seeds (14.3M cases each). Gates `M1.4` and `M1.6` stay open while both lanes re-vendor the expanded `M1.2` vector set and match every exact rejection offset.
- **I2 (Catalogue, comparison, report):** **exit not met.** 76/76 earlier report bodies, I2 differentials 100% on two seeds, sabotage self-test 33/33, forgery self-test clean, and M2.4 rebuild 26/26 pass (`M2.1`, `M2.4`, `M2.5`, `M2.8`, `M2.10`, `M2.11` met; spec side of `M2.6` and `M2.7` met). Remaining implementation work: `M2.2`, `M2.3`, `M2.9`, the 7 new matching vectors, zero-width-conditional span validation, `M2.7` packets, and `scripts/walkthrough`.
- **I3 (Evaluation harness):** `i3-eval` commit `07621b8` passes 216 checks on stamped binaries at `af3af2b`; reviewer's final pass in progress ([evaluation-harness-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/evaluation-harness-review.md)), not yet cleared to run.
- **I4–I5 (Signing verifier, embedding):** not started.

## Recorded owner decisions (2026-11-23)

From [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md#owner-decisions-2026-11-23):

1. **False-alarm budget (`M3.0`, met):** 1 in 20 per unordered repository search on the 48-repository corpus (132 held-out searches, met at ≤ 6 alarms); 1 in 100 tested on a larger corpus only if this passes.
2. **Corpus acquisition approved:** 48 Go/Rust repositories + mechanical replacements, stored outside every working tree (`$TRACEWEAVE_EVAL_DIR`), failing closed on licence recheck.
3. **Promotion & publication executed:** reviewed drafts promoted to `spec/`, `schemas/`, `profiles/`, and `test-vectors/`, pushed to `origin/roadmap-v2` (leaving `origin/main` untouched), and re-vendored with strict pin checks passing 43/43.
4. **Decided-in-draft items confirmed:** extraction bounds (`k ≤ 16`, `w ≤ 128`, `maxInputBytes ≤ 8 MiB`), explicit boilerplate catalogue (`OD-C5`), distinct-hash minimum evidence, comparison bounds, JSON nesting depth 64, catalogue amendments `A1`–`A15`, extraction decisions `OD-23` and `Q10`, `ts-tokens` stage-1 decisions, and `text-plain` stage-1 decisions (owner may reopen any of them).
5. **Image mark study & C2PA opened:** synthetic images and permissively licensed weights approved for `IMG.1`–`IMG.5` (`IMG.0`–`IMG.4` now met via `e-img-m-2`); `C2PA.1`–`C2PA.3` started ahead of M4.
6. **Domain, sites, and planned tracks:** `traceweave.org` registered on 2026-11-23; `traceweave.org` and `docs.traceweave.org` live; Evidence Ledger visual identity selected; registration-over-marks direction (M4), A2A skills (`SK.3`–`SK.5`), and browser tool (`WEB.0`–`WEB.6`) added to the roadmap.

### Still owner-blocked

- `M2E.0` (select a code carrier or omit embedding from the next release)
- Real-image sets (`IMGF.6` and any real-image mark run), non-commercial/unclear weights, and GPU spend
- Contacting external time-stamping authorities, calendars, or public logs for registration records (`M4` / Lane 13)
- `TXT.0` (UC-8 wording), `TXT.5`–`TXT.6` (PAN-PC-10 download), and `TXT.8` (any new text-mark experiment)
- `PY` decided-in-draft confirmations and promotion to `profiles/`, `WEB.0` start decision, and `SK.5` hosted-service decision
