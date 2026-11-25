---
title: Evidence and provenance
description: What a Traceweave comparison report is, private catalogue commitments, signing interoperability status, and C2PA 2.5 mapping status.
section: Specification
status: Experimental draft (M4.1–M4.2, M4.5 and C2PA.3 met; M4.3–M4.4, M4.6 and C2PA.1–C2PA.2 open)
---

Traceweave treats similarity evidence and cryptographic authentication as separate layers ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md), [spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)). A comparison report records what two catalogues shared under a fixed configuration; cryptographic verification checks who signed a byte sequence and whether an artifact's exact digest matches.

## What a comparison report is (and is not)

A report (`traceweave-report-draft-2`) is an inspectable record of a catalogue-only comparison ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)):

- **Deterministic body:** binds the SHA-256 digests of the reference catalogue, candidate catalogue, comparison configuration, and optional suppression catalogue (`inputs`), plus per-pair outcomes, matched regions with UTF-8 byte spans, distinct-hash counts, and unreduced containment and Jaccard fractions.
- **Separate provenance block:** records `bodySha256`, `comparisonConfigSha256`, `implementation` (`name`, `version`, `commit`), `specCommit`, and optional `generatedAt` (explicitly a claimed time, not a trusted timestamp).
- **Schema scope:** comparison reports carry matching observations only (`additionalProperties: false`). Fields for attribution, ranking, scores, signatures, or context notes are rejected by schema validation ([test-vectors/matching/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/README.md)).

### Independent verification checks

An implementation handling signed evidence reports six checks independently rather than collapsing them into a single status badge ([docs/implementation-patterns.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/implementation-patterns.md)):

