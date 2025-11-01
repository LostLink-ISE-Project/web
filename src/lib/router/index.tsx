import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages';
import LoginPage from '@/pages/admin/login/form';
import WithAuth from '@/layout/with-auth.layout';
import DashboardLayout from '@/layout/dashboard.layout';
import DashboardPage from '@/pages/admin/dashboard/page';

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
    element: <WithAuth />, // 🔒 checks for token
    children: [
      {
        element: <DashboardLayout />, // 📦 UI layout
        children: [
          { 
            path: "/dashboard", 
            element: <DashboardPage /> 
          },
          // { 
          //   path: "/items", 
          //   element: <ItemManagementPage /> 
          // },
          // { 
          //   path: "/offices", 
          //   element: <OfficeManagementPage /> 
          // },
          // { 
          //   path: "/locations", 
          //   element: <LocationManagementPage /> 
          // },
          // { 
          //   path: "/users", 
          //   element: <UserManagementPage /> 
          // },
        ],
      },
    ],
  },
]);
