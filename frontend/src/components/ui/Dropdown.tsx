"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DropdownItem = {
  label: string;
  icon?: ReactNode;
  /** Navigates when set; otherwise onSelect runs. */
  href?: string;
  onSelect?: () => void;
  tone?: "default" | "danger";
};

type DropdownProps = {
  /** Visible trigger content. */
  trigger: ReactNode;
  /** Accessible name for the trigger when its content is not descriptive text. */
  triggerLabel?: string;
  items: DropdownItem[];
  align?: "start" | "end";
  triggerClassName?: string;
};

/**
 * Menu button (arch §18): Enter/Space/ArrowDown open it, arrow keys and Home/End move
 * between items, Escape closes and returns focus to the trigger, Tab or outside click closes.
 */
export function Dropdown({
  trigger,
  triggerLabel,
  items,
  align = "end",
  triggerClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  function focusItem(index: number) {
    const count = items.length;
    itemRefs.current[((index % count) + count) % count]?.focus();
  }

  function openMenu(focusIndex: number) {
    setOpen(true);
    requestAnimationFrame(() => focusItem(focusIndex));
  }

  function closeMenu(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(items.length - 1);
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItem(current + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItem(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(items.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu(false);
        break;
    }
  }

  const itemClass = (tone: DropdownItem["tone"]) =>
    cn(
      "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm focus:outline-none",
      tone === "danger"
        ? "text-danger hover:bg-danger-soft focus:bg-danger-soft"
        : "text-ink hover:bg-brand-50 focus:bg-brand-50",
    );

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={triggerLabel}
        onClick={() => (open ? closeMenu(false) : openMenu(0))}
        onKeyDown={onTriggerKeyDown}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className={cn(
            "absolute z-40 mt-2 min-w-52 animate-fade-in overflow-hidden rounded-card bg-surface py-1.5 shadow-raised ring-1 ring-line",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) => {
            const content = (
              <>
                {item.icon}
                {item.label}
              </>
            );
            const select = () => {
              item.onSelect?.();
              closeMenu(!item.href);
            };
            return item.href ? (
              <Link
                key={item.label}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                href={item.href}
                role="menuitem"
                tabIndex={-1}
                onClick={select}
                className={itemClass(item.tone)}
              >
                {content}
              </Link>
            ) : (
              <button
                key={item.label}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={select}
                className={itemClass(item.tone)}
              >
                {content}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
