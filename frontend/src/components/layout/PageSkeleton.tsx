import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "./Container";

/** Loading pattern for route segments (loading.tsx). Announces loading to screen readers. */
export function PageSkeleton() {
  return (
    <Container className="py-10">
      <p role="status" className="sr-only">
        Loading…
      </p>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
