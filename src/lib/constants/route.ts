export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/dashboard/users',
  SETTINGS: '/dashboard/settings',
} as const;

export const ROUTE_ACCESS = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    permissions: ['*'],
  },
  [ROUTES.ABOUT]: {
    path: ROUTES.ABOUT,
    permissions: ['*'],
  },
  [ROUTES.LOGIN]: {
    path: ROUTES.LOGIN,
    permissions: ['*'],
  },
  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    permissions: ['ADMIN'],
  },
  [ROUTES.USERS]: {
    path: ROUTES.USERS,
    permissions: ['USERS'],
  },
  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    permissions: ['SETTINGS'],
  },
} as const;
