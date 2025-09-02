import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();

  return (
    <header className="border-b p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Presence Tracker</h1>
        <div>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={signOut}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Utilisateur non connecté</p>
          )}
        </div>
      </div>
    </header>
  );
}
