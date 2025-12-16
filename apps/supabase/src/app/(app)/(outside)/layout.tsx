import MainSidebar from "@/components/shared/sidebar/main-sidebar";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainSidebar />
      <main className="mx-auto max-w-xl">{children}</main>
    </>
  );
}