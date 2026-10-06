"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useToastStore, type Toast } from "@/stores/toastStore";

const variantStyles = {
  success: { icon: CheckIcon, accent: "text-success", srPrefix: "Success:" },
  error: { icon: AlertIcon, accent: "text-danger", srPrefix: "Error:" },
  info: { icon: InfoIcon, accent: "text-brand-700", srPrefix: "" },
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = () => {
    timer.current = setTimeout(() => dismiss(toast.id), toast.duration);
  };
  const stop = () => clearTimeout(timer.current);

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = variantStyles[toast.variant];
  const VariantIcon = style.icon;

  return (
    <li
      onMouseEnter={stop}
      onMouseLeave={start}
      onFocus={stop}
      onBlur={start}
      className="pointer-events-auto flex w-full animate-pop-in items-start gap-3 rounded-card bg-surface p-4 shadow-raised ring-1 ring-line sm:w-96"
    >
      <VariantIcon className={cn("mt-0.5", style.accent)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">
          {style.srPrefix ? <span className="sr-only">{style.srPrefix} </span> : null}
          {toast.title}
        </p>
        {toast.description ? (
          <p className="mt-0.5 text-sm text-ink-muted">{toast.description}</p>
        ) : null}
        {toast.action ? (
          <Link
            href={toast.action.href}
            onClick={() => dismiss(toast.id)}
            className="mt-2 inline-block text-sm font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            {toast.action.label}
          </Link>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dismiss(toast.id)}
        className="-m-1 rounded-full p-1 text-ink-subtle hover:bg-canvas hover:text-ink"
      >
        <CloseIcon className="size-4" />
      </button>
    </li>
  );
}

/** Live region for toasts (arch §11.2, §18). Mounted once in Providers. */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  return (
    <div
      role="region"
      data-keep-interactive=""
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-4 sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-auto"
    >
      <ol className="flex w-full flex-col gap-2 sm:w-auto">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </ol>
    </div>
  );
}
