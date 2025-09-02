import { Link } from '@tanstack/react-router';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 border-r">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="block p-2 rounded-md hover:bg-gray-200"
              activeProps={{ className: 'font-bold bg-gray-200' }}
            >
              Mes présences
            </Link>
          </li>
          <li>
            <Link
              to="/who-is-here"
              className="block p-2 rounded-md hover:bg-gray-200"
              activeProps={{ className: 'font-bold bg-gray-200' }}
            >
              Qui est là ?
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
