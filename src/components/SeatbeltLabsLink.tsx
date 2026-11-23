export function SeatbeltLabsLink() {
  return (
    <a
      href="https://seatbeltlabs.com"
      rel="noopener noreferrer"
      className="brand-link"
    >
      <span className="brand-mark-frame" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width={28}
          height={28}
          focusable="false"
          className="brand-mark-svg"
        >
          <rect width="48" height="48" rx="10" fill="#0d1014" />
          <g fill="none" stroke="#f5f7fa" strokeWidth="3">
            <path d="M11 34 24 11h13L24 34H11Z" />
            <path d="m11 14 13 23h13L24 14H11Z" stroke="#ff5a26" />
          </g>
        </svg>
      </span>
      <span className="brand-wordmark">SEATBELT LABS</span>
    </a>
  );
}
