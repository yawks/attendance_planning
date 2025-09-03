import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from '@tanstack/react-router';
import logo from '@/assets/logo.png?inline';

export function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center p-4">
        <img src={logo} alt="Presence Tracker Logo" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Presence Tracker</h1>
        <p className="mb-6 text-muted-foreground">Please sign in with your Google account to continue.</p>
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
