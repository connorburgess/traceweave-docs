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

Traceweave is an experimental design draft (`0.1.0-draft.1`) ([README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md)). Currently 25 of 47 core roadmap gates (including all M0, M1, and M2 gates plus `M4.1`, `M4.2`, and `M4.5`) and 13 of 55 later-profile gates (including `TS.3` for `ts-tokens`, `PY.3` for `py-tokens`, `TXT.3` and `TXT.7` for `text-plain`, and `C2PA.3` no-compatibility-claim check) are met, with 2 later-profile gates (`TXT.4` Stage 1 prose evaluation `e-txt-1` and `TXT.8` Unicode text carriers) closed as `negative-result` and 40 open ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)). Go, Rust, TypeScript (`ts-tokens`), Python (`py-tokens` at `b5d981c`), and plain text (`text-plain`) are verified across two independent Rust and Go implementations; still-image fingerprint (`e-img-f-2`) and mark (`e-img-m-2`) synthetic runs are measured (with `IMG.5` finding-aid schema/fixtures and `C2PA.1` `org.traceweave.registration-link` reviewed, and Lane 15 audio/video scoping merged). Offline-first M4 registration (`draft-5` + §4.7 + §9.1 `tw1-`) is implemented and verified in both Rust and Go (`a6066d3`, 0 divergences, 0 external dependencies) and the `M4.6` commitment/disclosure review is filed (`CD-B2` fixed & confirmed), while core `M4.3`–`M4.4` and `M4.6` remain open until vectors promote to `test-vectors/` and named non-author review closes. The M3 held-out evaluation (`m3-eval-draft-10`) has not been run, and the two independent reference implementations (in Rust and Go) remain in a private repository.

## What is the accuracy or false-alarm rate?

Unmeasured so far. The M3 evaluation protocol (`m3-eval-draft-10`) has not been executed, no evaluation corpus has been acquired yet, and the evaluation harness is under review ([research/drafts/evaluation-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/evaluation-protocol.md)). Shipped parameters such as `k = 5, w = 4` (code) and `k = 8, w = 8` (prose) are experimental values chosen for hand-checkable test vectors, not calibrated thresholds.

The recorded `M3.0` false-alarm budget (**1 in 20** per unordered repository search, or ≤ 6 alarms in 132 held-out searches) is an operational acceptance target to test against, not a demonstrated error rate.

## Why are embedded marks not used for source code or prose?

Every mechanism tested or reviewed so far resets under cheap normalization ([Limits & threat model](/docs/limits-and-threat-model)):

- **Source code:** synthetic Go and Rust syntax carriers survived `gofmt` and `rustfmt` (55/55 nonzero states), but all 55/55 were reset by cheap canonicalization, same-context transplants decoded cleanly, a 4-repository census found zero established safe eligible sites (`SYN.1`–`SYN.5`), and none of five reviewed published code-watermarking systems cleared the project's carrier bar ([Lane 06](/docs/research/lane-06-code-carriers)).
- **Existing prose:** Unicode homoglyph and zero-width watermarks are erased by one deterministic canonical fold (`NFKC + UTS #39 skeleton + delete Default_Ignorable`), and neural lexical rewriting (AWT) alters the author's wording at ~4 raw bits per 80 words with no licence file ([Lane 09](/docs/research/lane-09-text-profile)).

Embedded marking remains an open research track (`M2E.0`–`M2E.7`) — any candidate would need to pass `M2E.1` (including cheap normalization) before adoption.

## What about image watermarks?

Post-hoc still-image watermarks (TrustMark-Q and PixelSeal) were measured on 100 synthetic images per scheme under `e-img-m-2` ([Image mark study](/docs/research/image-mark-study)), closing gates `IMG.0`–`IMG.4`. Both matched 100/100 clean images and survived most edits, but keyless `reembed` transferred each mark onto an unrelated image **100/100** times for both schemes (and residual transplant succeeded 82/100 and 90/100; ReMark left 1/100 for TrustMark-Q). Because reviewed encoders and decoders are public and unkeyed, an image watermark acts as a **finding aid** rather than evidence of origin.

## Does Traceweave upload my source code or catalogues?

No. Local, offline extraction and comparison are the default, with no required remote server, registry, or public transparency log ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)).

Catalogues are still private artifacts: even though a catalogue contains no source text, its unkeyed 64-bit hashes and byte spans let anyone holding the catalogue test guessed snippets or confirm whole files via `sha256` ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Keep catalogues outside source checkouts by default.

## What does a `no-match` result mean?

`no-match` means insufficient matching evidence under the active profile and configuration ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)), not that reuse did not occur. Inserting or altering one token every `k − 1` tokens, heavy refactoring, cross-language porting, paraphrasing, translation, deep image cropping, or fragments shorter than `k + w − 1` tokens can all produce `no-match`.

## How does Traceweave differ from MOSS, JPlag, Dolos, SCANOSS, or C2PA?

The core token-matching algorithm is the same winnowing family as MOSS and sits alongside JPlag, Dolos, and SCANOSS; C2PA and in-toto are provenance and attestation formats rather than matchers. Traceweave focuses on an open, byte-deterministic, offline specification verified across independent implementations, keeping similarity observations, commitments, signatures, and origin context separate. See [Prior art](/docs/prior-art) for primary-source details.
