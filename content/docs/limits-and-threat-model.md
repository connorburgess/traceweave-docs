---
title: Limits and threat model
description: Known failure modes, adversarial assumptions, negative research results, and explicit non-claims.
section: Specification
status: Experimental draft (0.1.0-draft.1)
---

Traceweave's threat model ([spec/threat-model.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/threat-model.md)) assumes an adversary has the full specification, both reference implementations, all public releases, and any distributed content. Only owner-specific keys and local reference catalogues remain private. **An adversary does not need to recover a key to erase observable code, text, or media features.**

## Threat and limitation matrix

From [spec/threat-model.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/threat-model.md):

| Threat | Required response or open limitation |
| --- | --- |
| **Formatting, renaming, refactoring, recompression** | Measure per profile; never infer robustness from an algorithm name. |
| **Partial extraction into a large host** | Localize byte spans and report directional containment separately from whole-file similarity. |
| **Rewriting, regeneration, cross-language ports** | Allow abstention (`no-match` / `abstain`). Arbitrary rewriting has no detection assurance. |
| **Independent same-task implementation** | Include hard negative controls; shared structure or semantics is not ancestry. |
| **Shared dependencies and permitted historical copies** | Keep origin context separate from technical similarity. |
| **Transplanted marks and repeated fragments** | Never attribute a whole artifact from a small copied span or a transferred signal. |
| **Signed false claims** | Authenticate the signer under a trust policy; a valid signature never makes the signed claim true. |
| **Key or catalogue compromise** | Document loss of privacy and trust; retain prior evidence with compromise context. |
| **Adaptive detector queries** | Avoid public scoring oracles by default; rate limiting alone is not a security proof. |
| **Prefix queries and shared HMAC secrets** | No k-anonymity or zero-knowledge claim; combinations, frequency, and dictionary attacks leak features. |
| **Malicious evidence files** | Isolated parsing, strict resource bounds (e.g. JSON nesting depth ≤ 64, `maxInputBytes` ≤ 8 MiB), no code execution, no automatic remote fetching. |
| **Public transparency and identity** | Explicit disclosure choice; publishing a record, digest, or signature identity can reveal Traceweave use or enable correlation. |

## Why light rewriting defeats token k-grams

The core matcher compares winnowed k-grams of lexer tokens (established prior art from MOSS; [research/lanes/11-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/11-report-audit.md)):

- **Analytic evasion bound:** inserting or altering one token every `k − 1` tokens breaks every k-gram and leaves zero shared fingerprints. At `k = 5`, one inserted token every 4 kept tokens eliminates all exact and normalized k-gram matches ([research/lanes/11-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/11-report-audit.md)). At `k = 8` for prose, insertion every 7 tokens eliminates all sharing ([research/lanes/09-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/09-evidence-review.md)).
- **Not scope-aware and not semantic:** the `normalized` channel erases identifiers and literals lexically without parsing or scope resolution. Statement reordering, loop inversion, refactoring, cross-language porting, paraphrase, and translation are expected to reduce or eliminate matches ([spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md), [profiles/text.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/text.md)).
- **Short fragments:** any unchanged token run shorter than `k + w − 1` tokens loses winnowing's locality property; under `k = 5, w = 4`, the minimum locality-covered run is 8 tokens, and the minimum possible reportable match under `minRegionDistinctHashes = 2` is 6 tokens (two adjacent selected k-grams), with two disjoint full windows requiring 12 tokens ([research/lanes/11-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/11-report-audit.md)).
- **Boilerplate suppression is advisory:** explicit-catalogue suppression removes only hashes that winnowing happened to select in the boilerplate catalogue's context; idioms selected differently in another file remain unsuppressed ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)).

## Findings on embedded marks

Across source code, existing prose, and still images, every reviewed or tested embedded-mark approach exhibits cheap removal, keyless copying, or both.

