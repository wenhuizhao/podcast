import { createContext, useContext } from 'react';

import { User } from '@/types/User';

export interface AuthContextType {
  user?: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  setUser: (user: User | null) => {},
});

export const useAuth = () => useContext(AuthContext);
