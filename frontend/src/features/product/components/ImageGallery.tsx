"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/cn";

/**
 * Product gallery (requirements §16.1). Desktop/tablet: a vertical thumbnail rail beside a large
 * main image; phones: main image with thumbnails below. Thumbnails, arrow buttons, Left/Right
 * keys and touch swipes all change the main image.
 */
export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const count = images.length;
  const go = (next: number) => setIndex((next + count) % count);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      go(index + 1);
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    startX.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (startX.current === null) return;
    const delta = event.clientX - startX.current;
    if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
    startX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Product images"
      className="flex flex-col-reverse gap-3 md:flex-row"
    >
      {count > 1 ? (
        <div
          role="group"
          aria-label="Choose image"
          onKeyDown={onKeyDown}
          className="flex shrink-0 gap-2 overflow-x-auto md:w-20 md:flex-col md:overflow-visible"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              onMouseEnter={() => setIndex(i)}
              className={cn(
                "w-16 shrink-0 overflow-hidden rounded-control bg-surface ring-2 transition md:w-full",
                i === index
                  ? "ring-brand-600"
                  : "opacity-80 ring-transparent hover:opacity-100 hover:ring-line-strong",
              )}
            >
              <ProductImage src={src} alt="" sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
      <div
        className="relative min-w-0 flex-1 touch-pan-y overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <ProductImage
          key={images[index]}
          src={images[index]}
          alt={`${alt}, image ${index + 1} of ${count}`}
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
          priority={index === 0}
          aspect="portrait"
        />
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(index - 1)}
              className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 shadow-card hover:bg-surface"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(index + 1)}
              className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 shadow-card hover:bg-surface"
            >
              <ChevronRightIcon />
            </button>
            <p
              className="absolute right-3 bottom-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white"
              aria-live="polite"
            >
              {index + 1} / {count}
            </p>
          </>
        ) : null}
      </div>
    </section>
  );
}
