"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

const PLACEHOLDER = "/images/placeholder-product.svg";

type ProductImageProps = {
  src: string;
  alt: string;
  /** Responsive size hint for next/image, e.g. "(min-width: 1024px) 25vw, 50vw". */
  sizes: string;
  /** Load eagerly with high fetch priority (above-the-fold images, e.g. the main product image). */
  priority?: boolean;
  aspect?: "square" | "portrait" | "landscape";
  fit?: "cover" | "contain";
  className?: string;
};

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

/**
 * Product photo in a fixed-ratio box (no layout shift). Falls back to the Nivora
 * placeholder if the image is missing or fails to load (arch §17.2).
 */
export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  aspect = "square",
  fit = "cover",
  className,
}: ProductImageProps) {
  // Remember which src failed, so a new src gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !src || failedSrc === src;

  return (
    <div className={cn("relative overflow-hidden bg-brand-50", aspectClasses[aspect], className)}>
      {failed ? (
        <Image
          src={PLACEHOLDER}
          alt={`${alt} (image not available)`}
          fill
          unoptimized
          className="object-contain"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className={fit === "cover" ? "object-cover" : "object-contain"}
          onError={() => setFailedSrc(src)}
        />
      )}
    </div>
  );
}
