import { Outlet } from '@tanstack/react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { UpdateNotification } from './UpdateNotification'; // Import the new component
import { LayoutProvider, useLayout } from '@/contexts/LayoutContext';
import { WeekProvider } from '@/contexts/WeekContext';
import { cn } from '@/lib/utils';

function AppLayout() {
  const { isDesktopCollapsed } = useLayout();
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          isDesktopCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <Header />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <UpdateNotification /> {/* Add the component here */}
    </div>
  )
}

export function RootLayout() {
  return (
    <LayoutProvider>
      <WeekProvider>
        <AppLayout />
      </WeekProvider>
    </LayoutProvider>
  );
}
