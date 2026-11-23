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
      <div className="status-banner" role="status">
        <strong>Experimental design draft (0.1.0-draft.1).</strong> Traceweave
        is an open, non-commercial, independent specification — not a standard
        and not production software. Its held-out evaluation has not been run,
        so no detection accuracy or false-alarm rate is claimed. See the{" "}
        <Link href="/docs/roadmap">roadmap and gate counts</Link> (11 of 47 core
        gates met; 3 of 41 later-profile gates met).
      </div>

      <section className="home-hero">
        <h1>Traceweave</h1>
        <p className="home-lead">
          Traceweave is an open specification for recognising your own work when
          it turns up somewhere else, and for producing evidence of the match
          that anyone can re-run and check.
        </p>
        <p className="home-lead-follow">
          It is designed to cover any kind of work: source code, writing, images
          and audio. One shared evidence format sits underneath, with a profile
          for each medium. Your content never leaves your machine; only
          fingerprints are compared.
        </p>
        <div className="home-actions">
          <Link href="/docs/concepts" className="btn-primary">
            Start here: concepts
          </Link>
          <Link href="/docs/how-it-works" className="btn-secondary">
            How it works (worked example)
          </Link>
          <Link href="/docs/limits-and-threat-model" className="btn-secondary">
            Limits &amp; threat model
          </Link>
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
        <h2 id="can-cannot-heading">What it can and cannot tell you</h2>
        <div className="two-col-grid">
          <div className="panel-card">
            <h3>What Traceweave can report</h3>
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

          <div className="panel-card panel-card-negative">
            <h3>What Traceweave cannot tell you</h3>
            <ul>
              <li>
                <strong>Not ownership or authorship:</strong> a fingerprint
                match, a decoded mark, or a valid signature never establishes
                who wrote or owns content, nor direction of copying.
              </li>
              <li>
                <strong>Not infringement or permission:</strong> common idioms,
                shared dependencies, and permitted historical copies can match;
                rights review is explicitly outside the report.
              </li>
              <li>
                <strong>Not absence of reuse:</strong> <code>no-match</code>{" "}
                means insufficient matching evidence under the active
                configuration. Light rewriting (one inserted token every{" "}
                <code>k &minus; 1</code> tokens) defeats k-gram overlap.
              </li>
              <li>
                <strong>Not calibrated accuracy:</strong> the M3 held-out
                evaluation has not been run. Experimental parameters (such as{" "}
                <code>k = 5, w = 4</code>) carry no measured precision, recall,
                or false-alarm rate.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="negative-results-heading">
        <h2 id="negative-results-heading">Negative results and open limits</h2>
        <div className="callout callout-caution" role="note">
          <div className="callout-title">Key measured and reviewed limits</div>
          <ul>
            <li>
              <strong>Embedded marks in source code failed cheap normalization:</strong>{" "}
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
              <strong>Embedded marks in existing prose do not survive normalization:</strong>{" "}
              <Link href="/docs/research/lane-09-text-profile">Lane 09</Link>{" "}
              found that Unicode homoglyph and zero-width carriers are erased by
              one published canonical fold (NFKC + UTS #39 skeleton + deleting{" "}
              <code>Default_Ignorable_Code_Point</code>), and rejected learned
              lexical rewriting (AWT).
            </li>
            <li>
              <strong>Image watermarks are a finding aid, not evidence of origin:</strong>{" "}
              reviewed post-hoc schemes (TrustMark-Q, PixelSeal) have public,
              unkeyed encoders and decoders, so anyone can decode a mark and
              re-embed it onto an unrelated image without the key, and each
              scheme has cheap removals such as ReMark or regeneration (
              <Link href="/docs/research/image-mark-study">
                e-img-m-2 protocol
              </Link>
              ,{" "}
              <Link href="/docs/research/lane-10-image-profile">Lane 10</Link>).
              In the published specification checkout, <code>e-img-m-2</code> is
              frozen and reviewed to start, with dry-test smoke runs only and no
              committed full run yet.
            </li>
            <li>
              <strong>Core matching is established prior art:</strong> winnowing
              over token k-grams follows MOSS (Schleimer, Wilkerson, Aiken,
              2003) and sits alongside JPlag, Dolos, and SCANOSS (
              <Link href="/docs/prior-art">Prior art</Link>). The new work here
              is the open, byte-deterministic, offline specification — verified
              by two independent implementations — not an unbreakable similarity
              algorithm.
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
              First code profiles (Go and Rust), TypeScript and plain text stage
              1, still-image studies, and planned media.
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
              Plain answers to common questions, including why Traceweave does
              not establish ownership.
            </span>
          </Link>
        </div>
      </section>
    </DocsShell>
  );
}
