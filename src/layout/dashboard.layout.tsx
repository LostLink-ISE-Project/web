import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/dashboard/sidebar";
import { useDashboardStore } from "@/lib/stores/sidebar.store";
import { cn } from "@/lib/utils";
import MobileSidebar from "@/components/common/dashboard/mobile-sidebar";

export default function DashboardLayout() {
  const { isSidebarOpen } = useDashboardStore();
  
  return (
    <main className="flex min-h-screen flex-col">
      {/* Only visible on mobile */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>

      {/* Only visible on desktop/tablet */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <section
        className={cn(
            'w-full flex flex-col',
            isSidebarOpen ? 'pl-0 md:pl-72' : 'pl-0 md:pl-20'
        )}
      >
        <div className='p-6 px-0 md:p-12'>
            <Outlet />
        </div>
      </section>
    </main>
  );
}