1. **Exact subject digest** (does the candidate match the exact SHA-256 subject?)
2. **Signature validity** (does the cryptographic signature verify over the exact PAE bytes?)
3. **Signer trust** (is that key accepted by the verifier's local trust policy?)
4. **Timestamp verification** (if an RFC 3161 token is present, does it verify independently?)
5. **Fingerprint or mark comparison** (what candidate spans or bit agreements were observed?)
6. **Origin and context review** (handled outside the detector in a separate review packet)

A soft fingerprint match does not satisfy a failed exact subject digest, a valid signature from an untrusted key does not satisfy trust, and signing bytes authenticates the signer rather than establishing original authorship ([spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)).

## Private catalogue commitment

To preserve a record of a reference catalogue without publishing its contents, [spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md) defines a salted exact-byte commitment (`sha256-salted-catalogue-v1`):

```text
D = UTF8("Traceweave-Catalogue-v0.1") || 0x00
R = 32-byte OS cryptographic random nonce (kept private with the opening)
L = uint64_be(len(C))
C = exact private catalogue byte sequence

commitment = SHA256(D || R || L || C)   (64 lowercase hex characters)
```

- **Opening is all-or-nothing:** opening discloses the entire catalogue `C` and nonce `R`. Selective disclosure is not specified in this draft.
- **Exact bytes matter:** re-serializing a catalogue changes its bytes and normally breaks the commitment.
- **Commitment/disclosure review (`M4.6`):** a commitment/disclosure review is filed in [docs/reviews/commitment-disclosure-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/reviews/commitment-disclosure-review.md), with blocking finding `CD-B2` (catalogue opening-nonce validation) fixed and confirmed; gate `M4.6` remains open pending named external non-author closure.
- **What is verified today:** independent Go (`crypto/sha256`), Rust (`sha2 0.10.9`), and Python implementations all reproduce the synthetic commitment vector `f4df04ab00454b3a4b1bc25d80009a8a3e82f9d5d4f4eeed08c6cbbd9891c4a9` in [test-vectors/commitment.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/commitment.json) and reject altered openings or invalid nonce lengths across 50 native outcomes (gate [M4.2](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md), **met**; [research/lanes/signing-policy-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/signing-policy-results.md)).

## Signing and DSSE / in-toto status

Traceweave specifies a restricted in-toto Statement v1 adapter (`_type: https://in-toto.io/Statement/v1`, single SHA-256 subject) wrapped in a DSSE envelope (`payloadType: application/vnd.in-toto+json`) signed over upstream Pre-Authentication Encoding (PAE) bytes ([spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)):

```text
PAE(type, body) = "DSSEv1" + SP + LEN(type) + SP + type + SP + LEN(body) + SP + body
```

**Current status: `M4.1`, `M4.2`, and `M4.5` are met, and offline-first registration (`traceweave-registration-draft-5` + §4.7 + §9.1 `tw1-`, `REG.1`/`REG.2`) is implemented and verified in both independent Rust and Go CLIs (`a6066d3`, 0 divergences, 0 external dependencies), while core M4 release gates `M4.3`–`M4.4` and `M4.6` remain open until vectors promote to `test-vectors/` and named non-author review closes (no public release or hosted service yet).**

| Gate | Status | Evidence / remaining work |
| --- | --- | --- |
| **M4.1** Go/Rust DSSE interop | **Met** | 66/66 outcomes passed across Go→Go, Go→Rust, Rust→Go, and Rust→Rust using pinned `go-securesystemslib v0.11.1`, `wsc-dsse 0.12.1`, and `ed25519-compact 2.3.0` on the synthetic 762-byte statement under OS network denial ([research/lanes/signing-interop-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/signing-interop-results.md)) |
| **M4.2** Go/Rust commitments | **Met** | 50/50 native commitment outcomes + 72 shared-policy checks passed ([research/lanes/signing-policy-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/signing-policy-results.md)) |
| **M4.3** Negative crypto vectors | **Open** | Offline-first registration `REG.1`/`REG.2` vectors shipped in `traceweave` `main` @ `a6066d3` (`docs/reviews/m4-reg-review.md`); `M4.3` stays open until vectors promote to `test-vectors/` and `validate` checks them |
| **M4.4** Two strict parsers | **Open** | `traceweave` `main` @ `a6066d3` (`docs/reviews/m4-reg-review.md`) ships independent Rust + Go offline-first `traceweave-registration-draft-5` + §4.7 `claims.aiUse` + §9.1 `tw1-`, passing 86/86 positive and 140/140 negative fixtures + 6 cross-CLI interop + 54 `tw1-` + 70 fuzz + 14 B1–B6 probes with 0 divergences and 0 new external dependencies; `M4.4` stays open until `M4.3` vectors promote to `test-vectors/` |
| **M4.5** in-toto adapter & trust policy | **Met** | [trust-policy.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/trust-policy.md), 4 accept / 26 reject in-toto adapter fixtures wired into `tools/validate.py` ([intoto-adapter-fixtures/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/intoto-adapter-fixtures/README.md)), [timestamp-adapter-decision.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/timestamp-adapter-decision.md), non-author review [m4-5-intoto-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/m4-5-intoto-review.md) @ `51033c9` |
| **M4.6** Commitment design review | **Open** | Commitment/disclosure review filed in [docs/reviews/commitment-disclosure-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/reviews/commitment-disclosure-review.md) with `CD-B2` opening-nonce validation fixed and confirmed; stays open pending named non-author closure |

Until all M4 engineering gates close, any experimental detector release must be labelled **unsigned detector-only** (roadmap gate `M5.4`). Sigstore bundles and RFC 3161 timestamps remain optional future integrations, never mandatory public logs ([spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)).

## Registration record design (`draft-5`) and Lane 13

Following the `e-img-m-2` finding that image watermarks act as a finding aid rather than evidence of origin, [research/drafts/registration-record.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/registration-record.md) (`draft-5`, with **§4.7** self-declared AI-use claim and **§9.1** frozen `tw1-` text reference; confirmed by non-author review in [registration-record-draft-2-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/registration-record-draft-2-review.md) after earlier [registration-record-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/registration-record-review.md)) and [research/lanes/13-timestamp-evidence-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/13-timestamp-evidence-review.md) specify how a signed, timestamped registration record can establish an upper time bound without disclosing private content.

- **Structure:** a signed in-toto Statement v1 (`traceweave-registration-draft-5`) wrapped in a DSSE envelope with a fresh 32-byte OS random nonce, exact subject digests (1–64 subjects), a salted possession digest (`sha256-salted-possession-v1`), an optional salted catalogue commitment (`sha256-salted-catalogue-v1`), and separate time evidences countersigning **one** DSSE signature under **one** trust anchor.
- **Recommended first time sources (Lane 13):** **two unrelated RFC 3161 time-stamping authorities plus OpenTimestamps (Bitcoin)** — three independent trust anchors with quorum `q = 2`, so retroactive loss of one TSA still leaves quorum. `draft-5` specifies RFC 5280 path validation at `genTime` (cross-checked against `openssl ts -verify`), pinned OpenTimestamps checkpoint headers with `minConfirmations`, and a terminating two-pass key-event procedure (retire, rotate, or compromise) verified against 86 positive, 140 negative, and 43 wrong-implementation fixtures.
- **Optional self-declared AI-use claim (§4.7, owner decision 2026-11-24):** optional `claims.aiUse` (`generated`, `modified`, or `no-generative-ai`, plus an optional constrained tool token with anti-origin-claim checks and quoted rendering frame), signed at registration, mapped to the EU Code of Practice Annex 1 and IPTC Digital Source Type (with no IPTC term for `no-generative-ai`), never checked by Traceweave, and never affecting trust, time, key-event, digest, or possession outcomes. When absent, verification results explicitly report `declaredAiUse: {"status": "not-declared"}`.
- **Frozen text reference (§9.1, normative 2026-11-24):** `tw1-` followed by 26 upper-case Crockford base32 characters encoding the first 130 bits of `statementSha256` plus 1 Luhn mod 32 check character, for pasted text that cannot carry metadata; carries no content and no identity.
- **Separate verification outputs & agent skills (planned `SK.3`–`SK.5`):** a verifier reports digest/possession checks, per-signature validity and signer trust, key events, each time evidence, and per-signature earliest and quorum `notAfter` bounds (no single combined verdict), and includes local-first creation-time registration and verification skills over A2A 1.0 and MCP 2026-07-28 where only digests cross the wire.
- **Status and scope:** offline-first registration (`REG.1`/`REG.2`) is implemented and verified in both independent Rust and Go CLIs (`a6066d3`, `docs/reviews/m4-reg-review.md`, 0 divergences, 0 new external dependencies), while `M4.3`–`M4.4` stay open until vectors promote to `test-vectors/` and the format is not yet a released normative standard; **no external time-stamping service, calendar, log, or witness has been contacted** (contacting external TSAs awaits an owner decision). A registration shows exact bytes existed under a signing key no later than time `T` — first to register is not first to create. See [Embedding & Shelf compatibility checklist](/docs/embedding-and-shelf) for where Shelf cards and `tw1-` references can be embedded across platforms and content types.

## C2PA 2.5 mapping status

> [!NOTE]
> **Status:** `C2PA.3` (no-compatibility-claim check) is **met** (2026-11-25). The C2PA 2.5 mapping in [research/drafts/c2pa-mapping.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/c2pa-mapping.md) (`org.traceweave.*` namespace, including §1.8 `org.traceweave.registration-link` linking a sidecar manifest to an M4 `tw1-` + `statementSha256` registration) is audited and reviewed ([media-c2pa-av-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/media-c2pa-av-review.md)), awaiting owner decision D1 (`C2PA.1` open). No C2PA compatibility is claimed, no C2PA tool (such as `c2pa-rs`) has been installed, built, or run, and no fixture has been serialized to CBOR or JUMBF or signed (`C2PA.2` owner-blocked on D7/D10).

The draft maps Traceweave records against C2PA Technical Specification 2.5 and the Soft Binding API 2.5, with **7 positive JSON fixtures** (`f1`–`f7`, including `f7` sidecar `org.traceweave.registration-link`) and **22 negative fixtures** checked by `tools/validate.py` via `check_fixtures.py` ([research/drafts/c2pa-fixtures/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/c2pa-fixtures/README.md)). Key findings:

- **Fundamental semantic gap:** C2PA soft bindings ask *"which manifest belongs to this single asset?"* and return a manifest ID (optionally with an uncalibrated 0–100 `similarityScore`). Traceweave asks *"how much of catalogue B overlaps catalogue A under a fixed configuration?"* and returns closed outcomes, minimum-evidence regions, and raw-count fractions without a score field.
- **Soft-binding registry limits:** Traceweave cannot reuse the third-party PDQ entry (`com.originalpictures.pdq.1`, id 74) because it encodes a different implementation and threshold. Its current 64-bit ISCC Image-Code output does not satisfy draft IEP-0020's requirements for `io.iscc.v0` (256-bit units plus Data-Code and Instance-Code). No registered soft-binding algorithm exists for Traceweave's token-winnowing profiles. TrustMark variants `Q/C/P/F` are registered (`com.adobe.trustmark.*`), though registration is not evaluation.
- **Hard-binding mismatch:** Traceweave's `sha256` hashes exact compared bytes. A C2PA hard binding matches it only for a sidecar or remote manifest using `c2pa.hash.data` with no exclusions; embedded manifests, box hashes (`c2pa.hash.boxes`), structured text comment blocks, and NFC-normalized unstructured text differ in byte set or offsets.
- **Recommended report transport:** keep Traceweave comparison reports in a **separate in-toto/DSSE statement** (option B), optionally referenced from a C2PA manifest via `c2pa.external-reference` (option C), rather than embedding private multi-file comparison reports inside a public single-asset C2PA manifest (option A).
- **Round-trip lossiness:** round-tripping an image catalogue entry through C2PA (`f5`) retains only 2 of 20 leaf fields (the PDQ hash and, in the sidecar case only, the artifact digest); profile metadata, quality scores, thresholds, and abstentions are lossy or unmapped.
