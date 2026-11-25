---
title: Profiles
description: Status, channels, parameters, and conformance vectors for every Traceweave content profile.
section: Specification
status: Draft profiles (experimental)
---

Traceweave keeps matching algorithms, tokenizers, normalization rules, and error codes inside versioned **profiles** rather than assuming a single universal representation ([profiles/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/README.md)). One shared evidence format sits underneath, with a profile for each medium. Go and Rust are the first two working case-study profiles, and TypeScript/JavaScript (`ts-tokens`, `TS.3`) and plain text (`text-plain`, `TXT.3`) are now also verified across both independent Rust and Go implementations; Python (`py-tokens`) is frozen as specified and not yet implemented, still images have been measured in two studies (`e-img-f-2` and `e-img-m-2`), and more languages and audio are planned ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md), [profiles/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/README.md)). No universal similarity threshold exists across profiles, and none of the profiles below is a registered standard algorithm. For a side-by-side creator checklist of which platforms and content types support signing, fingerprinting, and finding-aid marks, see [Embedding & Shelf compatibility checklist](/docs/embedding-and-shelf).

## Profile summary

| Profile | Version | Status | Channels | Shipped experimental parameters | Reference vectors |
| --- | --- | --- | --- | --- | --- |
| **Go** (`go-tokens`) | `draft-1` | First case-study profile (experimental draft); verified across two independent implementations | `exact`, `normalized` | `k = 5`, `w = 4`, `maxInputBytes = 1 MiB` | 49 vectors (16 accepted, 33 errors) + 3 limits ([test-vectors/extraction/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/README.md)) |
| **Rust** (`rust2024-tokens`) | `draft-1` | First case-study profile (experimental draft); verified across two independent implementations | `exact`, `normalized` | `k = 5`, `w = 4`, `maxInputBytes = 1 MiB` | 118 vectors (42 accepted, 76 errors) + 3 limits ([test-vectors/extraction/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction/README.md)) |
| **TypeScript / JavaScript** (`ts-tokens`) | `draft-2` | Stage-1 profile verified across two independent Rust and Go implementations (`TS.3` met, 132/132 vendored vectors) | `exact`, `normalized` (`;` excluded from normalized) | `k = 5`, `w = 4`, `maxInputBytes = 1 MiB` | 77 vectors + 3 limits ([test-vectors/extraction-typescript/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction-typescript/README.md)) |
| **TSX / JSX** (`tsx-tokens`) | `draft-2` | Deferred draft (not normative; rejected as `unsupported-config`) | `exact`, `normalized` | `k = 5`, `w = 4`, `maxInputBytes = 1 MiB` | 33 draft vectors ([test-vectors/extraction-typescript/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction-typescript/README.md)) |
| **Python** (`py-tokens`) | `draft-1` | Frozen for stage-1 implementation (specified, not yet implemented; registered in `spec/catalogue-report.md`, awaiting promotion to `profiles/`) | `exact`, `normalized` (`normalizedExclusions` empty; zero-width `newline`, `indent`, `dedent`) | `k = 5`, `w = 4`, `maxInputBytes = 1 MiB` | 107 vectors (68 accepted, 39 errors) + 3 limits + 20 negative configs ([extraction-vectors-python/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/extraction-vectors-python/README.md)) |
| **Plain text** (`text-plain`) | `draft-1` | Stage-1 profile verified across two independent Rust and Go implementations (`TXT.3` met, 154/154 vendored vectors) | `exact`, `folded`, `skeleton` | `k = 8`, `w = 8`, `maxInputBytes = 1 MiB` | 55 vectors + 3 limits + 60 records ([test-vectors/extraction-text/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction-text/README.md)) |
| **Markdown** (`text-markdown`) | `draft-2` | Draft (awaits re-review; not normative; rejected as `unsupported-config`) | `exact`, `folded`, `skeleton` | `k = 8`, `w = 8`, `maxInputBytes = 1 MiB` | 21 draft vectors ([test-vectors/extraction-text/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction-text/README.md)) |
| **Still images** (`traceweave-image-fingerprint`) | `draft-2` | Research draft (not in `profiles/` yet); synthetic contract run `e-img-f-2` completed | PDQ (256-bit) and ISCC Image-Code v0 (64-bit), reported side by side | `T_pdq = 31` (quality floor 50), `T_iscc = 7` | 30 ThreatExchange PDQ vectors + 3 ISCC vectors ([research/drafts/extraction-profile-image.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/extraction-profile-image.md)) |
| **Audio / Binary** | — | Planned (not started; deferred after M3.4) | — | — | None ([profiles/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/README.md)) |

## Go (`go-tokens` / `draft-1`)

Defined in [spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md) §4 and linked from [profiles/code.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/code.md).

