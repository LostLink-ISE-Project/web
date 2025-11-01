import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/dashboard/sidebar";
import { useDashboardStore } from "@/lib/stores/sidebar.store";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { isSidebarOpen } = useDashboardStore();
  
  return (
    <main className="flex min-h-screen flex-col">
      <Sidebar />
      <section
        className={cn(
            'w-full flex flex-col',
            isSidebarOpen ? 'pl-72' : 'pl-20'
        )}
      >
        <div className='p-12'>
            <Outlet />
        </div>
      </section>
    </main>
  );
}
