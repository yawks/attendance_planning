import { Outlet, Link } from '@tanstack/react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { LayoutProvider, useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/lib/utils';

function AppLayout() {
  const { isSidebarOpen } = useLayout();
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          "lg:ml-64" // Apply margin only on large screens
        )}
      >
        <Header />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="bg-black/60 fixed inset-0 z-10 lg:hidden"
          onClick={() => useLayout().setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}


export function RootLayout() {
  return (
    <LayoutProvider>
      <AppLayout />
    </LayoutProvider>
  );
}
