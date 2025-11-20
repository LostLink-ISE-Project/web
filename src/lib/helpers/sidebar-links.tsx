import {
  Building2,
  MapPin,
  LayoutGrid,
  TabletSmartphone,
  UserRound,
  Settings,
  LibraryBig,
} from 'lucide-react';
import type { ReactNode } from 'react';

export interface SidebarLinkType {
  id: string[];
  title: string;
  icon: ReactNode;
  href: string;
  withDivider?: boolean;
  locked?: boolean;
}

export const useSidebarLinks = () => {
  const links: SidebarLinkType[] = [
    {
      id: ['dashboard'],
      title: 'Dashboard',
      icon: <LayoutGrid size={18} />,
      href: '/dashboard',
    },
    {
      id: ['items'],
      title: 'Items',
      icon: <TabletSmartphone size={18} />,
      href: '/dashboard/items',
    },
    {
      id: ['offices'],
      title: 'Offices',
      icon: <Building2 size={18} />,
      href: '/dashboard/offices',
    },
    {
      id: ['locations'],
      title: 'Locations',
      icon: <MapPin size={18} />,
      href: '/dashboard/locations',
    },
    {
      id: ['categories'],
      title: 'Categories',
      icon: <LibraryBig size={18} />,
      href: '/dashboard/categories',
    },
    {
      id: ['users'],
      title: 'Users',
      icon: <UserRound size={18} />,
      href: '/dashboard/users',
    },

    {
      id: ['settings'],
      title: 'Settings',
      icon: <Settings size={18} />,
      href: '/dashboard/settings',
    },
  ];

  return { links };
};
