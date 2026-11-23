---
title: "Lane 11: External design feedback audit"
description: Claim-by-claim audit of external critiques (Perplexity, Google research tooling, and a third-model critique) against primary sources and the Traceweave repository.
section: Research & experiments
status: Report audit (2026-11-23)
---

On 2026-11-23, Lane 11 audited two external design critiques of Traceweave (one from Perplexity with 45 listed citations, 23 used; one from Google's research tooling with zero citations) plus a third model's critique of the Google answer ([research/lanes/11-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/11-report-audit.md)). Every outside-world claim was checked against immutable primary papers, specifications, and source code commits.

## Top-level audit verdicts

- **Perplexity — keep as a checklist, with corrections:** 15 outside-world claims checked (1 contradicted: a "lossless" mapping to SCANOSS `.wfp` is impossible in either direction). Most criticisms of Traceweave (such as claiming seed merging was underspecified or abstentions were not reported separately) were artefacts of the short brief; the contracts already specify both.
- **Google — reject verdict and four of six recommendations:** numbers copied from other tools were mostly accurate, but its conclusions misread Traceweave's suppression mechanism, ignored `minRegionDistinctHashes` on a diagonal, wrongly claimed Unicode 17.0.0 was unreleased (released 2025-09-09), misstated Dolos's rolling hash as 64-bit (actually a 25-bit modulus `33,554,393`), and wrongly called Traceweave redundant with in-toto and C2PA (neither performs similarity matching).
- **What survived from both:** the empirical `k = 5` false-match risk is real and directly testable on tuning data before the M3 freeze, and adversarial / LLM-rewrite evaluation belongs in a follow-up gate after M3.4.

## Selected claims checked against primary sources

| Claim | Verdict | Primary basis ([research/lanes/11-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/11-report-audit.md)) |
| --- | --- | --- |
| "Raise `k` to 15–20 tokens; `k = 5, w = 4` causes rampant false positives" | **Unsupported mandate; testable** | No data offered. Published thresholds differ by unit: JPlag 8 tokens (Go/Rust), Dolos `k = 23` Tree-sitter paren/node tokens (`w = 17`), SCANOSS 30 bytes (`w = 64`). Also ignored that Traceweave requires `minRegionDistinctHashes` distinct non-common hashes on one diagonal. |
| "One inserted token every `k − 1` tokens breaks every k-gram" | **Supported (arithmetic)** | Period-5 insertion (4 kept, 1 inserted) puts an inserted token inside every 5-token window. |
| "Define a lossless mapping to SCANOSS `.wfp`" | **Contradicted** | `.wfp` needs file MD5, line numbers, and CRC32C of 30-byte grams; Traceweave catalogues store 64-bit SHA-256 token-k-gram hashes and byte spans with no source text. Lossy both ways. |
| "Verify exact/normalized spans before `match` to prevent 64-bit hash collisions" | **Infeasible & negligible at M3 scale** | Catalogues hold no source text. Upper bound on expected accidental 64-bit hash seeds across all 132 held-out M3 searches is `≤ 2.3 × 10⁻⁵` per channel. False alarms come from real equal token runs, not hash collisions. Span inspection belongs in the UC-2 review packet (`M2.7`). |
| "Evaluate on BigCloneBench (25k Java systems, 8M pairs)" | **Rejected** | Java only, BigCloneEval measures recall only (no precision), and Krinke & Ragkhitwetsagul (arXiv:2505.04311v2) found **93.3% unweighted (379/406) / 93.9% weighted** of WT3/T4 labels false. |
| "Replace SHA-256 with Karp–Rabin rolling hash for >4× speed" | **Rejected** | Breaks all vectors and `configSha256`, offers zero accuracy change (both 64-bit), and is easier to collide intentionally. |
| "132 searches cannot prove a low rate; 6 alarms has ~9–10% upper bound" | **Supported (already in protocol)** | Exact binomial for `N = 132`: 0 alarms → one-sided 95% upper bound `0.0224`; 6 alarms (`0.0455`) → one-sided 95% upper bound `0.0877` (two-sided `0.0963`), assuming independent searches. |
| "in-toto and C2PA make Traceweave redundant" | **Contradicted** | SLSA/in-toto is a build/statement attestation envelope; C2PA stores registered soft bindings for manifest recovery. Neither runs pairwise fingerprint comparison. |

## Concrete changes adopted into `m3-eval-draft-5`

Three tuning-stage changes were adopted before the M3 freeze ([research/lanes/11-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/11-report-audit.md), [research/drafts/evaluation-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/evaluation-protocol.md)):

1. **Fold-S outcome counts before freeze:** extend the timing pilot on tuning fold S to record outcome counts at `T = none` and `minRegionDistinctHashes = 2` for every `(k, window)` — answering the `k = 5` false-match question directly on tuning data, with a pre-declared rule adding `minRegionDistinctHashes` 8 and 12 if the strictest setting alarms in >50% of fold-S searches.
2. **Widen tuning grid to `k = 16`:** reaches the extraction contract bound (`192` configurations across 12 `(k, window)` settings), giving minimum match floors up to 21 tokens.
3. **Commit full fold-E table and blinded alarm-audit procedure** alongside `freeze.json`.

**Deferred to follow-up gates (after M3.4):** adversarial and LLM-rewrite benchmarks (requires owner approval for external models), a one-token-variant suppression vector, bag-of-tokens / SCANOSS comparison arms (`STRUCT.1`), keyed fingerprints (`KEYED.1`), resolver privacy additions (`RES.1`), and optional whole-file SWHID catalogue fields (`M5.5`).
