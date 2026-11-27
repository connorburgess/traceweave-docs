---
title: Embedding & Shelf compatibility checklist
description: Where you can embed Traceweave Shelf cards, what works with JavaScript off versus live in-browser checking, and which content types support registration, fingerprinting, and finding-aid marks.
section: Specification
status: Interactive prototype (shelf.traceweave.org live · traceweave-registration-draft-5)
---

This checklist summarizes where a **Traceweave Shelf** card or `tw1-` text reference can be embedded today, how each platform behaves with and without JavaScript, and which content types work for signed registration, reuse fingerprinting, and finding-aid marks.

> [!NOTE]
> **Prototype status:** [**Traceweave Shelf**](https://shelf.traceweave.org) is live as an interactive prototype. The underlying registration specification (`traceweave-registration-draft-5`, with §4.7 optional self-declared AI use and §9.1 frozen `tw1-` text reference) is promoted to normative [spec/registration-record.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/registration-record.md) with **all 6/6 M4 gates (`M4.1`–`M4.6`) met** (`traceweave` `main` @ `5b9a881`, pinned to published spec `9cf78ee`, `356/356` vendored files, 0 divergences, 0 external dependencies across Rust and Go CLIs), and the pure-Rust WebAssembly engine (`crates/tw-wasm`, `WEB.0`–`WEB.2` met at `51f29d7`, 0 WASM imports, 0 network calls) runs byte-identical verification offline in the browser. The live Shelf site does not imply a hosted signing, witness, or external time-stamping service; those remain subject to separate owner decisions.

## Browser comparison and testing tabs

[Open Shelf](https://shelf.traceweave.org) and select Fingerprint, Catalogue comparison, Replay report or Testing page (published source `c0c34cc407e39b80b293ccec6e255db0207acd4a`). Replay report recomputes comparison bodies; it does not authenticate original content or replace registration verification. The [bounded WEB.3 closure](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/web3-bounded-gate-closure-99a1a8b.md) covers accepted fixed fixtures, with physical-device, privacy and WEB.6 limits retained.

The [Testing page source notes](https://github.com/connorburgess/traceweave-shelf/blob/c0c34cc407e39b80b293ccec6e255db0207acd4a/docs/testing-page.md) describe six scoped Go lexical operations, six synthetic demonstrations with three both-mode misses, and two distinct controls. These are bounded examples, not general Go transformations or preserved-behavior promises. WEB.4 remains planned at published spec `b1177b6`, even though the page is published; WEB.5 is uncertified and WEB.6 planned. This does not announce public native signing tooling or hosted signing/time services.

## Where you can embed Traceweave Shelf cards

Every Traceweave registration is a static, self-contained bundle (`traceweave-registration-bundle-draft-5`) plus a short deterministic text reference (`tw1-` + 27 Crockford base32 characters, [spec/registration-record.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/registration-record.md) §9.1). Embedding needs no central database and no server-side API.

| Platform / medium | Recommended embed format | Works with JS off? | Live `"Checked just now"` check? | Notes |
| --- | --- | --- | --- | --- |
| **Plain HTML & static sites** | Full split-slab concrete card (HTML + CSS) linking to the static bundle | **Yes** — full card, `tw1-` reference, and bundle link render cleanly | **Optional** — add the client-side `"Check provenance"` script | Zero backend; the bundle can sit right beside the page as a static `.json` file |
| **Markdown, GitHub READMEs & docs** | Compact badge or plain-text line with the `tw1-` reference and record link | **Yes** — pure Markdown, no scripts or custom HTML required | **No** (follows link to a verifier or offline CLI) | Works in GitHub, GitLab, Codeberg, and any Markdown renderer; `tw1-` uses upper-case Crockford base32 with no Markdown-breaking punctuation |
| **Blogs & CMSes** (Galley, Ghost, WordPress, Substack, Beehiiv) | Custom HTML block for the split-slab card (Galley, Ghost, WordPress), or compact `tw1-` reference + record link fallback (Substack, Beehiiv, email) | **Yes** — HTML card or link fallback degrades cleanly | **Where custom scripts are allowed** (Galley, Ghost, self-hosted WordPress); link fallback on script-stripping platforms | Platforms that strip `<script>` or custom HTML (newsletters, Substack, Beehiiv) still carry the full `tw1-` reference and verification link |
| **Web frameworks** (Next.js, Astro, static exports) | Prerendered HTML/JSX split-slab card + static bundle file | **Yes** — static markup with zero server routes and zero hosted DB | **Optional** — client-side `"Check provenance"` script runs in the browser | Fits static exports (`next build`, `astro build`) without adding an API route or database |
| **Physical, gallery & print** | Printed QR code encoding **only** the `tw1-` reference and record URL | **Yes** — scannable from wall labels, books, zines, and packaging | Opens the linked verification view or bundle on the viewer's device | Never encodes private source bytes, keys, or personal identity — only the reference and public record URL |

### JavaScript off vs live in-browser verification

- **With JavaScript off (always works):** visitors see the static card or compact `tw1-` reference, the registrant's stated record metadata, and a direct link to the registration bundle so anyone can download and verify it offline with a local CLI.
- **With the optional `"Check provenance"` script enabled:** clicking `"Check provenance"` fetches the linked static bundle in the visitor's own browser, recomputes the `tw1-` reference, digests, DSSE signatures, key events, and time evidences locally, and updates the card to **`Checked just now`** — with no central verification server, no account, and no hosted database.

## Content types checklist

Traceweave separates **signed & timestamped registration** (which operates on raw file bytes of any kind), **reuse fingerprinting** (which uses a medium-specific profile), and **embedded marks** (finding aid only). See [Profiles](/docs/profiles) and [Evidence & provenance](/docs/evidence-and-provenance) for full technical details.

| Content type | Signed & timestamped registration (M4) | Reuse fingerprinting profile | Embedded marks (finding aid only) |
| --- | --- | --- | --- |
| **Source code — Go & Rust** | **Yes** (any file bytes) | **Implemented in Rust & Go** (`go-tokens`, `rust2024-tokens`; all M1/M2 core gates met; M3 eval not yet run) | **Not supported** — syntax carriers reset 55/55 under cheap normalization ([SYN.1–SYN.5](/docs/research/synthetic-carriers), [Lane 06](/docs/research/lane-06-code-carriers)) |
| **Source code — TypeScript / JS** | **Yes** (any file bytes) | **Implemented in Rust & Go** (`ts-tokens`, `TS.3` met at `8011b6d`; `tsx-tokens` deferred) | **Not supported** (erased by normalization) |
| **Source code — Python** | **Yes** (any file bytes) | **Implemented in Rust & Go** (`py-tokens`, `PY.1`–`PY.3` met: promoted to [profiles/python.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/python.md), 0 divergences at `b5d981c`; `PY.4` open) | **Not supported** (erased by normalization) |
| **Essays & plain text** | **Yes** (any file bytes) | **Implemented in Rust & Go** (`text-plain`, `TXT.3` & `TXT.7` met; Stage-1 prose eval `TXT.4`/`e-txt-1` closed as `negative-result` on repeated-structure prose; `text-markdown` draft) | **Not supported** (`TXT.8` `negative-result` for Unicode carriers) — Unicode homoglyph & zero-width marks are erased by canonical folding ([Lane 09](/docs/research/lane-09-text-profile), [txt8-unicode-mark-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/txt8-unicode-mark-review.md)) |
| **Still images** | **Yes** (any file bytes) | **Synthetic contract checked** (PDQ + ISCC in `e-img-f-2`, `IMGF.2`–`IMGF.4` met; C++ & real-image checks open; [Image fingerprint run](/docs/research/image-fingerprint-study)) | **Finding aid only** — PixelSeal & TrustMark-Q measured in [e-img-m-2](/docs/research/image-mark-study) (`IMG.0`–`IMG.4` met; `IMG.5` met through reviewed draft schema accommodation only, without normative promotion; finding-aid schema & fixtures with `provesOrigin: false` + optional `tw1-` link); marks transfer 100/100 without the key, so pair with M4 registration + optional C2PA link |
| **Audio & video** | **Yes** (any file bytes + optional C2PA `org.traceweave.registration-link`) | **Scoped; profile upcoming** ([Lane 15](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/15-audio-video-scoping.md): Chromaprint, Audfprint, vPDQ, TMK+PDQF, ISCC Video-Code v0 evaluated; proposed `AUD.1–3`/`VID.1–3` unstarted) | **Finding aid only (not implemented)** — audio/video watermark candidates surveyed in [Lane 08](/docs/research/lane-08-cross-media) and [Lane 15](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/lanes/15-audio-video-scoping.md); any future record follows the `IMG.5` finding-aid boundary |
| **PDFs, documents, datasets & archives** | **Yes** (any file bytes) | **Planned / unprofiled** (extract text for `text-plain` where applicable; binary profile `BIN.1`–`BIN.2` deferred after `M3.4`) | **Not supported** |

### Quick summary by mechanism

1. **Signed & timestamped registration (`M4` — works on any file bytes):** binds exact SHA-256 subject digests and a salted possession digest (`sha256-salted-possession-v1`) inside a DSSE-signed in-toto statement (`traceweave-registration-draft-5`) with independent time evidences (recommended: two unrelated RFC 3161 TSAs + OpenTimestamps, quorum 2). Works identically for source code, essays, still images, audio, video, PDFs, datasets, and archives.
2. **Reuse fingerprinting profiles:** find shared fragments locally without uploading your work. Go (`go-tokens`), Rust (`rust2024-tokens`), TypeScript/JS (`ts-tokens`), Python (`py-tokens`), and plain text (`text-plain`, with Stage 1 prose eval `TXT.4` recorded as `negative-result` on repeated-structure prose) are implemented in both independent Rust and Go CLIs; still images (PDQ/ISCC) have completed synthetic contract checks; audio and video profiles are upcoming.
3. **Embedded marks (finding aid only):** only still-image marks (PixelSeal, TrustMark-Q) have been measured positively as a finding aid (`e-img-m-2`), and because reviewed encoders/decoders are public and unkeyed, a mark is never evidence of origin and should be paired with an M4 registration record (and optional C2PA manifest). Embedded marks in source code and plain text are not supported because cheap normalization erases them.

## What a signed Shelf card shows — and what it does not show

Every Traceweave registration view follows the mandatory interpretation rules in [spec/registration-record.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/registration-record.md) §1 and §11 ([spec/core.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/core.md)):

### What a signed card shows

- **Existence and signing before a bound:** the exact registered bytes existed, and that signing key signed a statement naming them, **no later than `<UTC>`** according to the verified time evidences and policy.
- **Independent technical checks:** subject digest match, DSSE signature validity, signer trust under the viewer's policy, key-event status (retire, rotate, compromise), and per-signature earliest and quorum `notAfter` bounds — reported separately rather than collapsed into one label.
- **Optional self-declared AI use (§4.7):** if the registrant included `claims.aiUse` (`generated`, `modified`, or `no-generative-ai`), the card displays what the registrant declared at registration time and explicitly notes that **Traceweave did not check it**. When absent, nothing is implied (`not-declared`).

### What a signed card does NOT show

- **Authorship or originality:** signing bytes authenticates the key that signed the statement, not who created the work.
- **First creation:** **first to register is not first to create.** Time evidence establishes an upper bound (`notAfter`), never a creation date or lower bound.
- **Ownership or permission:** Traceweave produces checkable facts about bytes, signatures, timestamps, and shared fragments. It does not lock content and does not make the call on ownership, authorship, or permission. What you do with the evidence is up to you.

## Related pages

- [Evidence & provenance](/docs/evidence-and-provenance) — registration record `draft-5` structure, `tw1-` references, commitments, and C2PA 2.5 mapping
- [Profiles](/docs/profiles) — detailed status, parameters, and vectors for every content profile
- [Limits & threat model](/docs/limits-and-threat-model) — why embedded marks fail in code/text and act only as a finding aid in images
- [Roadmap & status](/docs/roadmap) — exact gate counts (`34/47` core, all `6/6` M4 met; `29/55` later met, `2` negative-result, `24` open) and implementation status
