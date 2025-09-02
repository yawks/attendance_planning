import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from '@tanstack/react-router';

export function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Presence Tracker</h1>
        <p className="mb-6">Please sign in with your Google account to continue.</p>
        <button
          onClick={signIn}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
