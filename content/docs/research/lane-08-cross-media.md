---
title: "Lane 08: Cross-media carrier architecture"
description: Primary-evidence comparison across code, text, images, and audio — shared evidence container versus medium-specific carriers.
section: Research & experiments
status: Evidence review & report audit (2026-11-22)
---

Lane 08 investigated whether Traceweave can share a single signal or architecture across code, text, still images, and audio ([research/lanes/08-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-evidence-review.md), [research/lanes/08-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-report-audit.md)).

## Architectural conclusion

**Share a common evidence container; do not assume a common physical signal, uniform bit capacity, or transferable confidence scale.** Every medium has distinct access requirements (generation-time versus post-hoc), coordinate systems, quality metrics (compiled tests, perplexity, PSNR, PESQ/SI-SNR), and cheap removal paths.

## Four-media primary-evidence comparison

All published metrics below are author-reported measurements from the cited papers, not independent replications ([research/lanes/08-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-evidence-review.md), [research/lanes/08-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-report-audit.md)):

| Medium / representative | Access & carrier | Raw / data capacity | Evidence & failure boundary |
| --- | --- | --- | --- |
| **Code** (Go/Rust synthetic controls) | Post-hoc syntax/naming choices; reference-assisted | Raw states only; no measured net authenticated payload | Survived `gofmt`/`rustfmt`; all 55/55 nonzero states erased by cheap normalization; same-context transplants decode; 4-repo census established 0 safe sites |
| **Text** (Kirchenbauer et al., ICML 2023; Apache-2.0) | **Generation-time** green-token logit bias (cannot mark existing human prose) | Presence test; no arbitrary identity payload | T5 span replacement lowers AUC from 0.998 to **0.838** at 0.5 budget (OPT-1.3B/C4); low-entropy failure explicit |
| **Image** (TrustMark, ICCV 2025; MIT repo `4c60b9fd`) | **Post-hoc** learned image residual | 100 raw bits → **61 data bits** under default `BCH_5` (35 ECC + 4 version bits), before identity/binding | Author remover **ReMark** lowers bit accuracy to **55%** at 48.5 dB PSNR (Table 3); `process_encode` silently truncates/pads without length checks; no transplant resistance |
| **Image** (Stable Signature, ICCV 2023; CC BY-NC code) | **Generation-time** diffusion decoder fine-tune | 48 bits (`τ = 41` for N=1 at FPR `10⁻⁶`) | Cannot mark existing images; non-commercial code licence (`CC BY-NC 4.0`) |
| **Audio** (WavMark v1, arXiv:2308.12770v1; MIT code `6ab3bf7c`) | **Post-hoc** invertible network over STFT | 32 raw bits per 1-second block (default 16 pattern + 16 payload) | 2.35% mean BER on 400 samples (Table 2); 0.50 accuracy at 1.25× speed in AudioSeal Table 3; `1/2^16` README heuristic is not a calibrated full-file false-alert rate |
| **Audio** (AudioSeal, arXiv:2401.17264v2; MIT code `1496f766`) | **Post-hoc** localized detector | 16-bit messages | Author Table 3 reports 0.99 accuracy at 1.25× speed and 0.98 after EnCodec (weight terms unchecked) |

## Proposed shared evidence container

Lane 08 proposed (non-normatively) five field groups that carry across media without collapsing medium-specific meaning ([research/lanes/08-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-evidence-review.md)):

1. **Artifact & config identity:** examined artifact SHA-256 and role, profile/version, implementation, configuration digest, model/checkpoint digest (if any), and reference availability.
2. **Region & coordinates:** medium-specific units (UTF-8 byte spans, pixel coordinates at stated width × height and orientation, or audio samples/sample rate) plus ambiguity status.
3. **Raw evidence & decoded payload:** kept as separate optional fields, with explicit decode errors, erasure, unsupported input, and abstention.
4. **Statistic & scope:** statistic name/value, threshold, calibration identifier, decision unit, and search scope — leaving confidence empty when uncalibrated and never multiplying mark and fingerprint scores as independent evidence.
5. **Provenance verdicts:** record resolution, exact signed bytes, signature validity, signer trust, and provenance claims kept separate.

## Audit of the incoming report

The audit ([research/lanes/08-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-report-audit.md)) **accepted** the shared-container/medium-specific-carrier split and noted C2PA's soft-binding lookup pattern, but **rejected** the report's proposed 3-modality study (35–45 A100 GPU-hours, generation-time models, CC BY-NC Stable Signature, invented recalls/abstention floors, and an internally contradictory claim that 0/10,000 negatives establishes FPR `≤ 10⁻⁴` or `10⁻⁶`, when rule-of-three bounds 0/10,000 only below `~3×10⁻⁴`). It also rejected merged status enums (`VERIFIED`, `UNWATERMARKED`, `confidence_score`).

**Resulting choice:** if a non-code mark study is authorized, still images with post-hoc TrustMark (and later PixelSeal from Lane 10) come first; audio stays deferred after M3.4 ([research/research-06-08-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/research-06-08-checkpoint.md)).
