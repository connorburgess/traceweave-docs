---
title: Evidence and provenance
description: What a Traceweave comparison report is, private catalogue commitments, signing interoperability status, and C2PA 2.5 mapping status.
section: Specification
status: Experimental draft (M4.1–M4.2 met; M4.3–M4.6 and C2PA.1–C2PA.3 open)
---

Traceweave treats similarity evidence and cryptographic authentication as separate layers ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md), [spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)). A comparison report records what two catalogues shared under a fixed configuration; cryptographic verification checks who signed a byte sequence and whether an artifact's exact digest matches.

## What a comparison report is (and is not)

A report (`traceweave-report-draft-2`) is an inspectable record of a catalogue-only comparison ([spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md)):

- **Deterministic body:** binds the SHA-256 digests of the reference catalogue, candidate catalogue, comparison configuration, and optional suppression catalogue (`inputs`), plus per-pair outcomes, matched regions with UTF-8 byte spans, distinct-hash counts, and unreduced containment and Jaccard fractions.
- **Separate provenance block:** records `bodySha256`, `comparisonConfigSha256`, `implementation` (`name`, `version`, `commit`), `specCommit`, and optional `generatedAt` (explicitly a claimed time, not a trusted timestamp).
- **What the report forbids:** any `ownership`, `authorship`, `infringement`, `licence`, `origin`, `rank`, `score`, or `signatureValid` field. Schema validation rejects reports that include them (`additionalProperties: false`; [test-vectors/matching/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/matching/README.md)).

### Independent verification verdicts

An implementation handling signed evidence must report six checks independently rather than collapsing them into a single status badge ([docs/implementation-patterns.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/docs/implementation-patterns.md)):

1. **Exact subject digest** (does the candidate match the exact SHA-256 subject?)
2. **Signature validity** (does the cryptographic signature verify over the exact PAE bytes?)
3. **Signer trust** (is that key accepted by the verifier's local trust policy?)
4. **Timestamp verification** (if an RFC 3161 token is present, does it verify independently?)
5. **Fingerprint or mark comparison** (what candidate spans or bit agreements were observed?)
6. **Rights and origin review** (handled outside the detector in a separate review packet)

A soft fingerprint match never repairs a failed exact subject digest. A valid signature from an untrusted key never satisfies trust. Signing someone else's public content does not establish ownership ([spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)).

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
- **No independent security review yet:** the commitment design has not undergone its non-author review (gate `M4.6`, open).
- **What is verified today:** independent Go (`crypto/sha256`), Rust (`sha2 0.10.9`), and Python implementations all reproduce the synthetic commitment vector `f4df04ab00454b3a4b1bc25d80009a8a3e82f9d5d4f4eeed08c6cbbd9891c4a9` in [test-vectors/commitment.json](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/commitment.json) and reject altered openings or invalid nonce lengths across 50 native outcomes (gate [M4.2](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md), **met**; [research/lanes/signing-policy-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/signing-policy-results.md)).

## Signing and DSSE / in-toto status

Traceweave specifies a restricted in-toto Statement v1 adapter (`_type: https://in-toto.io/Statement/v1`, single SHA-256 subject) wrapped in a DSSE envelope (`payloadType: application/vnd.in-toto+json`) signed over upstream Pre-Authentication Encoding (PAE) bytes ([spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)):

```text
PAE(type, body) = "DSSEv1" + SP + LEN(type) + SP + type + SP + LEN(body) + SP + body
```

**Current status: experimental interoperability harness only — no shipping signing CLI or verifier exists yet.**

| Gate | Status | Evidence / remaining work |
| --- | --- | --- |
| **M4.1** Go/Rust DSSE interop | **Met** | 66/66 outcomes passed across Go→Go, Go→Rust, Rust→Go, and Rust→Rust using pinned `go-securesystemslib v0.11.1`, `wsc-dsse 0.12.1`, and `ed25519-compact 2.3.0` on the synthetic 762-byte statement under OS network denial ([research/lanes/signing-interop-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/signing-interop-results.md)) |
| **M4.2** Go/Rust commitments | **Met** | 50/50 native commitment outcomes + 72 shared-policy checks passed ([research/lanes/signing-policy-results.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/signing-policy-results.md)) |
| **M4.3** Negative crypto vectors | **Open** | Tampered payload/type/signature, untrusted key, duplicate-key payload, subject mismatch with distinct reason codes |
| **M4.4** Two strict parsers | **Open** | Native Go and Rust libraries currently differ on duplicate outer JSON keys and unsigned `keyid` hints; the policy harness enforced strict rules in a shared Python layer, not yet independently in both languages |
| **M4.5** in-toto adapter & trust policy | **Open** | Accept/reject fixtures, trust-policy document, and decision on optional RFC 3161 timestamp adapter |
| **M4.6** Commitment design review | **Open** | Independent non-author review of commitment and disclosure design |

Until all M4 engineering gates close, any experimental detector release must be labelled **unsigned detector-only** (roadmap gate `M5.4`). Sigstore bundles and RFC 3161 timestamps remain optional future integrations, never mandatory public logs ([spec/attestations.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/attestations.md)).

## C2PA 2.5 mapping status

> [!WARNING]
> **No C2PA compatibility is claimed.** The mapping in [research/drafts/c2pa-mapping.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/c2pa-mapping.md) is an unreviewed research draft. No C2PA tool (such as `c2pa-rs`) has been installed, built, or run, and no fixture has been serialized to CBOR or JUMBF or signed. Gates `C2PA.1`–`C2PA.3` remain open.

The draft maps Traceweave records against C2PA Technical Specification 2.5 and the Soft Binding API 2.5, with 6 illustrative JSON fixtures and 18 negative fixtures checked by a local script ([research/drafts/c2pa-fixtures/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/c2pa-fixtures/README.md)). Key findings:

- **Fundamental semantic gap:** C2PA soft bindings ask *"which manifest belongs to this single asset?"* and return a manifest ID (optionally with an uncalibrated 0–100 `similarityScore`). Traceweave asks *"how much of catalogue B overlaps catalogue A under a fixed configuration?"* and returns closed outcomes, minimum-evidence regions, and raw-count fractions without a score field.
- **Soft-binding registry limits:** Traceweave cannot reuse the third-party PDQ entry (`com.originalpictures.pdq.1`, id 74) because it encodes a different implementation and threshold. Its current 64-bit ISCC Image-Code output does not satisfy draft IEP-0020's requirements for `io.iscc.v0` (256-bit units plus Data-Code and Instance-Code). No registered soft-binding algorithm exists for Traceweave's token-winnowing profiles. TrustMark variants `Q/C/P/F` are registered (`com.adobe.trustmark.*`), though registration is not evaluation.
- **Hard-binding mismatch:** Traceweave's `sha256` hashes exact compared bytes. A C2PA hard binding matches it only for a sidecar or remote manifest using `c2pa.hash.data` with no exclusions; embedded manifests, box hashes (`c2pa.hash.boxes`), structured text comment blocks, and NFC-normalized unstructured text differ in byte set or offsets.
- **Recommended report transport:** keep Traceweave comparison reports in a **separate in-toto/DSSE statement** (option B), optionally referenced from a C2PA manifest via `c2pa.external-reference` (option C), rather than embedding private multi-file comparison reports inside a public single-asset C2PA manifest (option A).
- **Round-trip lossiness:** round-tripping an image catalogue entry through C2PA (`f5`) retains only 2 of 20 leaf fields (the PDQ hash and, in the sidecar case only, the artifact digest); profile metadata, quality scores, thresholds, and abstentions are lossy or unmapped.
