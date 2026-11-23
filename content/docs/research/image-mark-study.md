---
title: "Experiment: Image embedded-mark study (e-img-m-2) & Lane 12 licences"
description: Licence audit (Lane 12), frozen expected-payload protocol e-img-m-2 for TrustMark-Q, PixelSeal, and dwtDct, non-author review confirmation, and why an embedded image mark is a finding aid and not evidence of origin.
section: Research & experiments
status: Frozen & reviewed to run in published checkout (no measured full run committed yet)
---

> [!CAUTION]
> **Status in the published specification checkout (`roadmap-v2`):** Protocol `e-img-m-2` is **frozen and cleared by non-author review to start** ([research/drafts/image-mark-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-protocol.md), [research/reviews/image-mark-protocol-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/image-mark-protocol-review.md)), with **no measured full run committed yet** in [research/experiments/image-mark/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-mark/README.md). Only dry-test smoke runs on 3 images per scheme are recorded in the published branch.

> [!WARNING]
> **An image mark is a finding aid, not evidence of origin.** Because TrustMark-Q and PixelSeal have public, unkeyed encoders and decoders, anyone can decode a marked image's bits and re-embed them into any unrelated image without knowing the creator's key. An accepted detection shows only that bits matching the expected payload were embedded in the candidate — never who embedded them or that the candidate derives from the original ([research/drafts/image-mark-use-case.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-use-case.md)).

## Lane 12: Pre-download licence audit

Before any model checkpoint was downloaded, [research/lanes/12-image-mark-licences.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/12-image-mark-licences.md) verified code, weight, and dependency licences (49 Python wheels pinned by SHA-256; 84 upstream source files pinned by SHA-256 and git blob ID; 6 model files totalling 1,379,468,804 bytes stored outside the repository under `$TRACEWEAVE_EVAL_DIR/models`):

| Candidate | Role | Code licence | Weight licence & pin notes | Decision |
| --- | --- | --- | --- | --- |
| **TrustMark, variant Q** (`adobe/trustmark@4c60b9fd`) | Candidate | MIT | MIT stated by licensor for downloaded model files; 5 files verified against publisher MD5s and pinned by SHA-256 (encoder, decoder, ReMark remover + 2 YAMLs) | **Cleared** |
| **PixelSeal** (`facebookresearch/videoseal@f12875a9`) | Candidate | MIT | MIT stated by licensor; 1 checkpoint (`1,237,429,197 B`) pinned via trust-on-first-use (TLS + size + recomputed S3 multipart ETag → SHA-256). Owner note: trained on SA-1B (confirm reading before any distribution decision) | **Cleared** |
| **invisible-watermark `dwtDct`** (`0.2.0`) | Negative control only | MIT | No weights used (classical block DCT; bundled RivaGAN ONNX files never loaded) | **Cleared** |
| **WmForger / VAE regeneration / Stable Signature** | Not used | MIT / CC BY-NC (Stable Signature) | Excluded for scope, extra weight licences, or non-commercial terms | **Not downloaded** |

## Frozen protocol `e-img-m-2`

Protocol `e-img-m-2` (self-excluding digest `cba3667307941766f19b2ff9141e89c154b1f9b53a01e11391135ffe8ab64110`) replaced `e-img-m-1`, which was retired unrun after the non-author review ([research/reviews/image-mark-protocol-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/image-mark-protocol-review.md)) caught two blocking issues:

1. **B1 — TrustMark bit independence:** TrustMark's 100 transmitted bits consist of 61 data bits, 35 linear BCH parity bits, and 4 fixed version bits (`0001`). Testing 74 of 100 transmitted bits violates the fair-coin independence assumption (effective tail `4.02 × 10⁻⁶`, nearly 5× the target `10⁻⁶`). `e-img-m-2` therefore tests **only direct HMAC output bits**:

