import type { SidebarLinkType } from '@/lib/helpers/sidebar-links';
import { useSidebarLinks } from '@/lib/helpers/sidebar-links';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDashboardStore } from '@/lib/stores/sidebar.store';
import { Button } from '@/components/ui/button';
import LostLinkLogo from '@/assets/LostLink.svg';
import { useAuthStore } from '@/lib/stores/auth.store';

export const SidebarLink = ({ link, open }: { link: SidebarLinkType; open: boolean }) => {
  const { pathname } = useLocation();

  const isActive =
    link.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(link.href);

  if (open) {
    return (
      <div className="relative">
        <Link
          to={link.locked ? '' : link.href}
          title={link.locked ? 'Coming soon' : ''}
          className={cn(
            `h-12 font-medium rounded-2xl hover:bg-primary/10 hover:text-primary text-sm flex gap-2 items-center p-4 transition-all duration-200`,
            isActive && 'bg-foreground',
            !open && 'justify-center',
            link.locked && 'opacity-30 pointer-events-none'
          )}
        >
          <span>{link.icon}</span>
          <span>{link.title}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={link.locked ? '' : link.href}
            title={link.locked ? 'Coming soon' : ''}
            className={cn(
              `h-12 font-medium rounded-2xl hover:bg-primary/10 hover:text-primary text-sm flex gap-2 items-center p-4 transition-all duration-200`,
              isActive && 'bg-foreground',
              'justify-center',
              link.locked && 'opacity-30 pointer-events-none'
            )}
          >
            <span>{link.icon}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-white">
          {link.title}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardStore();
  const { links } = useSidebarLinks();

  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-30 h-screen bg-white rounded-e-3xl shadow-2xl transition-all',
        isSidebarOpen ? 'w-72' : 'w-20'
      )}
    >
      <div className="h-full flex flex-col justify-between px-3 py-6">
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-1/2 -right-3 transform -translate-y-1/2 rounded-xl bg-primary text-white bg w-8 h-8 flex items-center justify-center shadow z-50"
        >
          {isSidebarOpen ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </Button>

        <div className="flex flex-col gap-2">
          <div
            className={`pb-6 flex ${isSidebarOpen ? 'justify-start pl-4' : 'justify-center pl-0'} items-center h-12`}
          >
            <Link to="/" className="flex items-center">
              {isSidebarOpen ? (
                <img src={LostLinkLogo} alt="Logo" className="transition-all w-32" />
              ) : (
                <span className="text-primary text-3xl font-bold">L</span>
              )}
            </Link>
          </div>

          {links.map((link) => (
            <Fragment key={link.id[0]}>
              <SidebarLink link={link} open={isSidebarOpen} />
              {link.withDivider && <hr />}
            </Fragment>
          ))}
        </div>

        {/* Logout */}
        <div>
          {isSidebarOpen ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                `w-full h-12 font-medium rounded-2xl hover:bg-destructive/10 hover:text-destructive text-sm flex gap-2 justify-start items-center !p-4 transition-all duration-200`
              )}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full h-12 rounded-2xl hover:bg-destructive/10 hover:text-destructive flex items-center justify-center !p-4"
                >
                  <LogOut size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-white">
                Logout
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
