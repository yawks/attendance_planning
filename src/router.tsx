import { createRouter, createRoute, createRootRoute, redirect, Outlet } from '@tanstack/react-router';
import { RootLayout } from './components/RootLayout';
import { MyPresencesPage } from './pages/MyPresences';
import { LoginPage } from './pages/Login';

// A simple auth check
const isAuthenticated = () => !!localStorage.getItem('isAuthenticated');

// The absolute root of our app. Doesn't render anything itself.
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// The layout for the authenticated part of the app
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: RootLayout,
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
      });
    }
  },
});

// The login route, a child of the absolute root
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const indexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: MyPresencesPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([indexRoute]),
]);

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <div>Loading...</div>,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
