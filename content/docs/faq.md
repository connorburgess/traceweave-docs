---
title: Frequently asked questions
description: Plain answers about what Traceweave can and cannot do, its experimental status, negative results, and privacy boundaries.
section: Project
status: Experimental draft (0.1.0-draft.1)
---

## Does this prove something is mine?

**No.** Traceweave never establishes ownership, authorship, copyright infringement, licence violation, or direction of copying ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md), [spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md)).

Why:
- **A fingerprint match** only shows that two files shared a sequence of winnowed token k-grams under a specific configuration. Common idioms, shared dependencies, independent implementations of the same specification, or lawful historical copies can all produce matches. It cannot tell who wrote the code first.
- **A valid signature or commitment** only authenticates exact bytes under a key or shows that a disclosed catalogue matches a prior hash. Anyone can sign or commit someone else's public files.
- **A decoded image watermark** only shows that bits matching an expected payload were embedded in a candidate image. Because reviewed post-hoc image watermark encoders and decoders are public and unkeyed, anyone can copy a mark onto an unrelated image without the key ([research/drafts/image-mark-use-case.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-use-case.md)).

Traceweave produces **reproducible technical evidence for human review**, not a legal or ownership verdict.

## Can Traceweave identify copyright infringement or training-data membership?

**No.** Rights and licence review are explicitly outside the comparison report, which forbids ownership, licence, and verdict fields by schema ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Likewise, Traceweave does not establish whether content was used to train a machine-learning model ([README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md), [docs/use-cases.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/use-cases.md)).

## Can I use Traceweave in production today?

**No.** Traceweave is an experimental design draft (`0.1.0-draft.1`), not a standard and not production software ([README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md)). Only 11 of 47 core roadmap gates (and 3 of 41 later-profile gates) are met ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)). The M3 held-out evaluation has not been run, signing verification (`M4.3`–`M4.6`) is unfinished, and the two independent reference implementations (in Rust and Go) have not been published yet.

## What is the accuracy or false-alarm rate?

**Unmeasured.** The M3 evaluation protocol (`m3-eval-draft-5`) has not been executed and no evaluation corpus has been acquired yet ([research/drafts/evaluation-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/evaluation-protocol.md)). Shipped parameters such as `k = 5, w = 4` (code) and `k = 8, w = 8` (prose) are experimental values chosen for hand-checkable test vectors, not calibrated thresholds.

The recorded `M3.0` false-alarm budget (**1 in 20** per unordered repository search, or ≤ 6 alarms in 132 held-out searches) is an operational acceptance target to test against, not a demonstrated error rate.

## Why are embedded marks not used for source code or prose?

Because every mechanism tested or reviewed failed cheap normalization ([Limits & threat model](/docs/limits-and-threat-model)):

- **Source code:** synthetic Go and Rust syntax carriers survived `gofmt` and `rustfmt` (55/55 nonzero states), but all 55/55 were reset by cheap canonicalization, same-context transplants decoded cleanly, a 4-repository census found zero established safe eligible sites (`SYN.1`–`SYN.5`), and none of five reviewed published code-watermarking systems cleared the project's carrier bar ([Lane 06](/docs/research/lane-06-code-carriers)).
- **Existing prose:** Unicode homoglyph and zero-width watermarks are completely erased by one deterministic canonical fold (`NFKC + UTS #39 skeleton + delete Default_Ignorable`), and neural lexical rewriting (AWT) alters the author's wording at ~4 raw bits per 80 words with no licence file ([Lane 09](/docs/research/lane-09-text-profile)).

Embedded marking remains an open research track (`M2E.0`–`M2E.7`), not an abandoned idea — any candidate must pass `M2E.1` (including cheap normalization) before adoption.

## What about image watermarks?

Post-hoc still-image watermarks (TrustMark-Q and PixelSeal) are under study under frozen protocol `e-img-m-2` ([Image mark study](/docs/research/image-mark-study)), following the Lane 12 licence audit. Even where an image mark survives ordinary edits like JPEG compression or resizing, it remains a **finding aid only**: each scheme has cheap removals (such as TrustMark's own ReMark remover or regeneration), blind BCH decoding yields 5.9–15.3% false positives on unmarked images in external benchmark `X1`, and public unkeyed encoders allow anyone to copy a mark onto an unrelated image without the key.

## Does Traceweave upload my source code or catalogues?

**No.** Local, offline extraction and comparison are core defaults with no required remote server, registry, or public transparency log ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)).

However, remember that **catalogues are still private artifacts**: even though a catalogue contains no source text, its unkeyed 64-bit hashes and byte spans let anyone holding the catalogue test guessed snippets or confirm whole files via `sha256` ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Keep catalogues outside source checkouts by default.

## Does a `no-match` result mean my content was not reused?

**No.** `no-match` means insufficient matching evidence under the active profile and configuration ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)). Light rewriting (one inserted or altered token every `k − 1` tokens), heavy refactoring, cross-language porting, paraphrasing, translation, deep image cropping, or fragments shorter than `k + w − 1` tokens can all produce `no-match`.

## How does Traceweave differ from MOSS, JPlag, Dolos, SCANOSS, or C2PA?

The core token-matching algorithm is the same winnowing family as MOSS and sits alongside JPlag, Dolos, and SCANOSS; C2PA and in-toto are provenance/attestation formats rather than matchers. Traceweave focuses on an open, byte-deterministic, offline specification verified across independent implementations with explicit separation between similarity, commitments, signatures, and rights review. See [Prior art](/docs/prior-art) for exact primary-source details.