| Scheme | Tested bits `n` | Threshold `k` | Analytic per-comparison bound `P(Bin(n, ½) ≥ k)` | Blind decode policy |
| --- | --- | --- | --- | --- |
| **TrustMark-Q** (`tm`) | **61** (raw positions 0–60 only; 100-bit agreement report-only) | **49** | `9.85 × 10⁻⁷` | Blind BCH validity recorded, never decisive |
| **PixelSeal** (`ps`) | **256** (`preds[0, 1:]`, detection channel excluded) | **167** | `6.22 × 10⁻⁷` | None |
| **`dwtDct`** (`dw`, control) | **32** | **30** | `1.23 × 10⁻⁷` | None |

2. **B2 — Honest framing of checks and keyless forgery:** zero accepts on unmarked, wrong-key, and wrong-entry queries (`P2`–`P4`, 39,900 comparisons per scheme) are explicitly labelled **implementation checks** (nearly certain by construction with HMAC payloads, not a measured false-accept rate), and `e-img-m-2` adds condition 20 (**`reembed` — keyless forgery**), decoding a marked image with the public decoder and re-embedding its bits into an unrelated host with the public encoder using no key.

### Planned conditions (100 synthetic entries + 100 hosts = 2,500 queries per scheme)

From [research/drafts/image-mark-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-protocol.md) §7:
- **Clean + 12 edits** imported byte-for-byte from `e-img-f-2` (`jpeg90`, `jpeg75`, `jpeg50`, `jpeg30`, `resize50`, `resize25`, `crop90`, `crop75`, `crop50`, `flip`, `png`, `screenshot`)
- **5 removal attempts:** TrustMark's `ReMark` remover, model-free `regen` (downscale + blur + JPEG 50 + upscale), `jpeg10`, `noisejpeg` (Gaussian σ=8 + JPEG 75), `rotate5` (5° counter-clockwise)
- **3 forgery / overwrite attacks:** literal residual `transplant` (`H + M − C`), **keyless `reembed`** (decode `M` with public decoder and embed into `H` with public encoder), and `overwrite` (re-mark `M` under key B, checked against both keys A and B)
- **Controls:** `wrongkey` (key B), `cover` (unmarked original), `host` (unmarked host), plus a 38.0 dB PSNR quality floor.

## Dry-test smoke observations (not measured results)

Before freezing `e-img-m-2`, the harness ran dry tests on 3 smoke images per scheme (seeds `3,000,000`–`3,000,002`; disjoint from the `2,000,000`–`2,000,201` experiment range), verified offline under `sandbox-exec` deny-network and independently reproduced by the non-author reviewer ([research/drafts/image-mark-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-protocol.md) §11, [research/reviews/image-mark-protocol-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/image-mark-protocol-review.md)):

- 22/22 unit tests passed; 3 smoke runs (including offline) were byte-identical (`resultsSha256`: `2d78db49...6ecd`).
- On the 3 smoke images: both TrustMark-Q and PixelSeal matched 3/3 clean images with 0 unmarked, wrong-key, or wrong-entry accepts.
- **Keyless `reembed` (dry test, n = 3):** accepted as the donor's entry on **3 of 3** smoke images for TrustMark-Q (61/61 bits via BCH) and **3 of 3** for PixelSeal (256/256 bits), and 1 of 3 for `dwtDct`. Residual `transplant` in the `e-img-m-1` smoke review also accepted on 3 of 3 for both candidates.
- The `dwtDct` negative control had PSNR 29.9–34.2 dB (below the 38.0 dB floor) and failed clean round-trip on 2 of 3 smoke images.

These dry-test counts come from 3 synthetic images and say nothing about rates. Protocol §6 states expectations `E1`–`E5` (that `reembed`, `transplant`, `ReMark`, and `overwrite` will succeed at high rates as expected limits, while `P1` ≥ 95/100 and `P2`–`P4` = 0 check clean recovery and implementation correctness), awaiting the full measured run on the 100-entry experiment range.
