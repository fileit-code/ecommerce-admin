import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  shopname: string;
  imageUrl: string | null;
  address: string | null;
  fcmToken: string | null;
  createdAt: string;
};

interface SignUpUserInfo {
  email: string | null,
  password: string | null,
  shopname: string | null,
  username: string | null,
  address: string | null,
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  updateProfile:  (username: string, shopname: string, address: string, imageBase64: string) => Promise<boolean>
  logout: () => Promise<void>;
  signUpInfo: SignUpUserInfo;
  setSignUpInfo: React.Dispatch<React.SetStateAction<SignUpUserInfo>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signUpInfo, setSignUpInfo] = useState<SignUpUserInfo>({
    email:  null,
    password: null,
    shopname: null,
    username: null,
    address: null,
  })
  const url =  'https://ecommerceplantilla-back.fileit-contact.workers.dev/api';


  const login = async (email: string, password: string) => { 
    try {
      const response = await fetch(url+'/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password}),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
        return false
      }

      const data = await response.json();
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
      return false
    } finally {
      setLoading(false);
    }
  }

  const register = async () => {
    setLoading(true);
    try {
      const response = await fetch(url+'/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...signUpInfo }),
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

  const updateProfile = async (username: string, shopname: string, address: string, imageBase64: string)=> {
    try {
      const response = await fetch(url+'/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, shopname, address, imageBase64 }),
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
        return true;
      }

      const data = await response.json();
      setUser(user ? { ...user, shopname: data.user.shopname, username: data.user.username, address: data.user.address } : null);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  const logout = async () => {
    // setLoading(true);
    // try {
    //   await fetch(url+'/auth/logout', {
    //     method: 'DELETE',
    //     credentials: 'include'
    //   });
    //   setUser(null);
    // } catch (error) {
    //   console.error('Logout error:', error);
    // } finally {
    //   setLoading(false);
    // }
  };


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(url+'/auth/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        console.log(data);
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
          // icon: '/logo.png'
        });
      }
    });
  }, []);

  return ( 
    <AuthContext.Provider 
    value={{ 
      user,
      loading,
      register, 
      login,
      updateProfile,
      logout,
      signUpInfo,
      setSignUpInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
}