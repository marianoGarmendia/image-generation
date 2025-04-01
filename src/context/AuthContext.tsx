import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  validateDevCode: (code: string) => boolean;
  checkDevSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const devToken = localStorage.getItem('devToken');
      
      if (token) {
        setIsAuthenticated(true);
      } else if (devToken) {
        const devSession = checkDevSession();
        setIsAuthenticated(devSession);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('devToken');
    localStorage.removeItem('devTokenExpiry');
    setUser(null);
    setIsAuthenticated(false);
  };

  const validateDevCode = (code: string) => {
    const devCode = import.meta.env.VITE_DEV_CODE;
    if (code === devCode) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      localStorage.setItem('devToken', code);
      localStorage.setItem('devTokenExpiry', expiryDate.toISOString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const checkDevSession = () => {
    const devToken = localStorage.getItem('devToken');
    const expiry = localStorage.getItem('devTokenExpiry');
 
    
    if (!devToken || !expiry) {
      console.log("Dev token or expiry not found");
      
      return false;
    }
    
    const expiryDate = new Date(expiry);
    const now = new Date();
    
    if (now > expiryDate) {
      localStorage.removeItem('devToken');
      localStorage.removeItem('devTokenExpiry');
      return false;
    }
    
    return devToken === import.meta.env.VITE_DEV_CODE;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Cargando...</div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated,
      validateDevCode,
      
      checkDevSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}