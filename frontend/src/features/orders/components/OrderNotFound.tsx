import Link from "next/link";
import { PackageIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { paths } from "@/config/routes";

export function OrderNotFound() {
  return (
    <EmptyState
      headingLevel="h1"
      icon={<PackageIcon />}
      title="We couldn't find that order."
      description="It may belong to a different account, or the order number may be incorrect."
      action={
        <Link href={paths.orders()} className={buttonClasses()}>
          View Your Orders
        </Link>
      }
    />
  );
}
