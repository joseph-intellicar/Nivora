"use client";

import { useId, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";
import { ModalLayer } from "./ModalLayer";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Action buttons shown at the bottom. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
};

const sizeClasses = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

/** Accessible modal dialog. On small screens it opens as a bottom sheet. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  children,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  return (
    <ModalLayer
      open={open}
      onClose={onClose}
      placement="center"
      labelledBy={titleId}
      describedBy={description ? descriptionId : undefined}
      panelClassName={cn(sizeClasses[size])}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 id={titleId} className="text-lg font-bold text-ink">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="mt-1 text-sm text-ink-muted">
              {description}
            </p>
          ) : null}
        </div>
        <IconButton label="Close" icon={<CloseIcon />} size="sm" onClick={onClose} />
      </div>
      {children ? <div className="overflow-y-auto px-5 py-4">{children}</div> : null}
      {footer ? (
        <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
          {footer}
        </div>
      ) : null}
    </ModalLayer>
  );
}
