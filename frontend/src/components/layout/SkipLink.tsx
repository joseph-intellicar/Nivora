/** First focusable element on every page: jumps keyboard users past the header. */
export function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only z-[70] rounded-control bg-brand-700 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  );
}
