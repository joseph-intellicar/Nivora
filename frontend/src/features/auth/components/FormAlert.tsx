import { AlertIcon, InfoIcon } from "@/components/icons";

/** Form-level message: an error (role="alert") or neutral information. */
export function FormAlert({ tone, children }: { tone: "error" | "info"; children: string }) {
  const Icon = tone === "error" ? AlertIcon : InfoIcon;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "flex items-start gap-2 rounded-control bg-danger-soft px-3 py-2.5 text-sm font-medium text-danger"
          : "flex items-start gap-2 rounded-control bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-800"
      }
    >
      <Icon className="mt-0.5 size-4" />
      <span>{children}</span>
    </div>
  );
}
