"use client";

import { useState, type ReactNode } from "react";
import { FilterIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { formatCount } from "@/lib/format";

/** Mobile/tablet filters (requirements §30): a drawer; changes apply immediately. */
export function FilterDrawer({
  total,
  activeCount,
  children,
}: {
  total: number;
  activeCount: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="secondary"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        <FilterIcon className="size-4" />
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        title="Filters"
        footer={
          <Button fullWidth onClick={() => setOpen(false)}>
            Show {formatCount(total)} {total === 1 ? "product" : "products"}
          </Button>
        }
      >
        {children}
      </Drawer>
    </>
  );
}
