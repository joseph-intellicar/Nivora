import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  /** Optional link action, e.g. { label: "View Cart", href: "/cart" }. */
  action?: { label: string; href: string };
  /** Auto-dismiss delay in ms. */
  duration: number;
};

export type ToastInput = Omit<Toast, "id" | "variant" | "duration"> &
  Partial<Pick<Toast, "variant" | "duration">>;

type ToastState = {
  toasts: Toast[];
  show: (toast: ToastInput) => number;
  dismiss: (id: number) => void;
};

const MAX_VISIBLE = 3;
let nextId = 1;

/** Global toast queue (UI state only, never persisted). */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (input) => {
    const id = nextId++;
    const toast: Toast = { variant: "success", duration: 5000, ...input, id };
    set((state) => ({ toasts: [...state.toasts, toast].slice(-MAX_VISIBLE) }));
    return id;
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/** Convenience for non-React callers (e.g. mutation callbacks). */
export const toast = {
  show: (input: ToastInput) => useToastStore.getState().show(input),
  success: (title: string, rest?: Omit<ToastInput, "title" | "variant">) =>
    useToastStore.getState().show({ ...rest, title, variant: "success" }),
  error: (title: string, rest?: Omit<ToastInput, "title" | "variant">) =>
    useToastStore.getState().show({ ...rest, title, variant: "error" }),
  info: (title: string, rest?: Omit<ToastInput, "title" | "variant">) =>
    useToastStore.getState().show({ ...rest, title, variant: "info" }),
};
