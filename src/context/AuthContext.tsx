
import React, { createContext, useContext, useState, ReactNode } from 'react';

// User types
type UserRole = 'admin' | 'team-owner' | 'player';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  teamName?: string;
  budget?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, teamName?: string) => Promise<void>;
  logout: () => void;
  updateUserBudget: (newBudget: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock login function - in a real app, this would connect to your backend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app, this would come from your backend
      let mockUser: User;
      
      if (email === 'admin@cricket.com') {
        mockUser = {
          id: '1',
          name: 'Admin User',
          email,
          role: 'admin',
        };
      } else if (email.includes('team')) {
        mockUser = {
          id: '2',
          name: `${email.split('@')[0]} Owner`,
          email,
          role: 'team-owner',
          teamId: '1',
          teamName: `${email.split('@')[0]} XI`,
          budget: 10000000 // 1 crore budget
        };
      } else {
        mockUser = {
          id: '3',
          name: `${email.split('@')[0]} Player`,
          email,
          role: 'player',
        };
      }
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string, role: UserRole, teamName?: string) => {
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        ...(role === 'team-owner' && {
          teamId: Math.random().toString(36).substr(2, 9),
          teamName: teamName || `${name}'s Team`,
          budget: 10000000 // 1 crore budget
        }),
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Update user budget function
  const updateUserBudget = (newBudget: number) => {
    if (user && user.role === 'team-owner') {
      setUser({
        ...user,
        budget: newBudget
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserBudget
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
