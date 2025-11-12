import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/common/dashboard/sidebar';
import { useDashboardStore } from '@/lib/stores/sidebar.store';
import { cn } from '@/lib/utils';
import MobileSidebar from '@/components/common/dashboard/mobile-sidebar';

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
          'w-full flex flex-col flex-1',
          isSidebarOpen ? 'pl-0 md:pl-72' : 'pl-0 md:pl-20'
        )}
      >
        <div className="p-6 px-0 md:p-12 flex-1">
          <Outlet />
        </div>

        {/* Footer */}
        <footer
          className={cn(
            'border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
            isSidebarOpen ? 'pl-0 md:pl-72' : 'pl-0 md:pl-20'
          )}
        >
          <div className="container flex flex-col items-center justify-between gap-4 py-4 md:h-16 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                © {new Date().getFullYear()} All rights reserved. Powered by{' '}
                <span className="font-semibold">USG Future Hub</span>
              </p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
