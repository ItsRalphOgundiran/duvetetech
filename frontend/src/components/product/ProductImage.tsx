import Image from "next/image";
import { Cpu } from "lucide-react";

/**
 * Product image with a branded gradient fallback — demo catalog items have no
 * real photos yet, and Woo images arrive from the WP media library domain.
 */
export default function ProductImage({
  src,
  alt,
  seed,
  sizes = "(max-width: 768px) 50vw, 25vw",
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  seed?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }
  const hue = (seed ?? 0) % 360;
  return (
    <div
      role="img"
      aria-label={alt}
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 55% 92%), hsl(${(hue + 40) % 360} 60% 85%))`,
      }}
    >
      <Cpu className="h-12 w-12 text-navy/25" aria-hidden />
    </div>
  );
}
