import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const url =  'https://ecommerceplantilla-back.fileit-contact.workers.dev/api';

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(url+'/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch(url+'/auth/logout', {
        method: 'DELETE',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(url+'/auth/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);// En tu componente principal de la app
  
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Mensaje recibido:', payload);
      // Mostrar notificación
      if (payload.notification) {
        new Notification(payload.notification.title ?? 'Notification', {
          body: payload.notification.body ?? '',
          icon: '/logo.png'
        });
      }
      
    });
  }, []);

  return ( 
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}