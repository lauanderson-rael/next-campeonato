/*
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
 mport { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />

      {children}
    </main>
  );
}
 */
// layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <main className="flex-1 overflow-y-auto relative">
            <SidebarTrigger className="text-green-600 hover:text-green-800 absolute top-2 left-2" />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}
