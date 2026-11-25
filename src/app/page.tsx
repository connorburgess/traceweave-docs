import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/DocsShell";
import { FlowDiagram } from "@/components/FlowDiagram";
import { getSearchIndex } from "@/lib/docs";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const SPEC_BASE =
  "https://github.com/connorburgess/traceweave-spec/blob/roadmap-v2";

export default function HomePage() {
  const searchIndex = getSearchIndex();

  return (
    <DocsShell searchIndex={searchIndex} isHome>
      <section className="home-hero home-hero--with-backdrop">
        <div className="home-hero-backdrop" aria-hidden="true">
          <picture className="hero-backdrop-picture hero-backdrop-picture--light">
            <source
              type="image/webp"
              srcSet="/imagery/docs-header-light-800.webp 800w, /imagery/docs-header-light-1600.webp 1600w"
              sizes="(max-width: 1120px) 760px, 980px"
            />
            <img
              src="/imagery/docs-header-light-1600.jpg"
              srcSet="/imagery/docs-header-light-800.jpg 800w, /imagery/docs-header-light-1600.jpg 1600w"
              sizes="(max-width: 1120px) 760px, 980px"
              width={1600}
              height={894}
              alt=""
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <picture className="hero-backdrop-picture hero-backdrop-picture--dark">
            <source
              type="image/webp"
              srcSet="/imagery/docs-header-dark-800.webp 800w, /imagery/docs-header-dark-1600.webp 1600w"
              sizes="(max-width: 1120px) 760px, 980px"
            />
            <img
              src="/imagery/docs-header-dark-1600.jpg"
              srcSet="/imagery/docs-header-dark-800.jpg 800w, /imagery/docs-header-dark-1600.jpg 1600w"
              sizes="(max-width: 1120px) 760px, 980px"
              width={1600}
              height={894}
              alt=""
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="home-hero-content">
          <h1>Traceweave</h1>
          <p className="home-lead">
            Traceweave is an open specification for recognising your own work
            when it turns up somewhere else, and for producing evidence of the
            match that anyone can re-run and check.
          </p>
          <p className="home-lead-follow">
            It is designed to cover any kind of work: source code, writing,
            images and audio. One shared evidence format sits underneath, with a
            profile for each medium. Your content never leaves your machine;
            only fingerprints are compared.
          </p>
          <div className="home-actions">
            <Link href="/docs/concepts" className="btn btn-primary">
              Start here: concepts
            </Link>
            <Link href="/docs/how-it-works" className="btn btn-secondary">
              How it works (worked example)
            </Link>
            <Link
              href="/docs/limits-and-threat-model"
              className="btn btn-secondary"
            >
              Limits &amp; threat model
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-status-block"
        aria-labelledby="where-it-stands-heading"
      >
        <h2 id="where-it-stands-heading" className="sr-only">
          Where it stands today
        </h2>
        <p>
          <strong>Where it stands today:</strong> source code is working end to
          end, with Go and Rust as the first two case studies. TypeScript,
          JavaScript and plain text are specified. Images have been measured in
          two studies. More languages, audio, and signed, timestamped
          registration records are planned. It is experimental and not yet
          evaluated on real-world data.
        </p>
        <p className="home-status-sources">
          See the{" "}
          <Link href="/docs/roadmap">roadmap and gate counts</Link> (25 of 47
          core gates met; 13 of 55 later-profile gates met, 2 negative-result{" "}
          <code>TXT.4</code>/<code>TXT.8</code>, 40 open; TypeScript{" "}
          <code>ts-tokens</code>, Python <code>py-tokens</code>, and plain text{" "}
          <code>text-plain</code> implemented in Rust and Go; offline-first M4
          registration <code>draft-5</code> implemented in Rust and Go).
          Sources:{" "}
          <a
            href={`${SPEC_BASE}/README.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            README.md
          </a>
          ,{" "}
          <a
            href={`${SPEC_BASE}/ROADMAP.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ROADMAP.md
          </a>{" "}
          (pilot languages and later profiles),{" "}
          <a
            href={`${SPEC_BASE}/profiles/README.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            profiles/README.md
          </a>
          .
        </p>
      </section>

      <section className="home-section" aria-labelledby="flow-heading">
        <h2 id="flow-heading">How the token-fingerprint flow works</h2>
        <FlowDiagram />
      </section>

      <section className="home-section" aria-labelledby="can-cannot-heading">
        <h2 id="can-cannot-heading">
          What a report records — and what stays out of scope
        </h2>
        <div className="two-col-grid">
          <div className="panel-card">
            <h3>What a report records</h3>
            <ul>
              <li>
                <strong>Shared token runs with exact byte spans:</strong>{" "}
                half-open UTF-8 byte offsets in both reference and candidate
                files where winnowed k-gram hashes align on the same diagonal (
                <a
                  href={`${SPEC_BASE}/spec/catalogue-report.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  spec/catalogue-report.md
                </a>
                ).
              </li>
              <li>
                <strong>
                  Fragment containment separate from whole-file similarity:
                </strong>{" "}
                unreduced raw counts (for example{" "}
                <code>14/14</code> reference-in-candidate containment alongside{" "}
                <code>14/39</code> whole-file Jaccard in{" "}
                <a
                  href={`${SPEC_BASE}/test-vectors/matching/example-report.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  example-report.json
                </a>
                ).
              </li>
              <li>
                <strong>Reproducible, offline reports:</strong> two runs or two
                implementations produce identical canonical report body bytes
                from catalogues and configuration alone, with explicit{" "}
                <code>match</code>, <code>no-match</code>, <code>abstain</code>,
                and <code>rejected</code> outcomes.
              </li>
              <li>
                <strong>Separate cryptographic checks (in progress):</strong>{" "}
                exact-byte catalogue commitments (
                <code>sha256-salted-catalogue-v1</code>) and experimental Go/Rust
                DSSE envelope interoperability kept strictly separate from
                similarity results (
                <a
                  href={`${SPEC_BASE}/spec/core.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  spec/core.md
                </a>
                ).
              </li>
            </ul>
          </div>

          <div className="panel-card">
            <h3>Out of scope</h3>
            <ul>
              <li>
                <strong>Ownership and permission calls:</strong> Traceweave
                produces checkable facts about your work — byte digests, shared
                spans, decoded mark bits, and signature checks. It does not lock
                content, and it does not make the call on ownership, authorship,
                direction of copying, or permission. Common idioms, shared
                dependencies, and earlier copies can also match. What you do
                with the evidence is up to you.
              </li>
              <li>
                <strong>Absence of reuse:</strong> <code>no-match</code> means
                insufficient matching evidence under the active configuration.
                Inserting or altering one token every <code>k &minus; 1</code>{" "}
                tokens breaks k-gram overlap.
              </li>
              <li>
                <strong>Calibrated accuracy:</strong> the M3 held-out
                evaluation has not been run yet. Experimental parameters (such
                as <code>k = 5, w = 4</code>) carry no measured precision,
                recall, or false-alarm rate.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="negative-results-heading">
        <h2 id="negative-results-heading">Measured limits and findings</h2>
        <div className="panel-card">
          <ul>
            <li>
              <strong>Embedded marks in source code reset under cheap normalization:</strong>{" "}
              in the synthetic Go and Rust carrier experiments, 55 of 55 nonzero
              states per language survived formatters (<code>gofmt</code>/
              <code>rustfmt</code>) but all 55 of 55 were reset by cheap
              normalization, and a four-repository public census established zero
              safe eligible sites (
              <Link href="/docs/research/synthetic-carriers">
                SYN.1&ndash;SYN.5
              </Link>
              ). None of the five code-watermarking papers reviewed in{" "}
              <Link href="/docs/research/lane-06-code-carriers">Lane 06</Link>{" "}
              cleared the project bar.
            </li>
            <li>
              <strong>Embedded marks in existing prose reset under canonical folding:</strong>{" "}
              <Link href="/docs/research/lane-09-text-profile">Lane 09</Link>{" "}
              found that Unicode homoglyph and zero-width carriers are erased by
              one published canonical fold (NFKC + UTS #39 skeleton + deleting{" "}
              <code>Default_Ignorable_Code_Point</code>), and set aside learned
              lexical rewriting (AWT).
            </li>
            <li>
              <strong>Image watermarks act as a finding aid, not origin evidence:</strong>{" "}
              reviewed post-hoc schemes (TrustMark-Q, PixelSeal) have public,
              unkeyed encoders and decoders, so anyone can decode a mark and
              re-embed it onto an unrelated image without the key, and each
              scheme has cheap removals such as ReMark or regeneration (
              <Link href="/docs/research/image-mark-study">
                e-img-m-2 results
              </Link>
              ,{" "}
              <Link href="/docs/research/lane-10-image-profile">Lane 10</Link>).
              In the measured <code>e-img-m-2</code> run (100 synthetic images
              per scheme), both TrustMark-Q and PixelSeal matched 100/100 clean
              images, but keyless re-embed succeeded 100/100 for both (and
              residual transplant 82/100 and 90/100; ReMark left 1/100 for
              TrustMark-Q).
            </li>
            <li>
              <strong>Core matching builds on established prior art:</strong>{" "}
              winnowing over token k-grams follows MOSS (Schleimer, Wilkerson,
              Aiken, 2003) and sits alongside JPlag, Dolos, and SCANOSS (
              <Link href="/docs/prior-art">Prior art</Link>). The contribution
              here is the open, byte-deterministic, offline specification —
              verified by two independent implementations — rather than a new
              similarity algorithm.
            </li>
          </ul>
        </div>
      </section>

      <section className="home-section" aria-labelledby="explore-heading">
        <h2 id="explore-heading">Explore the documentation</h2>
        <div className="card-grid">
          <Link href="/docs/concepts" className="nav-card">
            <span className="nav-card-title">Start here &amp; concepts</span>
            <span className="nav-card-desc">
              Fingerprints vs embedded marks, catalogues, outcomes, provenance,
              and glossary.
            </span>
          </Link>
          <Link href="/docs/how-it-works" className="nav-card">
            <span className="nav-card-title">How it works</span>
            <span className="nav-card-desc">
              Extraction, catalogues, comparison, and a worked example from
              published test vectors.
            </span>
          </Link>
          <Link href="/docs/profiles" className="nav-card">
            <span className="nav-card-title">Profiles</span>
            <span className="nav-card-desc">
              First code profiles (Go and Rust), TypeScript, Python, and plain
              text stage 1, still-image studies, and planned media.
            </span>
          </Link>
          <Link href="/docs/research" className="nav-card">
            <span className="nav-card-title">Research &amp; experiments</span>
            <span className="nav-card-desc">
              Lanes 06&ndash;12, synthetic code carriers, image studies, and M3
              evaluation protocol.
            </span>
          </Link>
          <Link href="/docs/roadmap" className="nav-card">
            <span className="nav-card-title">Roadmap &amp; status</span>
            <span className="nav-card-desc">
              Gate counts (M0&ndash;M5 and later profiles), what is met, and
              what remains open.
            </span>
          </Link>
          <Link href="/docs/faq" className="nav-card">
            <span className="nav-card-title">FAQ</span>
            <span className="nav-card-desc">
              Plain answers about scope, evaluation status, privacy, and related
              tools.
            </span>
          </Link>
        </div>
      </section>
    </DocsShell>
  );
}
