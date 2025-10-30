import {
  Home,
  User,
  Settings,
  Lock,
} from 'lucide-react';
import { ROUTE_ACCESS, ROUTES } from './route';

export interface SidebarLink {
  title: string;
  id: string;
  href: string;
  icon?: React.ReactNode;
  permissions?: string[] | ['*'];
}

export const sidebarLinks: SidebarLink[] = [
  {
    title: 'Dashboard',
    id: 'dashboard',
    href: ROUTES.DASHBOARD,
    icon: <Home size={18} />,
    // permissions: ROUTE_ACCESS[ROUTES.DASHBOARD].permissions,
  },
  {
    title: 'Users',
    id: 'users',
    href: ROUTES.USERS,
    icon: <User size={18} />,
  },
  {
    title: 'Settings',
    id: 'settings',
    href: ROUTES.SETTINGS,
    icon: <Settings size={18} />,
    // permissions: ROUTE_ACCESS[ROUTES.SETTINGS].permissions,
  },
  {
    title: 'Login',
    id: 'login',
    href: ROUTES.LOGIN,
    icon: <Lock size={18} />,
  },
];
