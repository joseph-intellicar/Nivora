import { ShopFrame } from "@/features/shell/ShopFrame";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return <ShopFrame>{children}</ShopFrame>;
}
