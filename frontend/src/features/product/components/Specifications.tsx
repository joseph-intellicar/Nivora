import type { Specification } from "@/domain/types";

/** Specifications table (requirements §16.1). */
export function Specifications({ specifications }: { specifications: Specification[] }) {
  return (
    <section aria-labelledby="specifications-heading">
      <h2 id="specifications-heading" className="text-lg font-bold text-ink">
        Specifications
      </h2>
      <dl className="mt-3 divide-y divide-line overflow-hidden rounded-card ring-1 ring-line">
        {specifications.map((spec) => (
          <div
            key={spec.label}
            className="grid grid-cols-[40%_1fr] gap-4 bg-surface px-4 py-3 text-sm"
          >
            <dt className="font-semibold text-ink-muted">{spec.label}</dt>
            <dd className="text-ink">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
