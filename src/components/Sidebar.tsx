import { Link } from '@tanstack/react-router';
import { CalendarCheck, Users, KanbanSquare } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useLayout();

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={cn(
        "bg-muted/40 border-r flex flex-col fixed inset-y-0 left-0 z-20 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b">
        <KanbanSquare className="h-8 w-8 text-primary flex-shrink-0" />
        <h2 className="text-xl font-bold">Presence Tracker</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-3 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: 'font-bold bg-primary text-primary-foreground' }}
            >
              <CalendarCheck className="h-5 w-5 flex-shrink-0" />
              <span>Mes présences</span>
            </Link>
          </li>
          <li>
            <Link
              to="/who-is-here"
              onClick={handleLinkClick}
              className="flex items-center gap-3 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: 'font-bold bg-primary text-primary-foreground' }}
            >
              <Users className="h-5 w-5 flex-shrink-0" />
              <span>Qui est là ?</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
