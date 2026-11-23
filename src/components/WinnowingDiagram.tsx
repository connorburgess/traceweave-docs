export function WinnowingDiagram() {
  return (
    <figure className="diagram-figure">
      <div className="diagram-scroll">
        <svg
          viewBox="0 0 860 220"
          width="860"
          height="220"
          role="img"
          aria-labelledby="winnow-title winnow-desc"
          className="diagram-svg"
        >
          <title id="winnow-title">
            Rightmost-minimum winnowing and fragment containment versus whole-file similarity
          </title>
          <desc id="winnow-desc">
            Left panel shows hash values 8, 4, 4, 7, 2 with window width 3:
            window 0 selects position 2 (rightmost tie of value 4), window 1
            selects position 2, window 2 selects position 4 (value 2), giving
            unique fingerprint positions 2 and 4. Right panel contrasts
            reference-in-candidate containment (14 of 14 distinct hashes) with
            whole-file Jaccard similarity (14 of 39 distinct hashes) from the
            published go-function-in-host vector.
          </desc>

          {/* Left panel: Winnowing */}
          <rect
            x="10"
            y="10"
            width="410"
            height="200"
            rx="2"
            className="svg-zone-private"
          />
          <text x="26" y="34" className="svg-zone-label">
            WINNOWING TIE RULE (w = 3, RIGHTMOST MINIMUM)
          </text>

          {/* Hash cells */}
          {[
            { pos: 0, val: "8", selected: false },
            { pos: 1, val: "4", selected: false },
            { pos: 2, val: "4", selected: true },
            { pos: 3, val: "7", selected: false },
            { pos: 4, val: "2", selected: true },
          ].map((cell, idx) => {
            const x = 32 + idx * 74;
            return (
              <g key={cell.pos}>
                <text
                  x={x + 28}
                  y="58"
                  textAnchor="middle"
                  className="svg-box-sub"
                >
                  pos {cell.pos}
                </text>
                <rect
                  x={x}
                  y="66"
                  width="56"
                  height="38"
                  rx="2"
                  className={
                    cell.selected ? "svg-box svg-box-accent" : "svg-box"
                  }
                />
                <text
                  x={x + 28}
                  y="90"
                  textAnchor="middle"
                  className="svg-box-title"
                >
                  {cell.val}
                </text>
              </g>
            );
          })}

          {/* Window brackets */}
          <text x="26" y="130" className="svg-box-sub">
            Window 0 [0..2]: min 4 at pos 1 &amp; 2 → rightmost = pos 2
          </text>
          <text x="26" y="150" className="svg-box-sub">
            Window 1 [1..3]: min 4 at pos 1 &amp; 2 → rightmost = pos 2
          </text>
          <text x="26" y="170" className="svg-box-sub">
            Window 2 [2..4]: min 2 at pos 4 → pos 4
          </text>
          <text x="26" y="194" className="svg-box-sub-bold">
            Retained unique fingerprint positions: [2, 4]
          </text>

          {/* Right panel: Containment vs Jaccard */}
          <rect
            x="440"
            y="10"
            width="410"
            height="200"
            rx="2"
            className="svg-zone-private"
          />
          <text x="456" y="34" className="svg-zone-label">
            CONTAINMENT VS JACCARD (go-function-in-host, exact)
          </text>

          <text x="456" y="64" className="svg-box-sub-bold">
            Reference sum.go (14 distinct hashes)
          </text>
          <rect
            x="456"
            y="74"
            width="130"
            height="24"
            rx="2"
            className="svg-box svg-box-accent"
          />
          <text x="521" y="90" textAnchor="middle" className="svg-box-sub-bold">
            14 / 14 matched
          </text>

          <text x="456" y="124" className="svg-box-sub-bold">
            Candidate host.go (39 distinct hashes)
          </text>
          <rect x="456" y="134" width="360" height="24" rx="2" className="svg-box" />
          <rect
            x="590"
            y="134"
            width="130"
            height="24"
            rx="2"
            className="svg-box svg-box-accent"
          />
          <text x="655" y="150" textAnchor="middle" className="svg-box-sub-bold">
            bytes [146, 254)
          </text>

          <text x="456" y="182" className="svg-box-sub">
            referenceInCandidate: 14 / 14 (unreduced raw counts)
          </text>
          <text x="456" y="198" className="svg-box-sub">
            whole-file Jaccard: 14 / 39 (diluted by surrounding host)
          </text>
        </svg>
      </div>
      <figcaption className="diagram-caption">
        Left: hand-checkable winnowing example from{" "}
        <code>docs/implementation-patterns.md</code> and{" "}
        <code>spec/extraction.md</code> §8. Right: exact-channel overlap counts
        from <code>test-vectors/matching/example-report.json</code> showing why
        directional containment and whole-file Jaccard are kept as separate
        fields.
      </figcaption>
    </figure>
  );
}
