---
title: "Experiment: Image embedded-mark study (e-img-m-2) & Lane 12 licences"
description: Licence audit (Lane 12), frozen expected-payload protocol e-img-m-2, and measured synthetic results for TrustMark-Q, PixelSeal, and dwtDct closing gates IMG.0–IMG.4.
section: Research & experiments
status: Measured on synthetic images (gates IMG.0–IMG.4 met; IMG.5 open; no natural-image rate claimed)
---

Study `e-img-m-2` evaluates post-hoc still-image watermarks (TrustMark-Q, PixelSeal, and `dwtDct` as a negative control) under an expected-payload protocol after a pre-download licence and digest audit in Lane 12 ([research/drafts/image-mark-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-protocol.md), [research/lanes/12-image-mark-licences.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/12-image-mark-licences.md), [RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-mark/results/e-img-m-2/RESULTS.md)).

**Measured outcome and scope (`roadmap-v2`, commit `0ca3091`):** two identical full runs executed offline under `sandbox-exec` deny-network on 100 synthetic marked images and 100 synthetic hosts per scheme (7,500 queries total, `resultsSha256`: `6d87d2cc...70bb`), independently rechecked with **0 mismatches in 7,500 queries** ([research/reviews/image-mark-protocol-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/image-mark-protocol-review.md#results-recheck-e-img-m-2)). Both TrustMark-Q and PixelSeal matched **100/100** clean images and met P1–P4, closing gates `IMG.0`–`IMG.4`. However, keyless re-embed transferred the mark onto unrelated images **100/100** times for both learned schemes (and residual transplant succeeded **82/100** and **90/100**), confirming that an image watermark acts as a finding aid rather than evidence of origin ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md), [research/drafts/image-mark-use-case.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-use-case.md)). All counts are on synthetic images only and say nothing about natural photographs.

## Lane 12: Pre-download licence audit

Before any model checkpoint was downloaded, [research/lanes/12-image-mark-licences.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/12-image-mark-licences.md) verified code, weight, and dependency licences (49 Python wheels pinned by SHA-256; 84 upstream source files pinned by SHA-256 and git blob ID; 6 model files totalling 1,379,468,804 bytes stored outside the repository under `$TRACEWEAVE_EVAL_DIR/models`):

| Candidate | Role | Code licence | Weight licence & pin notes | Decision |
| --- | --- | --- | --- | --- |
| **TrustMark, variant Q** (`adobe/trustmark@4c60b9fd`) | Candidate | MIT | MIT stated by licensor for downloaded model files; 5 files verified against publisher MD5s and pinned by SHA-256 (encoder, decoder, ReMark remover + 2 YAMLs) | **Cleared** |
| **PixelSeal** (`facebookresearch/videoseal@f12875a9`) | Candidate | MIT | MIT stated by licensor; 1 checkpoint (`1,237,429,197 B`) pinned via trust-on-first-use (TLS + size + recomputed S3 multipart ETag → SHA-256). Owner note: trained on SA-1B (confirm reading before any distribution decision) | **Cleared** |
| **invisible-watermark `dwtDct`** (`0.2.0`) | Negative control only | MIT | No weights used (classical block DCT; bundled RivaGAN ONNX files never loaded) | **Cleared** |
| **WmForger / VAE regeneration / Stable Signature** | Not used | MIT / CC BY-NC (Stable Signature) | Excluded for scope, extra weight licences, or non-commercial terms | **Not downloaded** |

## Frozen protocol `e-img-m-2`

Protocol `e-img-m-2` (frozen commit `d3af1ee`, self-excluding digest `cba3667307941766f19b2ff9141e89c154b1f9b53a01e11391135ffe8ab64110`) replaced `e-img-m-1` after non-author review ([research/reviews/image-mark-protocol-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/image-mark-protocol-review.md)) caught TrustMark's non-independent BCH parity/version bits (B1) and required explicit `reembed` keyless-forgery testing and honest labelling of P2–P4 as implementation checks (B2):

| Scheme | Tested bits `n` | Threshold `k` | Analytic per-comparison bound `P(Bin(n, ½) ≥ k)` | Blind decode policy |
| --- | --- | --- | --- | --- |
| **TrustMark-Q** (`tm`) | **61** (raw positions 0–60 only; 100-bit agreement report-only) | **49** | `9.85 × 10⁻⁷` | Blind BCH validity recorded, never decisive |
| **PixelSeal** (`ps`) | **256** (`preds[0, 1:]`, detection channel excluded) | **167** | `6.22 × 10⁻⁷` | None |
| **`dwtDct`** (`dw`, control) | **32** | **30** | `1.23 × 10⁻⁷` | None |

## Validity checks (W1–W6) and pass lines (P1–P4)

Executed on 2026-11-23 on macOS 26.4 arm64, CPython 3.14.6, torch 2.11.0 CPU (Run 1: `4,295.2 s` / `3,425.0 MiB` peak RSS; Run 2: `5,996.4 s` / `3,305.7 MiB`, both under the `14,400 s` abort limit; cross-host equality not tested; [RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-mark/results/e-img-m-2/RESULTS.md)):

- **Validity checks W1–W6:** all **pass** (W1: 6/6 weights, 84/84 sources, 49 pinned packages, 0 deviations, 3/3 goldens; W2: `networkProbe.denied` true with `EPERM` in both runs; W3: `entries.jsonl`, `queries.jsonl`, and `resultsSha256` `6d87d2cc...70bb` byte-identical across runs 1 and 2; W4: 0 record-validation errors; W5: 100/100 payload round-trips per scheme; W6: `codeIdentity.ok` true at frozen commit `d3af1ee`).
- **Pass lines (candidates only; P2–P4 are implementation checks expected to be 0 by construction with HMAC payloads, not a measured natural-image false-accept rate):**

| Line | `tm` (TrustMark-Q) | `ps` (PixelSeal) |
| --- | --- | --- |
| **P1:** clean marked images matched (`≥ 95/100`) | **100 / 100 (pass)** | **100 / 100 (pass)** |
| **P2 (implementation check):** unmarked inputs accepted (`0` required) | `0 / 20,000` (pass) | `0 / 20,000` (pass) |
| **P3 (implementation check):** wrong-key accepts (`0` required) | `0 / 10,000` (pass) | `0 / 10,000` (pass) |
| **P4 (implementation check):** wrong-entry accepts (`0` required) | `0 / 9,900` (pass) | `0 / 9,900` (pass) |

## Measured per-condition counts (out of 100 entries per scheme)

Each cell is the count out of 100 entries accepted for its own entry (`correctMatch`, or attacker success `acceptedAsTrue` for `transplant`, `reembed`, and `overwrite`). Wrong-entry accepts were **0** across every condition and scheme, with 0 abstentions and 0 ambiguous results ([RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-mark/results/e-img-m-2/RESULTS.md)):

| Condition | `tm` (TrustMark-Q) | `ps` (PixelSeal) | `dw` (`dwtDct` control) |
| --- | --- | --- | --- |
| `clean` | 100 | 100 | 42 |
| `jpeg90` / `jpeg75` / `jpeg50` / `jpeg30` | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 98 | 1 / 0 / 0 / 0 |
| `resize50` / `resize25` | 100 / 100 | 100 / 100 | 51 / 3 |
| `crop90` / `crop75` / `crop50` | 100 / 100 / **14** | 100 / 100 / 100 | 0 / 0 / 0 |
| `flip` / `png` / `screenshot` | 100 / 100 / **51** | 100 / 100 / 100 | 0 / 42 / 0 |
| `remark` (TrustMark ReMark remover) | **1** | 99 | 42 |
| `regen` (model-free regeneration chain) | 100 | **74** | 0 |
| `jpeg10` | **48** | **18** | 0 |
| `noisejpeg` (Gaussian σ=8 + JPEG 75) | 100 | 100 | 0 |
| `rotate5` (5° counter-clockwise) | **25** | 100 | 0 |
| `transplant` (residual copy `H + M − C`, donor entry accepted) | **82** | **90** | 1 |
| `reembed` (keyless public decode + re-embed, donor entry accepted) | **100** | **100** | 17 |
| `overwrite` (original key-A payload still accepted / key-B accepted) | **0** / 100 | **0** / 100 | 0 / 47 |
| `wrongkey` (clean decodes checked against all 100 key-B payloads) | 0 | 0 | 0 |

### Marked-image quality (PSNR vs cover, dB; floor 38.0)

| Scheme | Min | 25th pct | Median | 75th pct | Max | Below 38.0 dB floor |
| --- | --- | --- | --- | --- | --- | --- |
| `tm` (TrustMark-Q) | 41.95 | 43.99 | 44.96 | 45.84 | 48.01 | **0 / 100** |
| `ps` (PixelSeal) | 49.96 | 51.01 | 51.55 | 52.18 | 55.94 | **0 / 100** |
| `dw` (`dwtDct` control) | 30.45 | 33.43 | 34.33 | 35.58 | 39.75 | **96 / 100** |

Report-only TrustMark blind BCH decoding was valid on 100/100 clean images and **6/100** unmarked covers (0/100 hosts), confirming why blind BCH is never used to decide matches.

## What the run establishes — and its limits

- **Synthetic images only:** counts are on 100 procedural synthetic images and 100 synthetic hosts; 0 of 200 unmarked sources bounds the per-source rate below 1.49% (one-sided 95%) for this generator only, and says nothing about photographs.
- **Removal and forgery counts are lower bounds:** the protocol omits learned forgers (such as WmForger), VAE/diffusion regeneration, collusion/averaging across marked images, optimization against the public decoder, and adaptive attack chains.
- **Marks are finding aids, not origin evidence:** because keyless `reembed` succeeded 100/100 for both TrustMark-Q and PixelSeal (and plain residual `transplant` succeeded 82/100 and 90/100), a decoded mark shows only that matching payload bits were present. Evidence of prior existence comes from a signed, timestamped registration record ([Evidence & provenance](/docs/evidence-and-provenance), M4).
- **Gate status:** `IMG.0`–`IMG.4` are **met**; `IMG.5` (where the six extra mark-record fields live relative to the Lane 08 container) remains open ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)).
