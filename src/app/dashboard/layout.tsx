import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex flex-1 overflow-auto">
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />

          <main className="flex-1 overflow-y-auto relative">
            <Header />

            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
