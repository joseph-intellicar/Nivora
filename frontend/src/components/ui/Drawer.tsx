"use client";

import { useId, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { IconButton } from "./IconButton";
import { ModalLayer } from "./ModalLayer";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right" | "bottom";
  /** Sticky actions at the bottom (e.g. "Apply"). */
  footer?: ReactNode;
  children?: ReactNode;
};

/** Accessible side or bottom sheet (mobile menu, filters). */
export function Drawer({ open, onClose, title, side = "right", footer, children }: DrawerProps) {
  const titleId = useId();
  return (
    <ModalLayer open={open} onClose={onClose} placement={side} labelledBy={titleId}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 id={titleId} className="text-lg font-bold text-ink">
          {title}
        </h2>
        <IconButton label="Close" icon={<CloseIcon />} size="sm" onClick={onClose} />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      {footer ? <div className="border-t border-line px-5 py-4">{footer}</div> : null}
    </ModalLayer>
  );
}
