"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useHasMounted } from "@/hooks/useHasMounted";
import { cn } from "@/lib/cn";

export type ModalPlacement = "center" | "left" | "right" | "bottom";

type ModalLayerProps = {
  open: boolean;
  onClose: () => void;
  placement: ModalPlacement;
  labelledBy: string;
  describedBy?: string;
  panelClassName?: string;
  children: ReactNode;
};

const placementClasses: Record<ModalPlacement, { layer: string; panel: string }> = {
  center: {
    layer: "items-end justify-center p-0 sm:items-center sm:p-4",
    panel: "w-full rounded-t-card sm:rounded-card max-h-[90dvh] animate-pop-in",
  },
  left: { layer: "justify-start", panel: "h-full w-[min(22rem,88vw)] animate-slide-in-left" },
  right: { layer: "justify-end", panel: "h-full w-[min(26rem,92vw)] animate-slide-in-right" },
  bottom: {
    layer: "items-end",
    panel: "w-full max-h-[85dvh] rounded-t-card animate-slide-in-bottom",
  },
};

/** Locks page scroll; nested layers keep the lock until the last one closes. */
let scrollLocks = 0;
function lockScroll(): () => void {
  const body = document.body;
  if (scrollLocks === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.dataset.prevOverflow = body.style.overflow;
    body.dataset.prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
  }
  scrollLocks += 1;
  return () => {
    scrollLocks -= 1;
    if (scrollLocks === 0) {
      body.style.overflow = body.dataset.prevOverflow ?? "";
      body.style.paddingRight = body.dataset.prevPadding ?? "";
    }
  };
}

/** Makes everything outside the layer inert (unreachable by keyboard and screen readers). */
function inertOthers(layer: HTMLElement): () => void {
  const changed: Element[] = [];
  for (const child of Array.from(document.body.children)) {
    // Live regions marked data-keep-interactive (the toaster) stay announced.
    if (
      child !== layer &&
      !child.hasAttribute("inert") &&
      !child.hasAttribute("data-keep-interactive")
    ) {
      child.setAttribute("inert", "");
      changed.push(child);
    }
  }
  return () => changed.forEach((element) => element.removeAttribute("inert"));
}

/**
 * Shared modal behaviour for Dialog and Drawer (arch §18): portal, backdrop,
 * role="dialog" + aria-modal, focus trap with focus return, Escape to close,
 * background made inert, and scroll lock.
 */
export function ModalLayer({
  open,
  onClose,
  placement,
  labelledBy,
  describedBy,
  panelClassName,
  children,
}: ModalLayerProps) {
  const mounted = useHasMounted();
  const layerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open && mounted);

  useEffect(() => {
    if (!open || !layerRef.current) return;
    const unlock = lockScroll();
    const restoreInert = inertOthers(layerRef.current);
    return () => {
      restoreInert();
      unlock();
    };
  }, [open]);

  if (!mounted || !open) return null;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    }
  }

  const classes = placementClasses[placement];

  return createPortal(
    <div
      ref={layerRef}
      className={cn("fixed inset-0 z-50 flex", classes.layer)}
      onKeyDown={onKeyDown}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 animate-fade-in bg-ink/50"
        onMouseDown={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={cn(
          "relative flex flex-col overflow-hidden bg-surface shadow-raised focus:outline-none",
          classes.panel,
          panelClassName,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
