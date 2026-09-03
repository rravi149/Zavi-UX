import Image from "next/image";

export function BrandMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 text-[#2e8b46] ${className}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5 22.5 21.5h-5.2L12 11.6 6.7 21.5H1.5Z" />
      <path d="M12 14.6 15.6 21.5H8.4Z" />
    </svg>
  );
}

export function ZaviLogo({
  size = 28,
  alt = "",
  className = "",
}: {
  size?: number;
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      src="/zavi-logo.png"
      alt={alt}
      width={size}
      height={size}
      className={`shrink-0 rounded-lg ${className}`}
    />
  );
}
