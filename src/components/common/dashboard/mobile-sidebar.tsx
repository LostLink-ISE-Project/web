import { useSidebarLinks } from "@/lib/helpers/sidebar-links";
import { Fragment } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useDashboardStore } from "@/lib/stores/sidebar.store";
import { Button } from "@/components/ui/button";
import LostLinkLogo from "@/assets/LostLink.svg";
import { useAuthStore } from "@/lib/stores/auth.store";
import { SidebarLink } from "./sidebar";

const MobileSidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardStore();
  const { links } = useSidebarLinks();

  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Top bar with logo and burger */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow-sm z-40 relative">
        <img src={LostLinkLogo} alt="Logo" className="w-28" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="text-muted-foreground"
        >
          <Menu />
        </Button>
      </div>

      {/* Sidebar full screen overlay */}
      {isSidebarOpen && (
        <aside className="fixed top-0 left-0 z-50 h-screen w-full bg-white flex flex-col px-4 py-6">
          {/* Header with close */}
          <div className="flex justify-between items-center mb-6">
            <img src={LostLinkLogo} alt="Logo" className="w-28" />
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <X />
            </Button>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col gap-2 flex-grow">
            {links.map((link) => (
              <Fragment key={link.id[0]}>
                <SidebarLink link={link} open={true} />
                {link.withDivider && <hr />}
              </Fragment>
            ))}
          </div>

          {/* Logout */}
          <div className="mt-auto">
            <Button
              variant="ghost"
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
              className="w-full h-12 font-medium rounded-2xl hover:bg-destructive/10 hover:text-destructive text-sm flex gap-2 justify-start items-center p-4"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </Button>
          </div>
        </aside>
      )}
    </>
  );
};

export default MobileSidebar; 