- **Authority:** *The Go Programming Language Specification* (`go1.27`), with identifier classes evaluated strictly from pinned **Unicode 17.0.0** tables (`go_letter` = `Lu/Ll/Lt/Lm/Lo` + `_`; `go_digit` = `Nd`).
- **Token classes (8):** `keyword` (25 Go keywords), `ident` (including predeclared identifiers like `int`, `true`, `nil`), `punct`, `int`, `float`, `imag`, `rune`, `string`.
- **Semicolon insertion:** reproduces Go's lexical semicolon insertion rule; inserted semicolons carry `inserted: true` and an empty span `[e, e)` at the end of the triggering token, and serialize identically to explicit `;`.
- **Comments and directives:** line comments (`//`) and non-nested general comments (`/* ... */`) are dropped as trivia, including `//go:` and `//line` directives.
- **Closed error list (8 + config):** `invalid-utf8`, `bom`, `nul`, `input-too-large`, `illegal-character`, `unterminated-comment`, `unterminated-literal`, `malformed-literal` (plus `unsupported-config`).
- **Implementation status:** as one of the first two case-study profiles, reproduced byte-for-byte by two independent hand-written lexers (in Rust and Go) as evidence that the specification can be implemented independently (9.89 million differential cases agreed in the I1 review; [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)).

## Rust (`rust2024-tokens` / `draft-1`)

Defined in [spec/extraction.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/extraction.md) §5.

- **Authority:** *The Rust Reference* (edition 2024, Rust 1.97.1 docs), using pinned Unicode 17.0.0 `XID_Start`/`XID_Continue` and NFC tables.
- **Token classes (14):** `keyword`, `ident`, `lifetime`, `punct` (single-character tokens), `int`, `float`, `char`, `byte`, `string`, `rawstring`, `bytestring`, `rawbytestring`, `cstring`, `rawcstring`.
- **Deliberate strictness:** rejects NUL, BOM, isolated CR (`isolated-cr`), non-NFC identifiers (`non-nfc-identifier`), and U+200C/U+200D in identifiers (`malformed-identifier`). Handles shebang look-ahead, nested block comments, raw strings (up to 255 `#`), literal suffixes, and delimiter balance (`unbalanced-delimiter`). Doc comments are dropped as trivia.
- **Normalization:** erases `ident`, all literal classes, and `lifetime` values except `'static` and `'_`.
- **Closed error list (13 + config):** Go's 8 codes plus `isolated-cr`, `reserved-token`, `unbalanced-delimiter`, `non-nfc-identifier`, `malformed-identifier`.
- **Implementation status:** as the second case-study profile, reproduced byte-for-byte by both independent implementations alongside `go-tokens` ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)).

## TypeScript / JavaScript (`ts-tokens` stage 1; `tsx-tokens` deferred)

Defined in [profiles/typescript.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/typescript.md) and registered in [spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md) §3.6 (amendment A4).

- **Staging:** `ts-tokens` (`draft-2`) is frozen for stage-1 implementation and covers `.ts`, `.mts`, `.cts`, and non-JSX `.js`, `.mjs`, `.cjs`. `tsx-tokens` (`.tsx`, `.jsx`) is a **deferred draft** until measured on a real JSX corpus.
- **Authority:** ECMAScript 2026 (ECMA-262 17th ed.) with Unicode 17.0.0 `ID_Start`/`ID_Continue` deltas, cross-checked against TypeScript 6.0.3 (`119/119` files, 2,478,321 tokens in TypeScript's `lib/` agreed; [test-vectors/extraction-typescript/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/test-vectors/extraction-typescript/README.md)).
- **Key lexical design choices:**
  - **No automatic semicolon insertion (ASI):** instead, `punct` `;` is kept in `exact` and **excluded from `normalized`** (`normalizedExclusions`), raising semicolon-stripping normalized fingerprint survival from 62.5–67.3% (`draft-1`) to 100% (`draft-2`) on TypeScript's `_tsc.js` ([profiles/typescript.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/typescript.md)).
  - **Regex vs division:** handled without a parser via an `exprEnd` state flag and delimiter stack, with documented departures (such as regex immediately after a function/class declaration `}`).
  - **File selection exclusions (caller-side):** `.d.ts` declarations, `@generated`/`DO NOT EDIT` files, `.min.js` or lines longer than 4,096 bytes.
- **Implementation status:** two-implementation gate `TS.3` is **met** (`8011b6d`, `docs/reviews/text-ts-review.md`): independent Rust and Go implementations match 132/132 vendored `ts-tokens` vectors and 3,684 integrator + 768 reviewer + 102 adversarial differential cases with 0 divergences, and reject `tsx-tokens` as `unsupported-config`; `TS.1`, `TS.2`, and separate evaluation `TS.4` remain open ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)).

## Python (`py-tokens` / `draft-1`)

Defined in [research/drafts/extraction-profile-python.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/extraction-profile-python.md), frozen for stage-1 implementation (`58c25a9`) after clean-room review ([research/reviews/extraction-profile-python-review.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/reviews/extraction-profile-python-review.md)), and registered in [spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md) §3.6 (amendments A13/A14: profile-conditional zero-width tokens). Pending promotion to `profiles/`.

