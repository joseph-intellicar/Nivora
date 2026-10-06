"use client";

import "./globals.css";

/** Last-resort boundary for errors in the root layout. Renders its own document. */
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-canvas p-6 font-sans text-ink">
        <title>Something went wrong | Nivora</title>
        <div role="alert" className="max-w-md text-center">
          <p className="text-2xl font-extrabold tracking-tight text-brand-800">nivora</p>
          <h1 className="mt-6 text-xl font-bold">Something went wrong.</h1>
          <p className="mt-2 text-ink-muted">
            Please try again. If the problem continues, come back a little later.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="h-11 rounded-control bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Try again
            </button>
            {/* A plain link: client navigation may not work when the root layout has failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="inline-flex h-11 items-center rounded-control px-5 text-sm font-semibold text-brand-800 ring-1 ring-line-strong ring-inset"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
