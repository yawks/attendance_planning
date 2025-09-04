import { Link } from '@tanstack/react-router';
import { CalendarCheck, Users, KanbanSquare, ChevronsLeft } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function Sidebar() {
  const { isDesktopCollapsed, toggleDesktopSidebar, isMobileOpen, setMobileOpen } = useLayout();

  const handleLinkClick = () => {
    if (isMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="bg-black/60 fixed inset-0 z-10 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "bg-background border-r flex flex-col fixed inset-y-0 left-0 z-20 transition-transform duration-300 ease-in-out",
          // Mobile drawer logic
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop collapse logic
          "lg:translate-x-0",
          isDesktopCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className={cn(
          "flex items-center gap-2 pb-4 border-b mb-4 p-4 h-[65px]", // Fixed height to match header
          isDesktopCollapsed && "justify-center"
        )}>
          <img src="/icons/logo.png" alt="Presence Tracker Logo" className="h-8 w-8 flex-shrink-0" />
          <h2 className={cn(
            "text-xl font-bold transition-opacity duration-200 whitespace-nowrap",
            isDesktopCollapsed && "lg:opacity-0 lg:w-0"
          )}>
            Presence Tracker
          </h2>
        </div>
        <nav className="flex-1 px-2">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                activeProps={{ className: 'font-bold bg-primary text-primary-foreground' }}
              >
                <CalendarCheck className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className={cn("transition-opacity", isDesktopCollapsed && "lg:opacity-0 lg:hidden")}>Mes présences</span>
              </Link>
            </li>
            <li>
              <Link
                to="/who-is-here"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                activeProps={{ className: 'font-bold bg-primary text-primary-foreground' }}
              >
                <Users className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className={cn("transition-opacity", isDesktopCollapsed && "lg:opacity-0 lg:hidden")}>Qui est là ?</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-2 border-t hidden lg:block">
          <Button variant="ghost" onClick={toggleDesktopSidebar} className="w-full justify-center">
            <ChevronsLeft className={cn("h-5 w-5 transition-transform", isDesktopCollapsed && "rotate-180")} />
          </Button>
        </div>
      </aside>
    </>
  );
}
