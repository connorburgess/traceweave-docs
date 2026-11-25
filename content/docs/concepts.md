---
title: Start here & concepts
description: Core vocabulary and separation of concerns in Traceweave — fingerprints, embedded marks, catalogues, reports, outcomes, and provenance.
section: Overview
---

Traceweave is an open specification for recognising your own work when it turns up somewhere else, and for producing evidence of the match that anyone can re-run and check.

It is designed to cover any kind of work: source code, writing, images and audio. One shared evidence format sits underneath, with a profile for each medium. Your content never leaves your machine; only fingerprints are compared.

> [!NOTE]
> **Where it stands today:** source code is working end to end, with Go and Rust as the first two case studies. TypeScript, JavaScript and plain text are specified. Images have been measured in two studies. More languages, audio, and signed, timestamped registration records are planned. It is experimental and not yet evaluated on real-world data. (Sources: [README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md), [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md), [profiles/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/README.md).)

Beneath that shared model, Traceweave separates three distinct questions ([README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md)):

1. **Exact identity:** Which exact byte sequence does a record describe?
2. **Observed similarity or mark recovery:** Does another artifact contain similar token runs, similar image hashes, or bits matching a previously embedded mark?
3. **Verification and review:** What cryptographic signatures, signer trust policies, timestamps, or historical origin records support a review?

Keeping these questions separate is the central rule of [spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md). A valid signature authenticates bytes under a key; it does not establish how two works relate or who authored them.

## Fingerprints versus embedded marks

Traceweave treats extracted fingerprints, embedded marks, and provenance records as three separate mechanisms ([docs/use-cases.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/use-cases.md)):

| Mechanism | Modifies original content? | What it produces | Current status in draft |
| --- | --- | --- | --- |
| **Extracted fingerprint** | No | Profile-defined features (such as winnowed token k-gram hashes with byte spans, or perceptual image hashes) stored in a private catalogue | First two code case studies (Go and Rust) working end to end, and TypeScript (`ts-tokens`, `TS.3`), Python (`py-tokens`, `PY.3`), and plain text (`text-plain`, `TXT.3`; Stage-1 prose eval `TXT.4` closed as `negative-result`) verified across both independent Rust and Go implementations; image fingerprint draft tested on synthetic images |
| **Embedded mark** | Yes (before distribution) | Deliberately inserted state or payload recovered later from a candidate artifact | No code or prose carrier selected; synthetic Go/Rust carriers reset under cheap normalization; Unicode prose marks erased by canonical fold; synthetic image-mark study (`e-img-m-2`) measured (`IMG.0`–`IMG.4` met) and confirmed marks transfer without the key (100/100 keyless re-embed) |
| **Provenance record** | No (separate envelope or metadata) | Salted commitment to exact catalogue bytes, optional in-toto/DSSE signature, registration record with timestamp bounds, and separate trust/time checks | All 6/6 M4 gates met ([M4.1–M4.6](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)): normative registration ([spec/registration-record.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/registration-record.md), `draft-5` + §4.7/§9.1 `tw1-`) implemented and verified offline-first in both Rust and Go (`5b9a881`, pinned to `9cf78ee`, `356/356` files, 0 divergences, 0 external dependencies) |

An embedded mark and an extracted fingerprint are never interchangeable, and their outputs are never multiplied together as if they were independent statistical evidence ([research/lanes/08-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-evidence-review.md)).

## Catalogues

A **catalogue** (`traceweave-catalogue-draft-2`) stores the extracted fingerprints of one or more reference or candidate artifacts, bound to one exact extraction configuration ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)).

- **No source text is stored:** a catalogue omits source code, token text, token lists, normalized values, non-selected k-grams, window selections, timestamps, identities, licence data, and signatures.
- **Every examined artifact gets an entry:** including `ok`, `insufficient-tokens`, and `error` entries.
- **Private by default:** even without source text, the hashes are unkeyed 64-bit truncations of SHA-256. Anyone holding a catalogue can test guessed code snippets against it, confirm an exact file via its SHA-256 digest, or infer file structure from spans ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Catalogues must be handled like source code and kept outside source trees by default.

## Reports and outcomes

Comparison reads **only** catalogues and a comparison configuration — never source files — and emits a report document (`traceweave-report-draft-2`) split into two parts ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)):

- **`body`:** canonical JSON (RFC 8785 / JCS with sorted keys, no whitespace, no trailing newline). Two runs or two conforming implementations must produce identical bytes and an identical `bodySha256`.
- **`provenance`:** non-deterministic run metadata (implementation name, version, commit, `specCommit`, `bodySha256`, `comparisonConfigSha256`, optional claimed `generatedAt`), excluded from body-byte equality.

Every report, pair, and channel mode resolves to a closed outcome vocabulary:

