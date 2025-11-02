import { createBrowserRouter } from 'react-router-dom';

// Pages
import HomePage from '@/pages';
import LoginPage from '@/pages/admin/login/form';
import DashboardPage from '@/pages/admin/dashboard/page';
import ItemsPage from '@/pages/admin/dashboard/items/page';

// Layouts
import WithAuth from '@/layout/with-auth.layout';
import DashboardLayout from '@/layout/dashboard.layout';
import OfficesPage from '@/pages/admin/dashboard/offices/page';
import LocationsPage from '@/pages/admin/dashboard/locations/page';
import UsersPage from '@/pages/admin/dashboard/users/page';
import SettingsPage from '@/pages/admin/dashboard/settings/page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <WithAuth />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: <DashboardPage />,
          },
          {
            path: 'items',
            element: <ItemsPage />,
          },
          {
            path: 'offices',
            element: <OfficesPage />,
          },
          {
            path: 'locations',
            element: <LocationsPage />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);