1. **Source code (`SYN.1`–`SYN.5`, Lane 06):**
   - Synthetic Go and Rust syntax/naming carriers survived `gofmt` and `rustfmt` (55/55 nonzero states per language) but **all 55/55 were reset by cheap canonicalization**, and same-context signal transplants decoded cleanly ([research/experiment-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiment-checkpoint.md), [research/fragment-policy-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/fragment-policy-checkpoint.md)).
   - A four-repository public census (`go-spew`, `hey`, `itoa`, `hexyl`) established **zero safe eligible sites** ([research/public-census-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/public-census-checkpoint.md)).
   - None of the five published code-watermarking systems reviewed in Lane 06/07 (SrcMarker, RoSeMary, SEW, CLASP, PLACEMARK) cleared the project's carrier bar ([research/research-06-08-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/research-06-08-checkpoint.md)).
2. **Existing prose (Lane 09):**
   - Unicode homoglyph and zero-width carriers are completely erased by one deterministic canonical fold (NFKC + UTS #39 skeleton + deleting `Default_Ignorable_Code_Point`), and learned lexical rewriting (AWT) alters the author's wording while carrying only ~4 raw bits per 80 words before framing ([research/lanes/09-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/09-evidence-review.md)).
3. **Still images (Lane 08, Lane 10, `e-img-m-2`):**
   - Post-hoc image watermarks (TrustMark-Q, PixelSeal) use **public, unkeyed encoders and decoders**. Anyone can decode the bits from a marked image and re-embed them into any unrelated image without the key, passing the exact same expected-payload test ([research/drafts/image-mark-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-protocol.md)).
   - Each scheme also has cheap removals: ReMark reduces TrustMark bit accuracy to 55% at 48.5 dB PSNR ([research/lanes/08-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-evidence-review.md)), and generative regeneration removes over 99% of several tested marks ([research/lanes/10-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-evidence-review.md)).
   - Blind BCH decoding on TrustMark yields false decodes on 5.9–15.3% of unmarked images in external benchmark X1 ([research/lanes/10-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-report-audit.md)).
   - An image watermark is therefore at most a **finding aid**, never evidence of origin, authorship, or derivation.

## Still-image fingerprint limits

- **Crops, screenshots, and rotation:** PDQ fails deep crops (0/100 on `crop50` and `crop75`, 2/100 on `crop90`, and 0/100 on synthetic `screenshot` in `e-img-f-2`; [RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-fingerprint/results/e-img-f-2/RESULTS.md)). External preprint X1 reports 0% Recall@1 for PDQ on 70%-side crops, 15° rotations, and screenshot templates, and 1.00% per-query false bindings (267/26,820) against a 98,985-item natural-image product registry ([research/lanes/10-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-report-audit.md)).
- **Black-box evasion:** small L2 perturbations evaded PDQ in 99.9% of attempts in Jain et al. ([research/lanes/10-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-evidence-review.md)).

## Privacy limits of catalogues and reports

- **Catalogues are private:** unkeyed 64-bit hashes and byte spans let a catalogue holder test guessed snippets, confirm whole files via `sha256`, and inspect file structure ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)). Exchanging catalogues discloses these capabilities to the counterparty.
- **Reports are private by default:** a report exposes artifact IDs, whole-file `sha256` digests, byte spans, and overlap counts.
- **No remote resolver yet:** query leakage, enumeration, and membership disclosure for any future remote resolver are unstudied (open gates `RES.1`–`RES.3`).

## Scope boundaries

From [docs/use-cases.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/use-cases.md) and [spec/threat-model.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/threat-model.md):

- **Observation, not copy restriction:** Traceweave records checkable provenance and similarity evidence; it does not restrict copying or alter runtime behavior.
- **No hidden mechanisms:** no planted defects, callbacks, telemetry, network calls at runtime, or behavior changes are part of the design.
- **Technical records only:** Traceweave reports observable digests, fingerprint matches, and signature checks. Ownership, authorship, permission, and model-training membership are outside what a report determines.
- **Unmeasured accuracy:** the M3 evaluation has not been run yet, so no precision, recall, or false-alarm rate is claimed.
