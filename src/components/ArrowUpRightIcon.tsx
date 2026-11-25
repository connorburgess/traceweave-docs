interface ArrowUpRightIconProps {
  size?: number;
  className?: string;
}

export function ArrowUpRightIcon({
  size = 24,
  className,
}: ArrowUpRightIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M9.05025 19.4497L18.9497 9.55025M10.8377 8.86279L18.9497 9.55025L19.6372 17.6623"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
