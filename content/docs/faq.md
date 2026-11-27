---
title: Frequently asked questions
description: Plain answers about what Traceweave records, its scope, experimental status, research findings, and privacy boundaries.
section: Project
---

## Does this show something is mine?

Traceweave produces checkable facts about your work — exact byte digests, shared fingerprint spans, decoded mark bits, and signature checks ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md), [spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)). It does not lock content, and it does not make the call on ownership, authorship, or permission. What you do with the evidence is up to you.

Specifically:
- **A fingerprint match** shows that two files shared a sequence of winnowed token k-grams under a specific configuration. Common idioms, shared dependencies, independent implementations of the same specification, or historical copies can also match, and a match does not show which copy came first.
- **A signature or commitment** authenticates exact bytes under a key or shows that a disclosed catalogue matches a prior hash; anyone can sign or commit files they hold.
- **A decoded image watermark** shows that bits matching an expected payload were embedded in a candidate image. Because reviewed post-hoc encoders and decoders are public and unkeyed, anyone can copy a mark onto an unrelated image without the key ([research/drafts/image-mark-use-case.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-use-case.md)).

## What is the current status?

Traceweave is an experimental design draft (`0.1.0-draft.1`) ([README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md)). Currently 34 of 47 core roadmap gates (including all M0, M1, M2, and all 6/6 M4 gates `M4.1`–`M4.6`, plus `M2E.0`, `M3.0`, and `M5.1`–`M5.5`) and 29 of 55 later-profile gates (including `TS.1`–`TS.3` for `ts-tokens`, `PY.1`–`PY.3` for `py-tokens`, `TXT.1`–`TXT.3` and `TXT.7` for `text-plain`, `RES.1` resolver threat model, `C2PA.3` no-compatibility-claim check, `SK.1`–`SK.2` agent skill wrapper & 0-leak canary suite, `SK.3` local-first design only, and `WEB.0`–`WEB.3` including bounded browser-flow acceptance) are met, with 2 later-profile gates (`TXT.4` Stage 1 prose evaluation `e-txt-1` and `TXT.8` Unicode text carriers) closed as `negative-result` and 24 open ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)). Go, Rust, TypeScript (`ts-tokens`), Python (`py-tokens`, promoted to `profiles/python.md` and verified at `b5d981c`), and plain text (`text-plain`) are verified across two independent Rust and Go implementations; still-image fingerprint (`e-img-f-2`) and mark (`e-img-m-2`) synthetic runs are measured (with `IMG.5` finding-aid schema/fixtures and `C2PA.1` `org.traceweave.registration-link` reviewed, and Lane 15 audio/video scoping merged). Normative M4 registration (`spec/registration-record.md`, `spec/trust-policy.md`, `test-vectors/registration/`, `test-vectors/intoto-adapter/`) is implemented and verified offline-first in both Rust and Go (`5b9a881`, pinned to published spec `9cf78ee`, `356/356` vendored files, 0 divergences, 0 external dependencies), and the pure-Rust WebAssembly build (`crates/tw-wasm`, `51f29d7`) reproduces CLI outputs offline with 0 WASM imports and 0 network calls. These counts are from published `roadmap-v2` `b1177b6623ebcc218b5430ae35074ee9499b3c07`; `main` remains at `7e30cb7`. `IMGF.1` closes research specification only, `IMG.5` draft schema accommodation only, and the M5 closures do not imply release approval or full conformance. See the [pinned native demo](https://github.com/connorburgess/traceweave-spec/blob/d66e4b942c8ca7da1585cc5f19932456a82f5f1d/docs/release/offline-demo.md) and [conformance matrix](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/release/conformance-matrix.md) for exact evidence and limits. `SK.3` closes [design review only](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/sk3-design-gate-closure-4fa00c7.md); I1–I4 remain unresolved, and `SK.4`/`SK.5`, key/identity/policy defaults and namespace publication remain undecided. No adapter implementation, interoperability or hosting is established by that closure. The M3 held-out evaluation (`m3-eval-draft-10`) has not been run, and the two independent reference implementations (in Rust and Go) remain in a private repository.

## What is the accuracy or false-alarm rate?

Unmeasured so far. The M3 evaluation protocol (`m3-eval-draft-10`) has not been executed, no evaluation corpus has been acquired yet, and the evaluation harness is under review ([research/drafts/evaluation-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/evaluation-protocol.md)). Shipped parameters such as `k = 5, w = 4` (code) and `k = 8, w = 8` (prose) are experimental values chosen for hand-checkable test vectors, not calibrated thresholds.

The recorded `M3.0` false-alarm budget (**1 in 20** per unordered repository search, or ≤ 6 alarms in 132 held-out searches) is an operational acceptance target to test against, not a demonstrated error rate.

## Why are embedded marks not used for source code or prose?

Every mechanism tested or reviewed so far resets under cheap normalization ([Limits & threat model](/docs/limits-and-threat-model)):

- **Source code:** synthetic Go and Rust syntax carriers survived `gofmt` and `rustfmt` (55/55 nonzero states), but all 55/55 were reset by cheap canonicalization, same-context transplants decoded cleanly, a 4-repository census found zero established safe eligible sites (`SYN.1`–`SYN.5`), and none of five reviewed published code-watermarking systems cleared the project's carrier bar ([Lane 06](/docs/research/lane-06-code-carriers)).
- **Existing prose:** Unicode homoglyph and zero-width watermarks are erased by one deterministic canonical fold (`NFKC + UTS #39 skeleton + delete Default_Ignorable`), and neural lexical rewriting (AWT) alters the author's wording at ~4 raw bits per 80 words with no licence file ([Lane 09](/docs/research/lane-09-text-profile)).

The owner [decided to omit source-code embedding from the next release](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/decisions/code-embedding-decision.md), closing `M2E.0`. `M2E.1`–`M2E.7` remain deferred; any future candidate would need to pass `M2E.1` (including cheap normalization) before adoption.

## What about image watermarks?

Post-hoc still-image watermarks (TrustMark-Q and PixelSeal) were measured on 100 synthetic images per scheme under `e-img-m-2` ([Image mark study](/docs/research/image-mark-study)), closing gates `IMG.0`–`IMG.4`. Both matched 100/100 clean images and survived most edits, but keyless `reembed` transferred each mark onto an unrelated image **100/100** times for both schemes (and residual transplant succeeded 82/100 and 90/100; ReMark left 1/100 for TrustMark-Q). Because reviewed encoders and decoders are public and unkeyed, an image watermark acts as a **finding aid** rather than evidence of origin.

## Does Traceweave upload my source code or catalogues?

No. Local, offline extraction and comparison are the default, with no required remote server, registry, or public transparency log ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)).

