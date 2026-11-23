---
title: Source index
description: Complete list of every file in the public Traceweave specification repository (branch roadmap-v2) that this documentation site draws from.
section: Project
status: Verified against traceweave-spec branch roadmap-v2
---

Every factual statement, number, gate count, test-vector example, and research summary on this site is traced to a public file on the `roadmap-v2` branch of [traceweave-spec](https://github.com/connorburgess/traceweave-spec). Our build-time content check fails if any page cites a file path that does not exist on `roadmap-v2` or omits a cited file from this index.

## Top-level repository documents

| File | Role on this site |
| --- | --- |
| [README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/README.md) | Experimental status (`0.1.0-draft.1`), three separated questions, validation commands, scope |
| [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md) | Gate definitions, exact progress counts (14/47 core, 8/55 later), M0–M5 & later-profile gate tables (`PY`, `WEB`, `SK.3`–`SK.5`), 2026-11-23 owner decisions, implementation track status |
| [CONTRIBUTING.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/CONTRIBUTING.md) | Contribution rules, CI workflow scope, and validation boundaries |
| [SECURITY.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/SECURITY.md) | Private-evidence boundaries, hostile-input parsing rules, disclosure guidance |
| [LICENSE.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSE.md) | CC BY 4.0 / Apache-2.0 / Unicode License v3 split and attribution wording |
| [LICENSES/Apache-2.0.txt](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSES/Apache-2.0.txt) | Verbatim Apache License, Version 2.0 text |
| [LICENSES/CC-BY-4.0.txt](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSES/CC-BY-4.0.txt) | Verbatim Creative Commons Attribution 4.0 International text |
| [LICENSES/Unicode-3.0.txt](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/LICENSES/Unicode-3.0.txt) | Verbatim Unicode License v3 text for derived UCD 17.0.0 vector tables |

## Normative draft specification (`spec/`)

| File | Role on this site |
| --- | --- |
| [spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md) | Core objects, `sha256-salted-catalogue-v1` commitment formula, privacy defaults, interpretation boundaries |
| [spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md) | Go (`go-tokens`) and Rust (`rust2024-tokens`) lexical rules, channels, k-gram hashing, winnowing, bounds (`k ≤ 16`, `w ≤ 128`, `maxInputBytes ≤ 8 MiB`), non-claims |
| [spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md) | Canonical extraction record, catalogue format, privacy class, seed-merge comparison, suppression catalogues, deterministic report body vs provenance |
| [spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md) | Restricted in-toto Statement v1 & DSSE PAE adapter, trust policy, Sigstore/RFC 3161 optional status, C2PA status |
| [spec/conformance.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/conformance.md) | Conformance levels 1–5 and what repository checkers establish |
| [spec/threat-model.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/threat-model.md) | Adversary assumptions, threat table, privacy/oracle/transplant/rewrite limits, non-goals |

## Content profiles (`profiles/`)

| File | Role on this site |
| --- | --- |
| [profiles/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/README.md) | Overview of profile statuses across code, TypeScript, text, image, audio, and binary |
| [profiles/code.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/code.md) | Code profile scope, containment vs Jaccard rationale, pointer to `go-tokens` and `rust2024-tokens` |
| [profiles/typescript.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/typescript.md) | `ts-tokens` (`draft-2`, frozen stage 1) and `tsx-tokens` (deferred draft), `;` normalized exclusion, `exprEnd` regex/division rules |
| [profiles/text.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/text.md) | `text-plain` (`draft-1`, frozen stage 1) and `text-markdown` (`draft-2`, draft), Unicode 17.0.0 fold & UTS #39 skeleton channels |

## Planning & design documents (`docs/`)

| File | Role on this site |
| --- | --- |
| [docs/use-cases.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/use-cases.md) | UC-1 through UC-6, walkthroughs W-1/W-2, proposed UC-8, verification plans, explicit non-goals |
| [docs/implementation-patterns.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/implementation-patterns.md) | Winnowing `[8, 4, 4, 7, 2]` example, storage boundaries, independent verification verdicts, example matrix |
| [docs/implementation-repo-plan.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/implementation-repo-plan.md) | Rust primary CLI + Go second implementation architecture, hand-written lexers, `spec.lock`, I0–I5 milestones |
| [docs/sources.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/sources.md) | Source register, proposal-to-requirement discipline, evidence labels (`proposed`, `specified`, `implemented`, `measured`) |

## Test vectors (`test-vectors/`)

| File | Role on this site |
| --- | --- |
| [test-vectors/commitment.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/commitment.json) | Synthetic exact-byte commitment vector (`f4df04ab...c4a9`) |
| [test-vectors/dsse-pae.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/dsse-pae.json) | DSSE Pre-Authentication Encoding framing vectors |
| [test-vectors/extraction/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/README.md) | Go and Rust extraction vector counts, `go-equal-minimum` walkthrough, checker & toolchain cross-check summary |
| [test-vectors/extraction/config-go.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/config-go.json) | Exact canonical Go extraction configuration bytes (`dfbc5fe3...`) |
| [test-vectors/extraction/go.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/go.json) | Published Go extraction vectors including `go-exact-k` worked example |
| [test-vectors/extraction/unicode-17.0.0-tables.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/unicode-17.0.0-tables.json) | Pinned Unicode 17.0.0 identifier and NFC tables |
| [test-vectors/extraction-typescript/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction-typescript/README.md) | `ts-tokens` / `tsx-tokens` vector counts, TypeScript 6.0.3 cross-check (`119/119` files, 2.48M tokens), semicolon survival |
| [test-vectors/extraction-text/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction-text/README.md) | `text-plain` / `text-markdown` vector counts, 60 canonical records, Unicode 17.0.0 cross-checks |
| [test-vectors/matching/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/README.md) | Matching vector counts (76 vectors), forbidden-field corruption checks, wrong-implementation self-tests |
| [test-vectors/matching/comparison-config.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/comparison-config.json) | Exact canonical comparison configuration bytes (`39345e9c...`) |
| [test-vectors/matching/extraction-go.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/extraction-go.json) | Synthetic Go sources `mv-go-sum` (`sum.go`) and `mv-go-host` (`host.go`) used in the worked example |
| [test-vectors/matching/example-report.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/example-report.json) | Complete worked comparison report (`14/14` exact containment vs `14/39` Jaccard) |

## Research checkpoints, lanes, drafts, experiments, and reviews (`research/`)

| File | Role on this site |
| --- | --- |
| [research/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/README.md) | Research handoff policy and checkpoint overview |
| [research/discovery-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/discovery-checkpoint.md) | Initial 2026-11-18 discovery synthesis |
| [research/experiment-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiment-checkpoint.md) | Synthetic Go/Rust carriers (`SYN.1`–`SYN.3`) and signing interop summary |
| [research/fragment-policy-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/fragment-policy-checkpoint.md) | Fragment recovery, signal transplant (`SYN.4`), and signing-policy checkpoint |
| [research/public-census-plan.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/public-census-plan.md) | Frozen four-repository census protocol |
| [research/public-census-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/public-census-checkpoint.md) | Four-repository census counts (`SYN.5`: zero established safe eligibility) |
| [research/research-06-08-checkpoint.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/research-06-08-checkpoint.md) | Lanes 06–08 reconciliation: no code carrier clears bar, shared evidence container |
| [research/lanes/go-carrier-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/go-carrier-results.md) | Go synthetic carrier clean, formatter, and canonicalization counts |
| [research/lanes/rust-carrier-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/rust-carrier-results.md) | Rust synthetic carrier clean, formatter, and canonicalization counts |
| [research/lanes/go-fragment-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/go-fragment-results.md) | Go fragment localization and signal-transplant results |
| [research/lanes/rust-fragment-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/rust-fragment-results.md) | Rust fragment localization and signal-transplant results |
| [research/lanes/signing-interop-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/signing-interop-results.md) | Go/Rust DSSE 66-outcome interoperability results (`M4.1`) |
| [research/lanes/signing-policy-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/signing-policy-results.md) | Shared signing policy and 50 native Go/Rust commitment outcomes (`M4.2`) |
| [research/lanes/06-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/06-evidence-review.md) | Lane 06 primary review (SrcMarker, RoSeMary, SEW) and report audit |
| [research/lanes/07-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/07-evidence-review.md) | Lane 07 primary review (synchronization strings, WinMax, watermark stealing) |
| [research/lanes/07-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/07-report-audit.md) | Lane 07 audit (TetherMark, CLASP, PLACEMARK) |
| [research/lanes/08-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-evidence-review.md) | Lane 08 cross-media review (code, text, TrustMark, WavMark) and shared container |
| [research/lanes/08-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/08-report-audit.md) | Lane 08 audit (AudioSeal, Stable Signature, C2PA soft-binding lookup) |
| [research/lanes/09-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/09-evidence-review.md) | Lane 09 text profile review (winnowing, PAN-PC-10, Unicode marks, AWT) |
| [research/lanes/09-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/09-report-audit.md) | Lane 09 audit (NFKC correction, periodic-insertion evasion, fpcc) |
| [research/lanes/10-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-evidence-review.md) | Lane 10 image profile review (PDQ, ISCC, SSCD, dwtDct, Zhao et al., TetherMark) |
| [research/lanes/10-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/10-report-audit.md) | Lane 10 audit (`X1` soft-bindings benchmark preprint, `X3` PixelSeal) |
| [research/lanes/11-report-audit.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/11-report-audit.md) | Lane 11 external feedback audit and primary-source prior art (MOSS, JPlag, Dolos, SCANOSS, SWHID, C2PA, in-toto, SLSA, SourcererCC, BigCloneBench) |
| [research/lanes/12-image-mark-licences.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/12-image-mark-licences.md) | Lane 12 pre-download licence and SHA-256 audit for TrustMark-Q, PixelSeal, and `dwtDct` |
| [research/lanes/13-timestamp-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/13-timestamp-evidence-review.md) | Lane 13 primary-evidence review of time-evidence mechanisms (RFC 3161, eIDAS, Rekor, OpenTimestamps, C2SP witnesses, C2PA timestamps, RFC 4998) |
| [research/drafts/extraction-profile-image.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/extraction-profile-image.md) | Still-image fingerprint draft profile (`draft-2`, PDQ & ISCC Image-Code v0) |
| [research/drafts/extraction-profile-python.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/extraction-profile-python.md) | Draft Python extraction profile (`py-tokens` `draft-1`, frozen for stage-1 implementation) |
| [research/drafts/extraction-vectors-python/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/extraction-vectors-python/README.md) | `py-tokens` `draft-1` vectors (107 vectors + 3 limits + 20 negative configs), checker, and CPython 3.14.6 stdlib/fuzz cross-check |
| [research/drafts/registration-record.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/registration-record.md) | Registration record design (`draft-2`), per-signature time bounds, possession digest, key events, and A2A/MCP agent skills |
| [research/drafts/image-mark-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-protocol.md) | Frozen image embedded-mark protocol `e-img-m-2`, tested bit positions, and conditions |
| [research/drafts/image-mark-use-case.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/image-mark-use-case.md) | UC-7 wording and keyless-copy limitation |
| [research/drafts/c2pa-mapping.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/c2pa-mapping.md) | Draft C2PA 2.5 field mapping (`org.traceweave` namespace), soft-binding semantic gap, and transport recommendation |
| [research/drafts/c2pa-fixtures/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/c2pa-fixtures/README.md) | Illustrative C2PA mapping fixtures (`f1`–`f6`) and negative checks |
| [research/drafts/evaluation-protocol.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/evaluation-protocol.md) | M3 evaluation protocol `m3-eval-draft-9` (48 repos, 1/20 budget, freeze rules, harness rulings) |
| [research/experiments/image-fingerprint/results/e-img-f-2/RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-fingerprint/results/e-img-f-2/RESULTS.md) | Measured 200-image synthetic fingerprint run validity checks and PDQ/ISCC edit tables |
| [research/experiments/image-mark/results/e-img-m-2/RESULTS.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-mark/results/e-img-m-2/RESULTS.md) | Measured synthetic image-mark run `e-img-m-2` (W1–W6, P1–P4, per-condition counts, PSNR, keyless re-embed 100/100) |
| [research/experiments/image-mark/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/experiments/image-mark/README.md) | Image mark `e-img-m-2` harness status and offline execution instructions |
| [research/reviews/image-profile-protocol-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/image-profile-protocol-review.md) | Non-author review and results recheck of `e-img-f-2` |
| [research/reviews/image-mark-protocol-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/image-mark-protocol-review.md) | Non-author review of `e-img-m-1`, confirmation pass for `e-img-m-2`, and independent results recheck (0 mismatches in 7,500 queries) |
| [research/reviews/extraction-profile-python-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/extraction-profile-python-review.md) | Clean-room review of Python profile `py-tokens` `draft-1` (98/98 first-run vector match) |
| [research/reviews/registration-record-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/registration-record-review.md) | Non-author review of registration record draft, fixtures, and Lane 13 |
| [research/reviews/evaluation-harness-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/evaluation-harness-review.md) | Non-author review and confirmation passes for the M3 evaluation harness (`i3-eval`) |
| [research/reviews/implementation-merge-i1-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/implementation-merge-i1-review.md) | I1 dual-implementation extractor review (9.89M differential cases) |
| [research/reviews/implementation-merge-i2-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/implementation-merge-i2-review.md) | I2 dual-implementation comparison and report review (76/76 bodies, 5,000/5,000 clean-room pairs) |
