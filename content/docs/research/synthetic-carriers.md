---
title: Synthetic code carriers, fragments, and census
description: Measured Go and Rust carrier experiments (SYN.1–SYN.5), fragment recovery checks, and the four-repository eligibility census.
section: Research & experiments
status: Measured research records (negative & inconclusive results; not counted toward M2E gates)
---

The synthetic code-carrier studies (`SYN.1`–`SYN.5`) tested narrow syntax and naming carriers in Go and Rust against formatters, cheap normalization, fragment relocation, signal transplantation, and a four-repository public-code eligibility census. While the carriers survived `gofmt` and `rustfmt` (**55 of 55** nonzero states per language), cheap normalization reset all **55 of 55** states in both languages, same-context transplants decoded cleanly, and the four-repository census established **zero** safe eligible sites.

## Synthetic carrier experiments (`SYN.1`–`SYN.3`)

Executed and independently rerun on 2026-11-18 ([research/experiment-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiment-checkpoint.md), [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)):

| Record | Language / carriers | Clean & formatter result | Failure / removal result | Source |
| --- | --- | --- | --- | --- |
| `SYN.1` | Go (declaration order & local names) & Rust (declaration order & literal spelling) | **55/55** nonzero intentional insertions per language recovered after `gofmt` / `rustfmt` (62/62 total includes 7 already-zero states showing decoding only) | — | [research/experiment-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiment-checkpoint.md) |
| `SYN.2` | Functionality checks (marked outputs only) | Go: **124/124** (clean + formatted); Rust: **124/124** per build profile (**248** across debug/optimized). (248 Go and 372 Rust total compiled checks in checkpoint include attack outputs, excluded from `SYN.2`.) | — | [research/lanes/go-carrier-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/go-carrier-results.md), [research/lanes/rust-carrier-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/rust-carrier-results.md) |
| `SYN.3` | Cheap canonicalization | — | **Negative result:** all **55/55** nonzero states per language reset to zero; direct-return rewriting also removed all 62 Go carrier instances | [research/experiment-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiment-checkpoint.md) |

## Fragment localization and signal transplant (`SYN.4`)

Measured on 2026-11-21 ([research/fragment-policy-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/fragment-policy-checkpoint.md)):

| Lane | Queries and localization | Controls and interpretation | Source |
| --- | --- | --- | --- |
| **Go** | 24 main queries: **10** localized raw states, **14** abstentions; 30 definition spans checked; 22 compiled return checks | Complete narrow functions relocate; incomplete or ambiguous anchors abstain. **Same-context signal transfers decode cleanly (`SYN.4` negative result).** | [research/lanes/go-fragment-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/go-fragment-results.md) |
| **Rust** | 72 queries: **24** localized raw states, **48** abstentions; 60 localized symbols; 21 regression tests; 156 compiled checks across two build profiles | Closed synthetic hosts support original-byte localization, with explicit context and grammar limits. **Same-context signal transfers decode cleanly (`SYN.4` negative result).** | [research/lanes/rust-fragment-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/rust-fragment-results.md) |

The Go and Rust denominators test different synthetic query matrices and cannot be compared as language accuracy scores. Both experiments demonstrated why raw-state recovery, content alignment, signature validity, and signer trust must remain separate results.

## Four-repository public-code census (`SYN.5`)

Measured on 2026-11-21 under a frozen source-only protocol ([research/public-census-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/public-census-checkpoint.md), [research/public-census-plan.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/public-census-plan.md)). No acquired program, build script, macro, or dependency was executed:

| Language / repository | Primary files | Observed units | Narrow potential patterns found |
| --- | --- | --- | --- |
| Go: `go-spew` (library) | 8 | 63 parsed function declarations | 2 singleton literal assignments; 0 adjacent multi-assignment runs |
| Go: `hey` (application) | 6 | 32 parsed function declarations | 3 singleton literal assignments; 0 adjacent multi-assignment runs |
| Rust: `itoa` (library) | 2 | 16 lexical `fn` tokens; 138 numeric tokens | 0 canonical suffixed-`u32` spelling tokens or explicit `u32` declaration runs |
| Rust: `hexyl` (application) | 5 | 75 lexical `fn` tokens; 312 numeric tokens | 0 canonical suffixed-`u32` spelling tokens or explicit `u32` declaration runs |

**Outcome (`SYN.5`, inconclusive):** No full synthetic carrier shape matched, and **zero safe embedding eligibility** was established (the 5 Go singleton assignments were unassessed for scope/use safety). These four repositories are excluded from the future M3 held-out corpus.

## Decisions supported

1. Keep the Go and Rust syntax carriers as weak synthetic controls only — do not promote them to production profiles or build identity framing on top of them.
2. Prioritize the deterministic **extracted token-fingerprint comparison baseline** (`spec/extraction.md`, `spec/catalogue-report.md`) with source-code embedding [omitted from the next release by owner decision (`M2E.0`)](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/decisions/code-embedding-decision.md) and `M2E.1`–`M2E.7` deferred.