Catalogues are still private artifacts: even though a catalogue contains no source text, its unkeyed 64-bit hashes and byte spans let anyone holding the catalogue test guessed snippets or confirm whole files via `sha256` ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Keep catalogues outside source checkouts by default.

## What does a `no-match` result mean?

`no-match` means insufficient matching evidence under the active profile and configuration ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)), not that reuse did not occur. Inserting or altering one token every `k − 1` tokens, heavy refactoring, cross-language porting, paraphrasing, translation, deep image cropping, or fragments shorter than `k + w − 1` tokens can all produce `no-match`.

## How does Traceweave differ from MOSS, JPlag, Dolos, SCANOSS, or C2PA?

The core token-matching algorithm is the same winnowing family as MOSS and sits alongside JPlag, Dolos, and SCANOSS; C2PA and in-toto are provenance and attestation formats rather than matchers. Traceweave focuses on an open, byte-deterministic, offline specification verified across independent implementations, keeping similarity observations, commitments, signatures, and origin context separate. See [Prior art](/docs/prior-art) for primary-source details.

## Can I try fingerprinting and report replay in the browser?

[Traceweave Shelf](https://shelf.traceweave.org) publishes Fingerprint, Catalogue comparison, Replay report and a Testing page at source `c0c34cc`. Replay report recomputes the comparison body from catalogues and configuration; checking spans against original content still needs the original bytes. Registration verification is a separate operation. [WEB.3 acceptance](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/web3-bounded-gate-closure-99a1a8b.md) covers a fixed fixture set, not all browser behavior. The testing page has six scoped Go operations and six synthetic demonstrations, three misses across both modes and two separate controls; ambiguity is not counted as a miss, and operations can produce invalid or behavior-changing Go. WEB.4–WEB.6 remain planned at published spec `b1177b6`; WEB.5 remains uncertified and M3 held. Native registration implementation evidence is private; this does not announce a public native signing tool.
