---
title: "Lane 09: Text and document profile evidence"
description: Primary-evidence review of prose fingerprinting and embedded text marks — why Traceweave adopted folded-text winnowing and rejected Unicode/lexical watermarks.
section: Research & experiments
status: Evidence review & report audit (2026-11-22)
---

Lane 09 reviewed prose fingerprinting and embedded text-marking mechanisms across eight primary source families ([research/lanes/09-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/09-evidence-review.md)). It led to the folded-text winnowing profile in [profiles/text.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/text.md) and found no embedded prose-marking scheme suitable for testing: Unicode homoglyph and zero-width marks are erased by one published deterministic fold, and post-hoc lexical rewriting (AWT) alters the author's wording at ~4 raw bits per 80 words with no licence file.

## Primary sources evaluated

Eight primary source families were reviewed on 2026-11-22 ([research/lanes/09-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/09-evidence-review.md)):

| ID | Source | Key evidence | Decision for Traceweave |
| --- | --- | --- | --- |
| **W** | Schleimer, Wilkerson, Aiken, *Winnowing* (SIGMOD 2003) | Formal locality for shared runs ≥ `w + k − 1` units; measured density 0.019902 vs predicted 0.019802 (k=50 chars, w=100); no measured precision/recall or negative-set false-alert rate. | **Adopted baseline host** (`profiles/text.md`). |
| **B** | Broder, *Resemblance and containment* (1997) | Shingling estimators; containment requires a size-proportional sketch. | Secondary summary field only. |
| **M** | Manku et al., *SimHash* (WWW 2007) | Whole-page near-duplicates; ~0.75 precision/recall on sampled web pairs at Hamming distance 3; relies on stop words/stemming. | **Not suitable for fragments** (no localization). |
| **P** | Potthast et al., *PAN-PC-10* (COLING 2010; Zenodo 3250123) | 27,073 documents, 68,558 cases across none (40%), low (20%), high (20%), crowd-simulated (6%), and translated (14%) obfuscation, plus 25% negative documents. | **Best calibration corpus** (stage 2, owner-gated `TXT.5`–`TXT.6`). |
| **K** | Krishna et al., *DIPPER / retrieval* (NeurIPS 2023) | BM25 retrieval catches 96.2–97.8% of strong LLM paraphrases on long passages (vs 51.4–55.8% for generation watermarks), but drops below 25% at 20-word queries. | Confirms lexical retrieval helps on long passages while short fragments fail; out of scope for CPU-only k-grams. |
| **U** | Unicode 17.0.0: UAX #15, UTS #39, UAX #29 | Defines NFKC, confusable `skeleton`, and `Default_Ignorable_Code_Point`. UTS #39 warns `confusables.txt` changes between versions. | Defines **both** the pinned fold for `text-plain` and the cheapest removal of Unicode marks. |
| **N** | Nemecek et al., *Homoglyph and Invisible-Character Watermarking* (arXiv:2610.36432v1, 2026-10-27) | FLORES+ (1,012 sentences × 40 varieties): raw capacity 7.09 bits/char (English) before keying/ECC; detector needs key **and original cover**; modelled copy-paste removes the insertion track; **combined canonical fold erases the mark in every language**. | **Rejected:** erased by one deterministic fold. |
| **A** | Abdelnabi & Fritz, *AWT* (arXiv:2009.03015v2; commit `8b3ba57`) | Post-hoc neural lexical rewriter: 4 raw bits per 80 words (~50 bits per 1,000 words before framing); re-marking leaves ~85%, white-box denoiser ~55%; **no LICENSE file** at pinned commit; checkpoints on Google Drive. | **Rejected:** rewrites author's words, low capacity, unclear licence. |

## Recommendation adopted into `profiles/text.md`

Lane 09 recommended an **extracted-fingerprint text profile** hosted by the existing winnowing contract — CPU-only, zero model downloads, pinned to Unicode 17.0.0 files by SHA-256, mapping every folded and skeleton token back to its original UTF-8 byte span, and documenting paraphrase, translation, and short passages as expected misses.

That recommendation produced [profiles/text.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/text.md) (`text-plain` frozen for stage 1 with `k = 8, w = 8`, channels `exact`, `folded`, `skeleton`; `text-markdown` draft-2).

## Audit of the incoming report

The audit ([research/lanes/09-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/09-report-audit.md)) agreed with the report's top-level decision (winnowing baseline, no embedded prose mark) while rejecting its technical reasoning and experiment:

- **NFKC correction:** the report claimed NFKC strips zero-width characters (`U+200B`, `U+200C`, `U+200D`, `U+2060`, `U+FEFF`) and homoglyphs to 0% recovery — contradicted by UAX #15 and N §6 (NFKC leaves those characters unchanged and keeps 93% of cross-script pairs). The actual removal is the **canonical fold** (`NFKC + UTS #39 skeleton + delete Default_Ignorable`).
- **Periodic-insertion evasion correction:** the report claimed inserting one distractor word every `w + k − 2` words removes winnowing. That removes only the formal locality bound; the text extraction review measured **326 of 807** distinct hashes still shared at `k = 8, w = 8`, reaching zero only at one insertion every `k − 1 = 7` tokens.
- **Tool and threshold errors:** `fpcc` is a C-source lexer, not a prose tokenizer; expecting containment `≥ 0.98` under 1% word substitution conflicts with `k = 8` (where ~8% of k-grams are touched); and replacing SHA-256 with MD5 or inventing document-frequency frame mandates was rejected (Traceweave already uses explicit boilerplate catalogues under `M2.10`).
