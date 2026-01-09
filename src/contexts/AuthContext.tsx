import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';

interface UserProfile {
  email: string;
  name: string;
  imageUrl: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  signIn: () => void;
  signOut: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) {
      return null;
    }

    try {
      const session = JSON.parse(sessionData);
      const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;

      if (new Date().getTime() - session.timestamp > thirtyDaysInMillis) {
        localStorage.removeItem('userSession');
        return null;
      }
      return session.token;
    } catch (error) {
      // If parsing fails, remove the invalid item
      localStorage.removeItem('userSession');
      return null;
    }
  });

  // Placed before fetchProfile and wrapped in useCallback to ensure stable reference
  const signOut = useCallback(() => {
    googleLogout();
    localStorage.removeItem('userSession');
    localStorage.removeItem('isAuthenticated'); // Keep removing for cleanup of old values
    localStorage.removeItem('accessToken'); // Also remove the old token
    setUser(null);
    setToken(null);
    // Force a redirect to the login page to clear all state and prompt re-auth
    window.location.href = '/login';
  }, []);

  const fetchProfile = useCallback(async (accessToken: string) => {
    try {
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser({ name: data.name, email: data.email, imageUrl: data.picture });
      // This is the key to fixing the race condition.
      // We explicitly mark the user as authenticated only AFTER the profile is fetched.
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      signOut(); // Sign out if profile fetch fails
    }
  }, [signOut]);

  useEffect(() => {
    if (token) {
      fetchProfile(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, fetchProfile]);

  const signIn = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const session = {
        token: tokenResponse.access_token,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem('userSession', JSON.stringify(session));
      setToken(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: 'profile email https://www.googleapis.com/auth/spreadsheets',
  });

  const value = {
    isAuthenticated: !!user,
    user,
    signIn,
    signOut,
    isLoading,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
