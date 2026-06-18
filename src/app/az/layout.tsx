import { Suspense } from "react";

export default function AZLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}