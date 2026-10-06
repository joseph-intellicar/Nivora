import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { paths } from "@/config/routes";
import { Container } from "./Container";

type NotFoundContentProps = { title?: string; description?: string };

/** Nivora-branded "not found" message with a way back to shopping (requirements §8.4). */
export function NotFoundContent({
  title = "We couldn't find that page.",
  description = "The page may have moved, or the link may be incorrect. Let's get you back to shopping.",
}: NotFoundContentProps) {
  return (
    <Container className="py-8">
      <EmptyState
        headingLevel="h1"
        icon={<SearchIcon />}
        title={title}
        description={description}
        action={
          <Link href={paths.home()} className={buttonClasses()}>
            Continue Shopping
          </Link>
        }
      />
    </Container>
  );
}