| Level | Outcome class | Codes | Meaning |
| --- | --- | --- | --- |
| Report | `rejected` | `unsupported-comparison-config`, `suppression-catalogue-mismatch`, `malformed-catalogue`, `unsupported-catalogue`, `unsupported-profile`, `profile-mismatch`, `config-mismatch`, `mode-mismatch` | Input or configuration failed validation; no comparison ran |
| Pair | `not-compared` | `reference-extraction-error`, `candidate-extraction-error`, `insufficient-tokens` | At least one artifact could not be fingerprinted or had fewer than `k` tokens |
| Mode | `match` | `match` | At least one non-ambiguous reportable region reached `minRegionDistinctHashes` distinct non-common hashes |
| Mode | `abstain` | `seed-limit-exceeded`, `ambiguous` | Either total seeds exceeded `maxSeedsPerMode`, or every reportable region overlapped another reportable region on a reference or candidate position |
| Mode | `no-match` | `no-shared-fingerprints`, `below-minimum-evidence`, `common-only` | Insufficient matching evidence under the active parameters — never evidence that reuse did not happen |

### Containment versus whole-file similarity

Traceweave always reports directional fragment containment and whole-file Jaccard similarity as **separate unreduced integer fractions** ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)):

- `containment.referenceInCandidate`: shared distinct hashes divided by reference distinct hashes (`|H_R ∩ H_C| / |H_R|`).
- `containment.candidateInReference`: shared distinct hashes divided by candidate distinct hashes (`|H_R ∩ H_C| / |H_C|`).
- `similarity.jaccard`: shared distinct hashes divided by the union (`|H_R ∩ H_C| / |H_R ∪ H_C|`).

Separating these prevents a copied function embedded inside a much larger host file from disappearing behind a tiny whole-file denominator. For example, in `go-function-in-host`, `referenceInCandidate` is `14/14` while `jaccard` is `14/39` ([test-vectors/matching/example-report.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/example-report.json)). Fractions are raw counts and are never reduced or converted into probabilities.

## Provenance and review packets

Comparison reports record matching observations only; fields for ownership, signatures, trust, ranking, or context notes stay out of the report schema ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Instead:

- **Exact-byte commitments** (`sha256-salted-catalogue-v1`) bind a public record to private catalogue bytes using a 32-byte random nonce without disclosing the catalogue until opened ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)).
- **Attestations** use a restricted in-toto Statement v1 / DSSE envelope adapter to authenticate exact payload bytes; signature validity, signer trust, subject digest, and timestamp verification are reported independently ([spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)).
- **Origin review packets** (gate [M2.7](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md), met across the specification and both implementations) live in a separate record referencing a report's `bodySha256` and a region key `(reference id, candidate id, mode, first seed p, first seed q)`.
- **Shelf cards & `tw1-` references** (prototype; `shelf.traceweave.org` planned) present signed registration records across static sites, Markdown, CMSes, frameworks, and print — see [Embedding & Shelf compatibility checklist](/docs/embedding-and-shelf).

## Glossary

| Term | Definition |
| --- | --- |
| **Artifact** | An exact byte sequence identified by its SHA-256 digest and byte length ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)). |
| **Channel** | A profile-declared token view over an artifact. Go, Rust, and TypeScript declare `["exact", "normalized"]`; plain text declares `["exact", "folded", "skeleton"]` ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). |
| **Profile** | A versioned extraction specification (`id`, `version`, `configSha256`) that fixes exact lexing, character tables, channels, and error rules ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)). |
| **k-gram** | A contiguous sequence of `k` tokens in one channel stream, hashed with length-prefixed framing via SHA-256 truncated to its first 8 bytes as an unsigned 64-bit big-endian integer ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)). |
| **Winnowing** | Local fingerprint selection over sliding windows of `w` consecutive k-gram hashes, choosing the minimum hash and taking the rightmost position on ties ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)). |
| **Span** | A half-open UTF-8 byte interval `[start, end)` into the original input bytes. Spans never split a UTF-8 sequence and are never widened beyond matched k-grams ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)). |
| **Seed** | A pair of fingerprint positions `(p, q)` where reference position `p` and candidate position `q` share the same hash. Its diagonal is `q − p` ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). |
| **Region** | A maximal run of seeds on one diagonal whose consecutive reference positions satisfy `p_next − p ≤ mergeGap` ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). |
| **Suppression catalogue** | An explicit boilerplate catalogue bound by its SHA-256 in the comparison configuration. Any hash appearing in an `ok` entry of that catalogue is marked common and excluded from minimum-evidence counts ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). |
| **Commitment** | `SHA256(D || R || L || C)` over domain tag `D`, 32-byte private nonce `R`, 64-bit big-endian length `L`, and exact catalogue bytes `C` ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)). |
