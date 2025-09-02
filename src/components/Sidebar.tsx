import { Link } from '@tanstack/react-router';

export function Sidebar() {
  return (
    <aside className="w-64 bg-muted/40 p-4 border-r">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="block p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: 'font-bold bg-primary text-primary-foreground' }}
            >
              Mes présences
            </Link>
          </li>
          <li>
            <Link
              to="/who-is-here"
              className="block p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: 'font-bold bg-primary text-primary-foreground' }}
            >
              Qui est là ?
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
