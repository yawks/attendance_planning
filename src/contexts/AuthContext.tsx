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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));

  const fetchProfile = useCallback(async (accessToken: string) => {
    try {
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser({ name: data.name, email: data.email, imageUrl: data.picture });
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      signOut(); // Sign out if profile fetch fails
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, fetchProfile]);

  const signIn = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem('accessToken', tokenResponse.access_token);
      setToken(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: 'profile email https://www.googleapis.com/auth/spreadsheets',
  });

  const signOut = () => {
    googleLogout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setToken(null);
  };

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
