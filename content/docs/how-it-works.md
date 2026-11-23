---
title: How it works
description: Extraction, catalogues, comparison, and deterministic reports walked through using published Traceweave test vectors.
section: Overview
status: Experimental draft (extraction draft-1, catalogue/report draft-2)
showWinnowingDiagram: true
---

Traceweave's current token-fingerprint baseline runs in three deterministic stages: **extraction**, **catalogue construction**, and **catalogue-only comparison** ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md), [spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Every step is defined down to exact bytes so that independent Rust and Go implementations emit byte-identical outputs.

## Stage 1: Extraction

Extraction maps `exact configuration bytes + input bytes` to either an `ok` result, an `insufficient-tokens` abstention (fewer than `k` tokens), or an explicit `error` from a closed per-profile code list with no silent repair ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)).

### Configuration binding and validation order

Every extraction is bound to the exact canonical bytes of its configuration JSON (one line, fixed key order, trailing LF). For Go (`go-tokens`, `draft-1`), the shipped configuration bytes are:

```json
{"contract":"traceweave-token-winnow-draft-1","profile":"go-tokens","profileVersion":"draft-1","channels":["exact","normalized"],"k":5,"window":4,"hash":"sha256-first8-u64be","maxInputBytes":1048576}
```

Its SHA-256 (`configSha256`) is `dfbc5fe3517e9da65189cf2ef32c4655b5ec662441f2e71f508543a0a5c8f7b2` ([test-vectors/extraction/config-go.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/config-go.json)). Confirmed bounds are `k` in `1..16`, `window` in `1..128`, and `maxInputBytes` in `1..8,388,608` (8 MiB), with O(N) time and working memory required ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)).

Checks execute in strict order; the first failure decides the result:
0. **Configuration** (`unsupported-config`, offset `null`, input unread)
1. **Size** (`input-too-large`, offset `0`, input SHA-256 and length left `null`)
2. **UTF-8 encoding** (`invalid-utf8` under Unicode 17.0.0 D92)
3. **Forbidden code points** (`bom` U+FEFF and `nul` U+0000 for Go/Rust/TS; Rust also forbids `isolated-cr`; plain text accepts BOM and isolated CR)
4. **Lexical scan** using pinned Unicode 17.0.0 tables ([test-vectors/extraction/unicode-17.0.0-tables.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/unicode-17.0.0-tables.json)) — no parser, type checker, or macro expansion runs.

### Channels, k-grams, and winnowing

For Go and Rust, extraction produces two channels over the token stream ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)):
- **`exact`:** preserves each token's original bytes (`input[start:end]`), plus Go inserted semicolons with empty span `[e, e)` and value `;`.
- **`normalized`:** keeps token classes, keywords, punctuation, and Rust `'static`/`'_` lifetimes, while replacing every `ident` and literal value with `""` (not scope-aware).

Each k-gram `i` covering `k` consecutive channel tokens is serialized with 4-byte big-endian length prefixes (`LP(x)`):

```text
LP("traceweave/token-kgram/draft-1") || LP(profile) || LP(profileVersion) || LP(channel) || uint32be(k)
  || LP(class_i) || LP(value_i) || ... || LP(class_{i+k-1}) || LP(value_{i+k-1})
```

The hash is `sha256-first8-u64be` (first 8 bytes of SHA-256 as an unsigned 64-bit big-endian integer, rendered as 16 lowercase hex digits). It is **unkeyed** and provides no confidentiality.

Over the `m = max(0, n − k + 1)` k-gram hashes, winnowing slides a window of width `w`, picking the minimum hash in each window and breaking ties by selecting the **rightmost** position. If `1 ≤ m < w`, all `m` hashes form one partial window (`partialWindow: true`). Under identical configuration bytes, any unchanged run of at least `k + w − 1` tokens in a channel shares at least one fingerprint in that channel — a formal locality property of winnowing, not an accuracy rate.

## Worked extraction example (from published test vectors)

From [test-vectors/extraction/go.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/go.json), consider the small vector `go-exact-k`:

```go
return x + 1
```