- **Authority:** *The Python Language Reference* (CPython `v3.14.6`), with pinned Unicode 17.0.0 `xid_start`/`xid_continue` tables and no deltas.
- **Layout tokens and empty spans:** `newline`, `indent`, and `dedent` are zero-width tokens with empty text (`text == input[span]`), so layout-only k-grams can yield empty spans `[n, n)` even at `k = 5` (pinned by `py-empty-span-fingerprint`). Nesting for brackets and f/t-strings requires an explicit stack (no recursion per nesting level).
- **Channels:** `exact` and `normalized` with an empty `normalizedExclusions` list; soft keywords lex as `ident`.
- **File selection exclusions (caller-side):** `.pyi` stubs, `@generated`/`DO NOT EDIT` files, non-UTF-8 PEP 263 files containing bytes ≥ 0x80, notebooks (`.ipynb`), and Cython files.
- **Cross-check and clean-room verification:** clean-room review reproduced 98/98 pre-review vectors on the first run; post-review vector set holds **107 vectors** (68 accepted, 39 errors), 3 limit vectors, and 20 negative configs, rejecting 32/32 mutations and 29/29 wrong lexers ([extraction-vectors-python/README.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/extraction-vectors-python/README.md)). CPython 3.14.6 cross-check agreed on **1,847/1,847 lexable standard-library files** (5,909,005 tokens, 0 undocumented divergences) and 800,000 differential fuzz cases (400,000 × 2 seeds).
- **Implementation status:** specified, not yet implemented in Rust/Go CLIs (gates `PY.1`–`PY.4` open; [ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)).

## Plain text and Markdown (`text-plain` stage 1; `text-markdown` draft)

Defined in [profiles/text.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/text.md) and registered in [spec/catalogue-report.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/spec/catalogue-report.md) §3.6 (amendment A4).

- **Staging:** `text-plain` (`draft-1`) is frozen for stage-1 implementation. `text-markdown` (`draft-2`, using a linear set of masks MD-1 through MD-7 against CommonMark 0.31.2 rather than a full CommonMark parser) remains a draft awaiting re-review.
- **Three channels:**
  1. **`exact`:** original UTF-8 token bytes (including any internal `Default_Ignorable` characters).
  2. **`folded`:** `NFD → NFKC_CF → NFC → delete separators → NFC` using pinned Unicode 17.0.0 tables (eliminates case, ligatures like `ﬁ`, fullwidth forms, and zero-width characters; no stemming or stop words).
  3. **`skeleton`:** single-pass UTS #39 confusable skeleton over the folded token using digest-pinned `confusables.txt`, neutralizing listed homoglyphs (such as Cyrillic lookalikes) at the cost of intentional cross-script collisions.
- **Spans and input rules:** every folded and skeleton token maps back to its **original** half-open UTF-8 byte span. A leading BOM is accepted (as `Default_Ignorable`) and isolated CR is a separator; only `invalid-utf8`, `nul`, `input-too-large`, and `unsupported-config` are errors.
- **Parameters and limits:** shipped `k = 8, w = 8` (locality threshold 15 word tokens). Ideographs tokenize per character; scripts without spaces or ideographs (such as Thai) tokenize per space/punctuation run; paraphrase and translation are expected misses ([profiles/text.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/profiles/text.md)).
- **Implementation status:** two-implementation gate `TXT.3` is **met** (`8011b6d`, `docs/reviews/text-ts-review.md`): independent Rust and Go implementations match 154/154 vendored `text-plain` vectors and 3,684 integrator + 768 reviewer + 102 adversarial differential cases with 0 divergences, and reject `text-markdown` as `unsupported-config`; gates `TXT.0`–`TXT.2`, `TXT.4` (stage-1 prose run), and `TXT.5`–`TXT.8` remain open ([ROADMAP.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/ROADMAP.md)).

## Still-image fingerprints (`traceweave-image-fingerprint` / `draft-2`)

Research draft in [research/drafts/extraction-profile-image.md](https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2/research/drafts/extraction-profile-image.md) (gate `IMGF.1`, open pending formula specification for ISCC resize/grey steps and non-author item recount).

- **Shared decode stage:** JPEG and PNG only (≤ 64 MiB, ≤ 50M pixels, shorter side ≥ 32 px, 8-bit `L`/`LA`/`P`/`RGB`/`RGBA`), multi-frame and CMYK abstain, JPEG EXIF orientation applied, alpha flattened onto white, ICC profiles ignored and recorded.
- **Two extractors reported side by side (no combined score):**
  - **PDQ** (256-bit DCT hash, 0–100 quality score, abstain when quality ≤ 49, experimental Hamming threshold ≤ 31 over 8 query dihedral variants).
  - **ISCC Content-Code Image v0** (64-bit DCT hash over trimmed 32×32 greyscale image, experimental threshold ≤ 7 over 8 dihedral variants).
- **Measured status:** reference-vector conformance (`IMGF.2`), frozen protocol (`IMGF.3`), and 200-image synthetic contract check (`IMGF.4`, `e-img-f-2`) are **met**; C++ independent comparison (`IMGF.5`) and real-image false-match measurement (`IMGF.6`, owner-gated) remain open. See [Image fingerprint run (e-img-f-2)](/docs/research/image-fingerprint-study).
