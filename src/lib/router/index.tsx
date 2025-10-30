import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import { ROUTES } from '../constants/route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: ROUTES.LOGIN,
    element: <div></div>,
  },
]);
