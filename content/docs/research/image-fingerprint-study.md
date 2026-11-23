---
title: "Experiment: Image fingerprint run (e-img-f-2)"
description: Measured 200-image synthetic contract-and-record conformance run for PDQ and ISCC Image-Code v0, closing gates IMGF.2, IMGF.3, and IMGF.4.
section: Research & experiments
status: Measured contract check (gates IMGF.2–IMGF.4 met; synthetic images only, no natural-image rate claimed)
---

> [!WARNING]
> **Contract-and-record check only, not a natural-image accuracy measurement.** All counts below come from 200 procedurally generated synthetic images (shapes, gradients, texture noise) with fixed experimental thresholds (`T_pdq = 31`, `T_iscc = 7`) and **no pass line**. They do not establish a false-match rate or performance on real photographs ([RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-fingerprint/results/e-img-f-2/RESULTS.md)).

## Setup and validity conditions

Executed once as frozen (`e-img-f-2`, protocol digest `44a67a14c6e4c3028bd20a093896390c308a89cf92fc2d521c788346ad6b90c4`, frozen commit `6f39e50`) under OS network denial (`sandbox-exec` deny-network with bind/connect probe refused first), in two full independent runs on macOS arm64 / CPython 3.14.6, then independently rechecked ([research/experiments/image-fingerprint/results/e-img-f-2/RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-fingerprint/results/e-img-f-2/RESULTS.md), [research/reviews/image-profile-protocol-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/image-profile-protocol-review.md)).

| Condition | Result | Evidence / counts |
| --- | --- | --- |
| **V1** Reference vectors (`IMGF.2`) | **Pass** | 30/30 pinned ThreatExchange files; NumPy port = vendored reference 30/30; C++ within 10 bits 8/8 and quality equal 8/8; Python within 16 bits 12/12 (README) and 18/18 (unit tests); ISCC core 3/3 |
| **V2** Run-to-run determinism | **Pass** | `full-1` and `full-2` byte-identical (`resultsSha256`: `f4808162...c546`) |
| **V3** Cross-host agreement | **Not tested** | Single host (macOS arm64) |
| **V4** Port = vendor on every run image | **Pass** | **1,400 / 1,400** extractions equal, 0 mismatches in both runs |
| **V5** Record schema fit | **Pass** | 0 errors across 100 catalogue entries and 1,300 query lines in both runs |
| Runtime & memory | Completed (< 3,600 s limit) | Run 1: `856.4 s`, peak RSS `755,826,688 B`; Run 2: `841.4 s`, peak RSS `818,282,496 B` |

## Enrollment and negative queries

- **Catalogue:** 100 synthetic images. PDQ enrolled **98 / 100** (2 abstained as `low-quality`, quality ≤ 49). ISCC enrolled **100 / 100**.
- **Negatives (100 unseen synthetic images):**
  - **PDQ:** `0 / 100` within threshold (`99 no-match`, `1 abstain-low-quality`).
  - **ISCC:** `0 / 100` within threshold (`100 no-match`).

## Per-edit counts (no pass line)

Each of the 100 catalogue images received 12 deterministic edits (1,200 positive queries per extractor). Results are reproduced directly from [RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-fingerprint/results/e-img-f-2/RESULTS.md).

### PDQ (256-bit, experimental threshold ≤ 31, abstain quality ≤ 49)

| Edit | n | Correct match | No match | Abstained (low quality) | Ambiguous | Wrong top match | Any wrong entry within threshold |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `crop50` | 100 | **0** | 90 | 10 | 0 | 0 | 0 |
| `crop75` | 100 | **0** | 96 | 4 | 0 | 0 | 0 |
| `crop90` | 100 | **2** | 96 | 2 | 0 | 0 | 0 |
| `flip` | 100 | 98 | 0 | 2 | 0 | 0 | 0 |
| `jpeg30` | 100 | 98 | 1 | 1 | 0 | 0 | 0 |
| `jpeg50` | 100 | 98 | 0 | 2 | 0 | 0 | 0 |
| `jpeg75` | 100 | 98 | 0 | 2 | 0 | 0 | 0 |
| `jpeg90` | 100 | 98 | 0 | 2 | 0 | 0 | 0 |
| `png` | 100 | 98 | 0 | 2 | 0 | 0 | 0 |
| `resize25` | 100 | 98 | 0 | 2 | 0 | 0 | 0 |
| `resize50` | 100 | 98 | 0 | 2 | 0 | 0 | 0 |
| `screenshot` | 100 | **0** | 100 | 0 | 0 | 0 | 0 |
| **All 12 edits** | 1,200 | — | — | — | — | **0** | **0** |

### ISCC Image-Code v0 (64-bit, experimental threshold ≤ 7)

| Edit | n | Correct match | No match | Abstained (low quality) | Ambiguous | Wrong top match | Any wrong entry within threshold |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `crop50` | 100 | **0** | 100 | 0 | 0 | 0 | 0 |
| `crop75` | 100 | **5** | 95 | 0 | 0 | 0 | 0 |
| `crop90` | 100 | **69** | 31 | 0 | 0 | 0 | 0 |
| `flip` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| `jpeg30` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| `jpeg50` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| `jpeg75` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| `jpeg90` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| `png` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| `resize25` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| `resize50` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| `screenshot` | 100 | 100 | 0 | 0 | 0 | 0 | 0 |
| **All 12 edits** | 1,200 | — | — | — | — | **0** | **0** |

## What this run does and does not show

- **Demonstrates:** the extraction contract, deterministic two-run reproduction, offline execution, and vendor-vector conformance (`IMGF.2`–`IMGF.4` met). Note that ISCC's 100/100 on the synthetic `screenshot` edit is an artefact of its tolerant border trimmer removing the uniform 40 px grey pad used in the synthetic transform — real screenshot templates in external preprint `X1` dropped both PDQ and ISCC to 0% Recall@1 ([research/lanes/10-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-report-audit.md)).
- **Does not demonstrate:** natural-image false-match rates (`IMGF.6`, owner-gated), independent C++ PDQ agreement (`IMGF.5`, open), cross-host agreement, or adversarial evasion resistance.
