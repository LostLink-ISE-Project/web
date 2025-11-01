import { createBrowserRouter } from 'react-router-dom';

// Pages
import HomePage from '@/pages';
import LoginPage from '@/pages/admin/login/form';
import DashboardPage from '@/pages/admin/dashboard/page';
import ItemsPage from '@/pages/admin/dashboard/items/page';

// Layouts
import WithAuth from '@/layout/with-auth.layout';
import DashboardLayout from '@/layout/dashboard.layout';

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
          // {
          //   path: 'offices',
          //   element: <OfficeManagementPage />,
          // },
          // {
          //   path: 'locations',
          //   element: <LocationManagementPage />,
          // },
          // {
          //   path: 'users',
          //   element: <UserManagementPage />,
          // },
        ],
      },
    ],
  },
]);
