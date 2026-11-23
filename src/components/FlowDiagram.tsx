export function FlowDiagram() {
  return (
    <figure className="diagram-figure">
      <div className="diagram-scroll">
        <svg
          viewBox="0 0 920 260"
          width="920"
          height="260"
          role="img"
          aria-labelledby="flow-diagram-title flow-diagram-desc"
          className="diagram-svg"
        >
          <title id="flow-diagram-title">
            Traceweave token-fingerprint comparison pipeline
          </title>
          <desc id="flow-diagram-desc">
            Six-stage local pipeline: Source bytes feed into Tokens via a
            profile lexer, then into Fingerprints via k-gram SHA-256 hashing and
            rightmost-minimum winnowing, then into a Private catalogue that
            stores no source text. Reference and candidate catalogues plus a
            comparison config (and optional suppression catalogue) feed into
            Comparison, which emits a deterministic Report body alongside a
            separate Provenance block.
          </desc>

          <defs>
            <marker
              id="tw-arrow"
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" className="svg-arrow-fill" />
            </marker>
          </defs>

          {/* Top boundary label */}
          <rect
            x="14"
            y="14"
            width="584"
            height="148"
            rx="8"
            className="svg-zone-private"
          />
          <text x="28" y="34" className="svg-zone-label">
            LOCAL EXTRACTION (PRIVATE BY DEFAULT — NO NETWORK CALLS)
          </text>

          {/* Box 1: Source */}
          <rect x="28" y="52" width="114" height="72" rx="6" className="svg-box" />
          <text x="85" y="79" textAnchor="middle" className="svg-box-title">
            1. Source
          </text>
          <text x="85" y="97" textAnchor="middle" className="svg-box-sub">
            UTF-8 bytes +
          </text>
          <text x="85" y="112" textAnchor="middle" className="svg-box-sub">
            exact config
          </text>

          <line
            x1="142"
            y1="88"
            x2="168"
            y2="88"
            className="svg-connector"
            markerEnd="url(#tw-arrow)"
          />

          {/* Box 2: Tokens */}
          <rect x="172" y="52" width="120" height="72" rx="6" className="svg-box" />
          <text x="232" y="79" textAnchor="middle" className="svg-box-title">
            2. Tokens
          </text>
          <text x="232" y="97" textAnchor="middle" className="svg-box-sub">
            exact &amp; normalized
          </text>
          <text x="232" y="112" textAnchor="middle" className="svg-box-sub">
            with byte spans
          </text>

          <line
            x1="292"
            y1="88"
            x2="318"
            y2="88"
            className="svg-connector"
            markerEnd="url(#tw-arrow)"
          />

          {/* Box 3: Fingerprints */}
          <rect x="322" y="52" width="124" height="72" rx="6" className="svg-box" />
          <text x="384" y="79" textAnchor="middle" className="svg-box-title">
            3. Fingerprints
          </text>
          <text x="384" y="97" textAnchor="middle" className="svg-box-sub">
            k-gram SHA-256
          </text>
          <text x="384" y="112" textAnchor="middle" className="svg-box-sub">
            + winnowing
          </text>

          <line
            x1="446"
            y1="88"
            x2="472"
            y2="88"
            className="svg-connector"
            markerEnd="url(#tw-arrow)"
          />

          {/* Box 4: Private catalogue */}
          <rect
            x="476"
            y="52"
            width="108"
            height="72"
            rx="6"
            className="svg-box svg-box-accent"
          />
          <text x="530" y="76" textAnchor="middle" className="svg-box-title">
            4. Private
          </text>
          <text x="530" y="92" textAnchor="middle" className="svg-box-title">
            catalogue
          </text>
          <text x="530" y="112" textAnchor="middle" className="svg-box-sub">
            no source text
          </text>

          {/* Connector out to Comparison */}
          <line
            x1="584"
            y1="88"
            x2="626"
            y2="88"
            className="svg-connector"
            markerEnd="url(#tw-arrow)"
          />

          {/* Box 5: Comparison */}
          <rect x="630" y="52" width="124" height="72" rx="6" className="svg-box" />
          <text x="692" y="79" textAnchor="middle" className="svg-box-title">
            5. Comparison
          </text>
          <text x="692" y="97" textAnchor="middle" className="svg-box-sub">
            seeds, regions,
          </text>
          <text x="692" y="112" textAnchor="middle" className="svg-box-sub">
            containment
          </text>

          {/* Secondary inputs to Comparison */}
          <rect
            x="612"
            y="182"
            width="160"
            height="58"
            rx="6"
            className="svg-box svg-box-muted"
          />
          <text x="692" y="206" textAnchor="middle" className="svg-box-sub-bold">
            Comparison config +
          </text>
          <text x="692" y="222" textAnchor="middle" className="svg-box-sub">
            candidate &amp; optional
          </text>
          <text x="692" y="235" textAnchor="middle" className="svg-box-sub">
            boilerplate catalogues
          </text>
          <line
            x1="692"
            y1="182"
            x2="692"
            y2="128"
            className="svg-connector"
            markerEnd="url(#tw-arrow)"
          />

          <line
            x1="754"
            y1="88"
            x2="780"
            y2="88"
            className="svg-connector"
            markerEnd="url(#tw-arrow)"
          />

          {/* Box 6: Report */}
          <rect
            x="784"
            y="44"
            width="122"
            height="100"
            rx="6"
            className="svg-box svg-box-accent"
          />
          <text x="845" y="71" textAnchor="middle" className="svg-box-title">
            6. Report
          </text>
          <text x="845" y="90" textAnchor="middle" className="svg-box-sub">
            deterministic body
          </text>
          <text x="845" y="105" textAnchor="middle" className="svg-box-sub">
            (byte-identical)
          </text>
          <line x1="796" y1="115" x2="894" y2="115" className="svg-divider" />
          <text x="845" y="132" textAnchor="middle" className="svg-box-sub">
            + provenance block
          </text>

          {/* Note at bottom left */}
          <text x="28" y="196" className="svg-footnote">
            Note: Unkeyed hashes in a catalogue still allow guessing or confirming known code; keep catalogues private.
          </text>
          <text x="28" y="216" className="svg-footnote">
            Comparison reads catalogues only (no source text). Signatures, signer trust, timestamps, and origin context stay separate.
          </text>
        </svg>
      </div>
      <figcaption className="diagram-caption">
        Flow from{" "}
        <code>spec/extraction.md</code> and{" "}
        <code>spec/catalogue-report.md</code>: Source bytes and configuration
        produce tokens with UTF-8 byte spans, winnowed k-gram fingerprints, and
        a private catalogue holding no source text. Comparison consumes
        catalogues and configuration only, emitting a byte-identical canonical
        report body and a separate provenance block.
      </figcaption>
    </figure>
  );
}
