---
title: Frequently asked questions
description: Plain answers about what Traceweave records, its scope, experimental status, research findings, and privacy boundaries.
section: Project
status: Experimental draft (0.1.0-draft.1)
---

## Does this show something is mine?

Traceweave records checkable facts — exact byte digests, shared fingerprint spans, decoded mark bits, and signature checks ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md), [spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)). Ownership, authorship, and permission are judgments for people.

Specifically:
- **A fingerprint match** shows that two files shared a sequence of winnowed token k-grams under a specific configuration. Common idioms, shared dependencies, independent implementations of the same specification, or historical copies can also match, and a match does not show which copy came first.
- **A signature or commitment** authenticates exact bytes under a key or shows that a disclosed catalogue matches a prior hash; anyone can sign or commit files they hold.
- **A decoded image watermark** shows that bits matching an expected payload were embedded in a candidate image. Because reviewed post-hoc encoders and decoders are public and unkeyed, anyone can copy a mark onto an unrelated image without the key ([research/drafts/image-mark-use-case.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-use-case.md)).

## Is Traceweave ready for production use?

Not yet. Traceweave is an experimental design draft (`0.1.0-draft.1`) ([README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md)). Currently 11 of 47 core roadmap gates and 3 of 41 later-profile gates are met ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)). The M3 held-out evaluation has not been run, signing verification (`M4.3`–`M4.6`) is unfinished, and the two independent reference implementations (in Rust and Go) have not been published yet.

## What is the accuracy or false-alarm rate?

Unmeasured so far. The M3 evaluation protocol (`m3-eval-draft-5`) has not been executed and no evaluation corpus has been acquired yet ([research/drafts/evaluation-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/evaluation-protocol.md)). Shipped parameters such as `k = 5, w = 4` (code) and `k = 8, w = 8` (prose) are experimental values chosen for hand-checkable test vectors, not calibrated thresholds.

The recorded `M3.0` false-alarm budget (**1 in 20** per unordered repository search, or ≤ 6 alarms in 132 held-out searches) is an operational acceptance target to test against, not a demonstrated error rate.

## Why are embedded marks not used for source code or prose?

Every mechanism tested or reviewed so far resets under cheap normalization ([Limits & threat model](/docs/limits-and-threat-model)):

- **Source code:** synthetic Go and Rust syntax carriers survived `gofmt` and `rustfmt` (55/55 nonzero states), but all 55/55 were reset by cheap canonicalization, same-context transplants decoded cleanly, a 4-repository census found zero established safe eligible sites (`SYN.1`–`SYN.5`), and none of five reviewed published code-watermarking systems cleared the project's carrier bar ([Lane 06](/docs/research/lane-06-code-carriers)).
- **Existing prose:** Unicode homoglyph and zero-width watermarks are erased by one deterministic canonical fold (`NFKC + UTS #39 skeleton + delete Default_Ignorable`), and neural lexical rewriting (AWT) alters the author's wording at ~4 raw bits per 80 words with no licence file ([Lane 09](/docs/research/lane-09-text-profile)).

Embedded marking remains an open research track (`M2E.0`–`M2E.7`) — any candidate would need to pass `M2E.1` (including cheap normalization) before adoption.

## What about image watermarks?

Post-hoc still-image watermarks (TrustMark-Q and PixelSeal) are under study under frozen protocol `e-img-m-2` ([Image mark study](/docs/research/image-mark-study)), following the Lane 12 licence audit. Even where an image mark survives ordinary edits like JPEG compression or resizing, it acts as a **finding aid** rather than evidence of origin: each scheme has cheap removals (such as TrustMark's own ReMark remover or regeneration), blind BCH decoding yields 5.9–15.3% false positives on unmarked images in external benchmark `X1`, and public unkeyed encoders allow anyone to copy a mark onto an unrelated image without the key.

## Does Traceweave upload my source code or catalogues?

No. Local, offline extraction and comparison are the default, with no required remote server, registry, or public transparency log ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)).

Catalogues are still private artifacts: even though a catalogue contains no source text, its unkeyed 64-bit hashes and byte spans let anyone holding the catalogue test guessed snippets or confirm whole files via `sha256` ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Keep catalogues outside source checkouts by default.

## What does a `no-match` result mean?

`no-match` means insufficient matching evidence under the active profile and configuration ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)), not that reuse did not occur. Inserting or altering one token every `k − 1` tokens, heavy refactoring, cross-language porting, paraphrasing, translation, deep image cropping, or fragments shorter than `k + w − 1` tokens can all produce `no-match`.

## How does Traceweave differ from MOSS, JPlag, Dolos, SCANOSS, or C2PA?

The core token-matching algorithm is the same winnowing family as MOSS and sits alongside JPlag, Dolos, and SCANOSS; C2PA and in-toto are provenance and attestation formats rather than matchers. Traceweave focuses on an open, byte-deterministic, offline specification verified across independent implementations, keeping similarity observations, commitments, signatures, and origin context separate. See [Prior art](/docs/prior-art) for primary-source details.
