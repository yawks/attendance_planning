import { Link } from '@tanstack/react-router';
import { CalendarCheck, Users, KanbanSquare } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-muted/40 p-4 border-r flex flex-col">
      <div className="flex items-center gap-2 pb-4 border-b mb-4">
        <KanbanSquare className="h-8 w-8 text-primary" />
        <h2 className="text-xl font-bold">Presence Tracker</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: 'font-bold bg-primary text-primary-foreground' }}
            >
              <CalendarCheck className="h-5 w-5" />
              Mes présences
            </Link>
          </li>
          <li>
            <Link
              to="/who-is-here"
              className="flex items-center gap-3 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: 'font-bold bg-primary text-primary-foreground' }}
            >
              <Users className="h-5 w-5" />
              Qui est là ?
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