With `k = 5, w = 4`:
1. **Lexing** yields 5 tokens (including Go's inserted semicolon at byte 12):
   - `keyword` `"return"` `[0, 6)`
   - `ident` `"x"` `[7, 8)`
   - `punct` `"+"` `[9, 10)`
   - `int` `"1"` `[11, 12)`
   - `punct` `";"` `[12, 12)` (`inserted: true`)
2. **Normalized values** erase `ident` and `int`: `["return", "", "+", "", ";"]`.
3. **k-grams & winnowing:** `n = 5` gives `m = 1` k-gram (position `0`, span `[0, 12)`). Because `1 ≤ m < 4`, `partialWindow` is `true` and position `0` is selected:
   - `exact` fingerprint: `abc28a1dff9b3756` at `[0, 12)`
   - `normalized` fingerprint: `6c5bd99b8f724a9c` at `[0, 12)`

For tie-breaking, vector `go-equal-minimum` (`x++\nx++\nx++\nx++\n`, 12 tokens, 8 k-grams) repeats hashes with period 3 (`55e1d04e...`, `d4aafb7b...`, `1d99e08d...`). In the window covering positions 2..5, `1d99e08d...` appears at both 2 and 5; the rightmost-minimum rule selects `5`, yielding `windowSelections: [2, 2, 5, 5, 5]` and retained fingerprints at `[2, 5]` ([test-vectors/extraction/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/README.md)).

## Stage 2: Catalogue construction

A catalogue (`traceweave-catalogue-draft-2`) gathers extraction records produced under **one** extraction configuration, discards tokens, token text, k-gram lists, window selections, and normalized values, sorts artifacts by opaque `id`, and serializes as RFC 8785 canonical JSON with no trailing newline ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)).

Every catalogue records:
- `catalogueVersion`, `profile` (`{configSha256, id, version}`), and `extractionConfig`
- `artifacts[]`: `id`, `sha256`, `byteLength`, `status`, `tokenCount` (or `error`), and per-channel `{fingerprints, kgramCount, partialWindow}`.

## Stage 3: Comparison and deterministic report

Comparison reads only a reference catalogue, a candidate catalogue, an optional suppression (boilerplate) catalogue bound by SHA-256, and the comparison configuration ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). The shipped experimental comparison configuration ([test-vectors/matching/comparison-config.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/comparison-config.json), SHA-256 `39345e9c...147333`) is:

```json
{"comparison":"traceweave-seed-merge-draft-2","modes":["exact","normalized"],"minRegionDistinctHashes":2,"mergeGap":4,"maxSeedsPerMode":100000,"maxRegionsPerMode":1000,"suppressionCatalogueSha256":"none"}
```

For each `(reference, candidate)` pair and each declared mode:
1. **Seeds:** form all pairs `(p, q)` where reference position `p` and candidate position `q` share a hash. Count `seedCount` before enumerating; if `seedCount > maxSeedsPerMode`, abstain with `seed-limit-exceeded`.
2. **Diagonal merging:** group seeds by diagonal `q − p`, sort by `p`, and merge consecutive seeds with `p_next − p ≤ mergeGap` into regions.
3. **Minimum evidence:** compute `evidence = distinctHashes − distinctCommonHashes` (repeated occurrences of one hash count once, so periodic code like `x++` cannot trigger a match on a single hash). A region is `reportable` when `evidence ≥ minRegionDistinctHashes`.
4. **Ambiguity and caps:** a reportable region is marked `ambiguous` if another reportable region uses any of its reference or candidate positions (computed over all regions before `maxRegionsPerMode` truncation).
5. **Mode outcome:** evaluated in fixed precedence order (`no-shared-fingerprints` → `seed-limit-exceeded` → `match` if any non-ambiguous reportable region exists → `ambiguous` → `below-minimum-evidence` → `common-only`).

## Worked comparison example: `go-function-in-host`

The published example report ([test-vectors/matching/example-report.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/example-report.json)) compares two Go inputs from [test-vectors/matching/extraction-go.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/extraction-go.json):

**Reference (`sum.go`, 40 tokens):**

```go
func sumPositive(values []int) int {
	total := 0
	for _, v := range values {
		if v > 0 {
			total += v
		}
	}
	return total
}
```

**Candidate (`host.go`, 100 tokens):** contains `package stats`, a `Point` struct and `String()` method, then the same `sumPositive` function verbatim, followed by `var names = map[string]bool{"a": true, "b": false}`.

**Result in `example-report.json`** (`bodySha256`: `081d860084af229d77137e32dedd9f40f7d0bbeca6b18424b6d51cc1d89ed3be`):

| Channel | Outcome | Seeds | Reportable regions | Reference span (bytes) | Candidate span (bytes) | `referenceInCandidate` | Whole-file `jaccard` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exact` | `match` | 14 | 1 (`ambiguous: false`) | `[16, 124)` | `[146, 254)` | `14 / 14` | `14 / 39` |
| `normalized` | `match` | 17 | 1 (`ambiguous: false`) | `[0, 126)` | `[130, 256)` | `17 / 17` | `17 / 42` |

Notice two properties visible directly in the output:
1. **Spans are lower bounds on copied bytes:** in `exact`, the first selected fingerprint starts at byte 16 (`(`) and the last ends at byte 124, whereas in `normalized` a fingerprint was selected at position 0, covering `[0, 126)` in `sum.go` and `[130, 256)` in `host.go`. Spans are never artificially widened from source text.
2. **Containment stays visible inside a larger host:** `14/14` shows every reference fingerprint appeared in `host.go`, while `14/39` reflects the larger host denominator separately (roadmap gate [M2.5](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md), met).
