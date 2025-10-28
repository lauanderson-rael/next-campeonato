import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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

// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import Header from "@/components/Header";
// import { cookies } from "next/headers";

// export default async function Layout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const cookieStore = await cookies();
//   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

//   return (
//     <div className="flex h-screen flex-col overflow-hidden">
//       <div className="flex flex-1 overflow-auto">
//         <SidebarProvider defaultOpen={defaultOpen}>
//           <AppSidebar />
//           <main className="flex-1 overflow-y-auto relative">
//             <Header />
//             <SidebarTrigger className="text-white hidden md:flex hover:text-green-800 absolute top-5 left-2" />
//             {children}
//           </main>
//         </SidebarProvider>
//       </div>
//     </div>
//   );
// }
