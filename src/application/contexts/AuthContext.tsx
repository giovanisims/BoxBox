import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { IAuthService } from '../../domain/contracts/IAuthService';
import { UserSession } from '../../domain/entities/UserSession';
import { SupabaseAuthService } from '../../infrastructure/supabase/SupabaseAuthService';

export interface AuthContextData {
  session: UserSession | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<UserSession>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

const authService: IAuthService = new SupabaseAuthService();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    authService
      .getSession()
      .then((restoredSession) => setSession(restoredSession))
      .catch(() => setSession(null))
      .finally(() => setInitializing(false));

    const unsubscribe = authService.onAuthStateChange((updatedSession) => {
      setSession(updatedSession);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        initializing,
        signIn: (email, password) => authService.signIn(email, password),
        signUp: (email, password) => authService.signUp(email, password),
        signOut: () => authService.signOut(),
        recoverPassword: (email) => authService.recoverPassword(email),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
