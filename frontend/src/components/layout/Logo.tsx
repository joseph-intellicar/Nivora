type LogoProps = {
  /** Show the "nivora" wordmark next to the mark. */
  withWordmark?: boolean;
  /** "inverse" for dark backgrounds (e.g. the footer). */
  tone?: "default" | "inverse";
  className?: string;
};

/** Nivora brand mark: a lagoon tile with an "n" arch and a coral spark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <rect width="64" height="64" rx="16" className="fill-brand-700" />
      <path
        d="M19 47V30a13 13 0 0 1 26 0v17"
        fill="none"
        className="stroke-white"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="47" cy="17" r="5" className="fill-accent-400" />
    </svg>
  );
}

export function Logo({ withWordmark = true, tone = "default", className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="size-7 shrink-0 sm:size-8" />
      {withWordmark ? (
        <span
          className={`text-xl font-extrabold tracking-tight sm:text-2xl ${tone === "inverse" ? "text-white" : "text-brand-800"}`}
        >
          nivora
        </span>
      ) : (
        <span className="sr-only">Nivora</span>
      )}
    </span>
  );
}
