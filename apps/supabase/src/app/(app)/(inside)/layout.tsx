import SidebarSetings from "@/components/settings/sidebar";
import MainSidebar from "@/components/shared/sidebar/main-sidebar";
import { Sidebar } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-4">
      <MainSidebar />
      <div className="hidden h-full w-full md:ml-[80px] md:block md:w-auto md:min-w-[170px] xl:absolute xl:left-[81px] xl:ml-0 xl:border-l xl:border-l-black/10">
        <SidebarSetings />
      </div>
      <main className="flex-grow">
        <div className="mx-auto max-w-xl">{children}</div>
      </main>
    </div>
  );
}
