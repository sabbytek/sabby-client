import type { ReactNode } from "react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
