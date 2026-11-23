---
title: Start here & concepts
description: Core vocabulary and separation of concerns in Traceweave — fingerprints, embedded marks, catalogues, reports, outcomes, and provenance.
section: Overview
status: Experimental draft (0.1.0-draft.1)
---

> [!WARNING]
> Traceweave is an experimental design draft (`0.1.0-draft.1`), not a standard and not production software. Its M3 held-out evaluation has not been run.

Traceweave separates three distinct questions ([README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md)):

1. **Exact identity:** Which exact byte sequence does a record describe?
2. **Observed similarity or mark recovery:** Does another artifact contain similar token runs, similar image hashes, or bits matching a previously embedded mark?
3. **Verification and review:** What cryptographic signatures, signer trust policies, timestamps, or historical origin records support a review?

Keeping these questions separate is the central rule of [spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md). A valid signature authenticates bytes under a key; it does not make a similarity claim true or establish authorship, permission, or infringement.

## Fingerprints versus embedded marks

Traceweave treats extracted fingerprints, embedded marks, and provenance records as three separate mechanisms ([docs/use-cases.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/use-cases.md)):

| Mechanism | Modifies original content? | What it produces | Current status in draft |
| --- | --- | --- | --- |
| **Extracted fingerprint** | No | Profile-defined features (such as winnowed token k-gram hashes with byte spans, or perceptual image hashes) stored in a private catalogue | Go and Rust extractors + comparator built in two reference implementations; TypeScript (`ts-tokens`) and plain text (`text-plain`) stage-1 profiles frozen; image fingerprint draft tested on synthetic images |
| **Embedded mark** | Yes (before distribution) | Deliberately inserted state or payload recovered later from a candidate artifact | No code or prose carrier selected; synthetic Go/Rust carriers failed cheap normalization; Unicode prose marks erased by canonical fold; image mark protocol (`e-img-m-2`) frozen for synthetic testing |
| **Provenance record** | No (separate envelope or metadata) | Salted commitment to exact catalogue bytes, optional in-toto/DSSE signature, and separate trust/time checks | Commitment opening and bounded Go/Rust DSSE interop measured ([M4.1, M4.2](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)); shipping verifier not built yet |

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

Comparison reports deliberately forbid ownership, signature, trust, ranking, and licence fields ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Instead:

- **Exact-byte commitments** (`sha256-salted-catalogue-v1`) bind a public record to private catalogue bytes using a 32-byte random nonce without disclosing the catalogue until opened ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)).
- **Attestations** use a restricted in-toto Statement v1 / DSSE envelope adapter to authenticate exact payload bytes; signature validity, signer trust, subject digest, and timestamp verification are reported independently ([spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)).
- **Origin and licence review packets** (planned under gate [M2.7](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)) will live in a separate record referencing a report's `bodySha256` and a region key `(reference id, candidate id, mode, first seed p, first seed q)`.

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
