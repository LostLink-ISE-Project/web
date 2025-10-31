import { createBrowserRouter } from 'react-router-dom';
import  HomePage from '@/pages';
import AdminLogin from '@/pages/admin/login/form';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <AdminLogin />,
  }
]);
