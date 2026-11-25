interface ArrowUpRightIconProps {
  size?: number;
  className?: string;
}

export function ArrowUpRightIcon({
  size = 14,
  className,
}: ArrowUpRightIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M4.5 11.5L11.5 4.5M6.5 4.5H11.5V9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
