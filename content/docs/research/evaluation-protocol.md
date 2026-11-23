---
title: "M3 evaluation protocol (m3-eval-draft-5)"
description: Frozen-before-data design for measuring Traceweave's Go and Rust token-fingerprint baseline on 48 public repositories — not yet run.
section: Research & experiments
status: Ready to freeze (not yet run; corpus not yet acquired)
---

Protocol `m3-eval-draft-5` ([research/drafts/evaluation-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/evaluation-protocol.md)) specifies how roadmap gates `M3.0`–`M3.6` will measure the first two code profiles — Go (`go-tokens`) and Rust (`rust2024-tokens`) — on 48 public repositories without tuning on held-out data.

**Status:** the M3 evaluation has not been run yet. No corpus has been acquired, no thresholds have been frozen, and every parameter in [spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md) and [spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md) remains experimental.

## M3.0 false-alarm budget (met, 2026-11-23)

- **Unit:** one **unordered repository pair** `{R, C}` of the same language in different owner groups, compared exhaustively across all eligible files in both `exact` and `normalized` modes.
- **Alarm definition:** *anything* other than `compared` + `no-match` in both modes on every pair counts as an alarm — including `match`, `ambiguous`, `seed-limit-exceeded`, `not-compared`, or a `rejected` body — so a configuration cannot pass by abstaining.
- **Budget (`M3.0`, decided 2026-11-23):** **1 in 20 (5%)** per unordered repository search. On the 48-repository corpus (24 per language, split into tuning and held-out sets yielding **132 held-out negative searches**), gate `M3.6` is **met** when alarms are **≤ 6 of 132** and recorded as **negative-result** above 6 ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)).
- **Statistical modesty:** 0 alarms in 132 searches gives an exact one-sided 95% binomial upper bound of `0.0224`, and 6 alarms (`0.0455`) gives `0.0877` (assuming independent searches; repositories share searches, and the disjoint 12-search bound at 0 alarms is `0.221`). A stricter `1 in 100` budget will only be tested on a larger corpus if the 1-in-20 run passes ([research/lanes/11-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/11-report-audit.md)).
- **No recall pass line:** recall by transformation and fragment-size bucket is reported with denominators and covered fractions, never converted into an invented pass/fail cutoff.

## Mechanical corpus selection and exclusions

From [research/drafts/evaluation-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/evaluation-protocol.md) §3–§4:

- **Pool & walk:** first 100 GitHub repositories per language (`Go`, `Rust`) matching `stars:>=2000 fork:false archived:false size:<=50000 created:<2023-11-22 pushed:>=2025-11-22`, ordered by `SHA-256("traceweave-m3-select-v1\n" || lowercase(full_name))` and walked deterministically until 24 per language are accepted (one repo per owner; permissive licences only, verified by a fail-closed licence classifier at acquisition; no corpus source code redistributed).
- **Exclusions:** the four census owners (`davecgh`, `rakyll`, `dtolnay`, `sharkdp`), development-exposed owners (`golang`, `rust-lang`), forks, dependency-linked repositories (`go.mod` / `Cargo.toml`), duplicate-content repositories, generated files, vendored/test directories, files > 1 MiB, lex-error files, and files with < 16 tokens (with an error bound if `lex-error` + `under-16-tokens` exceeds 5% of held-out files).

## Anti-leakage and freeze discipline

1. **Before freeze (`M3.3`):** no held-out file is fingerprinted, catalogued, or compared.
2. **Tuning grid (updated in `m3-eval-draft-5` after Lane 11):** 192 configurations across 12 `(k, window)` settings up to `k = 16`, with fold-S outcome counts run first before the protocol digest is filled in, and an explicit pre-declared rule for adding higher `minRegionDistinctHashes` values if needed.
3. **Git ancestry verification (`M3.3`):** the commits freezing the protocol digest, split file, and chosen configuration (`freeze.json`) must be verifiable git ancestors (`git merge-base --is-ancestor`) of the first held-out result commit.
4. **Nine lexical positive transformations:** `verbatim`, `ws`, `comments-strip`, `comments-add`, `fmt` (Rust only; Go `fmt` dropped), `rename`, `reorder`, `split-mix`, and `compound` (lexical only, not compilable copies, and explicitly **not** an adversarial or LLM-rewrite benchmark).
5. **Independent rerun (`M3.5`):** a second person must rerun M3.4 and obtain identical counts.
