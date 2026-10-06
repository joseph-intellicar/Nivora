import { create } from "zustand";

export type VariantPickerMode = "add-to-cart" | "move-to-cart";

type VariantPickerState = {
  slug: string | null;
  mode: VariantPickerMode;
  open: (slug: string, mode: VariantPickerMode) => void;
  close: () => void;
};

/** Which product the shared variant picker dialog is showing (arch §11.2, decision D13). */
export const useVariantPickerStore = create<VariantPickerState>((set) => ({
  slug: null,
  mode: "add-to-cart",
  open: (slug, mode) => set({ slug, mode }),
  close: () => set({ slug: null }),
}));
