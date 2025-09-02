import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { gapi } from 'gapi-script';

interface UserProfile {
  email: string;
  name: string;
  imageUrl: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('isAuthenticated');
  });

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: 'email profile',
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        const isSignedIn = authInstance.isSignedIn.get();
        if (isSignedIn) {
          const profile = authInstance.currentUser.get().getBasicProfile();
          setUser({
            email: profile.getEmail(),
            name: profile.getName(),
            imageUrl: profile.getImageUrl(),
          });
          localStorage.setItem('isAuthenticated', 'true');
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('isAuthenticated');
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
      });
    };
    gapi.load('client:auth2', start);
  }, []);

  const signIn = async () => {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    const profile = authInstance.currentUser.get().getBasicProfile();
    setUser({
      email: profile.getEmail(),
      name: profile.getName(),
      imageUrl: profile.getImageUrl(),
    });
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
    });
  };

  const value = {
    isAuthenticated,
    user,
    signIn,
    signOut,
    isLoading,
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
