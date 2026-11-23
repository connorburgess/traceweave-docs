---
title: "Lane 07: Fragment recovery and transplant resistance"
description: Primary-evidence review of synchronization codes, window calibration, and watermark stealing, plus audit of an incoming fragment-recovery report.
section: Research & experiments
status: Evidence review & report audit (2026-11-22)
---

Lane 07 examined how partial fragments, insertion/deletion edits, multiple-window search, and mark transplantation behave across formal coding theory and empirical watermarking studies ([research/lanes/07-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/07-evidence-review.md), [research/lanes/07-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/07-report-audit.md)).

## Primary sources reviewed

| ID | Source | Supported result | Boundary for Traceweave |
| --- | --- | --- | --- |
| **S1** | Haeupler & Shahrasbi, *Synchronization Strings*, arXiv:1704.00807v1 (STOC 2017) | Encoded insertion/deletion channels can approach rate `1 − δ − ε` by attaching synchronization symbols to ECC symbols; zero or multiple received symbols at an index are treated as erasures. | Formal channel construction only; no code-corpus survival measurement. Synchronization and framing consume usable carrier states, so no universal fragment-size floor exists. |
| **S2** | Kirchenbauer et al., *On the Reliability of Watermarks for Large Language Models*, ICLR 2024 (arXiv:2306.04634v4) | `WinMax` maximizes a contiguous-window score and must be empirically calibrated on non-watermarked text; counting repeated n-grams understates false positives relative to nominal p-values (App. A.3). | Author text experiments, not Go/Rust. Maximizing over windows, keys, and references changes the null distribution; a single-window p-value is never a full-search p-value or an ownership probability. |
| **S3** | Jovanović, Staab, Vechev, *Watermark Stealing in Large Language Models*, ICML 2024 (arXiv:2402.19361v2) | Learning from 30,000 watermarked responses achieves KGW2-SelfHash spoofing rates of **0.81–0.87** across displayed settings at nominal non-adversarial FPR `10⁻³` (Table 2). | Low benign false-alert rates do not imply low adversarial false attribution. Copying or synthesizing a signal does not require forging a signature. |
| **A1** | Wei et al., *TetherMark*, arXiv:2611.22345v1 (2026-11-17, unreviewed preprint) | Keyed, enrollment-relative relation check on 240 image subjects lowers WmForger and WMCopier forgery ASR from **80.00% / 90.83%** (TrustMark-P baseline) to **9.17% / 16.25%** (Table 1). | Image-only, author-run unreviewed preprint; does not reach zero attack success, needs per-instance reference enrollment, and tests forgery attacks rather than literal residual copying. |
| **A2** | Xu et al., *CLASP*, arXiv:2510.11251v2 (2026-04-20) | Reference-assisted clean bit accuracy 97.85–99.72% (2–32 bits tested); blind direct prediction collapses to **52.01%** on MBJP (Table 7 ablation). | Demonstrates real reference-assisted dependence for structural code marks; no typed safe subset or Go/Rust measurement. |
| **A3** | Mohamed, Fathy et al., *PLACEMARK*, arXiv:2610.21031v1 (2026-10-15) | Repository module placement (249–2,166 bits in 9/10 Python repos, 216 trials); renaming drives BER to 0.36–0.52. | Python only; authors state Go/Java bind directories to packages, losing the placement property. |

## Five outputs that must stay separate

Lane 07 established that any future fragment or mark detector must preserve five distinct outputs and never invent evidence from a reference or ECC decoder ([research/lanes/07-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/07-evidence-review.md)):

1. **Candidate localization:** original UTF-8 byte spans, with duplicate anchors reported as ambiguous rather than picking the first hit that authenticates.
2. **Observed raw symbols:** only symbols evidenced by candidate bytes; missing sites stay erasures.
3. **Decoded payload:** ECC reconstruction reported separately from observed symbols (never converting reconstructed bits into claimed observed byte spans).
4. **Payload authentication:** signature validity, signer trust, and exact-content binding reported separately.
5. **Historical inference:** never emitted by a detector; even an authenticated payload on checked bound bytes does not establish authorship or host ancestry.

## Audit of the incoming report

The audit ([research/lanes/07-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/07-report-audit.md)) **rejected** the report's proposed experiment and schema changes (`VERDICT_AUTHENTIC`, `VERDICT_TRANSPLANT`, `lineage_id`, `instance_relation`):

- It reused the commutative-pair carrier already rejected in Lane 06.
- It proposed a Merkle root relation channel with a `≥ 0.80` threshold — internally contradictory because a Merkle root is an exact binary commitment where a 50% fragment always fails.
- It invented unsupported thresholds (`τ_BER = 0.25`, `τ_rel = 0.80`, `τ_H = 4.5 bits`, `FPR ≤ 10⁻⁴` on 200 clustered synthetic modules).
- It misstated Reed–Solomon decoding (`RS(32,16)` repairs up to `n − k` erasures or `⌊(n − k)/2⌋` errors, not `(n − k)/2` missing blocks) and overclaimed that formatters erase all lexical marks (contradicted by `SYN.1`).

**What survived:** forgery and transplantation are failures distinct from erasure; reference-assisted extraction is a real dependency for structural code marks; and repository-placement marking has no Go applicability.
