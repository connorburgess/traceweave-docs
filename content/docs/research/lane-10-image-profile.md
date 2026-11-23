---
title: "Lane 10: Still-image profile evidence"
description: Primary-evidence review of image perceptual hashes (PDQ, ISCC, SSCD), image watermarks (TrustMark, PixelSeal, dwtDct), removal/forgery attacks, and the X1 benchmark audit.
section: Research & experiments
status: Evidence review & report audit (2026-11-22)
---

Lane 10 reviewed eight primary image-fingerprinting, watermarking, attack, and provenance families, then audited an external report bringing in three additional sources (`X1`–`X3`) ([research/lanes/10-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-evidence-review.md), [research/lanes/10-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-report-audit.md)).

## Primary families evaluated

| ID | Family | What it is | Strongest supported evidence (author-run) | Verdict for Traceweave |
| --- | --- | --- | --- | --- |
| **F1** | **PDQ** (Meta ThreatExchange, BSD) | 256-bit DCT perceptual hash + 0–100 quality score | Clusters 157 CopyDays originals + JPEG 75/50 at threshold 32; deep crops score at random-pair distances. | **Primary fingerprint baseline** (`IMGF`). |
| **F2** | **Jain et al.** (USENIX Security 2022) | Black-box evasion & FPR study of pHash, aHash, dHash, PDQ | On ImageNet (`N = 500k`), PDQ at `T = 70` reaches 0.11% FPR; black-box small-L2 evasion succeeded on **99.9%** of 1,000 images × 10 runs. | Fingerprint evasion ceiling. |
| **F3** | **SSCD** (CVPR 2022, MIT code) | Learned 512-d ResNet50 copy descriptor | DISC2021 (1M refs, 50k queries): `61.5 µAP`; weights carry **no licence**, DISC21 is CC BY-NC 4.0. | Outside shortlist (unlicensed weights / NC training data). |
| **F4** | **ISCC Image-Code v0** (`iscc-core`, Apache-2.0) | 64-bit DCT hash on 32×32 greyscale (ISO 24138) | Bit derivation specified; caller handles EXIF, alpha, border crop, greyscale, resize. | **Second fingerprint extractor** (`IMGF`). |
| **F5** | **invisible-watermark** (`dwtDct`, MIT) | Classical DWT-DCT block quantization | Fails resize 50%, rotate 30°, crop; no key, no ECC, decoder always emits bits. | **Negative control only** in `e-img-m-2`. |
| **F6** | **Zhao et al.** (NeurIPS 2024) | VAE / diffusion regeneration removal | Removes **>99%** of DwtDctSvd, RivaGAN, and SSL marks on 1,000 images at TPR@FPR=0.01 (TrustMark not tested). | Removal ceiling for marks. |
| **F7** | **TetherMark** (arXiv:2611.22345v1, unreviewed preprint) | Enrollment-relative relation check vs forgery | TrustMark-P baseline accepts **80.00%** (WmForger) and **90.83%** (WMCopier) over 240 attempts; relation check lowers this to 9.17% / 16.25%. | Forgery/transplant boundary evidence. |
| **F8** | **C2PA 2.4** | Signed provenance manifest with hard + soft bindings | Soft binding must never substitute for hard binding; 79 registered algorithms including `io.iscc.v0` and `com.adobe.trustmark.*`. | Provenance mapping only (`C2PA` gates). |

## Four changes from the Lane 10 report audit (`X1`–`X3`)

Auditing the incoming report against the 2026 open-licence soft-bindings benchmark preprint `X1` (Kazempourradi et al., arXiv:2610.04151v1 — an unreplicated vendor preprint by Original Pictures Technologies) and `X3` (Souček et al., *Pixel Seal*, arXiv:2512.16874v1) changed the plan in four concrete ways ([research/lanes/10-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-evidence-review.md#after-the-report-audit), [research/lanes/10-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-report-audit.md)):

1. **Natural-image fingerprint failures are already documented in `X1`:** PDQ gave **267 false bindings in 26,820 never-registered queries (1.00% per query)** against a 98,985-item product registry; both PDQ and ISCC scored **0% Recall@1** on 70%-side crops and screenshot templates; PDQ scored **0%** on 15° rotation; and both were bit-identical across x86 and arm64 on 200 PNGs. Consequently, Traceweave replaced its 2,000-image `e-img-f-1` proposal with the smaller 200-image contract-and-record check [`e-img-f-2`](/docs/research/image-fingerprint-study).
2. **Blind BCH decoding is not presence evidence:** `X1` Table 8 showed blind TrustMark BCH decoding yields false positives on **5.9–15.3%** of 85 unmarked sources (e.g. `8/85` for variant Q). Any mark study must therefore use an **expected-payload k-of-n agreement test** over keyed bits rather than blind decode success.
3. **PixelSeal joins TrustMark-Q as a co-candidate:** post-hoc 256-bit residual watermark with MIT code and README-stated MIT weights (`X3`), subject to licence verification (completed in Lane 12) and SA-1B training-data owner review.
4. **Watermarking moves ISCC hashes:** `X1` §6 reported watermarking altered ISCC Image-Codes on **62.0%** of images (versus 0.3% for PDQ), meaning any combined workflow must register the fingerprint of the *marked* asset.

The audit **rejected** the report's conflation of video-only x86/ARM bit flips with still images, its "peer-reviewed" label for an unreplicated preprint, its misattribution of TetherMark's 9.17%/16.25% rates to conventional watermarks, and its invented acceptance gates.
