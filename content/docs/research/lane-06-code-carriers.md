---
title: "Lane 06: Practical code carriers"
description: Primary-evidence review of SrcMarker, RoSeMary, and SEW, plus claim-by-claim audit of an incoming report proposing AST commutative-pair watermarking.
section: Research & experiments
status: Evidence review & report audit (2026-11-22)
---

> [!CAUTION]
> **Decision:** Do not select a Go or Rust production carrier or start a new code-embedding experiment from this review ([research/lanes/06-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/06-evidence-review.md)). None of the reviewed code-watermarking candidates clears the project's carrier bar ([research/research-06-08-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/research-06-08-checkpoint.md)).

## Primary candidates reviewed

All external papers and repositories were inspected read-only on 2026-11-22 without execution. None demonstrates a Go or Rust port or a minimum recoverable arbitrary fragment.

| Candidate | Primary source | Reported setup & results (author-run) | Decision-relevant boundary |
| --- | --- | --- | --- |
| **SrcMarker** | Yang et al., arXiv:2309.00860v2 (2024-01-02; IEEE S&P 2024); MIT repo `2fb71cf8` | Post-hoc learned variable substitution + AST transformation; 4 bits/function default. Execution pass rates 97.64 / 97.86 / 97.99% on C++/Java/JS MBXP (syntax-only on CSN). Attacks: 1–3 transforms or 25–100% renaming. | Bit accuracy and selected-benchmark checks, not semantic equivalence or net authenticated capacity. Static audit of `null_hypothesis_test.py` shows repo-level binomial test, not arbitrary fragment search across keys/catalogues. Cheapest plausible removal: binding-resolved renaming + deterministic structural normalization. |
| **RoSeMary** | Zhang et al., arXiv:2502.02068v3 (2026-08-11) | Post-hoc CodeT5-guided syntax/name selection, 4-bit messages, ZK verification framing. Table 6 reports post-refactor FPR **0.30** for both C++ and Java at a 3/4-bit threshold. | Cryptographic proof of extraction relation does not establish host ancestry or semantic safety. No pinned author implementation/licence located in bounded inspection. |
| **SEW** | Lim, Jin, Han, arXiv:2609.39414v1 (2026-09-30); MIT repo `3c873186` | Post-hoc keyed style rewriting + human-style frequency calibration on Python/Java/C++. Complete target reversal yields **0% detection** (§5.3); short/invalid inputs limited (App. H). | Keyed signal presence test, not arbitrary authenticated identity payload. Static code audit uncovered two decisive flags (below). |

Together with **CLASP** (reference-assisted, 2–32 bits tested, no typed safe subset or Go/Rust measurement) and **PLACEMARK** (Python-only; authors note Go loses the placement property) audited in Lane 07, all five code candidates failed to clear the project bar ([research/research-06-08-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/research-06-08-checkpoint.md)).

### Two static audit flags in SEW

Inspection of SEW's pinned source code (`3c873186`) found two gaps between paper phrasing and implementation ([research/lanes/06-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/06-evidence-review.md)):

- **Flag A (flipping budget discrepancy):** in `attacks/flip.py`, `atk_flip(q < 1)` picks a site with probability `q` and writes a uniformly random variant, so expected changed sites are roughly `q/2` rather than `q`, whereas `q >= 1` inverts every site. Thus `flip50` and `flip75` cannot be read as 50% or 75% actual inversion.
- **Flag B (guard soundness):** `E2Commutative.guard` excludes literal string operands for `+` but does not require identifier operands to have numeric type (unexecuted Java counterexample: `String s = "a"; s + 1` vs `1 + s` changes concatenation order), and `E1Compare.guard` marks array/field access as pure without whole-program effect or operator-overloading proofs.

## Audit of the incoming report

An external report proposed Nata'ala's AST invariant carrier (commutative operand orientation with Tree-sitter guards) as a "proven" blind Go/Rust carrier. The bounded claim-by-claim audit ([research/lanes/06-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/06-evidence-review.md)) **rejected** the recommendation on five blocking grounds:

1. **Unverified primary paper:** the cited Research Square DOI (`10.21203/rs.3.rs-10418588/v1`) returned HTTP 403 and supplied no pinned implementation or software licence.
2. **Syntax is not semantic safety:** Tree-sitter leaf/purity guards cannot prove operational equivalence; immutable local strings in Go remain order-sensitive under `+`, and Go's specification does not strictly order all expression operands left to right.
3. **Undefined blind extraction:** HMAC over `(ScopeIdentifier, ordinal i)` had no canonical operand-label rule, no synchronization under insertion/deletion or partial copy, and collapsed `x + x` (single visible state) into supposed binary sites.
4. **Cheap canonicalization defeats it:** sorting operands on a proved-safe commutative subset preserves behavior and erases orientation without knowing the key.
5. **Statistical and architecture errors:** `n ≥ 20, Z ≥ 3.09` has an exact fair-bit binomial tail of `0.001288` (exceeding the claimed `0.001` FPR); Traceweave does not prohibit local reference-assisted comparison and uses a salted SHA-256 commitment rather than a Merkle tree.

## Outcome for the roadmap

The coordinator recorded in [research/research-06-08-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/research-06-08-checkpoint.md) that no code-carrier experiment and no SEW falsification check will run now; the project remains on the extracted token-fingerprint comparison baseline unless a new primary-source candidate plausibly meets the bar (`M2E.1`).
